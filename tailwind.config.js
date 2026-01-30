/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          card: 'var(--color-bg-card)',
        },
        'accent': {
          cyan: 'var(--color-accent-cyan)',
          magenta: 'var(--color-accent-magenta)',
          yellow: 'var(--color-accent-yellow)',
          green: 'var(--color-accent-green)',
          orange: 'var(--color-accent-orange)',
        },
        'text': {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        'border': {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        'rarity': {
          common: 'var(--color-rarity-common)',
          rare: 'var(--color-rarity-rare)',
          epic: 'var(--color-rarity-epic)',
          legendary: 'var(--color-rarity-legendary)',
          mythic: 'var(--color-rarity-mythic)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1.4' }],   /* 10px - absolute minimum, use sparingly */
        'xs': ['0.75rem', { lineHeight: '1.4' }],     /* 12px - labels, badges, minimum UI text */
        'sm': ['0.875rem', { lineHeight: '1.5' }],    /* 14px - small body text, secondary info */
        'base': ['1rem', { lineHeight: '1.6' }],      /* 16px - body text, default */
        'lg': ['1.125rem', { lineHeight: '1.5' }],    /* 18px - emphasis, lead text */
        'xl': ['1.25rem', { lineHeight: '1.4' }],     /* 20px - headings, card titles */
        '2xl': ['1.5rem', { lineHeight: '1.3' }],     /* 24px - section titles */
        '3xl': ['1.875rem', { lineHeight: '1.2' }],   /* 30px - page titles */
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
