import React from 'react';
import { GraduationCap, Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from '../contexts/RouterContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const HomePage = () => {
  const { navigate, setUserType } = useRouter();
  const { isDark } = useTheme();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    navigate(`/${type}/login`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Logo y Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`
              w-24 h-24 rounded-2xl flex items-center justify-center
              ${isDark ? 'bg-blue-600' : 'bg-blue-600 shadow-xl'}
            `}>
              <GraduationCap size={48} className="text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            UAGRM - Ingeniería en Sistemas
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Conectando talento con oportunidades
          </p>
        </div>

        {/* Cards de selección */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card Estudiante */}
          <Card hover onClick={() => handleUserTypeSelect('estudiante')}>
            <div className="text-center">
              <div className={`
                w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                ${isDark ? 'bg-blue-600' : 'bg-blue-100'}
              `}>
                <GraduationCap size={40} className={isDark ? 'text-white' : 'text-blue-600'} />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Soy Estudiante
              </h2>
              <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Crea tu perfil, muestra tus proyectos y conecta con empresas
              </p>
              <Button variant="primary" fullWidth>
                Ingresar como Estudiante
              </Button>
            </div>
          </Card>

          {/* Card Empresa */}
          <Card hover onClick={() => handleUserTypeSelect('empresa')}>
            <div className="text-center">
              <div className={`
                w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                ${isDark ? 'bg-purple-600' : 'bg-purple-100'}
              `}>
                <Building2 size={40} className={isDark ? 'text-white' : 'text-purple-600'} />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Soy Empresa
              </h2>
              <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Encuentra talento joven y publica ofertas de pasantías
              </p>
              <Button variant="secondary" fullWidth>
                Ingresar como Empresa
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};