import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'kotta-red':        '#8F3133',
        'kotta-dark-red':   '#6B2426',
        'kotta-light-red':  '#B85558',
        'kotta-cream':      '#FBF4F2',
        'kotta-black':      '#0D0D0D',
        'kotta-gray':       '#8C8C8C',
        'kotta-light-gray': '#E8E0DC',
        'kotta-gold':       '#D4A017',
        'kotta-mist':       '#D0C8C5',
      },
      fontFamily: {
        display: ['Ondo', 'var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeLeft: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        revealIn: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in':  'fadeIn 1s ease both',
        'fade-up':  'fadeUp 0.9s ease both',
        'fade-left': 'fadeLeft 0.9s ease both',
        'fade-right':'fadeRight 0.9s ease both',
        'marquee':  'marquee 30s linear infinite',
        'pulse2':   'pulse2 2s ease-in-out infinite',
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.5em',
      },
    },
  },
  plugins: [],
}

export default config
