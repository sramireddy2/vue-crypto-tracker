<template>
    <div class="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Bitcoin – Last 7 Days</h2>
        <button @click="refresh" class="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition">
          Refresh
        </button>
      </div>
      <line-chart v-if="chartData" :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  
  // Register Chart.js modules
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
  )
  
  const chartData = ref(null)
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280' }
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.2)' },
        ticks: { color: '#6B7280' }
      }
    },
    plugins: {
      legend: { display: false }
    },
    elements: {
      line: { tension: 0.3, borderColor: '#6366F1' },
      point: { radius: 4, backgroundColor: '#6366F1' }
    }
  }
  
  async function fetchHistory() {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
      { params: { vs_currency: 'usd', days: 7 } }
    )
    const prices = res.data.prices
    chartData.value = {
      labels: prices.map(p => new Date(p[0]).toLocaleDateString()),
      datasets: [
        {
          label: 'BTC USD',
          data: prices.map(p => p[1]),
          borderWidth: 2,
          pointRadius: 3,
          fill: false
        }
      ]
    }
  }
  
  function refresh() {
    fetchHistory()
  }
  
  onMounted(fetchHistory)
  </script>
  
  <style scoped>
  h2 { margin-bottom: 0.5em; }
  </style>  