import { createApp } from 'vue'
import App from './App.vue'
import { Line } from 'vue-chartjs'

const app = createApp(App)
app.component('line-chart', Line)
app.mount('#app')