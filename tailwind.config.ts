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
        brand: {
          dark:    "#070710",
          darker:  "#04040A",
          card:    "#0E0E1C",
          border:  "#1E1E32",
          gold:    "#E8A838",
          "gold-light": "#F5C764",
          "gold-dark":  "#C68A1E",
          purple:  "#7B2FBE",
          "purple-light": "#9B4FDE",
          teal:    "#00D2C8",
          pink:    "#F72585",
          text:    "#F0F0F8",
          muted:   "#8080A0",
          success: "#22C55E",
          warning: "#F59E0B",
          error:   "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial":    "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand":     "linear-gradient(135deg, #7B2FBE 0%, #E8A838 100%)",
        "gradient-dark":      "linear-gradient(180deg, #070710 0%, #0E0E1C 100%)",
        "gradient-hero":      "linear-gradient(135deg, #04040A 0%, #1A0A2E 50%, #070710 100%)",
        "gradient-gold":      "linear-gradient(135deg, #C68A1E 0%, #F5C764 50%, #C68A1E 100%)",
        "gradient-card":      "linear-gradient(145deg, #0E0E1C, #070710)",
        "noise":              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "gold":      "0 0 30px rgba(232, 168, 56, 0.3)",
        "gold-sm":   "0 0 15px rgba(232, 168, 56, 0.2)",
        "purple":    "0 0 30px rgba(123, 47, 190, 0.4)",
        "card":      "0 4px 32px rgba(0, 0, 0, 0.6)",
        "card-hover":"0 8px 48px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        "float":        "float 6s ease-in-out infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "shimmer":      "shimmer 2s linear infinite",
        "fade-in":      "fadeIn 0.5s ease-out",
        "slide-up":     "slideUp 0.5s ease-out",
        "spin-slow":    "spin 8s linear infinite",
      },
      keyframes: {
        float:   { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-20px)" } },
        glow:    { "from": { "box-shadow": "0 0 20px rgba(232,168,56,0.2)" }, "to": { "box-shadow": "0 0 40px rgba(232,168,56,0.6)" } },
        shimmer: { "0%": { "background-position": "-200% 0" }, "100%": { "background-position": "200% 0" } },
        fadeIn:  { "from": { opacity: "0" }, "to": { opacity: "1" } },
        slideUp: { "from": { opacity: "0", transform: "translateY(20px)" }, "to": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
