'use client';

import { useState } from 'react';
import { UserProfile, SectorKey } from '@/types';
import {
  EXPERIENCE_LABEL, GOAL_LABEL, BUDGET_LABEL,
  RISK_APPETITE_LABEL, INVESTMENT_HORIZON_LABEL, MAX_LOSS_LABEL,
  INFO_STYLE_LABEL, US_STARTED_AT_LABEL, MAX_CONCENTRATION_LABEL,
  FX_SENSITIVITY_LABEL, SECTOR_LABEL, getProfileSummary,
} from '@/lib/profile';
import { ONBOARDING_STEPS } from '@/data/onboarding';

interface Props {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onReset: () => void;
}

// Map profile key → display label function
function getDisplayValue(key: string, profile: UserProfile): string {
  switch (key) {
    case 'experience':        return EXPERIENCE_LABEL[profile.experience];
    case 'usStartedAt':       return US_STARTED_AT_LABEL[profile.usStartedAt];
    case 'goal':              return GOAL_LABEL[profile.goal];
    case 'investmentHorizon': return INVESTMENT_HORIZON_LABEL[profile.investmentHorizon];
    case 'budget':            return BUDGET_LABEL[profile.budget];
    case 'maxConcentration':  return MAX_CONCENTRATION_LABEL[profile.maxConcentration];
    case 'riskAppetite':      return RISK_APPETITE_LABEL[profile.riskAppetite];
    case 'maxLoss':           return MAX_LOSS_LABEL[profile.maxLoss];
    case 'dividendVsGrowth': { const v = profile.dividendVsGrowth; return v <= 37 ? '배당 중심' : v <= 62 ? '균형형' : '성장 중심'; }
    case 'fxSensitivity':     return FX_SENSITIVITY_LABEL[profile.fxSensitivity];
    case 'infoStyle':         return INFO_STYLE_LABEL[profile.infoStyle];
    case 'sectors':           return profile.sectors.map((s) => SECTOR_LABEL[s] ?? s).join(', ');
    case 'holdings':          return profile.holdings.length > 0 ? profile.holdings.join(', ') : '없음';
    default: return '—';
  }
}

function InlineEditor({
  stepKey,
  profile,
  onSave,
  onCancel,
}: {
  stepKey: string;
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
  onCancel: () => void;
}) {
  const step = ONBOARDING_STEPS.find((s) => s.key === stepKey);
  if (!step) return null;

  const rawValue = (profile as unknown as Record<string, unknown>)[stepKey];
  const [singleVal, setSingleVal] = useState<string>(String(rawValue ?? ''));
  const [multiVal, setMultiVal] = useState<string[]>(
    Array.isArray(rawValue) ? (rawValue as string[]) : []
  );
  const [slider3, setSlider3] = useState(() => {
    const cur = String(rawValue ?? '');
    const idx = step.options.findIndex((o) => o.value === cur);
    return idx >= 0 ? idx : 2;
  });
  const [slider100, setSlider100] = useState(
    typeof rawValue === 'number' ? rawValue : 50
  );

  const toggleMulti = (v: string) =>
    setMultiVal((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  const handleSave = () => {
    let value: string | string[] | number = singleVal;
    if (step.type === 'multi' || step.type === 'ticker-select') value = multiVal;
    else if (step.type === 'slider-5') value = step.options[slider3].value;
    else if (step.type === 'slider-100') value = slider100;
    onSave({ [stepKey]: value } as Partial<UserProfile>);
  };

  return (
    <div className="mt-2 rounded-xl p-3" style={{ background: 'var(--card-bg)', border: '1px solid rgba(78,205,196,0.25)' }}>
      {/* Single */}
      {(step.type === 'single') && (
        <div className="flex flex-col gap-1.5">
          {step.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSingleVal(opt.value)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
              style={{
                background: singleVal === opt.value ? 'rgba(78,205,196,0.12)' : 'transparent',
                border: `1px solid ${singleVal === opt.value ? 'rgba(78,205,196,0.4)' : 'transparent'}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span className="text-lg">{opt.icon}</span>
              <div>
                <div className="text-[13px] font-bold" style={{ color: singleVal === opt.value ? '#4ecdc4' : 'var(--t2)' }}>
                  {opt.label}
                </div>
                {opt.sub && <div className="text-[11px]" style={{ color: 'var(--t5)' }}>{opt.sub}</div>}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Multi */}
      {(step.type === 'multi' || step.type === 'ticker-select') && (
        <div className="grid grid-cols-2 gap-1.5">
          {step.options.map((opt) => {
            const chosen = multiVal.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleMulti(opt.value)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all"
                style={{
                  background: chosen ? 'rgba(78,205,196,0.12)' : 'transparent',
                  border: `1px solid ${chosen ? 'rgba(78,205,196,0.4)' : 'var(--card-border)'}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="text-[12px] font-semibold" style={{ color: chosen ? '#4ecdc4' : 'var(--t2)' }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Slider-5 */}
      {step.type === 'slider-5' && (
        <div>
          <div className="mb-2 flex justify-between">
            {step.sliderLabels!.map((l, i) => (
              <button
                key={i}
                onClick={() => setSlider3(i)}
                className="flex flex-col items-center gap-1"
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <span className="text-[9px] font-bold" style={{ color: slider3 === i ? '#4ecdc4' : 'var(--t5)' }}>{l}</span>
                <div className="h-2.5 w-2.5 rounded-full border-2 transition-all"
                  style={{
                    background: slider3 === i ? '#4ecdc4' : 'transparent',
                    borderColor: slider3 === i ? '#4ecdc4' : 'var(--card-border-alt)',
                  }}
                />
              </button>
            ))}
          </div>
          <input type="range" min={0} max={4} step={1} value={slider3}
            onChange={(e) => setSlider3(+e.target.value)} className="slider w-full"
            style={{ touchAction: 'none' }} />
          <div className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)' }}>
            <span className="text-base">{step.options[slider3].icon}</span>
            <p className="text-[12px] font-bold text-accent">{step.options[slider3].label}</p>
          </div>
        </div>
      )}

      {/* Slider-100 */}
      {step.type === 'slider-100' && (
        <div>
          <div className="mb-2 flex justify-between text-[11px]" style={{ color: 'var(--t5)' }}>
            <span>{step.sliderEndLabels![0]}</span>
            <span className="font-space font-bold text-accent">{slider100}</span>
            <span>{step.sliderEndLabels![1]}</span>
          </div>
          <input type="range" min={0} max={100} step={5} value={slider100}
            onChange={(e) => setSlider100(+e.target.value)} className="slider w-full" />
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button onClick={onCancel} className="btn-ghost flex-1 rounded-lg py-2 text-xs" style={{ color: 'var(--t4)' }}>
          취소
        </button>
        <button onClick={handleSave} className="btn-gradient flex-1 rounded-lg py-2 text-xs">
          저장
        </button>
      </div>
    </div>
  );
}

// Editable row
const EDITABLE_FIELDS: { key: string; label: string }[] = [
  { key: 'experience',        label: '투자 경험' },
  { key: 'usStartedAt',       label: '미국 주식 시작 시점' },
  { key: 'goal',              label: '투자 목표' },
  { key: 'investmentHorizon', label: '투자 기간' },
  { key: 'budget',            label: '월 투자 금액' },
  { key: 'maxConcentration',  label: '최대 투자 비중' },
  { key: 'riskAppetite',      label: '위험 감수 성향' },
  { key: 'maxLoss',           label: '손실 허용 한도' },
  { key: 'dividendVsGrowth',  label: '배당 vs 성장 선호' },
  { key: 'fxSensitivity',     label: '환율 민감도' },
  { key: 'infoStyle',         label: '정보 습득 스타일' },
  { key: 'sectors',           label: '관심 섹터' },
  { key: 'holdings',          label: '보유 종목' },
];

export default function ProfileTab({ profile, onUpdate, onReset }: Props) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const summary = getProfileSummary(profile);
  const completedDate = new Date(profile.completedAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleSave = (updates: Partial<UserProfile>) => {
    onUpdate(updates);
    setEditingKey(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Hero card */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: `linear-gradient(135deg,${summary.color}18,${summary.color}08)`, border: `1px solid ${summary.color}28` }}
      >
        <div className="mb-3 text-5xl">{summary.emoji}</div>
        <div className="mb-1 text-xl font-black" style={{ color: summary.color }}>{summary.title}</div>
        <p className="text-sm" style={{ color: 'var(--t4)' }}>{summary.subtitle}</p>
        <p className="mt-2 text-[11px]" style={{ color: 'var(--t5)' }}>{completedDate} 설정</p>
      </div>

      {/* Editable profile items */}
      <div>
        <p className="mb-2 text-[12px] font-bold tracking-widest" style={{ color: 'var(--t5)' }}>내 프로필 설정</p>
        <div className="card overflow-hidden rounded-2xl">
          {EDITABLE_FIELDS.map((field, i) => {
            const isLast = i === EDITABLE_FIELDS.length - 1;
            const isEditing = editingKey === field.key;
            return (
              <div key={field.key}>
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: isLast && !isEditing ? 'none' : '1px solid var(--card-border)' }}
                >
                  <span className="text-[13px]" style={{ color: 'var(--t4)' }}>{field.label}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="max-w-[140px] truncate text-right text-[13px] font-semibold" style={{ color: 'var(--t2)' }}>
                      {getDisplayValue(field.key, profile)}
                    </span>
                    <button
                      onClick={() => setEditingKey(isEditing ? null : field.key)}
                      className="rounded-md px-2 py-0.5 text-[11px] font-bold transition-all"
                      style={{
                        background: isEditing ? 'rgba(78,205,196,0.15)' : 'var(--card-sector)',
                        color: isEditing ? '#4ecdc4' : 'var(--t4)',
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      {isEditing ? '닫기' : '수정'}
                    </button>
                  </div>
                </div>
                {isEditing && (
                  <div className="px-3 pb-3" style={{ borderBottom: isLast ? 'none' : '1px solid var(--card-border)' }}>
                    <InlineEditor
                      stepKey={field.key}
                      profile={profile}
                      onSave={handleSave}
                      onCancel={() => setEditingKey(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector chips preview */}
      <div className="card-accent rounded-2xl p-4">
        <p className="mb-2.5 text-[11px] font-bold tracking-widest text-accent">✦ 맞춤 투자 원칙</p>
        {summary.tips.map((tip, i) => (
          <div key={i} className="mb-1.5 flex gap-2">
            <span className="text-accent text-xs">·</span>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t3)' }}>{tip}</p>
          </div>
        ))}
      </div>

      {/* Reset */}
      <div className="pb-2">
        <button onClick={onReset} className="btn-ghost w-full rounded-xl py-3.5 text-sm" style={{ color: 'var(--t4)' }}>
          🔄 처음부터 다시 프로파일링
        </button>
        <p className="mt-1.5 text-center text-[11px]" style={{ color: 'var(--t5)' }}>재설정하면 기존 프로필이 삭제돼요</p>
      </div>
    </div>
  );
}
