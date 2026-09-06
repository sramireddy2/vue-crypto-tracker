import { onMounted, onUnmounted } from 'vue'
import { useMarketStore } from '../stores/market'

const WS_URLS = [
  'wss://data-stream.binance.vision/ws/!miniTicker@arr',
  'wss://stream.binance.com:9443/ws/!miniTicker@arr',
  'wss://stream.binance.com:443/ws/!miniTicker@arr',
]

export function useBinanceTicker() {
  const store = useMarketStore()
  let socket = null
  let urlIndex = 0
  let retries = 0
  let reconnectTimer = null
  let rafId = null
  let pending = null
  let stopped = false

  function flush() {
    rafId = null
    if (pending) {
      store.applyTickers(pending)
      pending = null
    }
  }

  function connect() {
    if (stopped) return
    store.setConnection('connecting')
    const url = WS_URLS[urlIndex % WS_URLS.length]
    socket = new WebSocket(url)

    socket.onopen = () => {
      retries = 0
      store.setConnection('live')
    }

    socket.onmessage = (event) => {
      try {
        pending = JSON.parse(event.data)
        if (!rafId) rafId = requestAnimationFrame(flush)
      } catch {
        // ignore malformed frames
      }
    }

    socket.onerror = () => {
      socket?.close()
    }

    socket.onclose = () => {
      if (stopped) {
        store.setConnection('offline')
        return
      }
      store.setConnection('reconnecting')
      urlIndex += 1
      const delay = Math.min(1000 * 2 ** Math.min(retries, 4), 15000)
      retries += 1
      reconnectTimer = setTimeout(connect, delay)
    }
  }

  onMounted(connect)

  onUnmounted(() => {
    stopped = true
    clearTimeout(reconnectTimer)
    if (rafId) cancelAnimationFrame(rafId)
    socket?.close()
    store.setConnection('offline')
  })
}
