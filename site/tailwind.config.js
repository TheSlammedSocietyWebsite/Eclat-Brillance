/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        'bg-alt': 'var(--c-bg-alt)',
        'bg-soft': 'var(--c-bg-soft)',
        ink: 'var(--c-ink)',
        'ink-soft': 'var(--c-ink-soft)',
        text: 'var(--c-text)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        'line-strong': 'var(--c-line-strong)',
        accent: 'var(--c-accent)',
        'accent-soft': 'var(--c-accent-soft)',
        'accent-strong': 'var(--c-accent-strong)',
        gold: 'var(--c-gold)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        brand: '4px',
        'brand-lg': '10px',
      },
      boxShadow: {
        'brand-sm': '0 1px 2px rgba(26, 43, 74, 0.06), 0 4px 16px -10px rgba(26, 43, 74, 0.08)',
        'brand-md': '0 8px 24px -14px rgba(26, 43, 74, 0.22), 0 2px 8px rgba(26, 43, 74, 0.06)',
        'brand-lg': '0 24px 56px -20px rgba(26, 43, 74, 0.22), 0 4px 16px rgba(26, 43, 74, 0.08)',
        'brand-xl': '0 32px 80px -24px rgba(26, 43, 74, 0.28)',
      },
      maxWidth: {
        container: '1180px',
      },
    },
  },
  plugins: [],
}
