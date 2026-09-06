<template>
  <svg
    v-if="points"
    :viewBox="`0 0 ${width} ${height}`"
    class="h-8 w-24"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <polyline
      :points="points"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  <span v-else class="text-xs text-muted">—</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prices: { type: Array, default: () => [] },
  up: { type: Boolean, default: true },
})

const width = 96
const height = 32

const color = computed(() => (props.up ? '#22d3a6' : '#f43f5e'))

const points = computed(() => {
  const values = (props.prices || []).filter((n) => Number.isFinite(n))
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * width
      const y = height - ((value - min) / span) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})
</script>
