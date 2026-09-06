<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
    <SpotlightCard tag="article" card-class="p-5">
      <h3 class="mb-4 text-sm font-semibold tracking-tight text-ink">Top gainers</h3>
      <ul class="space-y-1">
        <li
          v-for="coin in store.gainers"
          :key="coin.id"
          class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-white/[0.05]"
          @click="store.selectCoin(coin.id)"
        >
          <div class="flex items-center gap-2">
            <img :src="coin.image" :alt="coin.name" class="h-5 w-5 rounded-full" />
            <span class="text-sm text-ink">{{ coin.symbol.toUpperCase() }}</span>
          </div>
          <span class="font-mono text-sm text-up">{{ formatPercent(coin.price_change_percentage_24h) }}</span>
        </li>
      </ul>
    </SpotlightCard>

    <SpotlightCard tag="article" card-class="p-5">
      <h3 class="mb-4 text-sm font-semibold tracking-tight text-ink">Top losers</h3>
      <ul class="space-y-1">
        <li
          v-for="coin in store.losers"
          :key="coin.id"
          class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-white/[0.05]"
          @click="store.selectCoin(coin.id)"
        >
          <div class="flex items-center gap-2">
            <img :src="coin.image" :alt="coin.name" class="h-5 w-5 rounded-full" />
            <span class="text-sm text-ink">{{ coin.symbol.toUpperCase() }}</span>
          </div>
          <span class="font-mono text-sm text-down">{{ formatPercent(coin.price_change_percentage_24h) }}</span>
        </li>
      </ul>
    </SpotlightCard>
  </section>
</template>

<script setup>
import { useMarketStore } from '../stores/market'
import { formatPercent } from '../utils/format'
import SpotlightCard from './SpotlightCard.vue'

const store = useMarketStore()
</script>
