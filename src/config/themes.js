// Sistema de Paletas de Colores Combinadas - FICCT Talent
// Cada tema define: primary (headers/nav), accent (botones), y fondos

export const COLOR_THEMES = {
    // Tema Celeste (El actual)
    celeste: {
        id: 'celeste',
        name: 'Celeste Profesional',
        icon: '🌊',
        description: 'Tonos turquesa suaves y profesionales',
        colors: {
            // Header/Navbar
            primary: '#8CB1B9',
            primaryHover: '#6A9AA5',
            primaryDark: '#4F7B87',

            // Botones y acentos
            accent: '#8CB1B9',
            accentHover: '#6A9AA5',
            accentLight: '#E1EFF1',

            // Fondos
            bgPrimary: '#FFFFFF',
            bgSecondary: '#F0F7F8',
            bgCard: '#FFFFFF',

            // Textos
            textPrimary: '#333333',
            textSecondary: '#666666',
            textLight: '#999999',
            textOnPrimary: '#FFFFFF',

            // Bordes
            border: '#D1D7D7',
            borderLight: '#E1EFF1',

            // Gradientes
            gradient: 'linear-gradient(135deg, #8CB1B9 0%, #6A9AA5 100%)',
            gradientHero: 'linear-gradient(135deg, rgba(140, 177, 185, 0.95), rgba(106, 154, 165, 0.9))',
        }
    },

    // Tema UAGRM Style - Azul + Rojo + Blanco (como la universidad)
    uagrm: {
        id: 'uagrm',
        name: 'Institucional UAGRM',
        icon: '🎓',
        description: 'Azul oscuro, rojo y blanco institucional',
        colors: {
            // Header/Navbar - Azul oscuro
            primary: '#1a365d',
            primaryHover: '#2c5282',
            primaryDark: '#0f2942',

            // Color de UI general (iconos, badges, bordes activos) - Azul
            accent: '#2c5282',
            accentHover: '#1a365d',
            accentLight: '#EBF4FF',

            // Color para botones de acción - Rojo
            buttonColor: '#c53030',
            buttonHover: '#9b2c2c',

            // Fondos - Blanco
            bgPrimary: '#FFFFFF',
            bgSecondary: '#F7FAFC',
            bgCard: '#FFFFFF',

            // Textos
            textPrimary: '#1a202c',
            textSecondary: '#4a5568',
            textLight: '#718096',
            textOnPrimary: '#FFFFFF',

            // Bordes
            border: '#E2E8F0',
            borderLight: '#EDF2F7',

            // Gradientes - Azul
            gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
            gradientHero: 'linear-gradient(135deg, rgba(26, 54, 93, 0.95), rgba(44, 82, 130, 0.9))',
        }
    },

    // Tema Monocromático - Blanco y Negro elegante
    mono: {
        id: 'mono',
        name: 'Blanco y Negro',
        icon: '⚫',
        description: 'Elegante diseño monocromático',
        colors: {
            // Header/Navbar - Negro
            primary: '#1a1a1a',
            primaryHover: '#333333',
            primaryDark: '#000000',

            // Botones y acentos - Gris oscuro
            accent: '#404040',
            accentHover: '#262626',
            accentLight: '#E5E5E5',

            // Fondos - Blanco
            bgPrimary: '#FFFFFF',
            bgSecondary: '#FAFAFA',
            bgCard: '#FFFFFF',

            // Textos
            textPrimary: '#1a1a1a',
            textSecondary: '#525252',
            textLight: '#737373',
            textOnPrimary: '#FFFFFF',

            // Bordes
            border: '#D4D4D4',
            borderLight: '#E5E5E5',

            // Gradientes
            gradient: 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)',
            gradientHero: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(64, 64, 64, 0.9))',
        }
    },

    // Tema Cielo - Tonos celestiales suaves
    cielo: {
        id: 'cielo',
        name: 'Cielo Claro',
        icon: '☁️',
        description: 'Tonos azul cielo claros y frescos',
        colors: {
            // Header/Navbar - Azul cielo
            primary: '#0EA5E9',
            primaryHover: '#0284C7',
            primaryDark: '#0369A1',

            // Botones y acentos - Azul más vibrante
            accent: '#0EA5E9',
            accentHover: '#0284C7',
            accentLight: '#E0F2FE',

            // Fondos
            bgPrimary: '#FFFFFF',
            bgSecondary: '#F0F9FF',
            bgCard: '#FFFFFF',

            // Textos
            textPrimary: '#0C4A6E',
            textSecondary: '#0369A1',
            textLight: '#7DD3FC',
            textOnPrimary: '#FFFFFF',

            // Bordes
            border: '#BAE6FD',
            borderLight: '#E0F2FE',

            // Gradientes
            gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
            gradientHero: 'linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(2, 132, 199, 0.9))',
        }
    },

    // Tema Esmeralda - Verde profesional
    esmeralda: {
        id: 'esmeralda',
        name: 'Esmeralda',
        icon: '💎',
        description: 'Verde esmeralda elegante',
        colors: {
            // Header/Navbar
            primary: '#047857',
            primaryHover: '#065F46',
            primaryDark: '#064E3B',

            // Botones y acentos
            accent: '#10B981',
            accentHover: '#059669',
            accentLight: '#D1FAE5',

            // Fondos
            bgPrimary: '#FFFFFF',
            bgSecondary: '#ECFDF5',
            bgCard: '#FFFFFF',

            // Textos
            textPrimary: '#064E3B',
            textSecondary: '#047857',
            textLight: '#6EE7B7',
            textOnPrimary: '#FFFFFF',

            // Bordes
            border: '#A7F3D0',
            borderLight: '#D1FAE5',

            // Gradientes
            gradient: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
            gradientHero: 'linear-gradient(135deg, rgba(4, 120, 87, 0.95), rgba(6, 95, 70, 0.9))',
        }
    },

    // Tema Violeta - Morado elegante
    violeta: {
        id: 'violeta',
        name: 'Violeta Real',
        icon: '👑',
        description: 'Morado elegante y sofisticado',
        colors: {
            // Header/Navbar
            primary: '#7C3AED',
            primaryHover: '#6D28D9',
            primaryDark: '#5B21B6',

            // Botones y acentos
            accent: '#8B5CF6',
            accentHover: '#7C3AED',
            accentLight: '#EDE9FE',

            // Fondos
            bgPrimary: '#FFFFFF',
            bgSecondary: '#F5F3FF',
            bgCard: '#FFFFFF',

            // Textos
            textPrimary: '#4C1D95',
            textSecondary: '#6D28D9',
            textLight: '#C4B5FD',
            textOnPrimary: '#FFFFFF',

            // Bordes
            border: '#DDD6FE',
            borderLight: '#EDE9FE',

            // Gradientes
            gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            gradientHero: 'linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(109, 40, 217, 0.9))',
        }
    },
};

// Tema por defecto
export const DEFAULT_THEME = 'celeste';

// Función para obtener un tema por ID
export const getTheme = (themeId) => {
    return COLOR_THEMES[themeId] || COLOR_THEMES[DEFAULT_THEME];
};

// Lista de temas disponibles para el selector
export const getAvailableThemes = () => {
    return Object.values(COLOR_THEMES);
};

// Función para aplicar las variables CSS del tema
export const applyThemeToCSS = (theme) => {
    const root = document.documentElement;
    const colors = theme.colors;

    // Aplicar cada color como variable CSS
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);

    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-hover', colors.accentHover);
    root.style.setProperty('--color-accent-light', colors.accentLight);

    // Color para botones (usa buttonColor si existe, sino accent)
    root.style.setProperty('--color-button', colors.buttonColor || colors.accent);
    root.style.setProperty('--color-button-hover', colors.buttonHover || colors.accentHover);

    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-secondary', colors.bgSecondary);
    root.style.setProperty('--bg-card', colors.bgCard);

    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-light', colors.textLight);
    root.style.setProperty('--text-on-primary', colors.textOnPrimary);

    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--border-light', colors.borderLight);

    root.style.setProperty('--gradient-primary', colors.gradient);
    root.style.setProperty('--gradient-hero', colors.gradientHero);
};
