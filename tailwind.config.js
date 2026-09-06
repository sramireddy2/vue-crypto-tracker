/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        deep: '#020203',
        page: '#050506',
        elevated: '#0a0a0c',
        accent: '#5E6AD2',
        'accent-bright': '#6872D9',
        ink: '#EDEDEF',
        muted: '#8A8F98',
        up: '#3DD68C',
        down: '#F16B7A',
      },
    },
  },
}
