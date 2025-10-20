import React, { useState } from 'react';
import { GraduationCap, Building2, User, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage = () => {
  const { navigate, userType } = useRouter();
  const { isDark } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEstudiante = userType === 'estudiante';

  const handleLogin = () => {
    // Simulación de login
    const mockUser = {
      id: '1',
      name: isEstudiante ? 'Juan Pérez' : 'Empresa Tech SA',
      email: email,
      type: userType
    };
    
    login(mockUser);
    navigate(`/${userType}/dashboard`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="absolute top-4 left-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          ← Volver
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`
              w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
              ${isEstudiante 
                ? (isDark ? 'bg-blue-600' : 'bg-blue-100')
                : (isDark ? 'bg-purple-600' : 'bg-purple-100')
              }
            `}>
              {isEstudiante ? (
                <GraduationCap size={32} className={isDark ? 'text-white' : 'text-blue-600'} />
              ) : (
                <Building2 size={32} className={isDark ? 'text-white' : 'text-purple-600'} />
              )}
            </div>
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Iniciar Sesión
            </h2>
            <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isEstudiante ? 'Portal de Estudiantes' : 'Portal de Empresas'}
            </p>
          </div>

          <div>
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              icon={User}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="mb-6">
              <button 
                className={`text-sm ${isEstudiante ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'}`}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button 
              variant={isEstudiante ? 'primary' : 'secondary'} 
              fullWidth
              onClick={handleLogin}
            >
              Ingresar
            </Button>
          </div>

          <div className={`mt-6 text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <p>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate(`/${userType}/registro`)}
                className={`font-semibold ${isEstudiante ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'}`}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};