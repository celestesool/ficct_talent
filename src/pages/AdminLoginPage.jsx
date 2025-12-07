import { Lock, AlertCircle, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.post('/auth/admin/login', formData);
      
      if (response.data && response.data.access_token) {
        // Guardar token y usuario
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token || '');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess(true);
        
        // Redirigir al dashboard admin después de 1.5 segundos
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      setError(errorMsg);
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
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
            <div className={`flex items-center justify-center gap-3 mb-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              <Lock size={40} />
              <h1 className="text-2xl font-bold">Admin</h1>
            </div>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Panel de administración seguro
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
              <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                Login exitoso. Redirigiendo...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email administrativo"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Iniciar Sesión Admin
                </>
              )}
            </Button>
          </form>

          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              🔒 <strong>Información importante:</strong> Este panel es solo para administradores autorizados. 
              Solo los usuarios registrados en la tabla de administradores pueden acceder.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
