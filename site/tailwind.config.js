/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        'bg-alt': 'var(--c-bg-alt)',
        ink: 'var(--c-ink)',
        'ink-soft': 'var(--c-ink-soft)',
        text: 'var(--c-text)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        accent: 'var(--c-accent)',
        'accent-soft': 'var(--c-accent-soft)',
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
        'brand-sm': '0 1px 2px rgba(26, 43, 74, 0.06)',
        'brand-md': '0 10px 30px -12px rgba(26, 43, 74, 0.18)',
        'brand-lg': '0 25px 60px -20px rgba(26, 43, 74, 0.22)',
      },
      maxWidth: {
        container: '1180px',
      },
    },
  },
  plugins: [],
}
