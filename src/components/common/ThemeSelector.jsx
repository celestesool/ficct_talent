import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeSelector = () => {
    const { colorTheme, changeColorTheme, availableThemes, isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const currentTheme = availableThemes.find(t => t.id === colorTheme);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón del selector */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${isDark
                        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                    }
        `}
                title="Cambiar paleta de colores"
            >
                <Palette size={20} />
                <span className="hidden sm:inline text-sm font-medium">
                    {currentTheme?.icon}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown de temas */}
            {isOpen && (
                <div className={`
          absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border overflow-hidden z-50
          ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }
        `}>
                    {/* Header */}
                    <div className={`
            px-4 py-3 border-b
            ${isDark ? 'border-slate-700' : 'border-slate-200'}
          `}>
                        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Paleta de Colores
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Elige el estilo visual de la plataforma
                        </p>
                    </div>

                    {/* Lista de temas */}
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {availableThemes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    changeColorTheme(theme.id);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${colorTheme === theme.id
                                        ? 'bg-[var(--color-accent)] bg-opacity-10 border-2 border-[var(--color-accent)]'
                                        : isDark
                                            ? 'hover:bg-slate-700'
                                            : 'hover:bg-slate-100'
                                    }
                `}
                            >
                                {/* Preview de colores */}
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: theme.colors.primary }}
                                        title="Color primario"
                                    />
                                    <div
                                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm -ml-2"
                                        style={{ backgroundColor: theme.colors.accent }}
                                        title="Color de acento"
                                    />
                                </div>

                                {/* Info del tema */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{theme.icon}</span>
                                        <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {theme.name}
                                        </span>
                                    </div>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {theme.description}
                                    </p>
                                </div>

                                {/* Indicador de selección */}
                                {colorTheme === theme.id && (
                                    <div
                                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: theme.colors.accent }}
                                    >
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Footer con info */}
                    <div className={`
            px-4 py-3 border-t text-center
            ${isDark ? 'border-slate-700' : 'border-slate-200'}
          `}>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Los colores se aplican a toda la plataforma
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
