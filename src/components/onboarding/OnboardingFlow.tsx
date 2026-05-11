'use client';

import { useState, useEffect } from 'react';
import { UserProfile, SectorKey } from '@/types';
import { ONBOARDING_STEPS } from '@/data/onboarding';
import { getProfileSummary } from '@/lib/profile';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

type Answers = Record<string, string | string[] | number>;

const TOTAL = ONBOARDING_STEPS.length;

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [slider3Val, setSlider3Val] = useState(2);      // 0|1|2|3|4
  const [slider100Val, setSlider100Val] = useState(50); // 0-100
  const [animKey, setAnimKey] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [finalProfile, setFinalProfile] = useState<UserProfile | null>(null);

  const current = ONBOARDING_STEPS[step];
  const progress = (step / TOTAL) * 100;

  useEffect(() => {
    setSelected(null);
    setMultiSelected([]);
    setSlider3Val(2);
    setSlider100Val(50);
    setAnimKey((k) => k + 1);
  }, [step]);

  const goBack = () => {
    if (step === 0) return;
    const prevStep = step - 1;
    const prevKey = ONBOARDING_STEPS[prevStep].key;
    const prevVal = answers[prevKey];
    // Restore previous step's selection state
    if (Array.isArray(prevVal)) setMultiSelected(prevVal as string[]);
    else if (typeof prevVal === 'number') {
      const prevType = ONBOARDING_STEPS[prevStep].type;
      if (prevType === 'slider-100') setSlider100Val(prevVal);
      else {
        const idx = ONBOARDING_STEPS[prevStep].options.findIndex(o => o.value === String(prevVal));
        setSlider3Val(idx >= 0 ? idx : 2);
      }
    } else {
      setSelected(prevVal as string ?? null);
    }
    setStep(prevStep);
  };

  const advance = (newAnswers: Answers) => {
    setAnswers(newAnswers);
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
    } else {
      const p: UserProfile = {
        experience:         (newAnswers.experience as UserProfile['experience']) ?? 'none',
        usStartedAt:        (newAnswers.usStartedAt as UserProfile['usStartedAt']) ?? 'never',
        goal:               (newAnswers.goal as UserProfile['goal']) ?? 'learning',
        investmentHorizon:  (newAnswers.investmentHorizon as UserProfile['investmentHorizon']) ?? '1to3',
        budget:             (newAnswers.budget as UserProfile['budget']) ?? 'under10',
        maxConcentration:   (newAnswers.maxConcentration as UserProfile['maxConcentration']) ?? '10',
        riskAppetite:       (newAnswers.riskAppetite as UserProfile['riskAppetite']) ?? 'neutral',
        maxLoss:            (newAnswers.maxLoss as UserProfile['maxLoss']) ?? 'minus20',
        dividendVsGrowth:   (() => { const raw = newAnswers.dividendVsGrowth; if (typeof raw === 'number') return raw; const n = parseInt(String(raw ?? '50'), 10); return isNaN(n) ? 50 : n; })(),
        fxSensitivity:      (newAnswers.fxSensitivity as UserProfile['fxSensitivity']) ?? 'some',
        infoStyle:          (newAnswers.infoStyle as UserProfile['infoStyle']) ?? 'news',
        sectors:            ((newAnswers.sectors as string[]) ?? []) as SectorKey[],
        holdings:           (newAnswers.holdings as string[]) ?? [],
        completedAt:        new Date().toISOString(),
      };
      setFinalProfile(p);
      setShowComplete(true);
    }
  };

  const handleSingle = (value: string) => {
    if (selected) return;
    setSelected(value);
    setTimeout(() => advance({ ...answers, [current.key]: value }), 320);
  };

  const toggleMulti = (value: string) =>
    setMultiSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const handleMultiNext = () => {
    if (multiSelected.length === 0) return;
    advance({ ...answers, [current.key]: multiSelected });
  };

  const handleTickerNext = (skip = false) =>
    advance({ ...answers, [current.key]: skip ? [] : multiSelected });

  const handleSlider3Next = () =>
    advance({ ...answers, [current.key]: current.options[slider3Val].value });

  const handleSlider100Next = () =>
    advance({ ...answers, [current.key]: slider100Val });

  // ── Complete screen ───────────────────────────────
  if (showComplete && finalProfile) {
    const summary = getProfileSummary(finalProfile);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-10">
        <div className="w-full max-w-[400px] animate-[fadeSlideUp_0.5s_ease-out]">
          <div className="mb-2 text-center text-xs font-bold tracking-widest text-accent">
            프로파일링 완료
          </div>
          <div className="mb-8 text-center">
            <div className="mb-4 text-7xl">{summary.emoji}</div>
            <div className="mb-2 text-2xl font-black" style={{ color: summary.color }}>
              {summary.title}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--t4)' }}>
              {summary.subtitle}
            </p>
          </div>
          <div className="card mb-5 space-y-3 rounded-2xl p-5">
            <p className="text-[11px] font-bold tracking-widest text-accent">✦ 맞춤 투자 원칙</p>
            {summary.tips.map((tip, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="mt-0.5 text-accent text-xs">·</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--t3)' }}>{tip}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onComplete(finalProfile)} className="btn-gradient w-full py-4 text-base">
            미장SCENE 시작하기 →
          </button>
        </div>
      </div>
    );
  }

  const isSingle  = current.type === 'single';
  const isMulti   = current.type === 'multi';
  const isTicker  = current.type === 'ticker-select';
  const isSlider3 = current.type === 'slider-5';
  const isSlider100 = current.type === 'slider-100';

  return (
    <div className="flex min-h-screen flex-col bg-bg px-5">
      {/* Progress */}
      <div className="pt-12 pb-6">
        <div className="mb-2 flex items-center justify-between text-[11px]" style={{ color: 'var(--t5)' }}>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={goBack}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--t4)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← 이전
              </button>
            )}
            <span>{step + 1} / {TOTAL}</span>
          </div>
          <span className="text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-[2px] rounded-full" style={{ background: 'var(--card-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#4ecdc4,#45b7d1)' }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={animKey} className="flex-1 animate-[fadeSlideUp_0.28s_ease-out]">
        <h2 className="mb-1.5 whitespace-pre-line text-[22px] font-black leading-snug" style={{ color: 'var(--t1)' }}>
          {current.question}
        </h2>
        <p className="mb-6 text-sm" style={{ color: 'var(--t4)' }}>{current.subtitle}</p>

        {/* ── Single select ── */}
        {isSingle && (
          <div className="flex flex-col gap-3">
            {current.options.map((opt) => {
              const isChosen = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSingle(opt.value)}
                  disabled={!!selected}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-200"
                  style={{
                    background: isChosen ? 'rgba(78,205,196,0.12)' : 'var(--card-bg)',
                    border: `1px solid ${isChosen ? 'rgba(78,205,196,0.45)' : 'var(--card-border)'}`,
                    cursor: selected ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold" style={{ color: isChosen ? '#4ecdc4' : 'var(--t1)' }}>
                      {opt.label}
                    </div>
                    {opt.sub && <div className="mt-0.5 text-[12px]" style={{ color: 'var(--t5)' }}>{opt.sub}</div>}
                  </div>
                  {isChosen && <span className="text-accent">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Multi / Ticker select ── */}
        {(isMulti || isTicker) && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              {current.options.map((opt) => {
                const isChosen = multiSelected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleMulti(opt.value)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200"
                    style={{
                      background: isChosen ? 'rgba(78,205,196,0.12)' : 'var(--card-bg)',
                      border: `1px solid ${isChosen ? 'rgba(78,205,196,0.45)' : 'var(--card-border)'}`,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold" style={{ color: isChosen ? '#4ecdc4' : 'var(--t1)' }}>
                        {opt.label}
                      </div>
                      {opt.sub && (
                        <div className="mt-0.5 truncate text-[11px]" style={{ color: 'var(--t5)' }}>{opt.sub}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex gap-2.5">
              {isTicker && (
                <button onClick={() => handleTickerNext(true)} className="btn-ghost flex-1 rounded-xl py-3.5 text-sm" style={{ color: 'var(--t4)' }}>
                  보유 종목 없어요
                </button>
              )}
              <button
                onClick={() => isTicker ? handleTickerNext(false) : handleMultiNext()}
                disabled={isMulti && multiSelected.length === 0}
                className="btn-gradient flex-1 py-3.5 text-sm disabled:opacity-40"
              >
                다음 →
              </button>
            </div>
          </>
        )}

        {/* ── Slider-5 ── */}
        {isSlider3 && (
          <div>
            {/* Clickable step dots with labels */}
            <div className="mb-2 flex justify-between">
              {current.sliderLabels!.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setSlider3Val(i)}
                  className="flex flex-col items-center gap-1.5 transition-all"
                  style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '0 2px' }}
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: slider3Val === i ? '#4ecdc4' : 'var(--t5)' }}
                  >
                    {label}
                  </span>
                  <div
                    className="h-3 w-3 rounded-full border-2 transition-all duration-200"
                    style={{
                      background: slider3Val === i ? '#4ecdc4' : 'transparent',
                      borderColor: slider3Val === i ? '#4ecdc4' : 'var(--card-border-alt)',
                      boxShadow: slider3Val === i ? '0 0 8px rgba(78,205,196,0.55)' : 'none',
                    }}
                  />
                </button>
              ))}
            </div>
            {/* Slider track */}
            <input
              type="range" min={0} max={4} step={1} value={slider3Val}
              onChange={(e) => setSlider3Val(+e.target.value)}
              className="slider w-full"
              style={{ touchAction: 'none' }}
            />
            {/* Inline current value display */}
            <div
              className="mt-5 flex items-center gap-3.5 rounded-2xl px-4 py-3.5"
              style={{ background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)' }}
            >
              <span className="flex-shrink-0 text-2xl">{current.options[slider3Val].icon}</span>
              <div>
                <p className="font-bold text-accent">{current.options[slider3Val].label}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: 'var(--t3)' }}>
                  {current.options[slider3Val].sub}
                </p>
              </div>
            </div>
            <button onClick={handleSlider3Next} className="btn-gradient mt-5 w-full py-4 text-sm">
              다음 →
            </button>
          </div>
        )}

        {/* ── Slider-100 ── */}
        {isSlider100 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--t4)' }}>{current.sliderEndLabels![0]}</span>
              <span className="text-sm" style={{ color: 'var(--t4)' }}>{current.sliderEndLabels![1]}</span>
            </div>
            <input
              type="range" min={0} max={100} step={5} value={slider100Val}
              onChange={(e) => setSlider100Val(+e.target.value)}
              className="slider w-full"
            />
            <div className="mt-3 text-center">
              <span className="font-space text-2xl font-extrabold text-accent">{slider100Val}</span>
              <span className="ml-1 text-sm" style={{ color: 'var(--t5)' }}>/ 100</span>
            </div>
            <div className="card mt-3 rounded-xl p-3.5 text-center">
              <p className="text-[13px]" style={{ color: 'var(--t3)' }}>
                {slider100Val <= 25 && '배당 수익을 중심으로 안정적인 현금 흐름을 선호해요.'}
                {slider100Val > 25 && slider100Val <= 50 && '배당을 어느 정도 선호하지만 성장에도 관심이 있어요.'}
                {slider100Val > 50 && slider100Val <= 75 && '성장 중심이지만 배당도 플러스 요소로 봐요.'}
                {slider100Val > 75 && '성장 기대감이 높은 종목을 강하게 선호해요.'}
              </p>
            </div>
            <button onClick={handleSlider100Next} className="btn-gradient mt-5 w-full py-4 text-sm">
              다음 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
