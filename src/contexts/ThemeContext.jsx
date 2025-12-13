import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLOR_THEMES, DEFAULT_THEME, getTheme, applyThemeToCSS } from '../config/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Estado para modo oscuro/claro
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // Estado para la paleta de colores
  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('colorTheme');
    return saved || DEFAULT_THEME;
  });

  // Obtener el tema actual completo
  const currentTheme = getTheme(colorTheme);

  // Efecto para aplicar modo oscuro/claro
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Efecto para aplicar la paleta de colores
  useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
    applyThemeToCSS(currentTheme);

    // Agregar clase con el nombre del tema para estilos específicos
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme, currentTheme]);

  // Función para cambiar modo oscuro/claro
  const toggleTheme = () => setIsDark(!isDark);

  // Función para cambiar paleta de colores
  const changeColorTheme = (themeId) => {
    if (COLOR_THEMES[themeId]) {
      setColorTheme(themeId);
    }
  };

  // Lista de temas disponibles
  const availableThemes = Object.values(COLOR_THEMES);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      colorTheme,
      changeColorTheme,
      currentTheme,
      availableThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
