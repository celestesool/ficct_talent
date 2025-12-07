import { Building2, GraduationCap, Lock, User, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserType } from '../contexts/userTypeContext.jsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const { isDark } = useTheme();
  const { login } = useAuth();
  const { setUserType } = useUserType();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminClicks, setAdminClicks] = useState(0);

  const isEstudiante = userType === 'estudiante';

  // Establecer userType global cuando el componente se monta
  React.useEffect(() => {
    if (userType) {
      setUserType(userType);
    }
  }, [userType, setUserType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData, userType);

      if (!response || !response.user) throw new Error('Error de autenticación.');

      navigate(`/${userType}/dashboard`);
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // 🔐 Trigger secreto: 3 clics en el logo para ir a admin login
  const handleLogoClick = () => {
    const newClicks = adminClicks + 1;
    setAdminClicks(newClicks);

    if (newClicks === 3) {
      navigate('/admin-login');
      setAdminClicks(0);
    }

    // Reset después de 5 segundos
    setTimeout(() => setAdminClicks(0), 5000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-white to-white'
      }`}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="absolute top-4 left-4">
        <Button variant="outline" onClick={handleGoBack}>
          ← Volver
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              onClick={handleLogoClick}
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
                isEstudiante
                  ? isDark
                    ? 'bg-primary-600'
                    : 'bg-primary-100'
                  : isDark
                  ? 'bg-primary-600'
                  : 'bg-primary-100'
              }`}
              title={adminClicks > 0 ? `${3 - adminClicks} clics para admin` : 'Panel de login'}
            >
              {isEstudiante ? (
                <GraduationCap
                  size={32}
                  className={isDark ? 'text-white' : 'text-primary-500'}
                />
              ) : (
                <Building2
                  size={32}
                  className={isDark ? 'text-white' : 'text-primary-500'}
                />
              )}
            </div>
            <h2
              className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Iniciar Sesión
            </h2>
            <p
              className={`mt-2 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {isEstudiante ? 'Portal de Estudiantes' : 'Portal de Empresas'}
            </p>
          </div>

          {error && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-red-900/50 text-red-200'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="on">
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              icon={User}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="username"
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="current-password"
            />

            <div className="mb-6">
              <button
                type="button"
                className={`text-sm ${
                  isEstudiante
                    ? 'text-primary-500 hover:text-primary-600'
                    : 'text-primary-500 hover:text-primary-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              variant={isEstudiante ? 'primary' : 'secondary'}
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </Button>
          </form>

          <div
            className={`mt-6 text-center ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <p>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate(`/${userType}/registro`)}
                className={`font-semibold ${
                  isEstudiante
                    ? 'text-primary-500 hover:text-primary-600'
                    : 'text-primary-500 hover:text-primary-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
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
