import { ArrowRight, Building2, Check, GraduationCap, Rocket, Star, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useUserType } from '../contexts/UserTypeContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { setUserType } = useUserType(); // ⭐ Para mantener el userType
  const { isDark } = useTheme();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    // ⭐⭐ REEMPLAZO: navigate en lugar de la navegación anterior
    navigate(`/${type}/login`);
  };

  const features = [
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Más de 5,000 estudiantes y 200 empresas conectadas'
    },
    {
      icon: Rocket,
      title: 'Oportunidades Reales',
      description: 'Pasantías, empleos y proyectos con empresas líderes'
    },
    {
      icon: Target,
      title: 'Match Perfecto',
      description: 'Algoritmo inteligente que conecta talento con oportunidades'
    },
    {
      icon: Star,
      title: 'Desarrollo Profesional',
      description: 'Herramientas para potenciar tu carrera desde la universidad'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Estudiantes' },
    { number: '200+', label: 'Empresas' },
    { number: '1,200+', label: 'Oportunidades' },
    { number: '95%', label: 'Tasa de Match' }
  ];

  const estudianteFeatures = [
    'Crea tu portafolio digital',
    'Gestiona proyectos y certificaciones',
    'Genera CV profesional con IA',
    'Conecta con empresas líderes'
  ];

  const empresaFeatures = [
    'Acceso a talento calificado',
    'Publica ofertas ilimitadas',
    'Sistema de match inteligente',
    'Gestión de candidatos eficiente'
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>

      {/* Header con navegación - MEJORADO */}
      <header className="relative border-b" style={{
        borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src="/images/logo.png"
                alt="FICCT TALENT"
                className="w-18 h-14 object-contain cursor-pointer"
                onClick={() => navigate('/')} // ⭐⭐ Agregado navegación al logo
              />
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  UAGRM
                </h1>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section - MEJORADO */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="space-y-6">
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  Plataforma Oficial FICCT - UAGRM
                </span>
                <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Conectamos{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Talento
                  </span>
                  {' '}con{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Oportunidades
                  </span>
                </h1>
                <p className={`text-lg lg:text-xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  La plataforma oficial de la Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones
                  para conectar estudiantes con las mejores oportunidades laborales.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className={`text-center p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
                    <div className={`text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                      {stat.number}
                    </div>
                    <div className={`text-xs lg:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards de selección - REDISEÑADAS Y MEJORADAS */}
            <div className="space-y-6">
              {/* Card Estudiante - MEJORADA */}
              <Card className={`
                border-2 transition-all duration-300 hover:shadow-2xl
                ${isDark
                  ? 'border-slate-700 hover:border-blue-500 hover:shadow-blue-500/20'
                  : 'border-slate-200 hover:border-blue-400 hover:shadow-blue-400/20'
                }
              `}>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isDark ? 'bg-blue-600' : 'bg-blue-500'}
                      shadow-lg
                    `}>
                      <GraduationCap size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Soy Estudiante
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Portal para estudiantes FICCT
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {estudianteFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                          ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}
                        `}>
                          <Check size={12} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                        </div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleUserTypeSelect('estudiante')}
                    className="group py-3"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Acceder como Estudiante
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </Card>

              {/* Card Empresa - MEJORADA */}
              <Card className={`
                border-2 transition-all duration-300 hover:shadow-2xl
                ${isDark
                  ? 'border-slate-700 hover:border-purple-500 hover:shadow-purple-500/20'
                  : 'border-slate-200 hover:border-purple-400 hover:shadow-purple-400/20'
                }
              `}>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isDark ? 'bg-purple-600' : 'bg-purple-500'}
                      shadow-lg
                    `}>
                      <Building2 size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Soy Empresa
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Portal para reclutadores
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {empresaFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                          ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}
                        `}>
                          <Check size={12} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                        </div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => handleUserTypeSelect('empresa')}
                    className="group py-3"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Acceder como Empresa
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - MEJORADO */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Por qué elegir FICCT Talent
            </h2>
            <p className={`text-lg lg:text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              La plataforma diseñada específicamente para nuestra comunidad
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:transform hover:scale-105 transition-all duration-300 p-6 lg:p-8"
                >
                  <div className={`
                    w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                    ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}
                  `}>
                    <Icon size={32} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                  <h3 className={`text-lg lg:text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm lg:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - MEJORADO */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className={`text-3xl lg:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ¿Listo para comenzar?
          </h2>
          <p className={`text-lg lg:text-xl mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Únete a la plataforma que está transformando la forma en que estudiantes y empresas se conectan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              variant="primary"
              onClick={() => handleUserTypeSelect('estudiante')}
              className="px-6 py-3 text-base group"
            >
              <span className="flex items-center justify-center gap-2">
                <GraduationCap size={20} />
                Soy Estudiante
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleUserTypeSelect('empresa')}
              className="px-6 py-3 text-base group"
            >
              <span className="flex items-center justify-center gap-2">
                <Building2 size={20} />
                Soy Empresa
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - MEJORADO */}
      <footer className={`py-8 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm text-center sm:text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              © 2024 FICCT - Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Universidad Autónoma Gabriel René Moreno
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};