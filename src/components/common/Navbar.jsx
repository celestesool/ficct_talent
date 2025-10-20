import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from '../../contexts/RouterContext';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { 
  User, 
  LogOut, 
  Menu,
  X,
  Home,
  Briefcase,
  Award,
  Code,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { isDark } = useTheme();
  const { navigate, userType, currentRoute } = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isEstudiante = userType === 'estudiante';

  // Rutas para Estudiante - Agrupadas por categoría
  const estudianteRoutes = [
    { 
      category: 'Principal',
      routes: [
        { path: '/estudiante/perfil', label: 'Perfil', icon: User },
        { path: '/estudiante/dashboard', label: 'Inicio', icon: Home },
      ]
    },
    { 
      category: 'Portafolio',
      routes: [
        { path: '/estudiante/proyectos', label: 'Proyectos', icon: Code },
        { path: '/estudiante/certificaciones', label: 'Certificaciones', icon: Award },
        { path: '/estudiante/habilidades', label: 'Habilidades', icon: BookOpen },
      ]
    },
    { 
      category: 'Académico',
      routes: [
        { path: '/estudiante/academico', label: 'Académico', icon: GraduationCap },
        { path: '/estudiante/cv-generator', label: 'Generar CV', icon: FileText },
      ]
    }
  ];

  // Rutas para Empresa
  const empresaRoutes = [
    { path: '/empresa/dashboard', label: 'Dashboard', icon: Home },
    { path: '/empresa/ofertas', label: 'Ofertas', icon: Briefcase },
    { path: '/empresa/candidatos', label: 'Candidatos', icon: Users },
  ];

  const getEstudianteRoutes = () => {
    return estudianteRoutes.flatMap(group => group.routes || []);
  };

  const routes = isEstudiante ? getEstudianteRoutes() : empresaRoutes;

  const isActiveRoute = (path) => {
    return currentRoute === path;
  };

  return (
    <nav className={`${isDark 
      ? 'bg-slate-900/95 backdrop-blur-md border-slate-700' 
      : 'bg-white/95 backdrop-blur-md border-slate-200'} border-b shadow-sm relative z-50`}>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="FICCT TALENT" 
              className="w-18 h-16 object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate(isEstudiante ? '/estudiante/dashboard' : '/empresa/dashboard')}
            />
          </div>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-end mr-8">
            {isEstudiante ? (
            
              <div className="flex items-center gap-2">
                
                <button
                  onClick={() => navigate('/estudiante/dashboard')}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium
                    ${isActiveRoute('/estudiante/dashboard')
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-lg'
                    }
                  `}
                >
                  <Home size={17} />
                  Dashboard
                </button>

                {/* Categorías con dropdown */}
                {estudianteRoutes.map((group, groupIndex) => (
                  <div key={groupIndex} className="relative group z-40">
                    <button className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
                      ${isDark 
                        ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}>
                      <span>{group.category}</span>
                      <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                    </button>
                    
                    {/* Dropdown de categoría */}
                    <div className={`
                      absolute top-full right-0 mt-2 w-56 rounded-xl shadow-lg border transition-all duration-200 z-50
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2
                      ${isDark 
                        ? 'bg-slate-800 border-slate-700' 
                        : 'bg-white border-slate-200'
                      }
                    `}>
                      <div className="p-2 space-y-1">
                        {group.routes.map((route) => {
                          const Icon = route.icon;
                          return (
                            <button
                              key={route.path}
                              onClick={() => navigate(route.path)}
                              className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium
                                ${isActiveRoute(route.path)
                                  ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                                  : isDark
                                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }
                              `}
                            >
                              <Icon size={18} />
                              {route.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Navegación simple para empresa 
              <div className="flex items-center gap-2">
                {empresaRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.path}
                      onClick={() => navigate(route.path)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium
                        ${isActiveRoute(route.path)
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-lg'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {route.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Perfil de usuario con dropdown */}
            {user && (
              <div className="relative z-50">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                    ${isDark 
                      ? 'hover:bg-slate-800 text-slate-300' 
                      : 'hover:bg-slate-100 text-slate-600'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isEstudiante 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-500 text-white'
                    }
                  `}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:block font-medium text-sm max-w-24 truncate">
                    {user.name || 'Usuario'}
                  </span>
                  <ChevronDown size={16} className={isProfileDropdownOpen ? 'rotate-180' : ''} />
                </button>

                {/* Dropdown del perfil */}
                {isProfileDropdownOpen && (
                  <div className={`
                    absolute top-full right-0 mt-2 w-48 rounded-xl shadow-lg border transition-all duration-200 z-50
                    ${isDark 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-slate-200'
                    }
                  `}>
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                        <p className="font-medium text-sm truncate">{user.name || 'Usuario'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isEstudiante ? 'Estudiante' : 'Empresa'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium
                          ${isDark
                            ? 'text-red-400 hover:bg-red-900/20'
                            : 'text-red-600 hover:bg-red-50'
                          }
                        `}
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Menú Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`
                  p-2.5 rounded-lg transition-all duration-200
                  ${isDark 
                    ? 'hover:bg-slate-800 text-slate-300' 
                    : 'hover:bg-slate-100 text-slate-600'
                  }
                `}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* MENÚ MOBILE */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 pb-3 z-50">
            <div className={`
              rounded-xl shadow-lg border transition-all duration-200
              ${isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
              }
            `}>
              <div className="p-3 space-y-1">
                {isEstudiante ? (
                 
                  <>
                    {/* Botón Dashboard en mobile */}
                    <button
                      onClick={() => {
                        navigate('/estudiante/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium
                        ${isActiveRoute('/estudiante/dashboard')
                          ? 'bg-blue-600 text-white'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <Home size={18} />
                      Dashboard
                    </button>

                    {/* Categorías en mobile */}
                    {estudianteRoutes.map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-1">
                        <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {group.category}
                        </p>
                        {group.routes.map((route) => {
                          const Icon = route.icon;
                          return (
                            <button
                              key={route.path}
                              onClick={() => {
                                navigate(route.path);
                                setIsMenuOpen(false);
                              }}
                              className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium
                                ${isActiveRoute(route.path)
                                  ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                                  : isDark
                                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }
                              `}
                            >
                              <Icon size={18} />
                              {route.label}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </>
                ) : (
                  // Menú mobile simple para empresa
                  empresaRoutes.map((route) => {
                    const Icon = route.icon;
                    return (
                      <button
                        key={route.path}
                        onClick={() => {
                          navigate(route.path);
                          setIsMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium
                          ${isActiveRoute(route.path)
                            ? 'bg-purple-600 text-white'
                            : isDark
                            ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }
                        `}
                      >
                        <Icon size={18} />
                        {route.label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};