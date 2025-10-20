import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Card = ({ children, className = '', hover = false, onClick }) => {
  const { isDark } = useTheme();
  
  const baseStyles = `
    rounded-2xl p-8 transition-all duration-300 border
    ${hover ? 'cursor-pointer hover:translate-y-[-4px] hover:shadow-xl' : ''}
    ${isDark 
      ? 'bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-xl' 
      : 'bg-white/80 border-slate-200 backdrop-blur-sm shadow-lg'
    }
  `;

  return <div onClick={onClick} className={`${baseStyles} ${className}`}>{children}</div>;
};