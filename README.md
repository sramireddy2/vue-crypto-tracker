# Vue Crypto Tracker

A live Vue 3 market dashboard with CoinGecko snapshots and Binance WebSocket prices.

**Live site:** [https://sramireddy2.github.io/vue-crypto-tracker/](https://sramireddy2.github.io/vue-crypto-tracker/)

## Features

- 250 coins with search, sort, and 7-day sparklines
- Live USD prices over a Binance mini-ticker WebSocket
- Market overview (cap, volume, BTC dominance)
- Top gainers and losers
- Watchlist saved in the browser
- Click a coin to load its 7-day chart

## Tech Stack

- Vue 3 + Composition API + Pinia
- Vite
- Tailwind CSS
- Axios for CoinGecko REST
- Binance WebSocket for live ticks

## Installation

```bash
git clone https://github.com/sramireddy2/vue-crypto-tracker.git
cd vue-crypto-tracker
npm install
npm run dev
```

The app is hosted on GitHub Pages from the `main` branch via GitHub Actions.
