export interface LiveQuote {
  price: string
  change: string
  up: boolean
}

export type QuoteMap = Record<string, LiveQuote>

export async function fetchLiveQuotes(tickers: string[]): Promise<QuoteMap> {
  if (tickers.length === 0) return {}
  try {
    const res = await fetch(`/api/quotes?symbols=${tickers.join(',')}`)
    if (!res.ok) return {}
    return res.json() as Promise<QuoteMap>
  } catch {
    return {}
  }
}
