'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseDefinition, SqlTableSchema, SqlQuestion } from '@/data/sqlPracticeData';
import { Database, Table, Key, Link2, Eye, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

interface SchemaExplorerProps {
  databases?: DatabaseDefinition[];
  activeDb: DatabaseDefinition;
  currentQuestion?: SqlQuestion;
  onSelectDb?: (db: DatabaseDefinition) => void;
  onPreviewTable: (tableName: string) => void;
}

export default function SchemaExplorer({
  activeDb,
  currentQuestion,
  onPreviewTable,
}: SchemaExplorerProps) {
  // Detect tables relevant to the current question dynamically
  const relevantTableNames = useMemo(() => {
    if (!currentQuestion) return [];
    const searchCorpus = `${currentQuestion.solutionSql} ${currentQuestion.starterSql || ''} ${currentQuestion.description} ${currentQuestion.title}`.toLowerCase();
    
    return activeDb.tables
      .filter((t) => {
        const regex = new RegExp(`\\b${t.tableName.toLowerCase()}\\b`, 'i');
        return regex.test(searchCorpus);
      })
      .map((t) => t.tableName);
  }, [currentQuestion, activeDb.tables]);

  // Mode: 'question' (show only tables needed for this question) vs 'all' (show all tables)
  const [filterMode, setFilterMode] = useState<'question' | 'all'>('question');

  // Always reset to 'question' mode whenever question changes so only related tables are shown
  useEffect(() => {
    setFilterMode('question');
  }, [currentQuestion?.id]);

  // Track expanded tables
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  // Auto-expand relevant tables whenever current question changes!
  useEffect(() => {
    if (relevantTableNames.length > 0) {
      const nextExpanded: Record<string, boolean> = {};
      relevantTableNames.forEach((name) => {
        nextExpanded[name] = true;
      });
      setExpandedTables(nextExpanded);
    } else {
      setExpandedTables({ [activeDb.tables[0]?.tableName || '']: true });
    }
  }, [currentQuestion?.id, activeDb.id, relevantTableNames]);

  // Tables to render based on filterMode: strictly only related tables in question mode
  const displayedTables = useMemo(() => {
    if (filterMode === 'question') {
      if (relevantTableNames.length > 0) {
        return activeDb.tables.filter((t) => relevantTableNames.includes(t.tableName));
      }
      return [];
    }
    return activeDb.tables;
  }, [activeDb.tables, filterMode, relevantTableNames]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Database Schema Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/90">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Database Schema
            </span>
          </div>

          {/* Dynamic question badge */}
          {relevantTableNames.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Related ({relevantTableNames.length})</span>
            </span>
          )}
        </div>

        {/* Active Database Info Card (clean read-only status instead of redundant select) */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 shadow-xs shadow-teal-400/50" />
            <span className="font-semibold text-slate-200 truncate">{activeDb.name}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 shrink-0 border border-slate-700">
            {activeDb.id === 'hospital' ? 'Healthcare' : 'Enterprise'}
          </span>
        </div>

        {/* Dynamic Schema Info & Filter Toggle */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            {filterMode === 'question' && relevantTableNames.length > 0 ? (
              <span className="font-semibold text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" />
                <span>{relevantTableNames.length} Question Table{relevantTableNames.length === 1 ? '' : 's'}</span>
              </span>
            ) : filterMode === 'question' && relevantTableNames.length === 0 ? (
              <span className="text-slate-500 italic">Pure In-Memory Query</span>
            ) : (
              <span>All {activeDb.tables.length} Tables</span>
            )}
          </div>

          <button
            onClick={() => setFilterMode(filterMode === 'question' ? 'all' : 'question')}
            className="text-[11px] font-mono font-medium text-slate-400 hover:text-teal-400 underline cursor-pointer transition-colors"
          >
            {filterMode === 'question'
              ? `Show all (${activeDb.tables.length})`
              : `Question only (${relevantTableNames.length})`}
          </button>
        </div>
      </div>

      {/* Tables & Columns Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
        {displayedTables.length === 0 && (
          <div className="p-4 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-xs text-slate-500">
            <Sparkles className="w-5 h-5 mx-auto mb-2 text-teal-500" />
            <p className="font-semibold text-slate-300">Pure In-Memory Query</p>
            <p className="text-[11px] text-slate-500 mt-1">This challenge generates rows dynamically using CTEs without requiring physical base tables.</p>
            <button
              onClick={() => setFilterMode('all')}
              className="mt-3 px-3 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-teal-400 cursor-pointer border border-slate-700 transition-colors"
            >
              Browse All Tables ({activeDb.tables.length})
            </button>
          </div>
        )}
        {displayedTables.map((table: SqlTableSchema) => {
          const isExpanded = !!expandedTables[table.tableName];
          const isRelevant = relevantTableNames.includes(table.tableName);

          return (
            <div
              key={table.tableName}
              className={`rounded-xl border transition-all overflow-hidden shadow-xs ${
                isRelevant
                  ? 'border-teal-500/50 bg-slate-950 ring-1 ring-teal-500/20'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700/80'
              }`}
            >
              {/* Table Header Bar */}
              <div
                className={`flex items-center justify-between px-3 py-2 ${
                  isRelevant
                    ? 'bg-teal-950/40 border-b border-teal-900/40'
                    : 'bg-slate-900/70 hover:bg-slate-800/60 transition-colors'
                }`}
              >
                <button
                  onClick={() => toggleTable(table.tableName)}
                  className={`flex items-center gap-1.5 text-xs font-bold font-mono transition-colors cursor-pointer text-left flex-1 min-w-0 ${
                    isRelevant
                      ? 'text-teal-200 hover:text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <Table className={`w-3.5 h-3.5 shrink-0 ${isRelevant ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="truncate">{table.tableName}</span>
                  <span className="text-[10px] text-slate-500 font-normal shrink-0">
                    ({table.columns.length})
                  </span>

                  {isRelevant && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800 shrink-0 ml-auto mr-1">
                      Target
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onPreviewTable(table.tableName)}
                  title={`Preview top rows of ${table.tableName}`}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-400 transition-colors shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Table Columns List */}
              {isExpanded && (
                <div className="px-3 py-2 space-y-1.5 border-t border-slate-800/70 text-[11px] font-mono bg-slate-950/50">
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      className="flex items-center justify-between gap-2 py-0.5 text-slate-300"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {col.isPk ? (
                          <span title="Primary Key" className="inline-flex shrink-0">
                            <Key className="w-3 h-3 text-amber-400" />
                          </span>
                        ) : col.isFk ? (
                          <span title={`Foreign Key (${col.references})`} className="inline-flex shrink-0">
                            <Link2 className="w-3 h-3 text-blue-400" />
                          </span>
                        ) : (
                          <span className="w-3 h-3 inline-block" />
                        )}
                        <span className="truncate font-semibold text-slate-200">{col.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer helper when showing filtered tables */}
        {filterMode === 'question' && relevantTableNames.length > 0 && activeDb.tables.length > relevantTableNames.length && (
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center text-[11px] text-slate-500">
            <span>Showing only tables for this question. </span>
            <button
              onClick={() => setFilterMode('all')}
              className="text-teal-400 font-semibold underline cursor-pointer ml-1 hover:text-teal-300"
            >
              Show all ({activeDb.tables.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

