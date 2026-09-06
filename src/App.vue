<template>
  <div class="relative min-h-screen text-ink">
    <AmbientBackground />
    <div class="relative z-10">
      <AppHeader />

      <main class="mx-auto max-w-7xl space-y-8 px-4 py-8 md:py-10">
        <div v-if="store.loading && !store.coins.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div
            v-for="n in 4"
            :key="n"
            class="h-28 animate-pulse rounded-2xl bg-white/[0.04]"
            :class="n < 3 ? 'xl:col-span-2' : ''"
          ></div>
        </div>

        <div
          v-else-if="store.error && !store.coins.length"
          class="surface-card p-8 text-center"
        >
          <p class="text-ink">{{ store.error }}</p>
          <button
            type="button"
            class="btn-primary mt-4"
            @click="store.loadMarkets()"
          >
            Retry
          </button>
        </div>

        <template v-else>
          <section class="fade-up">
            <p class="label-meta text-accent">Markets</p>
            <h1 class="text-display mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Live crypto markets
            </h1>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Real-time prices across the top 250 assets. Watchlist stays on this device.
            </p>
          </section>

          <div class="fade-up" style="animation-delay: 80ms">
            <MarketOverview />
          </div>

          <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div class="fade-up min-w-0" style="animation-delay: 140ms">
              <CoinTable />
            </div>
            <div class="fade-up space-y-4" style="animation-delay: 200ms">
              <MoversPanel />
              <PriceChart />
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AmbientBackground from './components/AmbientBackground.vue'
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
