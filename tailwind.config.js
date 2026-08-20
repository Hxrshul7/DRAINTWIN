/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b16',
          900: '#0a1424',
          850: '#0d1a2e',
          800: '#122238',
          700: '#1a2f4a',
          600: '#24405f',
        },
        slate: {
          750: '#2c3a4f',
        },
        accent: {
          cyan: '#22d3ee',
          blue: '#3b82f6',
        },
        risk: {
          low: '#22c55e',
          medium: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.15), 0 0 24px rgba(34,211,238,0.08)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity: 0.8 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
        slideIn: { '0%': { transform: 'translateX(12px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        flow: { '0%': { strokeDashoffset: 40 }, '100%': { strokeDashoffset: 0 } },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0,0,0.2,1) infinite',
        slideIn: 'slideIn 0.3s ease-out both',
        flow: 'flow 1s linear infinite',
      },
    },
  },
  plugins: [],
}
