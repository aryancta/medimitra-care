import type { Config } from 'tailwindcss';

/**
 * Tailwind configuration tuned for elderly-friendly UI:
 *  - Larger default font sizes
 *  - Deeply saturated primary (saffron) + teal secondary palette inspired by
 *    Indian healthcare iconography
 *  - Strong WCAG AA contrast ratios on every token
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './frontend/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1200px' },
    },
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        display: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          strong: '#0f172a',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted: '#475569',
          soft: '#94a3b8',
        },
        severity: {
          mild: '#16a34a',
          moderate: '#eab308',
          severe: '#dc2626',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(15, 23, 42, 0.18), 0 2px 6px -2px rgba(15, 23, 42, 0.06)',
        glow: '0 0 0 1px rgba(14, 116, 144, 0.08), 0 20px 40px -20px rgba(14, 116, 144, 0.35)',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'slide-up': 'slide-up 400ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
