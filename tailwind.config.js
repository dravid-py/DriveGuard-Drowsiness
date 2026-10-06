/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        surface: {
          DEFAULT: "#131B2A",
          muted: "#0F1622",
          card: "#162032",
          elevated: "#1B273C",
          border: "#233149",
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        status: {
          normal: "#10B981", // green
          warning: "#F59E0B", // amber
          critical: "#EF4444", // red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
