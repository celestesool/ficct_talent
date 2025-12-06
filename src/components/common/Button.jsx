import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Sistema de Botones Profesional - Paleta Turquesa
 * 
 * VARIANTES:
 * - primary: Sólido turquesa (#8CB1B9) - Para acciones principales o sin jerarquía (opción 1)
 * - primary-outline: Outline turquesa - Para sin jerarquía (opción 2, MISMA importancia que primary)
 * - secondary: Gris (#D1D7D7) - Solo cuando SÍ hay jerarquía (acción menos importante)
 * - success/danger: Estados especiales
 * 
 * REGLA: Si "Estudiantes" y "Empresas" tienen la misma importancia,
 * usar primary + primary-outline. NO usar secondary.
 */

export const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  fullWidth = false,
  disabled = false,
  size = 'md'
}) => {
  const { isDark } = useTheme();

  const sizes = {
    sm: 'px-[30px] py-[12px] text-base',
    md: 'px-[45px] py-[16px] text-[1.1rem]',  // Estándar según specs
    lg: 'px-[50px] py-[18px] text-[1.15rem]'
  };

  const baseStyles = `
    font-semibold transition-all duration-300 
    rounded
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variants = {
    // 🌊 PRIMARY SÓLIDO - Turquesa (#8CB1B9)
    // Para acciones principales o sin jerarquía (opción 1 de 2)
    primary: isDark
      ? 'bg-primary-500 border-2 border-primary-500 hover:bg-primary-600 hover:border-primary-600 text-white'
      : 'bg-primary-500 border-2 border-primary-500 hover:bg-primary-600 hover:border-primary-600 text-white',

    // 🔲 PRIMARY OUTLINE - Turquesa borde
    // Para sin jerarquía (opción 2 de 2) - MISMA importancia que primary sólido
    'primary-outline': isDark
      ? 'bg-transparent border-2 border-primary-500 hover:bg-primary-500 hover:border-primary-500 text-primary-500 hover:text-white'
      : 'bg-transparent border-2 border-primary-500 hover:bg-primary-500 hover:border-primary-500 text-primary-500 hover:text-white',

    // 🌫️ SECONDARY - Gris (#D1D7D7)
    // Solo cuando SÍ hay jerarquía (acción menos importante)
    secondary: isDark
      ? 'bg-secondary-200 border-2 border-secondary-200 hover:bg-primary-500 hover:border-primary-500 text-secondary-600 hover:text-white'
      : 'bg-secondary-200 border-2 border-secondary-200 hover:bg-primary-500 hover:border-primary-500 text-secondary-600 hover:text-white',

    // 🔲 OUTLINE NEUTRO - Borde gris
    outline: isDark
      ? 'bg-transparent border-2 border-secondary-200 hover:border-primary-500 hover:bg-primary-50 text-secondary-600'
      : 'bg-transparent border-2 border-secondary-200 hover:border-primary-500 hover:bg-primary-50 text-secondary-600',

    // 🟢 SUCCESS
    success: 'bg-success-500 border-2 border-success-500 hover:bg-success-600 hover:border-success-600 text-white',

    // 🔴 DANGER
    danger: 'bg-error-500 border-2 border-error-500 hover:bg-error-600 hover:border-error-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};