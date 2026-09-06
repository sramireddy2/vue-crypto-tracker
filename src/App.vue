<template>
  <div class="relative min-h-screen bg-page text-ink">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_60%)]"></div>
    <AppHeader />

    <main class="relative mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div v-if="store.loading && !store.coins.length" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="n in 4" :key="n" class="h-24 animate-pulse rounded-2xl bg-navy"></div>
      </div>

      <div
        v-else-if="store.error && !store.coins.length"
        class="rounded-2xl border border-down/30 bg-navy p-8 text-center"
      >
        <p class="text-ink">{{ store.error }}</p>
        <button
          class="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-soft"
          @click="store.loadMarkets()"
        >
          Retry
        </button>
      </div>

      <template v-else>
        <MarketOverview />

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <CoinTable />
          <div class="space-y-4">
            <MoversPanel />
            <PriceChart />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import MarketOverview from './components/MarketOverview.vue'
import CoinTable from './components/CoinTable.vue'
import MoversPanel from './components/MoversPanel.vue'
import PriceChart from './components/PriceChart.vue'
import { useMarketStore } from './stores/market'
import { useBinanceTicker } from './composables/useBinanceTicker'

const store = useMarketStore()
useBinanceTicker()

onMounted(() => {
  store.loadMarkets()
})
</script>
