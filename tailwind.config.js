/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PRIMARY - Usa variables CSS dinámicas del tema
        primary: {
          50: 'color-mix(in srgb, var(--color-accent) 10%, white)',
          100: 'color-mix(in srgb, var(--color-accent) 20%, white)',
          200: 'color-mix(in srgb, var(--color-accent) 30%, white)',
          300: 'color-mix(in srgb, var(--color-accent) 50%, white)',
          400: 'var(--color-accent)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent-hover)',
          700: 'var(--color-primary-dark)',
          800: 'color-mix(in srgb, var(--color-primary-dark) 80%, black)',
          900: 'color-mix(in srgb, var(--color-primary-dark) 60%, black)',
        },

        // ACCENT - También dinámico
        accent: {
          400: 'var(--color-accent)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent-hover)',
          3000: 'var(--color-accent)', // Para compatibilidad
        },

        // NEUTRAL - Grises y Blancos (estos se mantienen fijos)
        neutral: {
          white: '#FFFFFF',
          border: 'var(--border-color)',
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            light: 'var(--text-light)',
          },
          bg: {
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
            card: 'var(--bg-card)',
          },
        },

        // SECONDARY - Grises neutros
        secondary: {
          100: '#FAFAFA',
          200: 'var(--border-color)',
          300: 'var(--border-color)',
          400: 'var(--text-light)',
          500: 'var(--text-secondary)',
          600: 'var(--text-primary)',
          700: 'var(--text-primary)',
          800: 'var(--text-primary)',
          900: 'var(--text-primary)',
        },

        // SEMANTIC COLORS - Estos se mantienen fijos
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },

      fontFamily: {
        sans: ['Inter', '"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },

      borderRadius: {
        'sm': '3px',
        'DEFAULT': '4px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },

      borderWidth: {
        'DEFAULT': '2px',
        '3': '3px',
      },

      spacing: {
        'section': '40px',
        'card': '40px',
        'btn-y': '16px',
        'btn-x': '45px',
      },

      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
      },

      transitionDuration: {
        'DEFAULT': '300ms',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      // Gradientes dinámicos
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
      },
    },
  },
  plugins: [],
}