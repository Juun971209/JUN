'use client';

import { useState, useEffect } from 'react';
import { UserProfile, NewsItem, TodayPoint } from '@/types';
import { MARKET_INDICES } from '@/data/news';
import { fetchLiveQuotes, QuoteMap } from '@/services/quotes';
import {
  getPersonalizedNews, getTodayPoints,
  getHoldingsFlow, getHoldingsNews, getSimilarStocks,
} from '@/lib/personalization';
import { SECTOR_LABEL } from '@/lib/profile';
import { ALL_STOCKS } from '@/data/stocks';

function NewsCard({ news }: { news: NewsItem }) {
  const [open, setOpen] = useState(false);
  const isUp = news.change?.startsWith('+');
  return (
    <button onClick={() => setOpen(!open)} className="card card-hover w-full p-4 text-left">
      <div className="flex gap-3">
        <span className="text-2xl leading-none">{news.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {news.ticker && (
              <span className="font-space text-[10px] font-extrabold" style={{ color: isUp ? '#2ed573' : '#ff4757' }}>
                {news.ticker} {news.change}
              </span>
            )}
            <span className="text-[9px]" style={{ color: 'var(--t5)' }}>{news.time}</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--t2)' }}>
            {news.headline}
          </p>
          {open && (
            <div className="card-accent mt-3 p-3.5">
              <p className="mb-1 text-[11px] font-bold text-accent">💡 쉽게 말하면</p>
              <p className="text-[13px] leading-7" style={{ color: 'var(--t3)' }}>{news.summary}</p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function TodayPointCard({ point, idx }: { point: TodayPoint; idx: number }) {
  const urgencyColor = point.urgency === 'high' ? '#ff4757' : point.urgency === 'medium' ? '#ffa502' : '#4ecdc4';
  return (
    <div className="flex gap-3 rounded-2xl p-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black"
        style={{ background: `${urgencyColor}18`, color: urgencyColor }}>
        {idx + 1}
      </div>
      <div>
        <p className="mb-0.5 text-[11px] font-bold" style={{ color: urgencyColor }}>{point.icon} {point.title}</p>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t3)' }}>{point.body}</p>
      </div>
    </div>
  );
}

// Maps MARKET_INDICES labels to Yahoo Finance tickers
const INDEX_TICKER_MAP: Record<string, string> = {
  'S&P 500': '^GSPC',
  '나스닥':  '^IXIC',
  '다우':    '^DJI',
}

export default function TodayTab({ profile }: { profile: UserProfile }) {
  const todayPoints  = getTodayPoints(profile);
  const news         = getPersonalizedNews(profile);
  const holdingsNews = getHoldingsNews(profile);
  const similarStocks = getSimilarStocks(profile);
  const sectorLabels = profile.sectors.map((s) => SECTOR_LABEL[s] ?? s).join(' · ');
  const hasHoldings  = profile.holdings.length > 0;

  const [quotes, setQuotes] = useState<QuoteMap>({});

  useEffect(() => {
    const holdingTickers  = profile.holdings;
    const similarTickers  = similarStocks.map(s => s.ticker);
    const indexTickers    = Object.values(INDEX_TICKER_MAP);
    const all = [...new Set([...holdingTickers, ...similarTickers, ...indexTickers])];
    fetchLiveQuotes(all).then(setQuotes);
  }, [profile.holdings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Overlay live data on static holdings flow
  const holdingsFlow = getHoldingsFlow(profile).map(h => ({
    ...h,
    price:  quotes[h.ticker]?.price  ?? h.price,
    change: quotes[h.ticker]?.change ?? h.change,
    up:     quotes[h.ticker]?.up     ?? h.up,
  }));

  // Overlay live data on static market indices
  const liveIndices = MARKET_INDICES.map(idx => {
    const ticker = INDEX_TICKER_MAP[idx.label];
    const live = ticker ? quotes[ticker] : undefined;
    return live
      ? { ...idx, value: live.price, change: live.change, up: live.up }
      : idx;
  });

  // Risk alert: conservative user holding high-risk stocks
  const highRiskHoldings = profile.holdings.filter((ticker) => {
    const stock = ALL_STOCKS.find((s) => s.ticker === ticker);
    return stock?.riskLevel === 'high';
  });
  const showRiskAlert =
    (profile.riskAppetite === 'very_conservative' || profile.riskAppetite === 'conservative') &&
    highRiskHoldings.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <p className="text-lg font-black" style={{ color: 'var(--t1)' }}>오늘의 미장 브리핑 👋</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--t5)' }}>{sectorLabels} 관심 기반</p>
      </div>

      {/* Market indices */}
      <div className="grid grid-cols-3 gap-2">
        {liveIndices.map((idx) => (
          <div key={idx.label} className="card rounded-[10px] p-2.5 text-center">
            <p className="mb-0.5 text-[9px]" style={{ color: 'var(--t5)' }}>{idx.label}</p>
            <p className="font-space text-sm font-bold">{idx.value}</p>
            <p className="font-space text-[11px] font-bold" style={{ color: idx.up ? '#2ed573' : '#ff4757' }}>{idx.change}</p>
          </div>
        ))}
      </div>

      {/* Today's 3 points */}
      <div>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>⚡ 오늘 챙겨야 할 것 3가지</p>
        <div className="flex flex-col gap-2.5">
          {todayPoints.map((pt, i) => <TodayPointCard key={i} point={pt} idx={i} />)}
        </div>
      </div>

      {/* ── 보유 종목 섹션 ───────────────────────── */}
      {hasHoldings && (
        <>
          {/* 리스크 알림 */}
          {showRiskAlert && (
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)' }}>
              <p className="mb-1 text-[11px] font-bold" style={{ color: '#ff4757' }}>⚠️ 보유 종목 리스크 알림</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t3)' }}>
                보수적 성향이시지만 고위험 종목 <strong>{highRiskHoldings.join(', ')}</strong>을 보유 중이에요.
                비중 조절을 검토해 보세요.
              </p>
            </div>
          )}

          {/* 내 보유 종목 오늘 흐름 */}
          <div>
            <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>📈 내 보유 종목 오늘 흐름</p>
            <div className="flex flex-col gap-2">
              {holdingsFlow.map((h) => (
                <div key={h.ticker} className="card flex items-center gap-3 rounded-xl px-4 py-3">
                  <span className="text-xl">{h.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-space text-[13px] font-extrabold">{h.ticker}</p>
                    <p className="truncate text-[11px]" style={{ color: 'var(--t5)' }}>{h.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-space text-[13px] font-bold">{h.price}</p>
                    <p className="font-space text-[11px] font-bold" style={{ color: h.up ? '#2ed573' : '#ff4757' }}>
                      {h.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 내 종목 관련 뉴스 */}
          {holdingsNews.length > 0 && (
            <div>
              <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>
                📰 내 종목 관련 뉴스
              </p>
              <div className="flex flex-col gap-2.5">
                {holdingsNews.slice(0, 3).map((n) => <NewsCard key={n.id} news={n} />)}
              </div>
            </div>
          )}

          {/* 비슷한 추천 종목 */}
          {similarStocks.length > 0 && (
            <div>
              <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>
                ✨ 보유 종목과 비슷한 추천
              </p>
              <div className="flex flex-col gap-2">
                {similarStocks.map((s) => {
                  const liveChange = quotes[s.ticker]?.change ?? s.change;
                  const isUp = liveChange.startsWith('+');
                  return (
                    <div key={s.ticker} className="card flex items-center gap-3 rounded-xl px-4 py-3">
                      <span className="text-xl">{s.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-space text-[13px] font-extrabold">{s.ticker}</span>
                          <span className="rounded px-1.5 py-0.5 text-[9px]" style={{ background: 'var(--card-sector)', color: 'var(--t5)' }}>
                            {s.sectorLabel}
                          </span>
                        </div>
                        <p className="truncate text-[11px]" style={{ color: 'var(--t5)' }}>{s.oneLiner}</p>
                      </div>
                      <p className="font-space text-[12px] font-bold" style={{ color: isUp ? '#2ed573' : '#ff4757' }}>
                        {liveChange}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* 내 관심 섹터 뉴스 */}
      <div>
        <p className="mb-3 text-[13px] font-bold" style={{ color: 'var(--t1)' }}>
          📰 내 관심 섹터 뉴스
          <span className="ml-2 text-[11px] font-normal text-accent">탭하면 쉽게 풀어줘요</span>
        </p>
        {news.length === 0 ? (
          <div className="card rounded-2xl p-6 text-center">
            <p className="text-sm" style={{ color: 'var(--t4)' }}>오늘은 관련 뉴스가 없어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {news.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        )}
      </div>
    </div>
  );
}
