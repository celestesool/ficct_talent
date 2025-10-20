import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  fullWidth = false,
  disabled = false 
}) => {
  const { isDark } = useTheme();
  
  const baseStyles = `
    px-6 py-3 rounded-lg font-semibold transition-all duration-200 
    transform hover:scale-105 active:scale-95
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;
  
  const variants = {
    primary: isDark
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: isDark
      ? 'bg-purple-600 hover:bg-purple-700 text-white'
      : 'bg-purple-600 hover:bg-purple-700 text-white',
    outline: isDark
      ? 'border-2 border-slate-600 hover:bg-slate-800 text-slate-200'
      : 'border-2 border-slate-300 hover:bg-slate-50 text-slate-700',
    success: isDark
      ? 'bg-green-600 hover:bg-green-700 text-white'
      : 'bg-green-600 hover:bg-green-700 text-white',
    danger: isDark
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-red-600 hover:bg-red-700 text-white',
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