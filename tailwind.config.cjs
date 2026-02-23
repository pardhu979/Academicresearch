/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Academic primary colors
        acad: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae3ff',
          500: '#1e6fb8',
          600: '#1857a0',
          700: '#15507a'
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        // Accent colors for different sections
        research: '#8b5cf6',  // Purple for research projects
        docs: '#06b6d4',      // Cyan for documents
        chat: '#ec4899',      // Pink for messaging
        admin: '#f97316',     // Orange for admin
      },
      gradients: {
        'research': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        'docs': 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
        'chat': 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      }
    },
  },
  plugins: [],
}
