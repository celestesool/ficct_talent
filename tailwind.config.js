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
        // 🌊 PRIMARY - Turquesa Suave Profesional
        primary: {
          50: '#F0F7F8',      // Muy claro
          100: '#E1EFF1',     // Claro
          200: '#C3DFE3',     // Medio claro
          300: '#A5CFD5',     // Medio
          400: '#8CB1B9',     // ⭐ PRINCIPAL - Turquesa suave
          500: '#8CB1B9',     // Mismo que 400 (tu color principal)
          600: '#6A9AA5',     // Hover oscuro
          700: '#4F7B87',     // Muy oscuro
          800: '#3A5C68',     // Casi negro turquesa
          900: '#273F49',     // Negro turquesa
        },

        // 🌫️ NEUTRAL - Grises y Blancos
        neutral: {
          white: '#FFFFFF',    // ⭐ Fondo principal
          border: '#D1D7D7',   // ⭐ Bordes y separadores
          text: {
            primary: '#333333',   // ⭐ Texto principal
            secondary: '#666666', // ⭐ Texto secundario
            light: '#999999',     // Texto terciario
          },
          bg: {
            primary: '#FFFFFF',   // Fondo blanco puro
            secondary: '#FAFAFA', // Gris casi blanco (si necesitas alternativa)
            card: '#FFFFFF',      // Cards siempre blancas
          },
        },

        // Alias para compatibilidad con componentes actuales
        secondary: {
          100: '#FAFAFA',
          200: '#D1D7D7',   // Borde
          300: '#D1D7D7',
          400: '#999999',
          500: '#666666',   // Texto secundario
          600: '#333333',   // Texto principal
          700: '#333333',
          800: '#333333',
          900: '#333333',
        },

        // ✨ ACCENT - Mismo que primary para consistencia
        accent: {
          400: '#8CB1B9',
          500: '#8CB1B9',
          600: '#6A9AA5',
        },

        // 🎨 SEMANTIC COLORS
        success: {
          500: '#4CAF50',
          600: '#45A049',
        },
        warning: {
          500: '#FF9800',
          600: '#FB8C00',
        },
        error: {
          500: '#F44336',
          600: '#E53935',
        },
      },

      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },

      borderRadius: {
        'sm': '3px',
        'DEFAULT': '4px',
        'md': '4px',
        'lg': '5px',
        'xl': '5px',  // Máximo permitido
      },

      borderWidth: {
        'DEFAULT': '2px',
        '3': '3px',
      },

      spacing: {
        'section': '40px',  // Espaciado entre secciones
        'card': '40px',     // Padding en cards
        'btn-y': '16px',    // Padding vertical botones
        'btn-x': '45px',    // Padding horizontal botones
      },

      boxShadow: {
        'subtle': '0 2px 8px rgba(140, 177, 185, 0.1)',
        'hover': '0 4px 16px rgba(140, 177, 185, 0.15)',
        'card': '0 1px 3px rgba(140, 177, 185, 0.08)',
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
    },
  },
  plugins: [],
}