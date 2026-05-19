import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080c10',
        surface: '#0d1117',
        'surface-2': '#161b22',
        'surface-3': '#1c2330',
        border: '#21262d',
        'border-2': '#30363d',
        text: '#e6edf3',
        'text-muted': '#8b949e',
        'text-dim': '#484f58',
        accent: {
          teal: '#2dd4bf',
          cyan: '#22d3ee',
          emerald: '#10b981',
          gold: '#f59e0b',
          blue: '#3b82f6',
        },
        score: {
          high: '#10b981',
          mid: '#f59e0b',
          low: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glow: { from: { boxShadow: '0 0 10px rgba(45,212,191,0.2)' }, to: { boxShadow: '0 0 25px rgba(45,212,191,0.5)' } },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(45,212,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.03) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(48,54,61,0.5)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(45,212,191,0.2)',
        'glow-teal': '0 0 20px rgba(45,212,191,0.3)',
        'glow-cyan': '0 0 20px rgba(34,211,238,0.3)',
      }
    },
  },
  plugins: [],
}
export default config
