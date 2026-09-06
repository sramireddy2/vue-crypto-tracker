import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
})

export async function fetchMarkets() {
  const { data } = await client.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 250,
      page: 1,
      sparkline: true,
      price_change_percentage: '1h,24h,7d',
    },
  })
  return data
}

export async function fetchGlobal() {
  const { data } = await client.get('/global')
  const stats = data?.data ?? {}
  return {
    marketCap: stats.total_market_cap?.usd ?? null,
    volume24h: stats.total_volume?.usd ?? null,
    btcDominance: stats.market_cap_percentage?.btc ?? null,
    activeCoins: stats.active_cryptocurrencies ?? null,
  }
}

export async function fetchMarketChart(id, days = 7) {
  const { data } = await client.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: 'usd', days },
  })
  return data?.prices ?? []
}
