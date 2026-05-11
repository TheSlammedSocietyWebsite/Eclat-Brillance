/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8F8F6',
        'bg-alt': '#FFFFFF',
        ink: '#1A2B4A',
        'ink-soft': '#2C3E5E',
        text: '#2C2C2C',
        muted: '#6B6F76',
        line: '#E6E3DE',
        accent: '#6B8F71',
        'accent-soft': '#EAF0EC',
        gold: '#B8935A',
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
