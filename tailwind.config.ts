import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0C10",
          50: "#F5F6F8",
          100: "#E7E9EE",
          800: "#161A21",
          900: "#0F1216",
          950: "#0A0C10",
        },
        bone: {
          DEFAULT: "#F2EDE4",
          dim: "#D8D2C5",
        },
        manifold: {
          DEFAULT: "#3E6BFF",
          dim: "#1F3A8F",
          light: "#A9BFFF",
        },
        curvature: {
          DEFAULT: "#E8A33D",
          dim: "#8A5E1F",
          light: "#F4CC8F",
        },
        risk: {
          normal: "#3FB97E",
          osteopenia: "#E8A33D",
          osteoporosis: "#E0584B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(242,237,228,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,237,228,0.045) 1px, transparent 1px)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        pulseRing: "pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        dash: "dash 2.4s linear forwards",
      },
    },
  },
  plugins: [],
};
export default config;
