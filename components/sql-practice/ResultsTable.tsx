'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ListFilter } from 'lucide-react';

export interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
  executionTimeMs?: number;
  error?: string;
}

export type VerificationState = 'idle' | 'correct' | 'mismatch' | 'error';

interface ResultsTableProps {
  result: QueryResult | null;
  verification: {
    state: VerificationState;
    message?: string;
  };
  isLoading: boolean;
  onNextQuestion?: () => void;
}

export default function ResultsTable({
  result,
  verification,
  isLoading,
  onNextQuestion,
}: ResultsTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[220px] bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-500 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span>Executing query against in-memory SQLite database...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Verification Status Alert */}
      {verification.state === 'correct' && (
        <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{verification.message || '🎉 Perfect! Your query produced the exact expected output.'}</span>
          </div>
          {onNextQuestion && (
            <button
              onClick={onNextQuestion}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs cursor-pointer shadow-xs shrink-0"
            >
              Next Question →
            </button>
          )}
        </div>
      )}

      {verification.state === 'mismatch' && (
        <div className="px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{verification.message || 'Output mismatch: Result does not match expected answer.'}</span>
        </div>
      )}

      {result?.error && (
        <div className="px-4 py-3 bg-rose-500/10 border-b border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-mono flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">SQLite Error:</span>
            <span className="leading-relaxed">{result.error}</span>
          </div>
        </div>
      )}

      {/* Results Header Meta */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/70 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ListFilter className="w-3.5 h-3.5" />
          <span>
            {result && !result.error
              ? `${result.values.length} row${result.values.length === 1 ? '' : 's'} returned`
              : 'Query Results'}
          </span>
        </div>

        {result?.executionTimeMs !== undefined && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{result.executionTimeMs} ms</span>
          </div>
        )}
      </div>

      {/* Results Data Grid */}
      <div className="flex-1 overflow-auto max-h-[350px] scrollbar-thin">
        {result && !result.error && result.columns.length > 0 ? (
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-3 text-[10px] text-slate-400 font-normal w-8 text-center border-r border-slate-200 dark:border-slate-700">
                  #
                </th>
                {result.columns.map((col, idx) => (
                  <th key={idx} className="py-2 px-3 font-bold truncate">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {result.values.length === 0 ? (
                <tr>
                  <td
                    colSpan={result.columns.length + 1}
                    className="py-8 text-center text-slate-400 text-xs italic"
                  >
                    Query completed with 0 rows returned.
                  </td>
                </tr>
              ) : (
                result.values.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-teal-500/5 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-1.5 px-3 text-[10px] text-slate-400 font-normal text-center bg-slate-50/50 dark:bg-slate-950/30 border-r border-slate-100 dark:border-slate-800">
                      {rIdx + 1}
                    </td>
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="py-1.5 px-3 truncate max-w-[240px]">
                        {val === null ? (
                          <span className="text-amber-500 italic">NULL</span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 text-xs">
            {!result ? (
              <p>Write an SQL query above and click <strong className="text-slate-600 dark:text-slate-200 font-mono">Run Query</strong> (or Ctrl+Enter) to see results.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
