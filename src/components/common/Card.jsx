import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Card = ({ children, className = '', hover = false, onClick }) => {
  const { isDark } = useTheme();
  
  const baseStyles = `
    rounded-xl p-6 transition-all duration-200
    ${hover ? 'transform hover:scale-105 cursor-pointer' : ''}
    ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-md'}
  `;

  return <div onClick={onClick} className={`${baseStyles} ${className}`}>{children}</div>;
};