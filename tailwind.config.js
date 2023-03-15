/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'poppins': ['Poppins'],
        },
        animation: {
          fadeIn: 'fadeIn 0.5s',
          fadeOut: 'fadeOut 0.5s',
        },
        keyframes: {
          fadeIn: {
              '0%': { opacity: '0%' },
              '100%': { opacity: '100%' },
          },
          fadeOut: {
            '0%': { opacity: '100%' },
            '100%': { opacity: '0%'},
          },
        },
      },
    },
    plugins: [],
  }
  