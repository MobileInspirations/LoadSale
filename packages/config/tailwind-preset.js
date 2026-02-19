/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Deep navy/charcoal base
        surface: {
          DEFAULT: "hsl(var(--surface))",
          muted: "hsl(var(--surface-muted))",
          elevated: "hsl(var(--surface-elevated))",
        },
        // Accent palette
        accent: {
          cyan: "hsl(var(--accent-cyan))",
          purple: "hsl(var(--accent-purple))",
          emerald: "hsl(var(--accent-emerald))",
          amber: "hsl(var(--accent-amber))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px -5px hsl(var(--accent-cyan) / 0.3)",
        "glow-purple": "0 0 20px -5px hsl(var(--accent-purple) / 0.3)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        xl: "24px",
        "2xl": "40px",
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsl(var(--accent-cyan) / 0.2)" },
          "50%": { boxShadow: "0 0 30px -5px hsl(var(--accent-cyan) / 0.4)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        wider: "0.05em",
        widest: "0.1em",
      },
    },
  },
  plugins: [],
};
