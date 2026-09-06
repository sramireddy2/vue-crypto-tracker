import { defineStore } from 'pinia'
import { fetchGlobal, fetchMarkets } from '../services/coingecko'

const WATCHLIST_KEY = 'pulse-watchlist'

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useMarketStore = defineStore('market', {
  state: () => ({
    coins: [],
    global: {
      marketCap: null,
      volume24h: null,
      btcDominance: null,
      activeCoins: null,
    },
    livePrices: {},
    symbolMap: {},
    watchlist: loadWatchlist(),
    query: '',
    selectedId: 'bitcoin',
    connection: 'offline',
    lastTickAt: null,
    liveCount: 0,
    loading: false,
    error: null,
  }),

  getters: {
    selectedCoin(state) {
      return state.coins.find((coin) => coin.id === state.selectedId) ?? state.coins[0] ?? null
    },

    filteredCoins(state) {
      const q = state.query.trim().toLowerCase()
      if (!q) return state.coins
      return state.coins.filter((coin) => {
        return coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q)
      })
    },

    watchlistCoins(state) {
      const ids = new Set(state.watchlist)
      const q = state.query.trim().toLowerCase()
      return state.coins.filter((coin) => {
        if (!ids.has(coin.id)) return false
        if (!q) return true
        return coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q)
      })
    },

    gainers(state) {
      return [...state.coins]
        .filter((coin) => coin.price_change_percentage_24h != null)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 5)
    },

    losers(state) {
      return [...state.coins]
        .filter((coin) => coin.price_change_percentage_24h != null)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5)
    },
  },

  actions: {
    displayPrice(coin) {
      return this.livePrices[coin.id]?.price ?? coin.current_price
    },

    async loadMarkets() {
      this.loading = true
      this.error = null
      try {
        const [coins, global] = await Promise.all([fetchMarkets(), fetchGlobal()])
        this.coins = coins
        this.global = global
        this.symbolMap = {}
        for (const coin of coins) {
          const key = coin.symbol.toUpperCase()
          if (!this.symbolMap[key]) this.symbolMap[key] = coin.id
        }
        if (!coins.some((coin) => coin.id === this.selectedId)) {
          this.selectedId = coins[0]?.id ?? 'bitcoin'
        }
      } catch (err) {
        this.error = err?.response?.status === 429
          ? 'CoinGecko rate limit reached. Wait a moment and retry.'
          : 'Could not load market data. Check your connection and retry.'
      } finally {
        this.loading = false
      }
    },

    applyTickers(tickers) {
      if (!Array.isArray(tickers) || !tickers.length) return
      let live = this.liveCount
      for (const tick of tickers) {
        const pair = tick.s
        if (!pair?.endsWith('USDT')) continue
        const coinId = this.symbolMap[pair.slice(0, -4)]
        if (!coinId) continue
        const next = Number(tick.c)
        if (!Number.isFinite(next)) continue
        const prev = this.livePrices[coinId]
        if (!prev) live += 1
        const dir = prev && next !== prev.price ? (next > prev.price ? 'up' : 'down') : prev?.dir ?? null
        const n = prev && next !== prev.price ? (prev.n || 0) + 1 : prev?.n || 0
        this.livePrices[coinId] = { price: next, dir, n }
      }
      this.liveCount = live
      this.lastTickAt = Date.now()
    },

    setConnection(status) {
      this.connection = status
    },

    setQuery(value) {
      this.query = value
    },

    selectCoin(id) {
      this.selectedId = id
    },

    toggleWatch(id) {
      const next = this.watchlist.includes(id)
        ? this.watchlist.filter((item) => item !== id)
        : [...this.watchlist, id]
      this.watchlist = next
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next))
    },

    isWatched(id) {
      return this.watchlist.includes(id)
    },
  },
})
