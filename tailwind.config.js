/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './app/**/*.{js,jsx,ts,tsx}', // screens, layouts, tabs
    './components/**/*.{js,jsx,ts,tsx}', // reusable UI
    './hooks/**/*.{js,jsx,ts,tsx}', // custom hooks
    './constants/**/*.{js,jsx,ts,tsx}' // constants with class usage
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {}
  },
  plugins: []
};
