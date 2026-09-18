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
          DEFAULT: "#14171A", // anthracite - texte principal / fonds sombres
          900: "#0E1012",
          800: "#181B1F",
          700: "#22262B",
          600: "#2E3339",
        },
        steel: {
          50: "#F4F5F6",
          100: "#E7E9EB",
          200: "#D2D6DA",
          300: "#AFB6BD",
          400: "#89919A",
          500: "#6B7480", // gris technique de reference
          600: "#545C66",
          700: "#3F454C",
        },
        volt: {
          DEFAULT: "#FF6A1A", // accent energie/electrique
          50: "#FFF1E8",
          100: "#FFE0CC",
          400: "#FF8A47",
          500: "#FF6A1A",
          600: "#E85700",
          700: "#C24700",
        },
        ok: "#16794F",
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
