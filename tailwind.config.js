/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#05070D',
        navy: '#0B1220',
        accent: '#3B82F6',
        ink: '#E8EEF8',
        muted: '#8B9BB4',
        up: '#22D3A6',
        down: '#F43F5E',
      },
    },
  },
}
