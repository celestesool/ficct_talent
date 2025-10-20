import React, { useState } from 'react';
import { GraduationCap, Building2, User, Mail, Lock, Phone, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const RegistroPage = () => {
  const { navigate, userType } = useRouter();
  const { isDark } = useTheme();
  const { login } = useAuth();

  const isEstudiante = userType === 'estudiante';

  // Estados para Estudiante
  const [estudianteData, setEstudianteData] = useState({
    ci: '',
    registration_number: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  // Estados para Empresa
  const [empresaData, setEmpresaData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const handleEstudianteChange = (field, value) => {
    setEstudianteData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmpresaChange = (field, value) => {
    setEmpresaData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = isEstudiante ? estudianteData : empresaData;
    
    // Validación básica
    if (data.password !== data.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Simulación de registro
    const mockUser = {
      id: '1',
      name: isEstudiante ? `${estudianteData.first_name} ${estudianteData.last_name}` : empresaData.name,
      email: data.email,
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
        <Button variant="outline" onClick={() => navigate(`/${userType}/login`)}>
          ← Volver
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
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
              Crear Cuenta
            </h2>
            <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isEstudiante ? 'Registro de Estudiante' : 'Registro de Empresa'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isEstudiante ? (
              // Formulario Estudiante
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Cédula de Identidad (CI)"
                    type="number"
                    placeholder="12345678"
                    value={estudianteData.ci}
                    onChange={(e) => handleEstudianteChange('ci', e.target.value)}
                    required
                  />
                  
                  <Input
                    label="Registro Universitario"
                    type="text"
                    placeholder="2021000000"
                    value={estudianteData.registration_number}
                    onChange={(e) => handleEstudianteChange('registration_number', e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nombres"
                    type="text"
                    placeholder="Juan Carlos"
                    icon={User}
                    value={estudianteData.first_name}
                    onChange={(e) => handleEstudianteChange('first_name', e.target.value)}
                    required
                  />
                  
                  <Input
                    label="Apellidos"
                    type="text"
                    placeholder="Pérez García"
                    value={estudianteData.last_name}
                    onChange={(e)=> handleEstudianteChange('last_name', e.target.value)}required/></div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Teléfono"
                type="tel"
                placeholder="70123456"
                icon={Phone}
                value={estudianteData.phone_number}
                onChange={(e) => handleEstudianteChange('phone_number', e.target.value)}
                required
              />
              
              <Input
                label="Fecha de Nacimiento"
                type="date"
                icon={Calendar}
                value={estudianteData.birthDate}
                onChange={(e) => handleEstudianteChange('birthDate', e.target.value)}
                required
              />
            </div>

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="estudiante@uagrm.edu.bo"
              icon={Mail}
              value={estudianteData.email}
              onChange={(e) => handleEstudianteChange('email', e.target.value)}
              required
            />

            <div className="mb-4">
              <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Biografía breve <span className="text-slate-400">(opcional)</span>
              </label>
              <textarea
                placeholder="Cuéntanos un poco sobre ti..."
                value={estudianteData.bio}
                onChange={(e) => handleEstudianteChange('bio', e.target.value)}
                rows="3"
                className={`
                  w-full px-4 py-3 rounded-lg transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${isDark 
                    ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }
                `}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={estudianteData.password}
                onChange={(e) => handleEstudianteChange('password', e.target.value)}
                required
              />
              
              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={estudianteData.confirmPassword}
                onChange={(e) => handleEstudianteChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          // Formulario Empresa
          <>
            <Input
              label="Nombre de la Empresa"
              type="text"
              placeholder="Tech Solutions SA"
              icon={Building2}
              value={empresaData.name}
              onChange={(e) => handleEmpresaChange('name', e.target.value)}
              required
            />

            <div className="mb-4">
              <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Descripción de la Empresa <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe tu empresa y lo que hace..."
                value={empresaData.description}
                onChange={(e) => handleEmpresaChange('description', e.target.value)}
                rows="4"
                required
                className={`
                  w-full px-4 py-3 rounded-lg transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  ${isDark 
                    ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-purple-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                  }
                `}
              />
            </div>

            <Input
              label="Sitio Web"
              type="url"
              placeholder="https://www.tuempresa.com"
              value={empresaData.website}
              onChange={(e) => handleEmpresaChange('website', e.target.value)}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Correo Empresarial"
                type="email"
                placeholder="contacto@empresa.com"
                icon={Mail}
                value={empresaData.email}
                onChange={(e) => handleEmpresaChange('email', e.target.value)}
                required
              />
              
              <Input
                label="Teléfono"
                type="tel"
                placeholder="3-123456"
                icon={Phone}
                value={empresaData.phone_number}
                onChange={(e) => handleEmpresaChange('phone_number', e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={empresaData.password}
                onChange={(e) => handleEmpresaChange('password', e.target.value)}
                required
              />
              
              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={empresaData.confirmPassword}
                onChange={(e) => handleEmpresaChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" required className="mt-1" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Acepto los{' '}
              <a href="#" className={isEstudiante ? 'text-blue-600 hover:underline' : 'text-purple-600 hover:underline'}>
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a href="#" className={isEstudiante ? 'text-blue-600 hover:underline' : 'text-purple-600 hover:underline'}>
                política de privacidad
              </a>
            </span>
          </label>
        </div>

        <Button 
          variant={isEstudiante ? 'primary' : 'secondary'} 
          fullWidth
          type="submit"
        >
          Crear Cuenta
        </Button>
      </form>

      <div className={`mt-6 text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        <p>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigate(`/${userType}/login`)}
            className={`font-semibold ${isEstudiante ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'}`}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </Card>
  </div>
</div>
    
    );
};
