const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0071DC',
      },
      fontFamily: {
        // Yahan 'Poppins' ko 'Inter' se badla gaya hai
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-out': {
          '0%, 100%': { opacity: '0', transform: 'translateY(20px)' },
          '10%, 90%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-out': 'fade-in-out 3s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
