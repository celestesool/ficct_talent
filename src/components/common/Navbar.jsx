import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  ChevronDown,
  Code,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  User,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Datos simulados de notificaciones
  const mockNotifications = [
    {
      id: 1,
      title: "Nueva oferta de trabajo",
      company: "Tech Solutions SA",
      type: "Desarrollo Web",
      time: "Hace 2 horas",
      isNew: true
    },
    {
      id: 2,
      title: "Tu perfil fue visto",
      company: "Digital Innovators",
      type: "Recursos Humanos",
      time: "Hace 5 horas",
      isNew: true
    },
    {
      id: 3,
      title: "Oferta de práctica profesional",
      company: "StartUp Labs",
      type: "Frontend Developer",
      time: "Ayer",
      isNew: false
    },
    {
      id: 4,
      title: "Recordatorio: CV pendiente",
      company: "Sistema FICCT",
      type: "Recordatorio",
      time: "Ayer",
      isNew: false
    }
  ];

  const newNotificationsCount = mockNotifications.filter(notification => notification.isNew).length;

  // DETECTAR TIPO DE USUARIO POR LA RUTA ACTUAL
  const currentPath = location.pathname;
  const isEstudiante = currentPath.includes('/estudiante');
  const userType = isEstudiante ? 'estudiante' : 'empresa';

  // Rutas para Estudiante - Agrupadas por categoría (igual que tenías)
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

  // Rutas para Empresa (igual que tenías)
  const empresaRoutes = [
    { path: '/empresa/dashboard', label: 'Dashboard', icon: Home },
    { path: '/empresa/ofertas', label: 'Ofertas', icon: Briefcase },
    { path: '/empresa/candidatos', label: 'Candidatos', icon: Users },
  ];

  const getEstudianteRoutes = () => {
    return estudianteRoutes.flatMap(group => group.routes || []);
  };

  const routes = isEstudiante ? getEstudianteRoutes() : empresaRoutes;

  // REEMPLAZO: Detectar ruta activa con useLocation
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // FUNCIÓN DE NAVEGACIÓN ACTUALIZADA
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationsDropdownOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    // Aquí puedes manejar la acción cuando se hace clic en una notificación
    console.log('Notificación clickeada:', notificationId);
    setIsNotificationsDropdownOpen(false);
    
    // Ejemplo: navegar a una página específica basada en la notificación
    // navigate('/estudiante/ofertas');
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
              onClick={() => handleNavigation(isEstudiante ? '/estudiante/dashboard' : '/empresa/dashboard')}
            />
          </div>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-end mr-8">
            {isEstudiante ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigation('/estudiante/dashboard')}
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
                              onClick={() => handleNavigation(route.path)}
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

                {/* Icono de Notificaciones */}
                <div className="relative z-40">
                  <button
                    onClick={() => setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium relative
                      ${isNotificationsDropdownOpen
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : isDark
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-lg'
                      }
                    `}
                  >
                    <Bell size={17} />
                    {newNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {newNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de Notificaciones */}
                  {isNotificationsDropdownOpen && (
                    <div className={`
                      absolute top-full right-0 mt-2 w-80 rounded-xl shadow-lg border transition-all duration-200 z-50
                      ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                      }
                    `}>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Notificaciones
                          </h3>
                          {newNotificationsCount > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                              {newNotificationsCount} nuevas
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {mockNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification.id)}
                              className={`
                                p-3 rounded-lg cursor-pointer transition-all duration-200 border
                                ${notification.isNew
                                  ? isDark
                                    ? 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30'
                                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                  : isDark
                                    ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                }
                              `}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {notification.title}
                                </h4>
                                {notification.isNew && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {notification.company}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                  {notification.type}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setIsNotificationsDropdownOpen(false)}
                          className={`
                            w-full mt-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium
                            ${isDark
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }
                          `}
                        >
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Navegación simple para empresa 
              <div className="flex items-center gap-2">
                {empresaRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.path}
                      onClick={() => handleNavigation(route.path)}
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
                    {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario'}
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
                        <p className="font-medium text-sm truncate dark:text-slate-400">
                          {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario'}
                        </p>
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
                      onClick={() => handleNavigation('/estudiante/dashboard')}
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

                    {/* Notificaciones en mobile */}
                    <button
                      onClick={() => setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium relative
                        ${isNotificationsDropdownOpen
                          ? 'bg-blue-600 text-white'
                          : isDark
                            ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <Bell size={18} />
                      Notificaciones
                      {newNotificationsCount > 0 && (
                        <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {newNotificationsCount}
                        </span>
                      )}
                    </button>

                    {isNotificationsDropdownOpen && (
                      <div className={`
                        mt-2 rounded-lg border p-3
                        ${isDark
                          ? 'bg-slate-700 border-slate-600'
                          : 'bg-slate-50 border-slate-200'
                        }
                      `}>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {mockNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification.id)}
                              className={`
                                p-2 rounded-lg cursor-pointer transition-all duration-200 border
                                ${notification.isNew
                                  ? isDark
                                    ? 'bg-blue-900/20 border-blue-700/50'
                                    : 'bg-blue-50 border-blue-200'
                                  : isDark
                                    ? 'bg-slate-600 border-slate-500'
                                    : 'bg-white border-slate-200'
                                }
                              `}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {notification.title}
                                </h4>
                                {notification.isNew && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className={`text-xs mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {notification.company}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className={`text-xs px-1 py-0.5 rounded ${isDark ? 'bg-slate-500 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                  {notification.type}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categorías en mobile */}
                    {estudianteRoutes.map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-1">
                        <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          {group.category}
                        </p>
                        {group.routes.map((route) => {
                          const Icon = route.icon;
                          return (
                            <button
                              key={route.path}
                              onClick={() => handleNavigation(route.path)}
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
                        onClick={() => handleNavigation(route.path)}
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