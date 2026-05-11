'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DailyBriefData, SectorKey } from '@/types';
import { fetchDailyBrief } from '@/services/brief';

const SENTIMENT_COLOR = {
  bullish: '#2ed573',
  neutral: '#ffa502',
  bearish: '#ff4757',
};

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

const IMPORTANCE_COLOR: Record<string, string> = {
  high: '#ff4757',
  medium: '#ffa502',
  low: '#4ecdc4',
};

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const h = kst.getUTCHours();
  const m = String(kst.getUTCMinutes()).padStart(2, '0');
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 || 12;
  const month = kst.getUTCMonth() + 1;
  const day = kst.getUTCDate();
  return `${month}/${day} ${ampm} ${h12}:${m} KST 기준`;
}

function SkeletonRow() {
  return (
    <div className="h-10 animate-pulse rounded-xl" style={{ background: 'var(--card-bg)' }} />
  );
}

export default function DailyBriefTab({ profile }: { profile: UserProfile }) {
  const [data, setData] = useState<DailyBriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDailyBrief(profile.sectors as SectorKey[])
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [profile.sectors]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-black" style={{ color: 'var(--t1)' }}>데일리 브리핑</p>
          {data && (
            <p className="mt-0.5 text-[11px]" style={{ color: 'var(--t5)' }}>
              {formatUpdatedAt(data.updatedAt)}
            </p>
          )}
        </div>
        {!loading && !error && (
          <div
            className="rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{ background: 'rgba(78,205,196,0.1)', color: '#4ecdc4', border: '1px solid rgba(78,205,196,0.2)' }}
          >
            ✓ 최신
          </div>
        )}
      </div>

      {/* 에러 */}
      {error && (
        <div className="card rounded-2xl p-4 text-center">
          <p className="text-sm" style={{ color: '#ff4757' }}>⚠️ 데이터를 불러오지 못했어요</p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--t5)' }}>{error}</p>
        </div>
      )}

      {/* ── 📊 시장 분위기 ─────────────────────────── */}
      <section>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>📊 오늘의 시장 분위기</p>

        {loading ? (
          <div className="flex flex-col gap-2">
            <SkeletonRow />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </div>
        ) : data ? (
          <>
            {/* 심리 배너 */}
            <div
              className="mb-3 rounded-2xl p-4"
              style={{
                background: `${SENTIMENT_COLOR[data.sentiment.level]}10`,
                border: `1px solid ${SENTIMENT_COLOR[data.sentiment.level]}28`,
              }}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span className="text-2xl">{data.sentiment.emoji}</span>
                <div>
                  <p className="text-[10px] font-bold tracking-widest" style={{ color: 'var(--t5)' }}>
                    시장 심리
                  </p>
                  <p className="text-base font-black" style={{ color: SENTIMENT_COLOR[data.sentiment.level] }}>
                    {data.sentiment.label}
                  </p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t3)' }}>
                {data.sentiment.desc}
              </p>
            </div>

            {/* 지수 그리드 */}
            <div className="grid grid-cols-3 gap-2">
              {data.indices.map((idx) => (
                <div key={idx.label} className="card rounded-xl p-2.5 text-center">
                  <p className="mb-0.5 text-[9px]" style={{ color: 'var(--t5)' }}>{idx.label}</p>
                  <p className="font-space text-[13px] font-bold">{idx.value}</p>
                  <p
                    className="font-space text-[11px] font-bold"
                    style={{ color: idx.up ? '#2ed573' : '#ff4757' }}
                  >
                    {idx.change}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>

      {/* ── 📂 내 섹터 흐름 ────────────────────────── */}
      <section>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>
          📂 내 관심 섹터 흐름
          <span className="ml-2 text-[11px] font-normal" style={{ color: 'var(--t5)' }}>오늘 기준</span>
        </p>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : data && data.sectorPerf.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data.sectorPerf.map((sector) => {
              const color = sector.up ? '#2ed573' : '#ff4757';
              const pct = Math.abs(parseFloat(sector.change.replace('%', '').replace('+', '')));
              const barWidth = Math.min(pct * 15, 100);
              return (
                <div key={sector.key} className="card flex items-center gap-3 rounded-xl px-4 py-2.5">
                  <p className="w-16 flex-shrink-0 text-[12px] font-semibold" style={{ color: 'var(--t2)' }}>
                    {sector.label}
                  </p>
                  <div className="flex-1">
                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--card-border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${barWidth}%`, background: color }}
                      />
                    </div>
                  </div>
                  <p className="w-14 flex-shrink-0 text-right font-space text-[12px] font-bold" style={{ color }}>
                    {sector.change}
                  </p>
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <div className="card rounded-2xl p-5 text-center">
            <p className="text-sm" style={{ color: 'var(--t4)' }}>관심 섹터를 설정하면 여기에 표시돼요</p>
          </div>
        ) : null}
      </section>

      {/* ── 📅 챙겨야 할 일정 ──────────────────────── */}
      <section className="pb-2">
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>📅 챙겨야 할 일정</p>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : data ? (
          <>
            <div className="flex flex-col gap-2">
              {data.events.map((ev, i) => {
                const typeColor = EVENT_TYPE_COLOR[ev.type];
                const dotColor = IMPORTANCE_COLOR[ev.importance];
                return (
                  <div key={i} className="card flex items-center gap-3 rounded-xl px-4 py-3">
                    <div className="w-10 flex-shrink-0 text-center">
                      <p className="font-space text-[11px] font-bold" style={{ color: 'var(--t4)' }}>{ev.date}</p>
                      <p className="text-[10px]" style={{ color: 'var(--t5)' }}>{ev.day}</p>
                    </div>
                    <div className="h-6 w-px flex-shrink-0" style={{ background: 'var(--card-border)' }} />
                    <div className="flex flex-1 items-center gap-2 min-w-0">
                      <span
                        className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ background: `${typeColor}15`, color: typeColor }}
                      >
                        {EVENT_TYPE_LABEL[ev.type]}
                      </span>
                      <p className="truncate text-[13px]" style={{ color: 'var(--t2)' }}>{ev.event}</p>
                    </div>
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ background: dotColor, boxShadow: `0 0 5px ${dotColor}` }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[10px]" style={{ color: 'var(--t5)' }}>
              🔴 고영향 &nbsp;·&nbsp; 🟠 중영향 &nbsp;·&nbsp; 🟢 저영향
            </p>
          </>
        ) : null}
      </section>
    </div>
  );
}
