export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { base: '#FAFAFA' }, // Alabaster white
        text: { primary: '#1A1A1A', secondary: '#737373', inverse: '#FAFAFA' },
        action: { base: '#1A1A1A', hover: '#000000' }
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Manrope'", "sans-serif"],
      }
    }
  },
  plugins: [],
}
