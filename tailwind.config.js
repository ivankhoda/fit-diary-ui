/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0e7dde',
        secondary: '#4F5B66',
        accent: '#f8f9fa',
        'button-dark': '#5c6d7e',
        'light-gray': '#BDBDBA',
        'dark-gray': '#464748',
        'blue': '#009EDB',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Prevent Tailwind from conflicting with existing styles
  corePlugins: {
    preflight: true, // Set to false if you want to keep your existing global styles
  },
}
