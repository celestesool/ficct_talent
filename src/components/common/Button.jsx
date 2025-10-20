import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

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
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const baseStyles = `
    font-semibold transition-all duration-300 
    rounded-xl border-2
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-2px] hover:shadow-lg'}
  `;
  
  const variants = {
    primary: isDark
      ? 'bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white shadow-lg shadow-blue-600/25'
      : 'bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white shadow-lg shadow-blue-600/25',
    secondary: isDark
      ? 'bg-purple-600 border-purple-600 hover:bg-purple-700 hover:border-purple-700 text-white shadow-lg shadow-purple-600/25'
      : 'bg-purple-600 border-purple-600 hover:bg-purple-700 hover:border-purple-700 text-white shadow-lg shadow-purple-600/25',
    outline: isDark
      ? 'border-slate-600 hover:border-blue-500 hover:bg-blue-600/10 text-slate-200'
      : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700',
    success: isDark
      ? 'bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 text-white shadow-lg shadow-emerald-600/25'
      : 'bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 text-white shadow-lg shadow-emerald-600/25',
    danger: isDark
      ? 'bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700 text-white shadow-lg shadow-rose-600/25'
      : 'bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700 text-white shadow-lg shadow-rose-600/25',
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