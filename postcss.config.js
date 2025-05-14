// postcss.config.js - Use the correct 2025 package
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // The correct package for Tailwind 4.x
    'autoprefixer': {},
  },
}