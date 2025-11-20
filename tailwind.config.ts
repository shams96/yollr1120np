import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--midnight)",
        foreground: "var(--cloud)",
        primary: {
          DEFAULT: "var(--electric-peach)",
          foreground: "var(--midnight)",
        },
        secondary: {
          DEFAULT: "var(--cyan-pop)",
          foreground: "var(--midnight)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--graphite)",
          foreground: "var(--cloud)",
        },
        accent: {
          DEFAULT: "var(--cosmic-pink)",
          foreground: "var(--cloud)",
        },
        popover: {
          DEFAULT: "var(--graphite)",
          foreground: "var(--cloud)",
        },
        card: {
          DEFAULT: "var(--graphite)",
          foreground: "var(--cloud)",
        },
        // Yollr Specific Palette
        yollr: {
          peach: "var(--electric-peach)",
          pink: "var(--cosmic-pink)",
          cyan: "var(--cyan-pop)",
          lime: "var(--lime-pop)",
          midnight: "var(--midnight)",
          graphite: "var(--graphite)",
          cloud: "var(--cloud)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.2)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
