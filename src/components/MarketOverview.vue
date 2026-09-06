<template>
  <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
    <SpotlightCard
      v-for="(card, index) in cards"
      :key="card.label"
      tag="article"
      :card-class="index < 2 ? 'xl:col-span-2 p-6' : 'p-6'"
    >
      <p class="label-meta">{{ card.label }}</p>
      <p class="mt-3 text-2xl font-semibold tracking-tight text-ink tabular-nums">
        {{ card.value }}
      </p>
    </SpotlightCard>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useMarketStore } from '../stores/market'
import { formatCompactUsd } from '../utils/format'
import SpotlightCard from './SpotlightCard.vue'

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
