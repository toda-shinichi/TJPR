/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#8d5266',
          dark: '#f7f3ef',
          surface: '#fffdfa',
          card: '#f3ebe7',
          border: '#ddcfc9',
          crimson: '#8b4157',
          blue: '#435e70',
          emerald: '#435f4c'
        }
      },
      fontFamily: {
        serif: ['Noto Serif TC', 'serif'],
        sans: ['Noto Sans TC', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
