/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* V3 tokens — match CSS vars */
        bg:      '#07090D',
        bg2:     '#0C0F14',
        surface: '#11161E',
        card:    '#161C26',
        border:  '#1E2A38',
        border2: '#263545',
        gold:    '#E8B84B',
        gold2:   '#F5D280',
        gold3:   '#B89030',
        teal:    '#18D4C8',
        teal2:   '#0FADA3',
        red:     '#F04060',
        green:   '#28D890',
        blue:    '#4898F8',
        purple:  '#A870F8',
        muted:   '#8899AA',
        dim:     '#566070',
        /* V2 compat */
        brand: {
          bg: '#07090D', surface: '#11161E', card: '#161C26', border: '#1E2A38',
          teal: '#18D4C8', 'teal-dim': '#0FADA3', gold: '#E8B84B',
          red: '#F04060', green: '#28D890', purple: '#A870F8', blue: '#4898F8',
          gray: '#566070', 'gray-light': '#8899AA',
        },
      },
      fontFamily: {
        display: ['var(--font-syne)', 'var(--font-outfit)', 'sans-serif'],
        sans:    ['var(--font-jakarta)', 'var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      spacing: { '18': '4.5rem', '88': '22rem', '128': '32rem' },
      borderRadius: { '4': '1rem', '5': '1.25rem' },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-gold':     'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)',
        'gradient-teal':     'linear-gradient(135deg, #5EEEE8 0%, #18D4C8 60%, #0FADA3 100%)',
        'gradient-dark':     'linear-gradient(180deg, #07090D 0%, #0C0F14 100%)',
        'shimmer':           'linear-gradient(90deg, transparent 0%, rgba(232,184,75,.15) 50%, transparent 100%)',
      },
      animation: {
        'float-slow':  'float-slow 6s ease-in-out infinite',
        'pulse-ring':  'pulse-ring 2s ease-out infinite',
        'shimmer':     'shimmer 3s linear infinite',
        'fade-up':     'fade-up .6s ease both',
        'fade-in':     'fade-in .4s ease both',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        'float-slow':  { '0%,100%':{ transform:'translateY(0) rotate(0deg)' }, '50%':{ transform:'translateY(-12px) rotate(1deg)' } },
        'pulse-ring':  { '0%':{ transform:'scale(0.8)', opacity:.8 }, '100%':{ transform:'scale(2.5)', opacity:0 } },
        'shimmer':     { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        'fade-up':     { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        'fade-in':     { from:{ opacity:0 }, to:{ opacity:1 } },
      },
      boxShadow: {
        'glow-gold':  '0 0 40px rgba(232,184,75,.3), 0 0 80px rgba(232,184,75,.1)',
        'glow-teal':  '0 0 40px rgba(24,212,200,.3), 0 0 80px rgba(24,212,200,.1)',
        'glow-gold-sm':'0 0 15px rgba(232,184,75,.4)',
        'inner-gold': 'inset 0 0 30px rgba(232,184,75,.08)',
        'card':       '0 4px 24px rgba(0,0,0,.4)',
        'card-hover': '0 8px 48px rgba(0,0,0,.6)',
      },
    },
  },
  plugins: [],
};
