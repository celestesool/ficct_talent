import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  value, 
  onChange,
  required = false 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className="mb-4">
      {label && (
        <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className={isDark ? 'text-slate-400' : 'text-slate-500'} size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg transition-colors
            ${Icon ? 'pl-12' : ''}
            ${isDark 
              ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' 
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }
            border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20
          `}
        />
      </div>
    </div>
  );
};