import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`
        p-3 rounded-xl transition-all duration-300 hover:scale-110 border-2
        ${isDark 
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:border-slate-600' 
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
        }
        shadow-lg hover:shadow-xl
      `}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};