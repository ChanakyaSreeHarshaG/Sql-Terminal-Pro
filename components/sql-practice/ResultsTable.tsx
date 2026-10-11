'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ListFilter,
  Eye,
  Sparkles,
} from 'lucide-react';

export interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
  executionTimeMs?: number;
  error?: string;
}

export type VerificationState = 'idle' | 'correct' | 'mismatch' | 'error';

interface ResultsTableProps {
  result: QueryResult | null;
  expectedResult?: QueryResult | null;
  verification: {
    state: VerificationState;
    message?: string;
  };
  isLoading: boolean;
  onNextQuestion?: () => void;
  nextButtonLabel?: string;
  isSectionComplete?: boolean;
}

export default function ResultsTable({
  result,
  expectedResult,
  verification,
  isLoading,
  onNextQuestion,
  nextButtonLabel,
  isSectionComplete,
}: ResultsTableProps) {
  const [viewTab, setViewTab] = useState<'user' | 'expected'>('user');

  // Switch back to 'user' output whenever user executes a new query or loading starts
  useEffect(() => {
    setViewTab('user');
  }, [result, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[220px] bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-500 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span>Executing query against in-memory SQLite database...</span>
      </div>
    );
  }

  const activeData = viewTab === 'expected' ? expectedResult : result;
  const isShowingExpected = viewTab === 'expected';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Verification Status Alert */}
      {verification.state === 'correct' && (
        <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{verification.message || '🎉 Perfect! Your query produced the exact expected output.'}</span>
          </div>
          {onNextQuestion && (
            <button
              onClick={onNextQuestion}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all text-xs cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5 ${
                isSectionComplete
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold shadow-md'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>{nextButtonLabel || 'Next Question →'}</span>
            </button>
          )}
        </div>
      )}

      {verification.state === 'mismatch' && (
        <div className="px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{verification.message || 'Output mismatch: Result does not match expected answer.'}</span>
          </div>
          {viewTab === 'user' && expectedResult && (
            <button
              onClick={() => setViewTab('expected')}
              className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              Compare with Expected →
            </button>
          )}
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

      {/* Results Header Meta with Expected Output button in the right corner */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/70 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {isShowingExpected ? (
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>
                Expected Output ({expectedResult ? `${expectedResult.values.length} rows` : '0 rows'})
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                Target Output
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ListFilter className="w-3.5 h-3.5" />
              <span>
                {result && !result.error
                  ? `${result.values.length} row${result.values.length === 1 ? '' : 's'} returned`
                  : 'Query Results'}
              </span>
            </div>
          )}
        </div>

        {/* Right Corner Controls: Execution Time + Expected Output Toggle */}
        <div className="flex items-center gap-2">
          {!isShowingExpected && result?.executionTimeMs !== undefined && (
            <div className="flex items-center gap-1 text-slate-400 mr-1">
              <Clock className="w-3 h-3" />
              <span>{result.executionTimeMs} ms</span>
            </div>
          )}

          {/* Expected Output button in right corner */}
          <button
            onClick={() => setViewTab(isShowingExpected ? 'user' : 'expected')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isShowingExpected
                ? 'bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 border border-slate-300 dark:border-slate-700'
            }`}
            title={isShowingExpected ? 'Return to your query results' : 'Show the expected output for this question'}
          >
            {isShowingExpected ? (
              <>
                <ListFilter className="w-3.5 h-3.5" />
                <span>Your Output</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-teal-500" />
                <span>Expected Output</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Data Grid */}
      <div className="flex-1 overflow-auto max-h-[350px] scrollbar-thin">
        {activeData && !activeData.error && activeData.columns.length > 0 ? (
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className={`sticky top-0 z-10 border-b ${
              isShowingExpected
                ? 'bg-teal-950/90 text-teal-200 border-teal-800/80'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}>
              <tr>
                <th className="py-2 px-3 text-[10px] text-slate-400 font-normal w-8 text-center border-r border-slate-200 dark:border-slate-700">
                  #
                </th>
                {activeData.columns.map((col, idx) => (
                  <th key={idx} className="py-2 px-3 font-bold truncate">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {activeData.values.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeData.columns.length + 1}
                    className="py-8 text-center text-slate-400 text-xs italic"
                  >
                    {isShowingExpected
                      ? 'The expected solution produces 0 rows.'
                      : 'Query completed with 0 rows returned.'}
                  </td>
                </tr>
              ) : (
                activeData.values.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      isShowingExpected
                        ? 'hover:bg-teal-500/10 transition-colors'
                        : 'hover:bg-teal-500/5 dark:hover:bg-slate-800/40 transition-colors'
                    }
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
            {isShowingExpected ? (
              <p>No expected output available for this challenge.</p>
            ) : !result ? (
              <p>
                Write an SQL query above and click <strong className="text-slate-600 dark:text-slate-200 font-mono">Run Query</strong> (or Ctrl+Enter) to see results. Or click <strong className="text-teal-400 font-mono">Expected Output</strong> above to see what is expected.
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-4">
                <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center mb-2 border border-slate-700">0</span>
                <p className="font-semibold text-slate-300">0 rows returned</p>
                <p className="text-slate-500 mt-1 max-w-sm">
                  Your query executed without errors, but returned 0 rows matching the WHERE / HAVING filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
