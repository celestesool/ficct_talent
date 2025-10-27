import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete, 
}) => {
  const { isDark } = useTheme();

  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={name}
          className={`block mb-3 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className={isDark ? 'text-slate-400' : 'text-slate-500'} size={20} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete || name} // habilita autocompletado
          className={`
            w-full px-4 py-4 rounded-xl transition-all duration-300 border-2
            ${Icon ? 'pl-12' : ''}
            ${isDark
              ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:bg-slate-700'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            }
            focus:outline-none focus:ring-4 focus:ring-blue-500/20
            hover:border-slate-400
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
      </div>
    </div>
  );
};
