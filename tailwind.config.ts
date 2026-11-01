import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cacao: { DEFAULT: "#140b07", 900: "#0d0705", 800: "#1a0f0a", 700: "#24150e", 600: "#2f1c12" },
        chocolate: "#3a2216",
        earth: "#8a5a3b",
        gold: { DEFAULT: "#c9a96e", light: "#e4d1a6", dim: "#8f7748" },
        cream: "#f3ead9",
        beige: "#d8c6a5",
        jungle: { DEFAULT: "#2c3a28", light: "#4d5e41" },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
      letterSpacing: { ultra: "0.42em" },
      transitionTimingFunction: { lux: "cubic-bezier(0.77, 0, 0.175, 1)", out: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
  plugins: [],
};
export default config;
