/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx,vue}',
    ],
    darkMode: 'class',   // if you want manual dark‐mode toggling
    theme: {
      extend: {
        // e.g. add custom colors, fonts, spacing…
        colors: {
          primary: '#5A67D8',
        }
      },
    },
    plugins: [
      // e.g. require('@tailwindcss/forms'),
    ],
  }  