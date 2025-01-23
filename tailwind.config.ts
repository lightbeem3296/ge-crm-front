import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: '#3B82F6',
          secondary: '#2563EB',
          accent: '#60A5FA',
          neutral: '#E5E7EB',
          'base-100': '#FFFFFF',
          'base-200': '#F3F4F6',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF6150',
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: '#3B82F6',
          secondary: '#2563EB',
          accent: '#60A5FA',
          neutral: '#1F2937',
          'base-100': '#111827',
          'base-200': '#374151',
          info: '#3B82F6',
          success: '#34D399',
          warning: '#F59E0B',
          error: '#F87171',
        },
      },
    ],
  },
} satisfies Config;
