'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SqlQuestion } from '@/data/sqlPracticeData';
import {
  ListOrdered,
  LayoutGrid,
  List,
  CheckCircle2,
  Search,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface QuestionNavigatorProps {
  questions: SqlQuestion[];
  currentIndex: number;
  solvedIds: Set<string>;
  onSelectQuestion: (index: number) => void;
  isLastOfSection?: boolean;
  nextSectionLabel?: string;
  onNextSection?: () => void;
}

export default function QuestionNavigator({
  questions,
  currentIndex,
  solvedIds,
  onSelectQuestion,
  isLastOfSection,
  nextSectionLabel,
  onNextSection,
}: QuestionNavigatorProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active question into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentIndex, viewMode]);

  const solvedCount = questions.filter((q) => solvedIds.has(q.id)).length;
  const progressPct = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0;

  const filtered = questions
    .map((q, idx) => ({ q, originalIndex: idx }))
    .filter(({ q }) => {
      if (!searchQuery.trim()) return true;
      const qNum = String(questions.indexOf(q) + 1);
      const query = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query) ||
        q.difficulty.toLowerCase().includes(query) ||
        qNum.includes(query)
      );
    });

  const getDifficultyDot = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500';
      case 'Medium':
        return 'bg-amber-500';
      case 'Hard':
        return 'bg-rose-500';
    }
  };

  const getDifficultyBadge = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Hard':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Questions ({questions.length})
            </span>
          </div>

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grid of Question Numbers"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="List with Titles"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>Progress: {solvedCount}/{questions.length} Solved</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Search Input for questions */}
        <div className="relative mt-2">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by title or #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Questions Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {viewMode === 'grid' ? (
          /* Grid View of Question Numbers */
          <div>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {filtered.map(({ q, originalIndex }) => {
                const isActive = originalIndex === currentIndex;
                const isSolved = solvedIds.has(q.id);
                const qNum = originalIndex + 1;

                return (
                  <button
                    key={q.id}
                    ref={isActive ? activeItemRef : undefined}
                    onClick={() => onSelectQuestion(originalIndex)}
                    title={`#${qNum}: ${q.title} (${q.difficulty})`}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400 ring-offset-1 dark:ring-offset-slate-900 scale-105 z-10'
                        : isSolved
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100'
                        : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400'
                    }`}
                  >
                    <span>{qNum}</span>

                    {/* Status Dot / Checkmark */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {isSolved ? (
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${getDifficultyDot(q.difficulty)}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Legend */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Easy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Med
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Hard
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Check className="w-3 h-3 text-emerald-500" /> Solved
              </span>
            </div>
          </div>
        ) : (
          /* Detailed List View */
          <div className="space-y-1.5">
            {filtered.map(({ q, originalIndex }) => {
              const isActive = originalIndex === currentIndex;
              const isSolved = solvedIds.has(q.id);
              const qNum = originalIndex + 1;

              return (
                <button
                  key={q.id}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={() => onSelectQuestion(originalIndex)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        #{qNum}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${getDifficultyBadge(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-semibold truncate ${
                        isActive
                          ? 'text-teal-900 dark:text-teal-200'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {q.title}
                    </p>
                    {q.category && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate mt-0.5">
                        {q.category}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Optional Next Section Sticky Bar */}
      {isLastOfSection && onNextSection && (
        <div className="p-3 bg-slate-900 border-t border-teal-500/30">
          <button
            onClick={onNextSection}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer"
          >
            <span>{nextSectionLabel || 'Continue to Next Section →'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
