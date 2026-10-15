/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finora: {
          navy: '#0B1431',
          dark: '#10172A',
          cardNavy: '#131D3F',
          primary: '#5145D8',
          purple: '#6558E8',
          purpleLight: '#EEF0FF',
          purpleBorder: '#D8DBFC',
          gold: '#C8A96B',
          goldLight: '#FDF6E9',
          goldBorder: '#E6D3B1',
          goldGradientFrom: '#DFBA73',
          goldGradientTo: '#B59458',
          textMain: '#111B3B',
          textMuted: '#667085',
          bgSoft: '#F5F6FA',
          bgLight: '#F8FAFC',
          success: '#15966A',
          error: '#D64550',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 24, 40, 0.06), 0 2px 6px -2px rgba(16, 24, 40, 0.03)',
        'card': '0 10px 30px -4px rgba(11, 20, 49, 0.08), 0 4px 10px -2px rgba(11, 20, 49, 0.04)',
        'glow-purple': '0 0 25px -3px rgba(101, 88, 232, 0.45)',
        'glow-gold': '0 0 25px -3px rgba(200, 169, 107, 0.4)',
      }
    },
  },
  plugins: [],
}
