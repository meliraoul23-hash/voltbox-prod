import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F2A43",
          900: "#0A1D30",
          800: "#0F2A43",
          700: "#163C5C",
          600: "#1D4E76",
        },
        steel: {
          50: "#F5F7F9",
          100: "#E8ECF0",
          200: "#D3DAE1",
          300: "#AFBBC6",
          400: "#89969F",
          500: "#66727C",
          600: "#4E5960",
          700: "#3A434A",
        },
        volt: {
          DEFAULT: "#0E8F4F",
          50: "#EAF9F0",
          100: "#CFF3DE",
          400: "#2FB86B",
          500: "#0E8F4F",
          600: "#0B7A43",
          700: "#086236",
        },
        ok: "#0E8F4F",
        warn: "#B7791F",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        wrap: "1280px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(14,16,18,0.06), 0 8px 24px -12px rgba(14,16,18,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
