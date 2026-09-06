<template>
  <section class="overflow-hidden rounded-2xl border border-line bg-navy">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
      <div class="flex items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="rounded-lg px-3 py-1.5 text-sm transition"
          :class="activeTab === tab.id
            ? 'bg-accent/15 text-accent-soft'
            : 'text-muted hover:bg-navy-light hover:text-ink'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      <p class="text-xs text-muted">{{ rows.length }} coins</p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="text-left text-xs uppercase tracking-wider text-muted">
          <tr class="border-b border-line">
            <th class="px-3 py-3 font-medium"> </th>
            <th class="cursor-pointer px-2 py-3 font-medium" @click="sortBy('market_cap_rank')">#</th>
            <th class="cursor-pointer px-3 py-3 font-medium" @click="sortBy('name')">Coin</th>
            <th class="cursor-pointer px-3 py-3 text-right font-medium" @click="sortBy('current_price')">Price</th>
            <th class="hidden cursor-pointer px-3 py-3 text-right font-medium md:table-cell" @click="sortBy('price_change_percentage_1h_in_currency')">1h</th>
            <th class="cursor-pointer px-3 py-3 text-right font-medium" @click="sortBy('price_change_percentage_24h')">24h</th>
            <th class="hidden cursor-pointer px-3 py-3 text-right font-medium lg:table-cell" @click="sortBy('price_change_percentage_7d_in_currency')">7d</th>
            <th class="hidden cursor-pointer px-3 py-3 text-right font-medium lg:table-cell" @click="sortBy('market_cap')">Mkt cap</th>
            <th class="hidden cursor-pointer px-3 py-3 text-right font-medium xl:table-cell" @click="sortBy('total_volume')">Volume</th>
            <th class="hidden px-3 py-3 text-right font-medium sm:table-cell">7d</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="coin in rows"
            :key="coin.id"
            class="cursor-pointer border-b border-line/70 transition hover:bg-navy-light"
            :class="store.selectedId === coin.id ? 'bg-accent/5' : ''"
            @click="store.selectCoin(coin.id)"
          >
            <td class="px-3 py-3">
              <button
                class="text-lg leading-none"
                :class="store.isWatched(coin.id) ? 'text-accent-soft' : 'text-muted hover:text-ink'"
                :aria-label="store.isWatched(coin.id) ? 'Remove from watchlist' : 'Add to watchlist'"
                @click.stop="store.toggleWatch(coin.id)"
              >
                {{ store.isWatched(coin.id) ? '★' : '☆' }}
              </button>
            </td>
            <td class="px-2 py-3 text-muted">{{ coin.market_cap_rank ?? '—' }}</td>
            <td class="px-3 py-3">
              <div class="flex items-center gap-3">
                <img :src="coin.image" :alt="coin.name" class="h-7 w-7 rounded-full" />
                <div>
                  <p class="font-medium text-ink">{{ coin.name }}</p>
                  <p class="text-xs uppercase text-muted">{{ coin.symbol }}</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-3 text-right font-medium">
              <span
                :key="live(coin)?.n ?? 0"
                :class="priceClass(coin)"
              >
                {{ formatPrice(store.displayPrice(coin)) }}
              </span>
            </td>
            <td class="hidden px-3 py-3 text-right md:table-cell" :class="changeClass(coin.price_change_percentage_1h_in_currency)">
              {{ formatPercent(coin.price_change_percentage_1h_in_currency) }}
            </td>
            <td class="px-3 py-3 text-right" :class="changeClass(coin.price_change_percentage_24h)">
              {{ formatPercent(coin.price_change_percentage_24h) }}
            </td>
            <td class="hidden px-3 py-3 text-right lg:table-cell" :class="changeClass(coin.price_change_percentage_7d_in_currency)">
              {{ formatPercent(coin.price_change_percentage_7d_in_currency) }}
            </td>
            <td class="hidden px-3 py-3 text-right text-ink lg:table-cell">
              {{ formatCompactUsd(coin.market_cap) }}
            </td>
            <td class="hidden px-3 py-3 text-right text-ink xl:table-cell">
              {{ formatCompactUsd(coin.total_volume) }}
            </td>
            <td class="hidden px-3 py-3 text-right sm:table-cell">
              <div class="flex justify-end">
                <Sparkline
                  :prices="coin.sparkline_in_7d?.price"
                  :up="(coin.price_change_percentage_7d_in_currency ?? 0) >= 0"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!rows.length" class="px-4 py-10 text-center text-sm text-muted">
      {{ emptyMessage }}
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMarketStore } from '../stores/market'
import { formatCompactUsd, formatPercent, formatPrice } from '../utils/format'
import Sparkline from './Sparkline.vue'

const store = useMarketStore()
const activeTab = ref('all')
const sortKey = ref('market_cap_rank')
const sortAsc = ref(true)

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'watchlist', label: 'Watchlist' },
]

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = key === 'name'
  }
}

function valueOf(coin, key) {
  if (key === 'current_price') return store.displayPrice(coin)
  return coin[key]
}

const source = computed(() => (
  activeTab.value === 'watchlist' ? store.watchlistCoins : store.filteredCoins
))

const rows = computed(() => {
  const list = [...source.value]
  list.sort((a, b) => {
    const av = valueOf(a, sortKey.value)
    const bv = valueOf(b, sortKey.value)
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'string') {
      const cmp = av.localeCompare(bv)
      return sortAsc.value ? cmp : -cmp
    }
    return sortAsc.value ? av - bv : bv - av
  })
  return list
})

const emptyMessage = computed(() => {
  if (activeTab.value === 'watchlist') return 'Star coins to build a watchlist. It is saved in this browser.'
  if (store.query) return 'No coins match that search.'
  return 'No market data yet.'
})

function live(coin) {
  return store.livePrices[coin.id]
}

function priceClass(coin) {
  const dir = live(coin)?.dir
  if (dir === 'up') return 'flash-up'
  if (dir === 'down') return 'flash-down'
  return 'text-ink'
}

function changeClass(value) {
  if (value == null) return 'text-muted'
  return value >= 0 ? 'text-up' : 'text-down'
}
</script>

<style scoped>
.flash-up {
  animation: flash-up 0.45s ease;
}
.flash-down {
  animation: flash-down 0.45s ease;
}

@keyframes flash-up {
  0% { color: #22d3a6; background: rgba(34, 211, 166, 0.16); }
  100% { color: #e8eef8; background: transparent; }
}

@keyframes flash-down {
  0% { color: #f43f5e; background: rgba(244, 63, 94, 0.16); }
  100% { color: #e8eef8; background: transparent; }
}
</style>
