/**
 * News Service — data source abstraction layer
 *
 * 현재: MockNewsSource (로컬 목 데이터)
 * 추후: PolygonNewsSource, AlpacaNewsSource 등으로 교체 가능
 *
 * 교체 방법:
 *   1. 아래 USE_MOCK = false 로 변경
 *   2. PolygonNewsSource 에 실제 API 키 주입
 *   3. transformPolygonNews() 로 응답 형태 변환
 */

import { NewsItem, SectorKey } from '@/types';
import { NEWS } from '@/data/news';

// ── Interface ─────────────────────────────────────

export interface FetchNewsParams {
  sectors?: SectorKey[];
  tickers?: string[];
  limit?: number;
}

export interface NewsSource {
  fetchNews(params: FetchNewsParams): Promise<NewsItem[]>;
}

// ── Mock (현재 사용 중) ──────────────────────────

class MockNewsSource implements NewsSource {
  async fetchNews({ sectors, tickers, limit = 20 }: FetchNewsParams): Promise<NewsItem[]> {
    const sectorSet = new Set(sectors ?? []);
    const tickerSet = new Set(tickers ?? []);
    const hasFilter = sectorSet.size > 0 || tickerSet.size > 0;

    const filtered = NEWS.filter((n) => {
      if (!hasFilter) return true;
      if (n.isMacro) return true;
      if (n.ticker && tickerSet.has(n.ticker)) return true;
      if (n.sectorKeys.some((s) => sectorSet.has(s))) return true;
      return false;
    });

    return filtered.slice(0, limit);
  }
}

// ── Polygon.io (미래 연동 플레이스홀더) ──────────

class PolygonNewsSource implements NewsSource {
  constructor(private apiKey: string) {}

  async fetchNews(params: FetchNewsParams): Promise<NewsItem[]> {
    // TODO: 실제 API 연동 시 구현
    //
    // const tickers = params.tickers?.join(',') ?? '';
    // const url = `https://api.polygon.io/v2/reference/news` +
    //   `?ticker=${tickers}&limit=${params.limit ?? 20}&apikey=${this.apiKey}`;
    //
    // const res = await fetch(url);
    // const data = await res.json();
    // return transformPolygonNews(data.results, params.sectors);

    throw new Error('PolygonNewsSource: API key required. Set NEXT_PUBLIC_POLYGON_API_KEY.');
  }
}

// ── Factory ───────────────────────────────────────

const USE_MOCK =
  process.env.NEXT_PUBLIC_NEWS_SOURCE !== 'polygon' ||
  !process.env.NEXT_PUBLIC_POLYGON_API_KEY;

export const newsSource: NewsSource = USE_MOCK
  ? new MockNewsSource()
  : new PolygonNewsSource(process.env.NEXT_PUBLIC_POLYGON_API_KEY ?? '');

// ── Convenience ───────────────────────────────────

export async function fetchPersonalizedNews(params: FetchNewsParams): Promise<NewsItem[]> {
  return newsSource.fetchNews(params);
}
