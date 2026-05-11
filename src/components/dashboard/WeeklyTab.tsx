'use client';

import { UserProfile } from '@/types';
import { getWeeklySectorData } from '@/lib/personalization';
import { SECTOR_LABEL } from '@/lib/profile';

const WEEKLY_EVENTS = [
  { date: '5/12', day: '월', event: '미국 CPI 발표', type: 'macro' as const, importance: 'high' as const },
  { date: '5/14', day: '수', event: 'NVDA 애널리스트 데이', type: 'earnings' as const, importance: 'high' as const },
  { date: '5/15', day: '목', event: '미국 소매판매 지표', type: 'macro' as const, importance: 'medium' as const },
  { date: '5/15', day: '목', event: 'AMAT 실적 발표', type: 'earnings' as const, importance: 'medium' as const },
  { date: '5/16', day: '금', event: '미시간 소비심리 지수', type: 'macro' as const, importance: 'medium' as const },
];

const EVENT_TYPE_LABEL: Record<string, string> = {
  macro: '거시경제',
  earnings: '실적발표',
  holiday: '휴장',
};

const EVENT_TYPE_COLOR: Record<string, string> = {
  macro: '#45b7d1',
  earnings: '#ffa502',
  holiday: '#ff4757',
};

const IMPORTANCE_DOT: Record<string, string> = {
  high: '#ff4757',
  medium: '#ffa502',
  low: '#4ecdc4',
};

const MARKET_SENTIMENT = {
  level: 'bullish' as const,
  label: '강세',
  emoji: '🐂',
  desc: 'AI 모멘텀과 양호한 실적 시즌이 맞물리며 기술주 중심 상승세가 이어지고 있어요.',
};

const SENTIMENT_COLOR = {
  bullish: '#2ed573',
  neutral: '#ffa502',
  bearish: '#ff4757',
};

export default function WeeklyTab({ profile }: { profile: UserProfile }) {
  const sectorData = getWeeklySectorData(profile);
  const sentimentColor = SENTIMENT_COLOR[MARKET_SENTIMENT.level];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-lg font-black" style={{ color: 'var(--t1)' }}>주간 브리핑</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--t5)' }}>5/9 (금) 기준</p>
      </div>

      {/* 시장 심리 */}
      <div
        className="rounded-2xl p-4"
        style={{ background: `${sentimentColor}10`, border: `1px solid ${sentimentColor}28` }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">{MARKET_SENTIMENT.emoji}</span>
          <div>
            <p className="text-[11px] font-bold tracking-widest" style={{ color: 'var(--t5)' }}>이번 주 시장 심리</p>
            <p className="text-base font-black" style={{ color: sentimentColor }}>
              {MARKET_SENTIMENT.label}
            </p>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t3)' }}>
          {MARKET_SENTIMENT.desc}
        </p>
      </div>

      {/* 내 관심 섹터 주간 성과 */}
      {sectorData.length > 0 && (
        <div>
          <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>
            📊 내 관심 섹터 주간 성과
          </p>
          <div className="flex flex-col gap-2">
            {sectorData.map((sector) => {
              const color = sector.up ? '#2ed573' : '#ff4757';
              const pct = parseFloat(sector.change.replace('%', '').replace('+', ''));
              const barWidth = Math.min(Math.abs(pct) * 12, 100);
              return (
                <div
                  key={sector.key}
                  className="card flex items-center gap-3 rounded-xl px-4 py-3"
                >
                  <p className="w-20 text-[13px] font-semibold" style={{ color: 'var(--t2)' }}>
                    {SECTOR_LABEL[sector.key] ?? sector.key}
                  </p>
                  <div className="flex-1">
                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--card-border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%`, background: color }}
                      />
                    </div>
                  </div>
                  <p className="w-14 text-right font-space text-[13px] font-bold" style={{ color }}>
                    {sector.change}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 이번 주 주요 일정 */}
      <div>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>
          📅 이번 주 주요 일정
        </p>
        <div className="flex flex-col gap-2">
          {WEEKLY_EVENTS.map((ev, i) => {
            const typeColor = EVENT_TYPE_COLOR[ev.type];
            const dotColor = IMPORTANCE_DOT[ev.importance];
            return (
              <div key={i} className="card flex items-center gap-3 rounded-xl px-4 py-3">
                <div className="w-10 text-center">
                  <p className="font-space text-[11px] font-bold" style={{ color: 'var(--t5)' }}>{ev.date}</p>
                  <p className="text-[10px]" style={{ color: 'var(--t5)' }}>{ev.day}</p>
                </div>
                <div className="h-6 w-px" style={{ background: 'var(--card-border)' }} />
                <div className="flex flex-1 items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: `${typeColor}15`, color: typeColor }}
                  >
                    {EVENT_TYPE_LABEL[ev.type]}
                  </span>
                  <p className="flex-1 text-[13px]" style={{ color: 'var(--t2)' }}>{ev.event}</p>
                </div>
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ background: dotColor, boxShadow: `0 0 4px ${dotColor}` }}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px]" style={{ color: 'var(--t5)' }}>
          · 빨간 점: 고영향 · 주황 점: 중영향 · 청록 점: 저영향
        </p>
      </div>
    </div>
  );
}
