import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FFF5F8",
          100: "#FDE7F0",
          200: "#FBD0E2",
          300: "#F8B0CD",
          400: "#F37EB0",
          500: "#E8368F",
        },
        fuchsia: {
          brand: "#E8368F",
          hover: "#D2267B",
          dark: "#A8165F",
          light: "#FDF0F6",
        },
        charcoal: {
          DEFAULT: "#2B2230",
          light: "#5A4D61",
          muted: "#8A7993",
          soft: "#B5A7BD",
        },
        card: {
          DEFAULT: "#FFFFFF",
          soft: "#FFF9FB",
          tint: "#FAEDF4",
          border: "#F3DAE6",
        }
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "pink-sm": "0 2px 8px -2px rgba(232, 54, 143, 0.12)",
        "pink-md": "0 8px 24px -6px rgba(232, 54, 143, 0.16)",
        "pink-lg": "0 16px 36px -8px rgba(232, 54, 143, 0.22)",
        "soft-xl": "0 20px 40px -15px rgba(43, 34, 48, 0.07)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
