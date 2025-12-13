import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Sistema de Botones con Temas Dinámicos
 * Los colores se adaptan automáticamente al tema seleccionado
 * 
 * VARIANTES:
 * - primary: Sólido con color de botón del tema (rojo en UAGRM)
 * - primary-outline: Outline con color de acento (azul en UAGRM)
 * - secondary: Gris neutro
 * - success/danger: Estados especiales (fijos)
 */

export const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  fullWidth = false,
  disabled = false,
  size = 'md',
  type = 'button'
}) => {
  const { isDark, currentTheme } = useTheme();
  const colors = currentTheme?.colors || {};

  // Colores para botones (usa buttonColor si existe, sino accent)
  const buttonColor = colors.buttonColor || colors.accent || 'var(--color-button)';
  const buttonHover = colors.buttonHover || colors.accentHover || 'var(--color-button-hover)';

  const sizes = {
    sm: 'px-[30px] py-[12px] text-base',
    md: 'px-[45px] py-[16px] text-[1.1rem]',
    lg: 'px-[50px] py-[18px] text-[1.15rem]'
  };

  const baseStyles = `
    font-semibold transition-all duration-300 
    rounded border-2
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] hover:shadow-lg'}
  `;

  // Estilos dinámicos basados en el tema
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        // Botones primarios usan buttonColor (rojo en UAGRM, accent en otros)
        return {
          backgroundColor: buttonColor,
          borderColor: buttonColor,
          color: colors.textOnPrimary || '#FFFFFF',
        };

      case 'primary-outline':
        // Outline usa el color de acento (azul en UAGRM)
        return {
          backgroundColor: 'transparent',
          borderColor: colors.accent || 'var(--color-accent)',
          color: colors.accent || 'var(--color-accent)',
        };

      case 'secondary':
        return {
          backgroundColor: isDark ? '#404040' : '#E5E5E5',
          borderColor: isDark ? '#404040' : '#E5E5E5',
          color: isDark ? '#FFFFFF' : '#333333',
        };

      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border || 'var(--border-color)',
          color: isDark ? '#FFFFFF' : '#333333',
        };

      case 'success':
        return {
          backgroundColor: '#22C55E',
          borderColor: '#22C55E',
          color: '#FFFFFF',
        };

      case 'danger':
        return {
          backgroundColor: '#EF4444',
          borderColor: '#EF4444',
          color: '#FFFFFF',
        };

      default:
        return {
          backgroundColor: buttonColor,
          borderColor: buttonColor,
          color: colors.textOnPrimary || '#FFFFFF',
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Manejar hover con JavaScript
  const handleMouseEnter = (e) => {
    if (disabled) return;

    if (variant === 'primary') {
      e.target.style.backgroundColor = buttonHover;
      e.target.style.borderColor = buttonHover;
    } else if (variant === 'primary-outline') {
      e.target.style.backgroundColor = colors.accent || 'var(--color-accent)';
      e.target.style.color = colors.textOnPrimary || '#FFFFFF';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = buttonColor;
      e.target.style.borderColor = buttonColor;
      e.target.style.color = colors.textOnPrimary || '#FFFFFF';
    } else if (variant === 'outline') {
      e.target.style.borderColor = colors.accent || 'var(--color-accent)';
      e.target.style.backgroundColor = colors.accentLight || 'var(--color-accent-light)';
    } else if (variant === 'success') {
      e.target.style.backgroundColor = '#16A34A';
      e.target.style.borderColor = '#16A34A';
    } else if (variant === 'danger') {
      e.target.style.backgroundColor = '#DC2626';
      e.target.style.borderColor = '#DC2626';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;

    // Restaurar estilos originales
    const originalStyles = getVariantStyles();
    e.target.style.backgroundColor = originalStyles.backgroundColor;
    e.target.style.borderColor = originalStyles.borderColor;
    e.target.style.color = originalStyles.color;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
      style={variantStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};