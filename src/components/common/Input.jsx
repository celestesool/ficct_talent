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
          className={`block mb-3 font-semibold ${isDark ? 'text-secondary-300' : 'text-secondary-600'}`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className={isDark ? 'text-secondary-400' : 'text-secondary-500'} size={20} />
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
          autoComplete={autoComplete || name}
          className={`
            w-full px-4 py-4 rounded transition-all duration-300 border-2
            ${Icon ? 'pl-12' : ''}
            ${isDark
              ? 'bg-secondary-800 border-secondary-700 text-secondary-100 placeholder-secondary-400 focus:border-primary-500 focus:bg-secondary-800'
              : 'bg-white border-secondary-200 text-secondary-600 placeholder-secondary-400 focus:border-primary-500 focus:bg-white'
            }
            focus:outline-none focus:ring-4 focus:ring-primary-500/10
            hover:border-secondary-300
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
      </div>
    </div>
  );
};
