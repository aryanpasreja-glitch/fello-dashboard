/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fello-coral': '#FF7A6B',
        'fello-coral-dark': '#FF6B5B',
        'fello-navy': '#515B8E',
        'fello-purple': '#8B7FB8',
        'fello-light': '#F8F9FC',
        'fello-dark': '#2B3048',
        'fello-pink': '#E88BA8',
        'fello-blue': '#6B9FE8',
      },
    },
  },
  plugins: [],
}

