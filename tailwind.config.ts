import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts}',
    './shared/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        maxaro: {
          blue: {
            DEFAULT: '#0F2A4A',
            hover: '#183B65',
            light: '#EBF2FA',
          },
          accent: {
            DEFAULT: '#D97706',
            hover: '#B45309',
          },
          surface: {
            DEFAULT: '#FFFFFF',
            subtle: '#F8F9FA',
            muted: '#F1F3F5',
          },
          border: {
            DEFAULT: '#E5E7EB',
            subtle: '#F3F4F6',
          },
        },
        trust: {
          green: '#00B67A',
          greenBg: '#E6F8F2',
          blue: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card-subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(15, 42, 74, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'drawer': '-8px 0 32px 0 rgba(15, 42, 74, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
