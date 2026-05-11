'use client';

import { useState, useEffect } from 'react';
import { UserProfile, ScoredStock, EntrySignal } from '@/types';
import { getScoredStocks } from '@/lib/personalization';
import { fetchLiveQuotes, QuoteMap } from '@/services/quotes';
import { ALL_STOCKS } from '@/data/stocks';

const ENTRY_COLOR: Record<EntrySignal['level'], string> = {
  good:    '#2ed573',
  caution: '#ffa502',
  bad:     '#ff4757',
};

const ENTRY_LABEL: Record<EntrySignal['level'], string> = {
  good:    '진입 좋음',
  caution: '진입 보통',
  bad:     '진입 나쁨',
};

function EntryBadge({ signal }: { signal: EntrySignal }) {
  const color = ENTRY_COLOR[signal.level];
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {ENTRY_LABEL[signal.level]}
    </span>
  );
}

function StockCard({ item }: { item: ScoredStock }) {
  const [open, setOpen] = useState(false);
  const { stock, isMatch, reason, matchFactors, entrySignal, score } = item;
  const isUp = stock.change.startsWith('+');
  const maxScore = 12;
  const matchPct = Math.min(100, Math.round((score / maxScore) * 100));

  return (
    <button onClick={() => setOpen(!open)} className="card card-hover w-full p-4 text-left">
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{stock.logo}</div>
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-space text-[15px] font-extrabold">{stock.ticker}</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ background: 'var(--card-sector)', color: 'var(--t4)' }}>
              {stock.sectorLabel}
            </span>
            {stock.dividend && (
              <span className="text-[10px] text-warn font-bold">배당 {stock.dividend}</span>
            )}
          </div>
          <p className="truncate text-xs mb-2" style={{ color: 'var(--t5)' }}>{stock.oneLiner}</p>

          {/* Match bar */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--card-border)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${matchPct}%`,
                  background: isMatch
                    ? 'linear-gradient(90deg, #4ecdc4, #2ed573)'
                    : 'linear-gradient(90deg, #ff4757, #ffa502)',
                }}
              />
            </div>
            <span className="text-[10px] font-bold" style={{ color: isMatch ? '#4ecdc4' : '#ff4757' }}>
              {isMatch ? `${matchPct}% 매치` : '비추천'}
            </span>
          </div>

          {/* Badges row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  background: isMatch ? 'rgba(46,213,115,0.1)' : 'rgba(255,71,87,0.1)',
                  color: isMatch ? '#2ed573' : '#ff4757',
                }}>
                {isMatch ? '✓ 추천' : '✗ 비추'}
              </span>
              <span className="rounded-full px-2 py-0.5 text-[10px]"
                style={{
                  background: stock.riskLevel === 'high' ? 'rgba(255,71,87,0.08)' : stock.riskLevel === 'medium' ? 'rgba(255,165,2,0.08)' : 'rgba(46,213,115,0.08)',
                  color: stock.riskLevel === 'high' ? '#ff4757' : stock.riskLevel === 'medium' ? '#ffa502' : '#2ed573',
                }}>
                {stock.riskLevel === 'high' ? '고위험' : stock.riskLevel === 'medium' ? '중위험' : '저위험'}
              </span>
              <EntryBadge signal={entrySignal} />
            </div>
            <div className="text-right">
              <div className="font-space text-sm font-bold">{stock.price}</div>
              <div className="font-space text-[11px] font-bold" style={{ color: isUp ? '#2ed573' : '#ff4757' }}>
                {stock.change}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="mt-3 space-y-2.5">
          {/* 추천 이유 */}
          <div className="rounded-xl p-3.5"
            style={{
              background: isMatch ? 'rgba(46,213,115,0.05)' : 'rgba(255,71,87,0.05)',
              border: `1px solid ${isMatch ? 'rgba(46,213,115,0.15)' : 'rgba(255,71,87,0.15)'}`,
            }}>
            <p className="mb-1.5 text-[11px] font-bold"
              style={{ color: isMatch ? '#2ed573' : '#ff4757' }}>
              {isMatch ? '✓ 추천하는 이유' : '✗ 지금 당신에게 맞지 않는 이유'}
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t3)' }}>{reason}</p>
            {isMatch && matchFactors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {matchFactors.map((f, i) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px]"
                    style={{ background: 'rgba(78,205,196,0.1)', color: '#4ecdc4' }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
            {stock.ytd && (
              <p className="mt-2 text-[11px]" style={{ color: 'var(--t5)' }}>YTD {stock.ytd}</p>
            )}
          </div>

          {/* 진입 적합도 */}
          <div className="rounded-xl p-3.5"
            style={{
              background: `${ENTRY_COLOR[entrySignal.level]}08`,
              border: `1px solid ${ENTRY_COLOR[entrySignal.level]}25`,
            }}>
            <p className="mb-1 text-[11px] font-bold"
              style={{ color: ENTRY_COLOR[entrySignal.level] }}>
              📡 지금 진입 적합도: {entrySignal.label}
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--t4)' }}>
              {entrySignal.reason}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}

export default function StocksTab({ profile }: { profile: UserProfile }) {
  const [filter, setFilter] = useState<'all' | 'match' | 'nomatch'>('all');
  const [quotes, setQuotes] = useState<QuoteMap>({});

  useEffect(() => {
    const tickers = ALL_STOCKS.map(s => s.ticker);
    fetchLiveQuotes(tickers).then(setQuotes);
  }, []);

  const scored = getScoredStocks(profile).map(item => ({
    ...item,
    stock: {
      ...item.stock,
      price:  quotes[item.stock.ticker]?.price  ?? item.stock.price,
      change: quotes[item.stock.ticker]?.change ?? item.stock.change,
    },
  }));

  const matched = scored.filter((s) => s.isMatch);
  const notMatched = scored.filter((s) => !s.isMatch);
  const displayed = filter === 'match' ? matched : filter === 'nomatch' ? notMatched : scored;

  const filters: { id: typeof filter; label: string; count: number }[] = [
    { id: 'all',     label: '전체',   count: scored.length  },
    { id: 'match',   label: '✓ 추천', count: matched.length },
    { id: 'nomatch', label: '✗ 비추', count: notMatched.length },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-lg font-black" style={{ color: 'var(--t1)' }}>내 성향 기반 종목 분석</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--t5)' }}>
          추천·비추 이유 + 진입 적합도까지 · 카드 탭하면 상세 보기
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all duration-200"
              style={{
                background: active ? 'rgba(78,205,196,0.15)' : 'var(--card-bg)',
                color: active ? '#4ecdc4' : 'var(--t4)',
                border: active ? '1px solid rgba(78,205,196,0.35)' : '1px solid var(--card-border)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {f.label} <span style={{ opacity: 0.6 }}>({f.count})</span>
            </button>
          );
        })}
      </div>

      {/* Stock list */}
      <div className="flex flex-col gap-2.5">
        {displayed.map((item) => <StockCard key={item.stock.ticker} item={item} />)}
      </div>
    </div>
  );
}
