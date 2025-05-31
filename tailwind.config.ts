
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        arabic: ["Cairo", "Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Enhanced Fitness App Color System
        fitness: {
          primary: {
            50: "hsl(268, 83%, 98%)",
            100: "hsl(268, 83%, 95%)",
            200: "hsl(268, 83%, 88%)",
            300: "hsl(268, 83%, 78%)",
            400: "hsl(268, 83%, 68%)",
            500: "hsl(268, 83%, 58%)",
            600: "hsl(268, 83%, 48%)",
            700: "hsl(268, 83%, 38%)",
            800: "hsl(268, 83%, 28%)",
            900: "hsl(268, 83%, 18%)",
          },
          secondary: {
            50: "hsl(338, 76%, 98%)",
            100: "hsl(338, 76%, 95%)",
            200: "hsl(338, 76%, 88%)",
            300: "hsl(338, 76%, 78%)",
            400: "hsl(338, 76%, 68%)",
            500: "hsl(338, 76%, 58%)",
            600: "hsl(338, 76%, 48%)",
            700: "hsl(338, 76%, 38%)",
            800: "hsl(338, 76%, 28%)",
            900: "hsl(338, 76%, 18%)",
          },
          accent: {
            50: "hsl(220, 91%, 98%)",
            100: "hsl(220, 91%, 95%)",
            200: "hsl(220, 91%, 88%)",
            300: "hsl(220, 91%, 79%)",
            400: "hsl(220, 91%, 69%)",
            500: "hsl(220, 91%, 59%)",
            600: "hsl(220, 91%, 49%)",
            700: "hsl(220, 91%, 39%)",
            800: "hsl(220, 91%, 29%)",
            900: "hsl(220, 91%, 19%)",
          },
          orange: {
            50: "hsl(24, 95%, 98%)",
            100: "hsl(24, 95%, 95%)",
            200: "hsl(24, 95%, 88%)",
            300: "hsl(24, 95%, 78%)",
            400: "hsl(24, 95%, 68%)",
            500: "hsl(24, 95%, 58%)",
            600: "hsl(24, 95%, 48%)",
            700: "hsl(24, 95%, 38%)",
            800: "hsl(24, 95%, 28%)",
            900: "hsl(24, 95%, 18%)",
          },
          neutral: {
            50: "hsl(210, 40%, 98%)",
            100: "hsl(210, 40%, 96%)",
            200: "hsl(214, 32%, 91%)",
            300: "hsl(213, 27%, 84%)",
            400: "hsl(215, 20%, 65%)",
            500: "hsl(215, 16%, 47%)",
            600: "hsl(215, 19%, 35%)",
            700: "hsl(215, 25%, 27%)",
            800: "hsl(217, 33%, 17%)",
            900: "hsl(222, 84%, 5%)",
          },
        },
        // Semantic Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          50: "hsl(142, 76%, 98%)",
          100: "hsl(142, 76%, 95%)",
          500: "hsl(142, 76%, 36%)",
          600: "hsl(142, 76%, 31%)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          50: "hsl(38, 92%, 98%)",
          100: "hsl(38, 92%, 95%)",
          500: "hsl(38, 92%, 50%)",
          600: "hsl(38, 92%, 45%)",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          50: "hsl(199, 89%, 98%)",
          100: "hsl(199, 89%, 95%)",
          500: "hsl(199, 89%, 48%)",
          600: "hsl(199, 89%, 43%)",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
          50: "hsl(0, 84%, 98%)",
          100: "hsl(0, 84%, 95%)",
          500: "hsl(0, 84%, 60%)",
          600: "hsl(0, 84%, 55%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],
        'h6': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
