/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#e60011",
          hover: "#c10018",
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#e60011",
          600: "#c10018",
          900: "#7f1d1d",
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
          subtle: "#ffedd5",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // SMK Telkom Color Palette
        telkom: {
          red: "#e60011",
          "red-hover": "#c10018",
          dark: "#0f0f14",
          surface: "#16181d",
          light: "#ffffff",
          text: "#0b0b0b",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#374151",
          700: "#1f2937",
          800: "#111827",
          900: "#0f172a",
        },
      },
      fontFamily: {
        // default body
        sans: [
          "var(--font-body)",
          "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"
        ],
        // headings
        heading: [
          "var(--font-geist-sans)",
          "var(--font-body)",
          "system-ui", "sans-serif"
        ],
        display: [
          "var(--font-geist-sans)",
          "var(--font-body)",
          "system-ui", "sans-serif"
        ],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        tightest: "-0.03em",
        tightish: "-0.02em",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-out",
        typewriter: "typewriter 3s steps(40) 1s 1 normal both",
        blink: "blink 1s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-4px)" },
          "60%": { transform: "translateY(-2px)" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 50%": { "border-color": "transparent" },
          "51%, 100%": { "border-color": "currentColor" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 16px rgba(0, 0, 0, 0.08)",
        "hard": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "glow": "0 0 20px rgba(230, 0, 17, 0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function({ addUtilities }) {
      addUtilities({
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".text-pretty": {
          "text-wrap": "pretty",
        },
      });
    },
  ],
};