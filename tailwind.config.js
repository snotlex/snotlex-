/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#00c2ff',
        'primary-mid': '#0080ff',
        'primary-dark': '#5e17eb',
        'text-dark': '#333333',
        'text-light': '#ffffff',
        'bg-light': '#f8f9fa',
        'bg-dark': '#212529',
      },
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
