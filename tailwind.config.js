/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cave: {
          dark: '#1D133D',
          deep: '#211842',
          card: 'rgba(48, 35, 92, 0.8)',
          accent: '#FFC107',
        },
        crystal: {
          blue: '#2563EB',
          teal: '#0D9488',
          purple: '#7C3AED',
          pink: '#DB2777',
          yellow: '#D97706',
          green: '#16A34A',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 15px rgba(124, 58, 237, 0.5)',
        'glow-teal': '0 0 15px rgba(13, 148, 136, 0.5)',
        'glow-green': '0 0 15px rgba(22, 163, 74, 0.5)',
      }
    },
  },
  plugins: [],
}
