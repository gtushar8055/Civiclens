/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mesh: {
          purple: '#8E2DE2',
          orange: '#F00000',
          peach: '#F4A261'
        },
        appBg: {
          light: '#FDF8F5',
          dark: '#121212',
          cardLight: '#FFFFFF',
          cardDark: '#1E1E1E'
        },
        primary: {
          DEFAULT: '#9d4edd',
          orange: '#ff7b54'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
        'floating': '0 30px 60px -20px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}