'use client';

import React, { useState } from 'react';
import { SqlQuestion } from '@/data/sqlPracticeData';
import { Lightbulb, ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, Code2, Copy, Check } from 'lucide-react';

interface QuestionCardProps {
  question: SqlQuestion;
  currentIndex: number;
  totalQuestions: number;
  isSolved: boolean;
  onPrev: () => void;
  onNext: () => void;
  onLoadSolution: (sql: string) => void;
  isLastOfSection?: boolean;
  nextSectionLabel?: string;
  onNextSection?: () => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  isSolved,
  onPrev,
  onNext,
  onLoadSolution,
  isLastOfSection,
  nextSectionLabel,
  onNextSection,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset Clue and Solution drawers whenever question changes
  React.useEffect(() => {
    setShowHint(false);
    setShowSolution(false);
    setCopied(false);
  }, [question.id]);

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

  const handleCopySolution = () => {
    navigator.clipboard.writeText(question.solutionSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextClick = () => {
    if (isLastOfSection && onNextSection) {
      onNextSection();
    } else {
      onNext();
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Top bar with difficulty & stepper */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${getDifficultyBadge(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {question.category}
            </span>
            {isSolved && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            {isLastOfSection && onNextSection && (
              <button
                onClick={onNextSection}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                title="Advance to next section"
              >
                <span>Next Section →</span>
              </button>
            )}
            <span>{currentIndex + 1} / {totalQuestions}</span>
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextClick}
              disabled={!isLastOfSection && currentIndex === totalQuestions - 1}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isLastOfSection
                  ? 'hover:bg-teal-500/20 text-teal-400'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
              title={isLastOfSection ? nextSectionLabel || 'Advance to Next Section' : 'Next Question'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
          {question.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {question.description}
        </p>

        {/* Clue Accordion */}
        {showHint && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-xs text-amber-950 dark:text-amber-200 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Clue / Hint</span>
            </div>
            <p className="leading-relaxed pl-5.5">{question.hint}</p>
          </div>
        )}

        {/* Solution Reveal Drawer */}
        {showSolution && (
          <div className="mb-4 p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-xs font-mono shadow-inner">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Official Solution SQL
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySolution}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Copy Solution to Clipboard"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => onLoadSolution(question.solutionSql)}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shadow-xs"
                  title="Load solution query directly into SQL terminal"
                >
                  Load in Editor
                </button>
              </div>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-emerald-300">
              <code>{question.solutionSql}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar with Clue & Show Solution Options */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => setShowHint(!showHint)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
            showHint
              ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
              : 'bg-amber-50/80 dark:bg-slate-800/80 border-amber-200 dark:border-slate-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{showHint ? 'Hide Clue' : '💡 Clue'}</span>
        </button>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
            showSolution
              ? 'bg-indigo-100 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
              : 'bg-indigo-50/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-700 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>{showSolution ? '🔒 Hide Solution' : '🔓 Show Solution'}</span>
        </button>
      </div>
    </div>
  );
}
