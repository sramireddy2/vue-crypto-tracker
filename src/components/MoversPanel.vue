<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
    <article class="rounded-2xl border border-line bg-navy p-4">
      <h3 class="mb-3 text-sm font-semibold text-ink">Top gainers</h3>
      <ul class="space-y-2">
        <li
          v-for="coin in store.gainers"
          :key="coin.id"
          class="flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 transition hover:bg-navy-light"
          @click="store.selectCoin(coin.id)"
        >
          <div class="flex items-center gap-2">
            <img :src="coin.image" :alt="coin.name" class="h-5 w-5 rounded-full" />
            <span class="text-sm text-ink">{{ coin.symbol.toUpperCase() }}</span>
          </div>
          <span class="text-sm font-medium text-up">{{ formatPercent(coin.price_change_percentage_24h) }}</span>
        </li>
      </ul>
    </article>

    <article class="rounded-2xl border border-line bg-navy p-4">
      <h3 class="mb-3 text-sm font-semibold text-ink">Top losers</h3>
      <ul class="space-y-2">
        <li
          v-for="coin in store.losers"
          :key="coin.id"
          class="flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 transition hover:bg-navy-light"
          @click="store.selectCoin(coin.id)"
        >
          <div class="flex items-center gap-2">
            <img :src="coin.image" :alt="coin.name" class="h-5 w-5 rounded-full" />
            <span class="text-sm text-ink">{{ coin.symbol.toUpperCase() }}</span>
          </div>
          <span class="text-sm font-medium text-down">{{ formatPercent(coin.price_change_percentage_24h) }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup>
import { useMarketStore } from '../stores/market'
import { formatPercent } from '../utils/format'

const store = useMarketStore()
</script>
