import type { Config } from "tailwindcss";

const config = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // values are "r g b" CSS variables set in app/globals.css and swapped by lib/themes.ts
      colors: {
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          100: "rgb(var(--ink-100) / <alpha-value>)",
          200: "rgb(var(--ink-200) / <alpha-value>)",
          300: "rgb(var(--ink-300) / <alpha-value>)",
        },
        signal: {
          DEFAULT: "rgb(var(--signal) / <alpha-value>)",
          soft: "rgb(var(--signal-soft) / <alpha-value>)",
        },
        mist: {
          DEFAULT: "rgb(var(--mist) / <alpha-value>)",
          100: "rgb(var(--mist-100) / <alpha-value>)",
          200: "rgb(var(--mist-200) / <alpha-value>)",
        },
      },
      // a slow dim-and-glow so the theme tab gets noticed
      keyframes: {
        beacon: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 18px rgb(var(--signal) / 0.45)" },
          "50%": { opacity: "0.45", boxShadow: "0 0 0 rgb(var(--signal) / 0)" },
        },
      },
      animation: {
        beacon: "beacon 2.4s ease-in-out infinite",
      },
      // loaded with next/font in app/layout.tsx
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        accent: ["var(--font-accent)", "Georgia", "serif"],
        code: ["var(--font-code)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
