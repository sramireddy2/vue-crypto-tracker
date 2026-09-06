<template>
  <SpotlightCard tag="section" card-class="p-5">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <p class="label-meta">7-day chart</p>
        <h2 class="mt-2 text-lg font-semibold tracking-tight text-ink">
          {{ coin ? `${coin.name} · ${coin.symbol.toUpperCase()}` : 'Select a coin' }}
        </h2>
      </div>
      <p v-if="coin" class="font-mono text-sm" :class="changeClass">
        {{ formatPercent(coin.price_change_percentage_24h) }}
      </p>
    </div>

    <div v-if="loading" class="flex h-48 items-center justify-center text-sm text-muted">
      Loading chart…
    </div>
    <div v-else-if="error" class="flex h-48 items-center justify-center text-sm text-down">
      {{ error }}
    </div>
    <div v-else-if="chartData" class="h-48">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </SpotlightCard>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useMarketStore } from '../stores/market'
import { fetchMarketChart } from '../services/coingecko'
import { formatPercent, formatPrice } from '../utils/format'
import SpotlightCard from './SpotlightCard.vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const store = useMarketStore()
const coin = computed(() => store.selectedCoin)
const loading = ref(false)
const error = ref(null)
const prices = ref([])
let requestId = 0

const changeClass = computed(() => (
  (coin.value?.price_change_percentage_24h ?? 0) >= 0 ? 'text-up' : 'text-down'
))

const chartData = computed(() => {
  if (!prices.value.length) return null
  return {
    labels: prices.value.map(([ts]) => new Date(ts).toLocaleDateString()),
    datasets: [
      {
        data: prices.value.map(([, value]) => value),
        borderColor: '#5E6AD2',
        backgroundColor: 'rgba(94, 106, 210, 0.14)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => formatPrice(ctx.parsed.y),
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#8A8F98', maxTicksLimit: 6, font: { family: 'IBM Plex Mono', size: 10 } },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.06)' },
      ticks: {
        color: '#8A8F98',
        font: { family: 'IBM Plex Mono', size: 10 },
        callback: (value) => formatPrice(value),
      },
      border: { display: false },
    },
  },
}

async function loadChart(id) {
  if (!id) return
  const current = ++requestId
  loading.value = true
  error.value = null
  try {
    const next = await fetchMarketChart(id, 7)
    if (current !== requestId) return
    prices.value = next
  } catch {
    if (current !== requestId) return
    prices.value = []
    error.value = 'Chart unavailable right now.'
  } finally {
    if (current === requestId) loading.value = false
  }
}

watch(
  () => store.selectedId,
  (id) => loadChart(id),
  { immediate: true },
)
</script>
