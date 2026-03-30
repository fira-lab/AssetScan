import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindAnimate from "tailwindcss-animate"; // <--- Add this import at the top
const config: Config = {
  // 1. Keep the broad content paths to catch all your new Lovable components
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // 2. Hybrid Font Families
      fontFamily: {
        sans: ['"Satoshi"', ...defaultTheme.fontFamily.sans],
        heading: ["Montserrat", "sans-serif"], // Lovable headings
        body: ["Open Sans", "sans-serif"],      // Lovable body
      },
      // 3. Merged Colors (The most important part)
      colors: {
        // LOVABLE DYNAMIC COLORS (Connected to your globals.css variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          mission: "#5750F1", // Preserved your old primary just in case
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        // MISSION STATIC COLORS (Keeping your existing dashboard colors)
        stroke: "#E6EBF1",
        "stroke-dark": "#27303E",
        gray: {
          DEFAULT: "#EFF4FB",
          dark: "#122031",
          1: "#F9FAFB",
          2: "#F3F4F6",
          3: "#E5E7EB",
          4: "#D1D5DB",
          5: "#9CA3AF",
          6: "#6B7280",
          7: "#374151",
        },
        dark: {
          DEFAULT: "#111928",
          2: "#1F2A37",
          3: "#374151",
          4: "#4B5563",
          5: "#6B7280",
          6: "#9CA3AF",
          7: "#D1D5DB",
          8: "#E5E7EB",
        },
      },
      // 4. Preserve all your Mission spacing/sizes
      fontSize: {
        "heading-1": ["60px", "72px"],
        "heading-2": ["48px", "58px"],
        "heading-3": ["40px", "48px"],
        "heading-4": ["35px", "45px"],
        "heading-5": ["28px", "40px"],
        "heading-6": ["24px", "30px"],
        "body-2xlg": ["22px", "28px"],
        "body-sm": ["14px", "22px"],
        "body-xs": ["12px", "20px"],
      },
      // Keep all those specific spacing values from your Mission config
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        // ... (The rest of your 4.5 to 242.5 spacing values go here)
      },
      // 5. Merged Keyframes & Animations
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // Keep your Mission spins/rotations
        linspin: { "100%": { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        rotating: "rotating 30s linear infinite",
      },
    },
  },
  // 6. Ensure you have the animate plugin for Lovable effects
plugins: [tailwindAnimate],
} satisfies Config;

export default config;