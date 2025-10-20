import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from '../../contexts/RouterContext';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { GraduationCap, Building2, User, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { isDark } = useTheme();
  const { navigate, userType } = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isEstudiante = userType === 'estudiante';

  return (
    <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${isEstudiante ? 'bg-blue-600' : 'bg-purple-600'}
            `}>
              {isEstudiante ? (
                <GraduationCap size={24} className="text-white" />
              ) : (
                <Building2 size={24} className="text-white" />
              )}
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                UAGRM - Ing. Sistemas
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {isEstudiante ? 'Portal Estudiante' : 'Portal Empresa'}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <User size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {user.name || 'Usuario'}
                </span>
              </div>
            )}
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <div className="flex items-center gap-2">
                <LogOut size={18} />
                Cerrar Sesión
              </div>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};