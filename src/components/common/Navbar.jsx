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
  GraduationCap
} from 'lucide-react';

export const Navbar = () => {
  const { isDark } = useTheme();
  const { navigate, userType, currentRoute } = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isEstudiante = userType === 'estudiante';

  // Rutas para Estudiante
  const estudianteRoutes = [
    { path: '/estudiante/dashboard', label: 'Dashboard', icon: Home },
    { path: '/estudiante/perfil', label: 'Perfil', icon: User },
    { path: '/estudiante/proyectos', label: 'Proyectos', icon: Code },
    { path: '/estudiante/certificaciones', label: 'Certificaciones', icon: Award },
    { path: '/estudiante/habilidades', label: 'Habilidades', icon: BookOpen },
    { path: '/estudiante/academico', label: 'Académico', icon: GraduationCap },
  ];

  // Rutas para Empresa
  const empresaRoutes = [
    { path: '/empresa/dashboard', label: 'Dashboard', icon: Home },
    { path: '/empresa/ofertas', label: 'Ofertas', icon: Briefcase },
    { path: '/empresa/candidatos', label: 'Candidatos', icon: Users },
  ];

  const routes = isEstudiante ? estudianteRoutes : empresaRoutes;

  const isActiveRoute = (path) => {
    return currentRoute === path;
  };

  return (
    <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="FICCT TALENT" 
              className="w-18 h-16 object-contain cursor-pointer transition-transform hover:scale-105" // ✅ Corregido: w-12 h-12
              onClick={() => navigate(isEstudiante ? '/estudiante/dashboard' : '/empresa/dashboard')}
            />
          </div>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium
                    ${isActiveRoute(route.path)
                      ? isEstudiante
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-600 text-white'
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

          {/* Acciones */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <User size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                <span className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {user.name || 'Usuario'}
                </span>
              </div>
            )}
            <ThemeToggle />
            
            {/* Menú Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            <Button variant="outline" onClick={handleLogout} className="hidden sm:flex text-sm py-2">
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                Cerrar Sesión
              </div>
            </Button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3">
            <div className={`rounded-lg p-3 ${
              isDark ? 'bg-slate-700' : 'bg-slate-100'
            }`}>
              <div className="space-y-2">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <button
                      key={route.path}
                      onClick={() => {
                        navigate(route.path);
                        setIsMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm
                        ${isActiveRoute(route.path)
                          ? isEstudiante
                            ? 'bg-blue-600 text-white'
                            : 'bg-purple-600 text-white'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-600'
                          : 'text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {route.label}
                    </button>
                  );
                })}
                
                {/* Botón cerrar sesión en mobile */}
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm
                    ${isDark
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-red-600 hover:bg-red-50'
                    }
                  `}
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};