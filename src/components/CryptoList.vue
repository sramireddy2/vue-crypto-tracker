<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <!-- Search + Dark Toggle -->
      <div class="flex items-center gap-2 p-6">
        <input
          v-model="filter"
          placeholder="🔍 Search coin..."
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          @click="dark = !dark"
          class="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
        >
          {{ dark ? '☀️' : '🌙' }}
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th @click="sortBy('name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Coin ↕
              </th>
              <th @click="sortBy('current_price')" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Price ↕
              </th>
              <th @click="sortBy('price_change_percentage_24h')" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                24h % ↕
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="coin in filteredAndSorted"
              :key="coin.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="px-6 py-4 flex items-center gap-3">
                <img :src="coin.image" alt="" class="w-8 h-8 rounded-full" />
                <span class="font-medium text-gray-900 dark:text-gray-100">{{ coin.name }}</span>
              </td>
              <td class="px-6 py-4 text-right text-gray-900 dark:text-gray-100">
                ${{ formatNumber(coin.current_price) }}
              </td>
              <td
                class="px-6 py-4 text-right font-semibold"
                :class="coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'"
              >
                {{ coin.price_change_percentage_24h.toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Load More -->
      <div class="flex justify-center py-4">
        <button
          @click="loadMore"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const coins = ref([])
const filter = ref('')
const sortKey = ref('market_cap_rank')
const sortAsc = ref(true)
const page = ref(1)
const dark = ref(false)

async function fetchCoins() {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets',
    {
      params: {
        vs_currency: 'usd',
        per_page: 50,
        page: page.value,
        sparkline: false,
        price_change_percentage: '24h'
      }
    }
  )
  // append on loadMore, replace on first mount
  coins.value = page.value === 1
    ? res.data
    : [...coins.value, ...res.data]
}

function loadMore() {
  page.value += 1
  fetchCoins()
}

function formatNumber(x) {
  return x.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const filteredAndSorted = computed(() => {
  return coins.value
    .filter(c => c.name.toLowerCase().includes(filter.value.toLowerCase()))
    .sort((a, b) => {
      const res = a[sortKey.value] > b[sortKey.value] ? 1 : -1
      return sortAsc.value ? res : -res
    })
})

onMounted(fetchCoins)
</script>