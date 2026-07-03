/**
 * Tailwind configuration with red-black branding
 */
export default {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dc2626", // red
        dark: "#0a0a0a",   // black
      },
    },
  },
  plugins: [],
};
