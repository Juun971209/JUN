import { NextRequest } from 'next/server'
import { BRIEF_MOCK } from '@/data/brief'
import { DailyBriefData, SectorKey } from '@/types'

const INDEX_TICKERS = ['^GSPC', '^IXIC', '^DJI', '^VIX', 'DX-Y.NYB', '^TNX']
const INDEX_LABELS  = ['S&P 500', '나스닥', '다우', 'VIX', '달러지수', '10Y 금리']

const SECTOR_ETF: Record<SectorKey, string> = {
  semiconductor: 'SMH',
  ai:            'XLK',
  bigtech:       'XLK',
  healthcare:    'XLV',
  finance:       'XLF',
  consumer:      'XLY',
  energy:        'XLE',
  ev:            'TSLA',
}

const SECTOR_LABELS: Record<SectorKey, string> = {
  semiconductor: '반도체',
  ai:            'AI',
  bigtech:       '빅테크',
  healthcare:    '헬스케어',
  finance:       '금융',
  consumer:      '소비재',
  energy:        '에너지',
  ev:            '전기차',
}

type YahooQuote = {
  symbol: string
  regularMarketPrice: number
  regularMarketChangePercent: number
}

async function yahooQuotes(symbols: string[]): Promise<YahooQuote[]> {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MijangScene/1.0)' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`)
  const json = await res.json() as {
    quoteResponse: { result: YahooQuote[]; error: unknown }
  }
  return json.quoteResponse?.result ?? []
}

function fmtIndexValue(ticker: string, price: number): string {
  if (ticker === '^VIX')     return price.toFixed(1)
  if (ticker === '^TNX')     return `${price.toFixed(2)}%`
  if (ticker === 'DX-Y.NYB') return price.toFixed(1)
  if (price >= 10000)        return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (price >= 1000)         return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  return price.toFixed(2)
}

function deriveSentiment(sp500Pct: number): DailyBriefData['sentiment'] {
  if (sp500Pct >= 0.5) return {
    level: 'bullish', label: '강세', emoji: '🐂',
    desc: `S&P 500이 ${sp500Pct.toFixed(2)}% 상승하며 기술주 중심으로 강세가 이어지고 있어요.`,
  }
  if (sp500Pct <= -0.5) return {
    level: 'bearish', label: '약세', emoji: '🐻',
    desc: `S&P 500이 ${Math.abs(sp500Pct).toFixed(2)}% 하락하며 시장이 약세를 보이고 있어요.`,
  }
  return {
    level: 'neutral', label: '중립', emoji: '😐',
    desc: `시장이 방향성을 탐색 중이에요. S&P 500 변동은 ${sp500Pct >= 0 ? '+' : ''}${sp500Pct.toFixed(2)}%예요.`,
  }
}

export async function GET(request: NextRequest) {
  const sectors = (request.nextUrl.searchParams.get('sectors') ?? '')
    .split(',').filter(Boolean) as SectorKey[]

  try {
    const sectorEtfs = [...new Set(sectors.map(s => SECTOR_ETF[s]).filter(Boolean))]
    const allTickers = [...INDEX_TICKERS, ...sectorEtfs]
    const quotes = await yahooQuotes(allTickers)

    const qm: Record<string, { price: number; pct: number }> = {}
    for (const q of quotes) {
      qm[q.symbol] = { price: q.regularMarketPrice, pct: q.regularMarketChangePercent }
    }

    const indices = INDEX_TICKERS.map((t, i) => {
      const q = qm[t]
      if (!q) return null
      const pct = q.pct
      return {
        label:  INDEX_LABELS[i],
        value:  fmtIndexValue(t, q.price),
        change: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
        up:     pct >= 0,
      }
    }).filter((x): x is NonNullable<typeof x> => x !== null)

    const sectorPerf = sectors.map(key => {
      const etf = SECTOR_ETF[key]
      const q = qm[etf]
      if (!q) return null
      const pct = q.pct
      return {
        key,
        label:  SECTOR_LABELS[key],
        change: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
        up:     pct >= 0,
      }
    }).filter((x): x is NonNullable<typeof x> => x !== null)

    const data: DailyBriefData = {
      date:       new Date().toISOString().slice(0, 10),
      updatedAt:  new Date().toISOString(),
      sentiment:  deriveSentiment(qm['^GSPC']?.pct ?? 0),
      indices:    indices.length > 0 ? indices : BRIEF_MOCK.indices,
      sectorPerf,
      events:     BRIEF_MOCK.events,
    }

    return Response.json(data)
  } catch (err) {
    console.error('[api/brief] Yahoo Finance failed:', err)
    return Response.json({
      ...BRIEF_MOCK,
      updatedAt: new Date().toISOString(),
      sectorPerf: sectors.length > 0
        ? BRIEF_MOCK.sectorPerf.filter(s => sectors.includes(s.key as SectorKey))
        : BRIEF_MOCK.sectorPerf,
    } satisfies DailyBriefData)
  }
}
