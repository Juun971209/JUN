/**
 * Daily Brief Service — data source abstraction
 *
 * 현재: MockBriefSource (로컬 목 데이터)
 *
 * 실제 API로 전환하는 방법:
 *   1. .env.local 파일 생성
 *   2-A. Yahoo Finance (API 키 불필요):
 *        NEXT_PUBLIC_BRIEF_SOURCE=yahoo
 *        → app/api/brief/route.ts 에서 Yahoo Finance 호출 (CORS 우회 필요)
 *   2-B. Alpha Vantage (무료 키 필요):
 *        NEXT_PUBLIC_BRIEF_SOURCE=alphavantage
 *        NEXT_PUBLIC_ALPHAVANTAGE_API_KEY=YOUR_KEY
 *        → https://www.alphavantage.co/support/#api-key 에서 무료 키 발급
 */

import { DailyBriefData, SectorKey } from '@/types';
import { BRIEF_MOCK } from '@/data/brief';

// ── Interface ─────────────────────────────────────

export interface BriefDataSource {
  fetchBrief(sectors: SectorKey[]): Promise<DailyBriefData>;
}

// ── Mock (현재 사용 중) ──────────────────────────

class MockBriefSource implements BriefDataSource {
  async fetchBrief(sectors: SectorKey[]): Promise<DailyBriefData> {
    const sectorPerf = sectors.length > 0
      ? BRIEF_MOCK.sectorPerf.filter((s) => sectors.includes(s.key as SectorKey))
      : BRIEF_MOCK.sectorPerf;
    return { ...BRIEF_MOCK, sectorPerf, updatedAt: new Date().toISOString() };
  }
}

// ── Yahoo Finance (API 키 불필요, 서버사이드 프록시 필요) ──
//
// app/api/brief/route.ts 구현 예시:
//   const tickers = ['SPY', 'QQQ', 'DIA', '^VIX', 'DX-Y.NYB', '^TNX'];
//   const urls = tickers.map(t =>
//     `https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=1d`
//   );
//   const results = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
//   return Response.json(transformYahooToGrief(results, sectors));

class YahooFinanceBriefSource implements BriefDataSource {
  async fetchBrief(sectors: SectorKey[]): Promise<DailyBriefData> {
    const params = new URLSearchParams({ source: 'yahoo', sectors: sectors.join(',') });
    const res = await fetch(`/api/brief?${params}`);
    if (!res.ok) throw new Error(`Yahoo brief fetch failed: ${res.status}`);
    return res.json() as Promise<DailyBriefData>;
  }
}

// ── Alpha Vantage (무료 API 키 필요) ──────────────
//
// app/api/brief/route.ts 구현 예시:
//   const KEY = process.env.ALPHAVANTAGE_API_KEY;
//   const [sector, spy] = await Promise.all([
//     fetch(`https://www.alphavantage.co/query?function=SECTOR&apikey=${KEY}`).then(r => r.json()),
//     fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${KEY}`).then(r => r.json()),
//   ]);
//   return Response.json(transformAlphaVantageToGrief(sector, spy, sectors));

class AlphaVantageBriefSource implements BriefDataSource {
  constructor(private readonly apiKey: string) {}
  async fetchBrief(sectors: SectorKey[]): Promise<DailyBriefData> {
    const params = new URLSearchParams({ source: 'alphavantage', sectors: sectors.join(',') });
    const res = await fetch(`/api/brief?${params}`);
    if (!res.ok) throw new Error(`Alpha Vantage brief fetch failed: ${res.status}`);
    return res.json() as Promise<DailyBriefData>;
  }
}

// ── Factory ───────────────────────────────────────

const src   = process.env.NEXT_PUBLIC_BRIEF_SOURCE;
const avKey = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY ?? '';

export const briefSource: BriefDataSource =
  src === 'alphavantage' && avKey ? new AlphaVantageBriefSource(avKey) :
  src === 'mock'                  ? new MockBriefSource()               :
                                    new YahooFinanceBriefSource();      // default: Yahoo Finance

export async function fetchDailyBrief(sectors: SectorKey[]): Promise<DailyBriefData> {
  return briefSource.fetchBrief(sectors);
}
