'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, QuizStats, QuizCategory } from '@/types';
import { QUIZ_POOL, QUIZ_CATEGORIES } from '@/data/quiz';

const STATS_KEY = 'mijang_quiz_stats_v1';
const DAILY_KEY = 'mijang_daily_quiz_v1';

function loadStats(): QuizStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { streak: 0, lastDate: '', totalCorrect: 0, totalAnswered: 0 };
    return JSON.parse(raw) as QuizStats;
  } catch { return { streak: 0, lastDate: '', totalCorrect: 0, totalAnswered: 0 }; }
}

function saveStats(s: QuizStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getDailyQuestion(): QuizQuestion {
  const dayNum = Math.floor(Date.now() / 86_400_000);
  return QUIZ_POOL[dayNum % QUIZ_POOL.length];
}

function getTodayAnswered(): number | null {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    const { date, answer } = JSON.parse(raw);
    if (date !== getTodayKey()) return null;
    return answer as number;
  } catch { return null; }
}

function saveTodayAnswer(answer: number) {
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: getTodayKey(), answer }));
}

// ── Sub-components ────────────────────────────────

function StatChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-4 py-3"
      style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
      <p className="font-space text-xl font-extrabold" style={{ color }}>{value}</p>
      <p className="mt-0.5 text-[10px]" style={{ color: 'var(--t5)' }}>{label}</p>
    </div>
  );
}

function DailyQuizCard({ question, onAnswer }: {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(getTodayAnswered());
  const [revealed, setRevealed] = useState(selected !== null);

  const handleSelect = useCallback((i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    saveTodayAnswer(i);
    onAnswer(i === question.answer);
  }, [revealed, question.answer, onAnswer]);

  const isCorrect = selected === question.answer;

  return (
    <div className="card rounded-2xl p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-widest text-accent">오늘의 퀴즈</span>
        <span className="rounded-full px-2 py-0.5 text-[9px]"
          style={{
            background: question.difficulty === 'easy' ? 'rgba(46,213,115,0.12)' : question.difficulty === 'medium' ? 'rgba(255,165,2,0.12)' : 'rgba(255,71,87,0.12)',
            color: question.difficulty === 'easy' ? '#2ed573' : question.difficulty === 'medium' ? '#ffa502' : '#ff4757',
          }}>
          {question.difficulty === 'easy' ? '쉬움' : question.difficulty === 'medium' ? '보통' : '어려움'}
        </span>
      </div>
      <p className="mb-4 text-[15px] font-bold leading-snug" style={{ color: 'var(--t1)' }}>
        {question.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          let bg = 'var(--card-bg)';
          let border = 'var(--card-border)';
          let textColor = 'var(--t2)';

          if (revealed) {
            if (i === question.answer) {
              bg = 'rgba(46,213,115,0.1)'; border = 'rgba(46,213,115,0.4)'; textColor = '#2ed573';
            } else if (i === selected && i !== question.answer) {
              bg = 'rgba(255,71,87,0.1)'; border = 'rgba(255,71,87,0.4)'; textColor = '#ff4757';
            }
          } else if (selected === i) {
            bg = 'rgba(78,205,196,0.1)'; border = 'rgba(78,205,196,0.4)'; textColor = '#4ecdc4';
          }

          return (
            <button key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all duration-200"
              style={{ background: bg, border: `1px solid ${border}`, cursor: revealed ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: `${border}30`, color: textColor }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-[13px]" style={{ color: textColor }}>{opt}</span>
              {revealed && i === question.answer && <span className="ml-auto text-sm">✓</span>}
              {revealed && i === selected && i !== question.answer && <span className="ml-auto text-sm">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Result + Explanation */}
      {revealed && (
        <div className="mt-4 space-y-2.5">
          <div className="rounded-xl px-4 py-3"
            style={{
              background: isCorrect ? 'rgba(46,213,115,0.08)' : 'rgba(255,71,87,0.08)',
              border: `1px solid ${isCorrect ? 'rgba(46,213,115,0.25)' : 'rgba(255,71,87,0.25)'}`,
            }}>
            <p className="mb-1 text-[12px] font-bold" style={{ color: isCorrect ? '#2ed573' : '#ff4757' }}>
              {isCorrect ? '🎉 정답이에요!' : '❌ 아쉬워요'}
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--t3)' }}>
              {question.explanation}
            </p>
          </div>
          {question.relatedTickers && question.relatedTickers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: 'var(--t5)' }}>관련 종목</span>
              {question.relatedTickers.map((t) => (
                <span key={t} className="font-space rounded px-1.5 py-0.5 text-[10px] font-bold"
                  style={{ background: 'rgba(78,205,196,0.1)', color: '#4ecdc4' }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PracticeCard({ question, onResult }: {
  question: QuizQuestion;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    onResult(i === question.answer);
  };

  return (
    <div className="card rounded-2xl p-4">
      <p className="mb-3 text-[14px] font-bold leading-snug" style={{ color: 'var(--t1)' }}>
        {question.question}
      </p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          let bg = 'var(--card-bg)', border = 'var(--card-border)', textColor = 'var(--t2)';
          if (revealed) {
            if (i === question.answer) { bg = 'rgba(46,213,115,0.1)'; border = 'rgba(46,213,115,0.4)'; textColor = '#2ed573'; }
            else if (i === selected)   { bg = 'rgba(255,71,87,0.1)';  border = 'rgba(255,71,87,0.4)';  textColor = '#ff4757'; }
          } else if (selected === i)   { bg = 'rgba(78,205,196,0.1)'; border = 'rgba(78,205,196,0.4)'; textColor = '#4ecdc4'; }

          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={revealed}
              className="rounded-xl px-3 py-2.5 text-left text-[12px] transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color: textColor, cursor: revealed ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              <span className="font-bold">{String.fromCharCode(65 + i)}.</span> {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--t4)' }}>
          💡 {question.explanation}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────

export default function QuizTab() {
  const [stats, setStats] = useState<QuizStats>(() => ({ streak: 0, lastDate: '', totalCorrect: 0, totalAnswered: 0 }));
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<QuizCategory | 'all'>('all');
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceResults, setPracticeResults] = useState<boolean[]>([]);

  useEffect(() => {
    setStats(loadStats());
    setMounted(true);
  }, []);

  const handleDailyAnswer = useCallback((correct: boolean) => {
    setStats((prev) => {
      const today = getTodayKey();
      const isNewDay = prev.lastDate !== today;
      const newStreak = isNewDay ? (correct ? prev.streak + 1 : 0) : prev.streak;
      const updated: QuizStats = {
        streak: newStreak,
        lastDate: today,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
      };
      saveStats(updated);
      return updated;
    });
  }, []);

  const practicePool = activeCategory === 'all'
    ? QUIZ_POOL
    : QUIZ_POOL.filter((q) => q.category === activeCategory);

  const currentPractice = practicePool[practiceIdx % practicePool.length];

  const handlePracticeResult = (correct: boolean) => {
    setPracticeResults((prev) => [...prev, correct]);
    setStats((prev) => {
      const updated: QuizStats = {
        ...prev,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
      };
      saveStats(updated);
      return updated;
    });
  };

  const handleNext = () => {
    setPracticeIdx((i) => i + 1);
  };

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-lg font-black" style={{ color: 'var(--t1)' }}>투자 퀴즈</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--t5)' }}>매일 새 퀴즈 · 풀수록 실력이 쌓여요</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatChip label="연속 정답" value={`${stats.streak}일`} color="#4ecdc4" />
        <StatChip label="누적 정답" value={stats.totalCorrect} color="#2ed573" />
        <StatChip label="정답률" value={`${accuracy}%`} color="#ffa502" />
      </div>

      {/* Daily quiz */}
      <section>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>📅 오늘의 퀴즈</p>
        <DailyQuizCard question={getDailyQuestion()} onAnswer={handleDailyAnswer} />
      </section>

      {/* Practice section */}
      <section>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>🧩 카테고리별 연습</p>

        {/* Category chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {[{ id: 'all' as const, label: '전체', icon: '✦', color: '#4ecdc4' }, ...QUIZ_CATEGORIES].map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id}
                onClick={() => { setActiveCategory(cat.id as QuizCategory | 'all'); setPracticeIdx(0); setPracticeResults([]); }}
                className="rounded-full px-3 py-1 text-[11px] font-bold transition-all"
                style={{
                  background: active ? 'rgba(78,205,196,0.15)' : 'var(--card-bg)',
                  color: active ? '#4ecdc4' : 'var(--t4)',
                  border: active ? '1px solid rgba(78,205,196,0.35)' : '1px solid var(--card-border)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>

        {practicePool.length > 0 && (
          <>
            <PracticeCard
              key={practiceIdx}
              question={currentPractice}
              onResult={handlePracticeResult}
            />
            <button onClick={handleNext}
              className="btn-ghost mt-3 w-full rounded-xl py-3 text-[13px]"
              style={{ color: 'var(--t3)' }}>
              다음 문제 →
            </button>
          </>
        )}

        {practiceResults.length > 0 && (
          <p className="mt-2 text-center text-[11px]" style={{ color: 'var(--t5)' }}>
            이번 세션: {practiceResults.filter(Boolean).length}/{practiceResults.length} 정답
          </p>
        )}
      </section>
    </div>
  );
}
