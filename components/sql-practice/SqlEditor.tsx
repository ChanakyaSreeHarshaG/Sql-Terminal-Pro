'use client';

import React, { useRef, useEffect } from 'react';
import { Play, RotateCcw, CheckCheck, Trash2 } from 'lucide-react';

interface SqlEditorProps {
  sql: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onCheck: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export default function SqlEditor({
  sql,
  onChange,
  onRun,
  onCheck,
  onReset,
  isRunning,
}: SqlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle keyboard shortcut (Ctrl+Enter or Cmd+Enter to Run)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRun]);

  const lineNumbers = sql.split('\n').map((_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-mono text-slate-400 font-semibold ml-2">SQL Terminal</span>
          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
            (Press Ctrl + Enter to run)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange('')}
            title="Clear Editor"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onReset}
            title="Reset Starter Code"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-[11px] font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onCheck}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all cursor-pointer text-xs shadow-sm hover:shadow-teal-500/20"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Check Solution</span>
          </button>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer text-xs shadow-sm hover:shadow-blue-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm">
        {/* Line Numbers Column */}
        <div className="py-3 px-2 bg-slate-950/60 text-slate-600 select-none text-right font-mono text-xs w-10 shrink-0 border-r border-slate-800/80">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={sql}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your SELECT query here..."
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 resize-none focus:outline-none font-mono leading-6 selection:bg-blue-600 selection:text-white"
        />
      </div>
    </div>
  );
}
