/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#0a0e1a', surface: '#0f1629', elevated: '#1a2035' },
        border: { DEFAULT: '#1e293b', light: '#2d3748' },
        accent: { DEFAULT: '#3b82f6', glow: '#60a5fa' },
        danger: { DEFAULT: '#ef4444', glow: '#f87171' },
        warning: { DEFAULT: '#f59e0b' },
        success: { DEFAULT: '#10b981' },
        critical: { DEFAULT: '#dc2626' },
        text: { primary: '#e2e8f0', secondary: '#94a3b8', muted: '#64748b' }
      }
    },
  },
  plugins: [],
}