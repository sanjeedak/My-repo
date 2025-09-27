/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0071DC',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
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
  plugins: [
    forms,
  ],
};