export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Previous theme colors (commented out for trial brighter theme):
        surface: { base: '#FAFAFA' },
        text: { primary: '#1A1A1A', secondary: '#737373', inverse: '#FAFAFA' },
        action: { base: '#1A1A1A', hover: '#000000' }
        */
        surface: { base: '#FFFFFF' },
        text: { primary: '#111111', secondary: '#555555', inverse: '#FFFFFF' },
        action: { base: '#111111', hover: '#000000' }
      },
      fontFamily: {
        /* Previous font definitions:
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Manrope'", "sans-serif"],
        */
        serif: ["'Outfit'", "'Inter'", "sans-serif"],
        sans: ["'Inter'", "'Outfit'", "sans-serif"],
      }
    }
  },
  plugins: [],
}
