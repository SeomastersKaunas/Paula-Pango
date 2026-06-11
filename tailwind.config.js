/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paula Pango palette
        background: '#fdfbf9',   // warm white/creme
        surface:    '#f0e9e9',   // blush surface / cards
        border:     '#e4d4d4',   // soft dividers
        secondary:  '#cfb0ae',   // dusty rose — accents, icons
        primary:    '#7b5d5d',   // deep rose-brown — CTA, links, active
        text:       '#3e3232',   // warm near-black
        'text-muted': '#9e8080', // muted captions
      },
      fontFamily: {
        serif:  ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:   ['var(--font-jost)',      'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
