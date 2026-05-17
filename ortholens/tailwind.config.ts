import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          base:     '#060B14',   // page root – deepest layer
          surface:  '#0D1421',   // card/panel surface
          elevated: '#131F33',   // elements sitting above surface
        },
        // Borders
        border: {
          dim:    'rgba(0,229,255,0.10)',
          soft:   'rgba(0,229,255,0.22)',
          bright: 'rgba(0,229,255,0.45)',
        },
        // Accent
        accent: {
          DEFAULT: '#00E5FF',
          dim:     'rgba(0,229,255,0.08)',
          glow:    'rgba(0,229,255,0.25)',
        },
        // Diagnostic states
        fracture: {
          DEFAULT: '#FF3860',
          dim:     'rgba(255,56,96,0.10)',
          glow:    'rgba(255,56,96,0.25)',
        },
        normal: {
          DEFAULT: '#00D68F',
          dim:     'rgba(0,214,143,0.10)',
          glow:    'rgba(0,214,143,0.25)',
        },
        warning: {
          DEFAULT: '#FFB84D',
          dim:     'rgba(255,184,77,0.10)',
        },
        // Text
        text: {
          primary:   '#F0F6FF',
          secondary: 'rgba(176,196,222,0.70)',
          muted:     'rgba(176,196,222,0.40)',
          accent:    '#00E5FF',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan-beam':   'scan-beam 2.4s linear infinite',
        'ping-slow':   'ping 2.4s cubic-bezier(0,0,0.2,1) infinite',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite alternate',
        'count-up':    'count-up 0.6s ease-out forwards',
      },
      keyframes: {
        'scan-beam': {
          '0%':   { transform: 'translateY(-4px)', opacity: '0' },
          '5%':   { opacity: '1' },
          '95%':  { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'pulse-glow': {
          from: { boxShadow: '0 0 4px rgba(0,229,255,0.2)' },
          to:   { boxShadow: '0 0 18px rgba(0,229,255,0.6), 0 0 36px rgba(0,229,255,0.2)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: { panel: '14px' },
    },
  },
  plugins: [],
}
export default config
