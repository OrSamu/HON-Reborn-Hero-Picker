import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark slate base
        bg: {
          primary:   '#0d1117',
          secondary: '#161b22',
          tertiary:  '#1c2330',
          card:      '#1e2636',
          hover:     '#252e3f',
        },
        // HON brand gold/teal accent
        accent: {
          gold:      '#d4a017',
          'gold-lt': '#f0c040',
          teal:      '#2ab5b5',
          'teal-lt': '#4fd4d4',
          red:       '#e05050',
          'red-lt':  '#f07070',
          green:     '#3dba6b',
          'green-lt':'#5dd88b',
        },
        // Team colors
        teamA: {
          DEFAULT: '#3b7dd8',
          light:   '#6aa3f5',
          bg:      '#1a2a48',
        },
        teamB: {
          DEFAULT: '#c0392b',
          light:   '#e06050',
          bg:      '#3a1a1a',
        },
        // Border and text
        border: {
          DEFAULT: '#2d3748',
          light:   '#4a5568',
        },
        text: {
          primary:   '#e8eaf0',
          secondary: '#9aa3b5',
          muted:     '#6b7588',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6)',
        'glow-gold': '0 0 20px rgba(212,160,23,0.4)',
        'glow-teal': '0 0 20px rgba(42,181,181,0.4)',
        'glow-blue': '0 0 20px rgba(59,125,216,0.4)',
        'glow-red':  '0 0 20px rgba(192,57,43,0.4)',
      },
      animation: {
        'shimmer':    'shimmer 1.5s infinite',
        'pulse-gold': 'pulseGold 1.2s ease-in-out infinite',
        'flip-in':    'flipIn 0.4s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'bounce-in':  'bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(212,160,23,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(212,160,23,0.8)' },
        },
        flipIn: {
          '0%':   { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0)',     opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        bounceIn: {
          '0%':  { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%':{ transform: 'scale(1)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
