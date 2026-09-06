<template>
  <header class="sticky top-0 z-20 border-b border-line/80 bg-page/80 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/40">
            <span class="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_#3b82f6]"></span>
          </div>
          <div>
            <p class="text-sm font-semibold tracking-wide text-ink">Pulse</p>
            <p class="text-xs text-muted">Live market tracker</p>
          </div>
        </div>
      </div>

      <label class="relative block flex-1">
        <span class="sr-only">Search coins</span>
        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <input
          :value="store.query"
          type="search"
          placeholder="Search name or symbol…"
          class="w-full rounded-xl border border-line bg-navy px-10 py-2.5 text-sm text-ink placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          @input="store.setQuery($event.target.value)"
        />
      </label>

      <div class="flex items-center gap-3 text-xs">
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
          :class="pillClass"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="dotClass"></span>
          {{ statusLabel }}
        </span>
        <span class="hidden text-muted sm:inline">{{ lastTick }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useMarketStore } from '../stores/market'
import { formatTime } from '../utils/format'

const store = useMarketStore()

const statusLabel = computed(() => {
  if (store.connection === 'live') return 'Live'
  if (store.connection === 'reconnecting') return 'Reconnecting'
  if (store.connection === 'connecting') return 'Connecting'
  return 'Offline'
})

const pillClass = computed(() => {
  if (store.connection === 'live') return 'border-up/30 bg-up/10 text-up'
  if (store.connection === 'offline') return 'border-down/30 bg-down/10 text-down'
  return 'border-accent/30 bg-accent/10 text-accent-soft'
})

const dotClass = computed(() => {
  if (store.connection === 'live') return 'bg-up animate-pulse'
  if (store.connection === 'offline') return 'bg-down'
  return 'bg-accent-soft animate-pulse'
})

const lastTick = computed(() => (
  store.lastTickAt ? `Tick ${formatTime(store.lastTickAt)}` : 'Waiting for ticks'
))
</script>
