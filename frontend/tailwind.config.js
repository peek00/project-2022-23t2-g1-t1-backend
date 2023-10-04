/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  
  ],
  theme: {
    theme: {
      colors: {
        transparent: 'transparent',
        nav : "#1C2434",
      },
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
]
}

