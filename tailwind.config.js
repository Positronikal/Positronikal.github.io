/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', '*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#0c0c0c',
          green: '#00ff00',
          'green-dim': '#00cc00',
          yellow: '#ffdf00',
          'yellow-dim': '#ccb200',
          red: '#ff0000',
          blue: '#0088ff',
          cyan: '#00ffff',
          gray: '#808080',
          'gray-light': '#c0c0c0',
          white: '#e0e0e0',
          overlay: 'rgba(0, 0, 0, 0.75)',
          // Cybersecurity themed colors
          'matrix-green': '#00ff41',
          'hack-green': '#33ff33',
          'error-red': '#ff3333',
          'warning-amber': '#ffaa00',
          'info-cyan': '#00aaff',
          'forensics-blue': '#0066cc',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
        'cyber': ['"IBM Plex Mono"', '"Source Code Pro"', 'monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        typing: 'typing 1.5s steps(30, end)',
        'cursor-blink': 'cursor-blink 1.5s step-end infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-in-slow': 'fade-in 1s ease-in-out',
        'fade-in-delayed': 'fade-in 0.5s ease-in-out 0.3s both',
        scanline: 'scanline 10s linear infinite',
        'matrix-rain': 'matrix-rain 2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'terminal-startup': 'terminal-startup 2s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'cursor-blink': {
          '0%, 100%': { borderRightColor: 'transparent' },
          '50%': { borderRightColor: 'currentColor' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%': { textShadow: '0 0 5px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'terminal-startup': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'crt-overlay':
          'linear-gradient(transparent 0%, rgba(32, 128, 32, 0.2) 2%, rgba(32, 128, 32, 0.05) 3%, rgba(32, 128, 32, 0.05) 3%, transparent 4%)',
        'matrix-bg': 'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.1) 0%, rgba(0, 0, 0, 0.9) 70%)',
        'cyber-grid': 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
      },
      boxShadow: {
        'terminal': '0 0 20px rgba(0, 255, 0, 0.3)',
        'cyber-glow': '0 0 30px rgba(0, 255, 65, 0.5)',
        'hack-glow': '0 0 40px rgba(51, 255, 51, 0.6)',
      },
      backdropBlur: {
        'terminal': '8px',
      },
    },
  },
  plugins: [],
};