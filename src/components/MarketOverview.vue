<template>
  <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <article v-for="card in cards" :key="card.label" class="rounded-2xl border border-line bg-navy p-4">
      <p class="text-xs uppercase tracking-wider text-muted">{{ card.label }}</p>
      <p class="mt-2 text-xl font-semibold text-ink">{{ card.value }}</p>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useMarketStore } from '../stores/market'
import { formatCompactUsd } from '../utils/format'

const store = useMarketStore()

const cards = computed(() => [
  { label: 'Market cap', value: formatCompactUsd(store.global.marketCap) },
  { label: '24h volume', value: formatCompactUsd(store.global.volume24h) },
  {
    label: 'BTC dominance',
    value: store.global.btcDominance == null ? '—' : `${store.global.btcDominance.toFixed(1)}%`,
  },
  { label: 'Live feeds', value: store.liveCount ? `${store.liveCount} coins` : '—' },
])
</script>
