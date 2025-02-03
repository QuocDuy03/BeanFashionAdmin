/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue-cyan': '#00354b',
        yellow: '#ffc107',
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        'off-white': '#f7f8f9',
        'text-dark-blue': '#01567f',
        'white-blue': '#F1F4F9',
        'black-light': '#202224',
        'primary-dark': '#0006b3',
        'partial-primary': colors.indigo
      },
      width: {
        1200: '1200px'
      },
      maxWidth: {
        1200: '1200px'
      },
      screens: {
        xs: '275px'
      },
      willChange: {
        opacity: 'opacity'
      },
      dropShadow: {
        sidebar: ['0 0px 10px rgba(59, 130, 246, 0.3)', '0 0px 10px rgba(59, 130, 246, 0.1)']
      },
      keyframes: {
        pulsate: {
          '0%': {
            transform: 'scale(0.1)',
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(1.2)'
          }
        },
        aniName: {
          '0%': {
            left: '0px'
          },
          '50%': {
            left: '3%'
          },
          '100%': {
            left: '0px'
          }
        },
        shine: {
          '100%': {
            left: '125%'
          }
        }
      },
      animation: {
        pulsate: 'pulsate 1s ease-out infinite',
        aniName: 'aniName 3s infinite',
        shine: 'shine 1.1s'
      },
      backgroundImage: {
        fire: "url('@/assets/images/fire.png')",
        'big-banner-sale': "url('@/assets/images/bg_banner_big.webp')",
        auth: "url('@/assets/svgs/authBg.svg')"
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-thin': {
          '::-webkit-scrollbar': {
            width: '4px',
            height: '4px'
          }
        },
        '.scrollbar-thumb': {
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#818cf8',
            borderRadius: '10px'
          }
        },
        '.scrollbar-track': {
          '::-webkit-scrollbar-track': {
            backgroundColor: '#ccc',
            borderRadius: '10px'
          }
        },
        '.scrollbar-thumb:hover': {
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#6366f1'
          }
        }
      });
    }
  ]
};
