import { NextRequest } from 'next/server'

export type QuoteResult = Record<string, { price: string; change: string; up: boolean }>

function fmtPrice(symbol: string, price: number): string {
  // Index symbols — no $ sign
  if (symbol.startsWith('^'))  return price >= 1000
    ? price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : price.toFixed(2)
  if (symbol === 'DX-Y.NYB') return price.toFixed(1)
  // Regular stocks
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (price >= 100)  return `$${price.toFixed(0)}`
  return `$${price.toFixed(2)}`
}

export async function GET(request: NextRequest) {
  const symbols = request.nextUrl.searchParams.get('symbols') ?? ''
  if (!symbols.trim()) return Response.json({})

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MijangScene/1.0)' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return Response.json({})

    const json = await res.json() as {
      quoteResponse: {
        result: { symbol: string; regularMarketPrice: number; regularMarketChangePercent: number }[]
      }
    }

    const result: QuoteResult = {}
    for (const q of json.quoteResponse?.result ?? []) {
      const pct = q.regularMarketChangePercent ?? 0
      result[q.symbol] = {
        price:  fmtPrice(q.symbol, q.regularMarketPrice ?? 0),
        change: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
        up:     pct >= 0,
      }
    }
    return Response.json(result)
  } catch {
    return Response.json({})
  }
}
