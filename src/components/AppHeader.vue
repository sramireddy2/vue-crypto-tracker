<template>
  <header class="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050506]/75 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
      <a
        :href="homeHref"
        class="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]"
        aria-label="Pulse home"
      >
        <img
          :src="logoSrc"
          alt=""
          width="40"
          height="40"
          class="logo-mark h-10 w-10 rounded-xl object-cover"
        />
        <div>
          <p class="text-sm font-semibold tracking-tight text-ink">Pulse</p>
          <p class="text-[11px] text-muted">Market terminal</p>
        </div>
      </a>

      <label class="relative block flex-1">
        <span class="sr-only">Search coins</span>
        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <input
          :value="store.query"
          type="search"
          placeholder="Search name or symbol…"
          class="input-field"
          @input="store.setQuery($event.target.value)"
        />
      </label>

      <div class="flex items-center gap-3 text-xs">
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono tracking-wide"
          :class="pillClass"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="dotClass"></span>
          {{ statusLabel }}
        </span>
        <span class="hidden font-mono text-[11px] text-muted sm:inline">{{ lastTick }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useMarketStore } from '../stores/market'
import { formatTime } from '../utils/format'

const store = useMarketStore()
const homeHref = import.meta.env.BASE_URL
const logoSrc = `${homeHref}pulse-logo.png`

const statusLabel = computed(() => {
  if (store.connection === 'live') return 'Live'
  if (store.connection === 'reconnecting') return 'Reconnecting'
  if (store.connection === 'connecting') return 'Connecting'
  return 'Offline'
})

const pillClass = computed(() => {
  if (store.connection === 'live') return 'border-up/30 bg-up/10 text-up'
  if (store.connection === 'offline') return 'border-down/30 bg-down/10 text-down'
  return 'border-accent/30 bg-accent/10 text-[#c5c9f2]'
})

const dotClass = computed(() => {
  if (store.connection === 'live') return 'bg-up animate-pulse'
  if (store.connection === 'offline') return 'bg-down'
  return 'bg-accent-bright animate-pulse'
})

const lastTick = computed(() => (
  store.lastTickAt ? `Tick ${formatTime(store.lastTickAt)}` : 'Waiting for ticks'
))
</script>

<style scoped>
.logo-mark {
  animation: logo-pulse 3.2s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.03); filter: brightness(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .logo-mark {
    animation: none;
  }
}
</style>
