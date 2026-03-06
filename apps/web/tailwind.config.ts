import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        concrete: {
          light: "#F0F2F5", // Background
          rough: "#EAECEF", // Sidebar/Secondary
          pure: "#FFFFFF", // Surface
          smooth: "#FAFAFA", // Interaction Surface
        },
        ink: {
          black: "#262626", // Heading
          dark: "#595959", // Body
          medium: "#8C8C8C", // Secondary
          light: "#BFBFBF", // Disabled/Border
        },
        status: {
          blocked: "#A8071A", // Architectural Red
          inprogress: "#003EB3", // Deep Blue
          done: "#389E0D", // Nature Green
          agent: "#531DAB", // Mystic Purple
        },
      },
      boxShadow: {
        'ando': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'inner-concrete': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'ando': '2px', // Sharp but safe
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
