export const theme = {
  colors: {
    // 🌊 Celeste profesional principal
    primary: {
      light: '#0EA5E9',    // Sky blue 500 - celeste vibrante pero elegante
      dark: '#38BDF8',     // Sky blue 400 - más suave para modo oscuro
    },
    // 🌫️ Grises sofisticados (secundario)
    secondary: {
      light: '#64748B',    // Slate 500 - gris azulado profesional
      dark: '#94A3B8',     // Slate 400 - gris suave
    },
    // ✨ Acento premium (para CTAs importantes)
    accent: {
      light: '#06B6D4',    // Cyan 500 - celeste/turquesa vibrante
      dark: '#22D3EE',     // Cyan 400 - versión clara
    },
    // 🎯 Color de éxito/confirmación
    success: {
      light: '#10B981',    // Emerald 500
      dark: '#34D399',     // Emerald 400
    },
    // ⚠️ Color de advertencia
    warning: {
      light: '#F59E0B',    // Amber 500
      dark: '#FBBf24',     // Amber 400
    },
    // 🔴 Color de error
    error: {
      light: '#EF4444',    // Red 500
      dark: '#F87171',     // Red 400
    },
    // 🖼️ Fondos
    background: {
      light: '#FFFFFF',    // Blanco puro
      dark: '#0F172A',     // Slate 900 - azul muy oscuro elegante
    },
    // 📄 Superficies (tarjetas, modales)
    surface: {
      light: '#F8FAFC',    // Slate 50 - gris casi blanco
      dark: '#1E293B',     // Slate 800 - gris oscuro azulado
    },
    // Superficie alternativa (para más contraste)
    surfaceAlt: {
      light: '#F1F5F9',    // Slate 100
      dark: '#334155',     // Slate 700
    },
    // 📝 Textos
    text: {
      primary: {
        light: '#0F172A',  // Slate 900 - casi negro azulado
        dark: '#F1F5F9',   // Slate 100 - casi blanco
      },
      secondary: {
        light: '#64748B',  // Slate 500 - gris medio
        dark: '#CBD5E1',   // Slate 300 - gris claro
      },
      tertiary: {
        light: '#94A3B8',  // Slate 400 - gris suave
        dark: '#94A3B8',   // Mismo para oscuro
      },
    },
    // 🔲 Bordes
    border: {
      light: '#E2E8F0',    // Slate 200 - gris muy claro
      dark: '#334155',     // Slate 700 - gris oscuro
    },
    // 🌟 Overlay/Modal backdrop
    overlay: {
      light: 'rgba(15, 23, 42, 0.5)',   // Negro azulado 50%
      dark: 'rgba(0, 0, 0, 0.7)',       // Negro 70%
    },
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    // Sombra especial con tinte celeste para modo claro
    celestial: '0 8px 32px rgba(14, 165, 233, 0.15)',
  },
};