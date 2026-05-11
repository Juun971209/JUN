import {
  UserProfile, EnrichedStock, NewsItem, ScoredStock,
  TodayPoint, SectorKey, EntrySignal,
} from '@/types';
import { ALL_STOCKS } from '@/data/stocks';
import { NEWS } from '@/data/news';
import { SECTOR_LABEL, GOAL_LABEL, INVESTMENT_HORIZON_LABEL, RISK_APPETITE_LABEL } from '@/lib/profile';

// ── Entry signal ──────────────────────────────────

function computeEntrySignal(stock: EnrichedStock): EntrySignal {
  const tickerNews = NEWS.filter((n) => n.ticker === stock.ticker);
  const sectorNews = NEWS.filter(
    (n) => !n.ticker && n.sectorKeys.includes(stock.sector as SectorKey) && n.impact === 'high',
  );

  if (tickerNews.length === 0 && sectorNews.length === 0) {
    return { level: 'caution', label: '중립', reason: '관련 최신 뉴스 없음' };
  }

  const highImpact = tickerNews.find((n) => n.impact === 'high');
  if (highImpact) {
    const isUp = highImpact.change?.startsWith('+') ?? false;
    return {
      level: isUp ? 'good' : 'bad',
      label: isUp ? '좋음' : '나쁨',
      reason: highImpact.headline,
      newsId: highImpact.id,
    };
  }

  const mediumNews = tickerNews[0];
  if (mediumNews) {
    const isUp = mediumNews.change?.startsWith('+') ?? false;
    return {
      level: 'caution',
      label: '보통',
      reason: mediumNews.headline,
      newsId: mediumNews.id,
    };
  }

  const sectorImpact = sectorNews[0];
  return {
    level: 'caution',
    label: '보통',
    reason: `섹터 이슈: ${sectorImpact.headline}`,
    newsId: sectorImpact.id,
  };
}

// ── Scoring ───────────────────────────────────────

const RISK_DELTA: Record<string, Record<string, number>> = {
  very_conservative: { low: 2,  medium: -1, high: -3 },
  conservative:      { low: 1,  medium: 0,  high: -2 },
  neutral:           { low: 0,  medium: 1,  high: 0  },
  aggressive:        { low: -1, medium: 1,  high: 2  },
  very_aggressive:   { low: -2, medium: 0,  high: 3  },
};

function scoreStock(
  stock: EnrichedStock,
  profile: UserProfile,
): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Sector match (+3) — highest weight
  if (profile.sectors.includes(stock.sector as SectorKey)) {
    score += 3;
    factors.push(`${SECTOR_LABEL[stock.sector] ?? stock.sector} 관심 섹터`);
  }

  // Goal fit (+2)
  if (stock.goalFit.includes(profile.goal)) {
    score += 2;
    factors.push(`${GOAL_LABEL[profile.goal]} 목표`);
  }

  // Investment horizon fit (+2)
  if (stock.horizonFit.includes(profile.investmentHorizon)) {
    score += 2;
    factors.push(`${INVESTMENT_HORIZON_LABEL[profile.investmentHorizon]} 투자 기간`);
  }

  // Risk appetite vs stock risk level
  const riskDelta = RISK_DELTA[profile.riskAppetite]?.[stock.riskLevel] ?? 0;
  score += riskDelta;
  if (riskDelta >= 1) {
    factors.push(`${RISK_APPETITE_LABEL[profile.riskAppetite]} 성향에 맞는 위험도`);
  }

  // Budget fit (+1)
  if (stock.budgetFit.includes(profile.budget)) {
    score += 1;
  }

  // Beginner friendly (+1)
  if (
    (profile.experience === 'none' || profile.experience === 'under1') &&
    stock.beginnerFriendly
  ) {
    score += 1;
    factors.push('입문자에게 적합');
  }

  // Holdings bonus (+2)
  if (profile.holdings.includes(stock.ticker)) {
    score += 2;
    factors.push('현재 보유 중');
  }

  // Dividend vs growth preference
  const dvg = profile.dividendVsGrowth;
  if (dvg <= 37 && stock.dividend) {
    score += 1;
    factors.push(`배당 중심 선호 (${stock.dividend})`);
  } else if (dvg >= 63 && !stock.dividend) {
    score += 1;
    factors.push('성장주 선호');
  }

  return { score, factors };
}

function buildReason(
  stock: EnrichedStock,
  profile: UserProfile,
  isMatch: boolean,
  factors: string[],
): string {
  if (isMatch) {
    if (factors.length > 0) {
      return `${factors.slice(0, 2).join(' · ')}를 선택해서 추천해요.`;
    }
    return stock.matchMsg[profile.goal] ?? stock.oneLiner;
  }

  // Not matched — explain why
  const riskDelta = RISK_DELTA[profile.riskAppetite]?.[stock.riskLevel] ?? 0;
  if (riskDelta <= -2) {
    return `${RISK_APPETITE_LABEL[profile.riskAppetite]} 성향에 이 종목의 위험도가 맞지 않아요.`;
  }
  return stock.noMatchMsg[profile.goal] ?? `${GOAL_LABEL[profile.goal]} 목표와 거리가 있어요.`;
}

export function getScoredStocks(profile: UserProfile): ScoredStock[] {
  return ALL_STOCKS.map((stock) => {
    const { score, factors } = scoreStock(stock, profile);

    const goalMatch = stock.goalFit.includes(profile.goal);
    const sectorMatch = profile.sectors.includes(stock.sector as SectorKey);
    const horizonMatch = stock.horizonFit.includes(profile.investmentHorizon);
    const riskDelta = RISK_DELTA[profile.riskAppetite]?.[stock.riskLevel] ?? 0;

    const isMatch =
      (goalMatch || sectorMatch) &&
      horizonMatch &&
      riskDelta >= -1;

    const reason = buildReason(stock, profile, isMatch, factors);
    const entrySignal = computeEntrySignal(stock);

    return { stock, score, isMatch, reason, matchFactors: factors, entrySignal };
  }).sort((a, b) => b.score - a.score);
}

// ── News filtering ────────────────────────────────

export function getPersonalizedNews(profile: UserProfile): NewsItem[] {
  const userSectors = new Set(profile.sectors as string[]);
  const userTickers = new Set(profile.holdings);

  return NEWS
    .filter((n) => {
      if (n.isMacro) return true;
      if (n.sectorKeys.some((s) => userSectors.has(s))) return true;
      if (n.ticker && userTickers.has(n.ticker)) return true;
      return false;
    })
    .sort((a, b) => {
      const aHolding = a.ticker && userTickers.has(a.ticker) ? 2 : 0;
      const bHolding = b.ticker && userTickers.has(b.ticker) ? 2 : 0;
      const imp = { high: 2, medium: 1, low: 0 };
      return (bHolding + imp[b.impact]) - (aHolding + imp[a.impact]);
    });
}

export function getHoldingsNews(profile: UserProfile): NewsItem[] {
  const tickers = new Set(profile.holdings);
  return NEWS.filter((n) => n.ticker && tickers.has(n.ticker));
}

// ── Today's 3 key points ──────────────────────────

export function getTodayPoints(profile: UserProfile): TodayPoint[] {
  const points: TodayPoint[] = [];
  const userSectors = new Set(profile.sectors as string[]);
  const userTickers = new Set(profile.holdings);

  const holdingsNews = NEWS.find(
    (n) => n.ticker && userTickers.has(n.ticker) && n.impact === 'high',
  );
  if (holdingsNews) {
    points.push({
      icon: '📊',
      title: `보유 종목 이슈: ${holdingsNews.ticker}`,
      body: holdingsNews.headline,
      urgency: 'high',
    });
  }

  const sectorNews = NEWS.find(
    (n) =>
      n.impact === 'high' &&
      n.sectorKeys.some((s) => userSectors.has(s)) &&
      n !== holdingsNews,
  );
  if (sectorNews) {
    points.push({
      icon: '⚡',
      title: '관심 섹터 주목',
      body: sectorNews.headline,
      urgency: 'high',
    });
  }

  const macroNews = NEWS.find(
    (n) => n.isMacro && n !== holdingsNews && n !== sectorNews,
  );
  if (macroNews) {
    points.push({
      icon: '🏦',
      title: '시장 전반',
      body: macroNews.headline,
      urgency: 'medium',
    });
  }

  if (points.length < 3) {
    const fallback = NEWS.find((n) => !points.some((p) => p.body === n.headline));
    if (fallback) {
      points.push({ icon: '📰', title: '오늘의 뉴스', body: fallback.headline, urgency: 'low' });
    }
  }

  return points.slice(0, 3);
}

// ── Holdings daily flow ───────────────────────────

export function getHoldingsFlow(
  profile: UserProfile,
): { ticker: string; name: string; logo: string; price: string; change: string; up: boolean }[] {
  return profile.holdings
    .map((ticker) => {
      const stock = ALL_STOCKS.find((s) => s.ticker === ticker);
      if (!stock) return null;
      return {
        ticker: stock.ticker,
        name: stock.name,
        logo: stock.logo,
        price: stock.price,
        change: stock.change,
        up: stock.change.startsWith('+'),
      };
    })
    .filter(Boolean) as ReturnType<typeof getHoldingsFlow>;
}

// ── Similar stock suggestions based on holdings ───

export function getSimilarStocks(
  profile: UserProfile,
): EnrichedStock[] {
  if (profile.holdings.length === 0) return [];
  const holdingSet = new Set(profile.holdings);

  // Find sectors of held stocks
  const holdingSectors = new Set(
    ALL_STOCKS
      .filter((s) => holdingSet.has(s.ticker))
      .map((s) => s.sector),
  );

  // Suggest non-held stocks in the same sectors
  return ALL_STOCKS
    .filter((s) => !holdingSet.has(s.ticker) && holdingSectors.has(s.sector))
    .slice(0, 3);
}

// ── Weekly sector performance (static prototype) ──

export function getWeeklySectorData(profile: UserProfile) {
  const allSectors: Record<SectorKey, { change: string; up: boolean }> = {
    ai:            { change: '+5.2%', up: true  },
    semiconductor: { change: '+4.8%', up: true  },
    bigtech:       { change: '+2.1%', up: true  },
    healthcare:    { change: '-1.4%', up: false },
    finance:       { change: '+3.2%', up: true  },
    consumer:      { change: '+0.8%', up: true  },
    energy:        { change: '-2.3%', up: false },
    ev:            { change: '+1.9%', up: true  },
  };

  return profile.sectors.map((key) => ({ key, ...allSectors[key] }));
}
