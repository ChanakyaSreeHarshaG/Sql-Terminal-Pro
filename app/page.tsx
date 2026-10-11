'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  DATABASES,
  SQL_PRACTICE_QUESTIONS,
  SQL_PATTERNS,
  PATTERN_QUESTIONS,
  DatabaseDefinition,
  SqlQuestion,
  SqlPatternDefinition,
} from '@/data/sqlPracticeData';
import SchemaExplorer from '@/components/sql-practice/SchemaExplorer';
import QuestionCard from '@/components/sql-practice/QuestionCard';
import SqlEditor from '@/components/sql-practice/SqlEditor';
import ResultsTable, { QueryResult, VerificationState } from '@/components/sql-practice/ResultsTable';
import QuestionNavigator from '@/components/sql-practice/QuestionNavigator';
import {
  Database,
  Sparkles,
  Trophy,
  Layers,
  Code2,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Flame,
} from 'lucide-react';

export default function StandaloneSqlTerminalPage() {
  // Practice Track Toggle: 'standard' (72 authentic questions) vs 'patterns' (200 repeating interview patterns)
  const [practiceMode, setPracticeMode] = useState<'standard' | 'patterns'>('standard');
  const [selectedPatternId, setSelectedPatternId] = useState<string>('all');

  const [activeDb, setActiveDb] = useState<DatabaseDefinition>(DATABASES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  // Questions filtered based on mode, pattern filter, and difficulty
  const filteredQuestions = useMemo(() => {
    if (practiceMode === 'patterns') {
      return PATTERN_QUESTIONS.filter((q) => {
        const matchPattern =
          selectedPatternId === 'all'
            ? true
            : (() => {
                const patternDef = SQL_PATTERNS.find((p) => p.id === selectedPatternId);
                return patternDef ? q.category.startsWith(`Pattern ${patternDef.number}:`) : true;
              })();
        const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
        return matchPattern && matchDiff;
      });
    } else {
      return SQL_PRACTICE_QUESTIONS.filter((q) => {
        const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
        return matchDiff;
      });
    }
  }, [practiceMode, selectedPatternId, selectedDifficulty]);

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const currentQuestion: SqlQuestion | undefined = filteredQuestions[questionIndex] || filteredQuestions[0];

  // Currently active pattern definition
  const currentPattern = useMemo(() => {
    if (selectedPatternId !== 'all') {
      return SQL_PATTERNS.find((p) => p.id === selectedPatternId) || SQL_PATTERNS[0];
    }
    if (currentQuestion) {
      const match = currentQuestion.category.match(/Pattern (\d+):/);
      if (match) {
        const num = parseInt(match[1], 10);
        return SQL_PATTERNS.find((p) => p.number === num) || SQL_PATTERNS[0];
      }
    }
    return SQL_PATTERNS[0];
  }, [selectedPatternId, currentQuestion]);

  const [sqlCode, setSqlCode] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [expectedResult, setExpectedResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [engineReady, setEngineReady] = useState<boolean>(false);
  const [engineError, setEngineError] = useState<string | null>(null);

  const [verification, setVerification] = useState<{
    state: VerificationState;
    message?: string;
  }>({ state: 'idle' });

  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sql_terminal_solved_ids');
        if (saved) return new Set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load solved IDs from localStorage', e);
      }
    }
    return new Set();
  });

  // Save solved IDs to localStorage whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sql_terminal_solved_ids', JSON.stringify(Array.from(solvedIds)));
      } catch (e) {
        console.error('Failed to save solved IDs to localStorage', e);
      }
    }
  }, [solvedIds]);

  // Persist user's written / submitted code per question in localStorage
  const [savedUserCode, setSavedUserCode] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sql_terminal_saved_code');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved SQL code from localStorage', e);
      }
    }
    return {};
  });

  const savedUserCodeRef = useRef<Record<string, string>>(savedUserCode);
  useEffect(() => {
    savedUserCodeRef.current = savedUserCode;
  }, [savedUserCode]);

  const handleSqlChange = (newCode: string) => {
    setSqlCode(newCode);
    if (currentQuestion) {
      setSavedUserCode((prev) => {
        const next = { ...prev };
        if (newCode.trim()) {
          next[currentQuestion.id] = newCode;
        } else {
          delete next[currentQuestion.id];
        }
        savedUserCodeRef.current = next;
        try {
          localStorage.setItem('sql_terminal_saved_code', JSON.stringify(next));
        } catch (e) {
          console.error('Failed to persist code to localStorage', e);
        }
        return next;
      });
    }
  };

  // SQLite references
  const sqlModuleRef = useRef<any>(null);
  const dbInstanceRef = useRef<any>(null);

  // Initialize SQLite in WebAssembly
  useEffect(() => {
    let isMounted = true;

    const loadSqlEngine = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Check if script already attached
        if (!(window as any).initSqlJs) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js';
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load sql-wasm.js from CDN'));
          });
        }

        const SQL = await (window as any).initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
        });

        if (!isMounted) return;
        sqlModuleRef.current = SQL;

        // Init database with active question schema
        const targetDb = currentQuestion
          ? (DATABASES.find((d) => d.id === currentQuestion.database) || activeDb)
          : activeDb;
        setActiveDb(targetDb);
        initDb(targetDb, SQL);
        setEngineReady(true);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('SQL Engine init error:', err);
        setEngineError(err.message || 'Could not initialize WebAssembly SQLite');
      }
    };

    loadSqlEngine();

    return () => {
      isMounted = false;
    };
  }, []);

  // Re-initialize database whenever active database changes
  const initDb = (dbDef: DatabaseDefinition, SQLModule?: any) => {
    const SQL = SQLModule || sqlModuleRef.current;
    if (!SQL) return;
    try {
      const db = new SQL.Database();
      db.run(dbDef.initSql);
      dbInstanceRef.current = db;
    } catch (err) {
      console.error('Failed to init DDL seed:', err);
    }
  };

  const handleSelectDb = (newDb: DatabaseDefinition) => {
    setActiveDb(newDb);
    initDb(newDb);
    setQueryResult(null);
    setVerification({ state: 'idle' });
  };

  // Switch Track Mode handler
  const handleSwitchMode = (mode: 'standard' | 'patterns') => {
    setPracticeMode(mode);
    setQuestionIndex(0);
    setQueryResult(null);
    setVerification({ state: 'idle' });

    if (mode === 'patterns') {
      // Switch active db to Enterprise / Patterns Master Sandbox
      const patternsDb = DATABASES.find((d) => d.id === 'enterprise') || DATABASES[1];
      setActiveDb(patternsDb);
      initDb(patternsDb);
    } else {
      // Switch back to Hospital
      const hospitalDb = DATABASES[0];
      setActiveDb(hospitalDb);
      initDb(hospitalDb);
    }
  };

  // Auto-sync SQLite database and active schema whenever current question changes
  useEffect(() => {
    if (currentQuestion) {
      const targetDb = DATABASES.find((d) => d.id === currentQuestion.database) || DATABASES[0];
      if (activeDb.id !== targetDb.id) {
        setActiveDb(targetDb);
        initDb(targetDb);
      }
    }
  }, [currentQuestion?.id, currentQuestion?.database, activeDb.id]);

  // Restore user's typed query when question changes (keeps editor clean if unattempted)
  useEffect(() => {
    if (currentQuestion) {
      const saved = savedUserCodeRef.current[currentQuestion.id];
      // Only restore if user actually wrote/saved code for this question (ignore auto starterSql)
      const isAutoStarter = Boolean(currentQuestion.starterSql && saved === currentQuestion.starterSql);
      if (saved !== undefined && saved.trim() !== '' && !isAutoStarter) {
        setSqlCode(saved);
      } else {
        // Keep editor clean and empty so user can write from scratch
        setSqlCode('');
      }
      setVerification({ state: 'idle' });
      setQueryResult(null);
    }
  }, [currentQuestion?.id]);

  // Compute expected output table for active challenge
  useEffect(() => {
    if (!currentQuestion || !engineReady || !dbInstanceRef.current) {
      setExpectedResult(null);
      return;
    }
    try {
      const res = dbInstanceRef.current.exec(currentQuestion.solutionSql);
      if (res && res.length > 0) {
        setExpectedResult({
          columns: res[0].columns,
          values: res[0].values,
        });
      } else {
        setExpectedResult({ columns: [], values: [] });
      }
    } catch (e) {
      console.error('Failed to compute expected output:', e);
      setExpectedResult(null);
    }
  }, [currentQuestion?.id, currentQuestion?.solutionSql, engineReady, activeDb.id]);

  // Unified Run Query & Solution Verification Handler
  const handleExecuteQuery = (customSql?: string) => {
    const sqlToRun = customSql !== undefined ? customSql : sqlCode;
    if (!sqlToRun.trim()) {
      setVerification({
        state: 'error',
        message: 'Please write an SQL query in the editor first.',
      });
      return;
    }

    // Persist current code
    handleSqlChange(sqlToRun);

    const db = dbInstanceRef.current;
    if (!db) {
      setVerification({
        state: 'error',
        message: 'SQLite WebAssembly engine is initializing. Please wait a moment...',
      });
      return;
    }

    setIsRunning(true);

    setTimeout(() => {
      const startTime = performance.now();
      try {
        const userRes = db.exec(sqlToRun);
        const elapsed = Math.round(performance.now() - startTime);

        if (!userRes || userRes.length === 0) {
          // If query produced 0 rows, check whether solution expects 0 rows
          const expectedRes = currentQuestion ? db.exec(currentQuestion.solutionSql) : null;
          const expectedRows = expectedRes && expectedRes.length > 0 ? expectedRes[0].values.length : 0;

          if (expectedRows === 0 && expectedRes) {
            setVerification({
              state: 'correct',
              message: '🎉 Correct! Your query satisfies all problem constraints and matches the expected answer.',
            });
            if (currentQuestion) {
              setSolvedIds((prev) => new Set([...prev, currentQuestion.id]));
              handleSqlChange(sqlToRun);
            }
          } else {
            setVerification({
              state: 'mismatch',
              message: `Your query returned 0 rows, but the solution expects ${expectedRows} record(s).`,
            });
          }

          setQueryResult({
            columns: [],
            values: [],
            executionTimeMs: elapsed,
          });
          return;
        }

        const u = userRes[0];
        setQueryResult({
          columns: u.columns,
          values: u.values,
          executionTimeMs: elapsed,
        });

        if (!currentQuestion) {
          setVerification({ state: 'idle' });
          return;
        }

        // Compare against expected solution query
        const expectedRes = db.exec(currentQuestion.solutionSql);
        if (!expectedRes || expectedRes.length === 0) {
          setVerification({
            state: 'mismatch',
            message: 'Row count mismatch: Solution produces 0 rows.',
          });
          return;
        }

        const e = expectedRes[0];

        // 1. Check Row count
        if (u.values.length !== e.values.length) {
          setVerification({
            state: 'mismatch',
            message: `Row count mismatch: Returned ${u.values.length} row(s), but expected solution produces ${e.values.length} row(s).`,
          });
          return;
        }

        // 2. Check Column count
        if (u.columns.length !== e.columns.length) {
          setVerification({
            state: 'mismatch',
            message: `Column count mismatch: Expected ${e.columns.length} columns (${e.columns.join(', ')}), but your query returned ${u.columns.length}.`,
          });
          return;
        }

        // 3. Robust Normalized Content Comparison
        const normalizeCell = (v: any) => {
          if (v === null || v === undefined) return '';
          if (typeof v === 'number') {
            return Number(v.toFixed(3)).toString();
          }
          return String(v).trim().toLowerCase();
        };

        const stringifyRow = (row: any[]) =>
          row.map(normalizeCell).join(' | ');

        const userRowStrings = u.values.map(stringifyRow);
        const expectedRowStrings = e.values.map(stringifyRow);

        let matches = false;
        // Strict row-for-row match
        if (JSON.stringify(userRowStrings) === JSON.stringify(expectedRowStrings)) {
          matches = true;
        } else {
          // If query does not require ORDER BY, compare sorted rows
          const sortedUser = [...userRowStrings].sort();
          const sortedExpected = [...expectedRowStrings].sort();
          if (JSON.stringify(sortedUser) === JSON.stringify(sortedExpected)) {
            matches = true;
          }
        }

        if (matches) {
          setVerification({
            state: 'correct',
            message: '🎉 Correct! Your query satisfies all problem constraints and matches the expected answer.',
          });
          if (currentQuestion) {
            setSolvedIds((prev) => new Set([...prev, currentQuestion.id]));
            handleSqlChange(sqlToRun);
          }
        } else {
          setVerification({
            state: 'mismatch',
            message: `Result mismatch: The values returned by your query differ from the official expected answer. Review the hint or click 'Show Solution' to cross-verify.`,
          });
        }
      } catch (err: any) {
        setVerification({
          state: 'error',
          message: `SQL Execution Error: ${err.message}`,
        });
        setQueryResult({
          columns: [],
          values: [],
          error: err.message,
        });
      } finally {
        setIsRunning(false);
      }
    }, 15);
  };

  // Preview top rows of any table from Schema Explorer without failing question check
  const handlePreviewTable = (tableName: string) => {
    const previewSql = `SELECT * FROM ${tableName} LIMIT 5;`;
    setSqlCode(previewSql);
    const db = dbInstanceRef.current;
    if (!db) return;
    try {
      const res = db.exec(previewSql);
      if (res && res.length > 0) {
        setQueryResult({
          columns: res[0].columns,
          values: res[0].values,
          executionTimeMs: 5,
        });
        setVerification({ state: 'idle' });
      }
    } catch (e: any) {
      setQueryResult({ columns: [], values: [], error: e.message });
    }
  };

  // Solved questions isolated per track
  const solvedStandardCount = useMemo(() => {
    return SQL_PRACTICE_QUESTIONS.filter((q) => solvedIds.has(q.id)).length;
  }, [solvedIds]);

  const solvedPatternsCount = useMemo(() => {
    return PATTERN_QUESTIONS.filter((q) => solvedIds.has(q.id)).length;
  }, [solvedIds]);

  const currentTrackSolvedCount =
    practiceMode === 'patterns' ? solvedPatternsCount : solvedStandardCount;

  const totalBankQuestions =
    practiceMode === 'patterns' ? PATTERN_QUESTIONS.length : SQL_PRACTICE_QUESTIONS.length;

  // Next Section Routing & Action Resolver
  const nextSectionInfo = useMemo(() => {
    if (!currentQuestion) {
      return {
        isLastOfSection: false,
        nextButtonLabel: 'Next Question →',
        onNextSection: () => setQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1)),
      };
    }

    if (practiceMode === 'standard') {
      const isLast = questionIndex >= filteredQuestions.length - 1;
      if (isLast) {
        return {
          isLastOfSection: true,
          nextButtonLabel: 'Continue to 20 Master Interview Patterns (200 Qs) →',
          onNextSection: () => handleSwitchMode('patterns'),
        };
      }
      return {
        isLastOfSection: false,
        nextButtonLabel: 'Next Question →',
        onNextSection: () => setQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1)),
      };
    }

    // practiceMode === 'patterns'
    if (selectedPatternId !== 'all') {
      const isLastOfCurrentPattern = questionIndex >= filteredQuestions.length - 1;
      if (isLastOfCurrentPattern) {
        const nextPatternNum = currentPattern.number + 1;
        const nextPatDef = SQL_PATTERNS.find((p) => p.number === nextPatternNum);
        if (nextPatDef) {
          return {
            isLastOfSection: true,
            nextButtonLabel: `Next Section: Pattern ${nextPatternNum} (${nextPatDef.name}) →`,
            onNextSection: () => {
              setSelectedPatternId(nextPatDef.id);
              setQuestionIndex(0);
            },
          };
        } else {
          // Completed all 20 patterns!
          return {
            isLastOfSection: true,
            nextButtonLabel: '🏆 All 20 Patterns Completed! Back to Standard Track →',
            onNextSection: () => handleSwitchMode('standard'),
          };
        }
      }
      return {
        isLastOfSection: false,
        nextButtonLabel: 'Next Question →',
        onNextSection: () => setQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1)),
      };
    } else {
      // selectedPatternId === 'all' (all 200 questions view)
      const nextQ = filteredQuestions[questionIndex + 1];
      const isLastOfAll = questionIndex >= filteredQuestions.length - 1;

      if (isLastOfAll) {
        return {
          isLastOfSection: true,
          nextButtonLabel: '🏆 All 200 Questions Completed! Standard Track →',
          onNextSection: () => handleSwitchMode('standard'),
        };
      }

      if (nextQ && nextQ.category !== currentQuestion.category) {
        // Next question moves into the next pattern section!
        const nextPatternTitle = nextQ.category.replace(/Pattern \d+:\s*/, '');
        return {
          isLastOfSection: true,
          nextButtonLabel: `Next Section: ${nextPatternTitle} →`,
          onNextSection: () => setQuestionIndex((prev) => prev + 1),
        };
      }

      return {
        isLastOfSection: false,
        nextButtonLabel: 'Next Question →',
        onNextSection: () => setQuestionIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1)),
      };
    }
  }, [
    currentQuestion,
    practiceMode,
    selectedPatternId,
    questionIndex,
    filteredQuestions,
    currentPattern,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-teal-500 selection:text-white">
      {/* Standalone Brand Navigation Header */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
              &gt;_
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              SQL Terminal <span className="text-teal-400">Pro</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Engine:</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className={`w-2 h-2 rounded-full ${engineReady ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
              {engineReady ? 'SQLite WebAssembly' : 'Loading...'}
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top Header Bar */}
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                SQL Practice Terminal
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Master 272 hands-on SQL challenges across authentic Healthcare and Enterprise schemas with real-time local SQLite execution.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono shrink-0">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>
                Total Solved: <strong className="text-teal-400">{solvedIds.size}</strong> / 272
              </span>
            </div>
          </div>

          {/* Prominent Dual Curriculum Track Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Track 1: Standard Healthcare */}
            <button
              onClick={() => handleSwitchMode('standard')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                practiceMode === 'standard'
                  ? 'bg-slate-900/90 border-teal-500 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${practiceMode === 'standard' ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">Standard Practice Track</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        72 Questions
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hospital Patient Database · 72 authentic queries from Easy to Hard
                    </p>
                  </div>
                </div>
                {practiceMode === 'standard' && (
                  <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                    ● Active Track
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2.5 border-t border-slate-800/60 mt-1">
                <span>Healthcare Schema Progress</span>
                <span className="font-bold text-teal-400">{solvedStandardCount} / 72 Solved</span>
              </div>
            </button>

            {/* Track 2: 20 Master Interview Patterns (200 Questions) */}
            <button
              onClick={() => handleSwitchMode('patterns')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                practiceMode === 'patterns'
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border-teal-400 shadow-xl shadow-teal-500/15 ring-2 ring-teal-400'
                  : 'bg-slate-900/40 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${practiceMode === 'patterns' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Flame className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">20 Master Interview Patterns</span>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-teal-500/20 text-amber-300 border border-amber-500/40 font-bold">
                        🔥 200 Questions
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      20 Core Interview Patterns · 10 progressive questions each · Enterprise Schema
                    </p>
                  </div>
                </div>
                {practiceMode === 'patterns' ? (
                  <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                    ● Active Track
                  </span>
                ) : (
                  <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                    Switch to 200 Qs ↗
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2.5 border-t border-slate-800/60 mt-1">
                <span>Enterprise Interview Progress</span>
                <span className="font-bold text-amber-400">{solvedPatternsCount} / 200 Solved</span>
              </div>
            </button>
          </div>

          {/* Sub-Bar / Mode & Filter Toolbar */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* Left: Quick Switcher & Pattern Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold shadow-inner">
                <button
                  onClick={() => handleSwitchMode('standard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    practiceMode === 'standard'
                      ? 'bg-slate-800 text-teal-300 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Standard (72 Qs)</span>
                </button>
                <button
                  onClick={() => handleSwitchMode('patterns')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    practiceMode === 'patterns'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>20 Interview Patterns (200 Qs)</span>
                </button>
              </div>

              {/* In Patterns Mode: Pattern Dropdown with 'All 200' Option */}
              {practiceMode === 'patterns' ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Pattern:
                    </span>
                    <select
                      value={selectedPatternId}
                      onChange={(e) => {
                        setSelectedPatternId(e.target.value);
                        setQuestionIndex(0);
                      }}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-950 border border-teal-500/40 text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer shadow-sm max-w-[280px] sm:max-w-none"
                    >
                      <option value="all">🌟 All 20 Patterns (All 200 Questions)</option>
                      {SQL_PATTERNS.map((pat) => {
                        const patSolved = PATTERN_QUESTIONS.filter(
                          (q) => q.category.startsWith(`Pattern ${pat.number}:`) && solvedIds.has(q.id)
                        ).length;
                        return (
                          <option key={pat.id} value={pat.id}>
                            #{pat.number}. {pat.name} {patSolved > 0 ? `(${patSolved}/10 Solved)` : '(10 Qs)'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedPatternId !== 'all' ? (
                    <button
                      onClick={() => {
                        setSelectedPatternId('all');
                        setQuestionIndex(0);
                      }}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 transition-all cursor-pointer"
                    >
                      Show All 200 Qs
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 hidden sm:inline-block">
                      Showing All 200 Questions (#1 - #200)
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono hidden md:flex items-center gap-2 ml-2">
                  <span>Healthcare Hospital Patient Schema</span>
                </div>
              )}
            </div>

            {/* Right: Solved Count & Difficulty Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Solved: <strong className="text-teal-400">{currentTrackSolvedCount}</strong> / {totalBankQuestions}
                </span>
              </div>

              {/* Difficulty Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setQuestionIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-slate-800 text-teal-300 shadow-xs font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Engine Error Alert */}
        {engineError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono">
            <strong>Engine Error:</strong> {engineError}
          </div>
        )}

        {/* Main 3-Column Layout: Schema (Left), Editor & Results (Center), Question Navigator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Schema Explorer (3 cols) */}
          <div className="order-2 lg:order-1 lg:col-span-3 h-[700px] lg:sticky lg:top-20">
            <SchemaExplorer
              databases={DATABASES}
              activeDb={activeDb}
              currentQuestion={currentQuestion}
              onSelectDb={handleSelectDb}
              onPreviewTable={handlePreviewTable}
            />
          </div>

          {/* Center Column: Question Card + Editor + Results (6 cols) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-5">
            {/* Question Card */}
            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                currentIndex={questionIndex}
                totalQuestions={filteredQuestions.length}
                isSolved={solvedIds.has(currentQuestion.id)}
                onPrev={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                onNext={nextSectionInfo.onNextSection}
                onLoadSolution={(sol) => handleSqlChange(sol)}
                isLastOfSection={nextSectionInfo.isLastOfSection}
                nextSectionLabel={nextSectionInfo.nextButtonLabel}
                onNextSection={nextSectionInfo.onNextSection}
              />
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                No questions match the current filter. Try selecting 'All' difficulty.
              </div>
            )}

            {/* SQL Code Editor */}
            <div className="h-[270px]">
              <SqlEditor
                sql={sqlCode}
                onChange={handleSqlChange}
                onRun={() => handleExecuteQuery()}
                onCheck={() => handleExecuteQuery()}
                onReset={() => {
                  handleSqlChange('');
                  setVerification({ state: 'idle' });
                  setQueryResult(null);
                }}
                isRunning={isRunning}
              />
            </div>

            {/* Results Grid Table */}
            <div className="min-h-[280px]">
              <ResultsTable
                result={queryResult}
                expectedResult={expectedResult}
                verification={verification}
                isLoading={isRunning}
                onNextQuestion={nextSectionInfo.onNextSection}
                nextButtonLabel={nextSectionInfo.nextButtonLabel}
                isSectionComplete={nextSectionInfo.isLastOfSection}
              />
            </div>
          </div>

          {/* Right Column: Question Navigator with Question Numbers (3 cols) */}
          <div className="order-3 lg:order-3 lg:col-span-3 h-[700px] lg:sticky lg:top-20">
            <QuestionNavigator
              questions={filteredQuestions}
              currentIndex={questionIndex}
              solvedIds={solvedIds}
              onSelectQuestion={(idx) => {
                setQuestionIndex(idx);
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              isLastOfSection={nextSectionInfo.isLastOfSection}
              nextSectionLabel={nextSectionInfo.nextButtonLabel}
              onNextSection={nextSectionInfo.onNextSection}
            />
          </div>
        </div>

        {/* Bottom Quick Reference Bar */}
        <footer className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            Client-Side SQLite in WebAssembly · All 272 queries execute locally in your browser with zero latency.
          </p>
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <span>Built by</span>
            <a
              href="https://chanakyasreeharsha.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500/80 text-teal-400 hover:text-teal-300 font-medium transition-all shadow-xs group"
            >
              <span>💼</span>
              <span className="group-hover:underline underline-offset-2">Chanakya Sree Harsha</span>
              <span className="text-[10px] text-slate-500 group-hover:text-teal-400 transition-colors">↗</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
