import React from 'react';
import { GraduationCap, Building2, Users, Rocket, Target, Star, ArrowRight } from 'lucide-react';
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      
      {/* Header con navegación */}
      <header className="relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo.png" 
                alt="FICCT TALENT" 
                className="w-18 h-16 object-contain"
              />
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  UAGRM
                </h1>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                 Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Texto principal */}
            <div className="space-y-8">
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  Plataforma Oficial FICCT
                </span>
                <h1 className={`text-5xl lg:text-6xl font-bold leading-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Conectamos{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Talento
                  </span>{' '}
                  con{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Oportunidades
                  </span>
                </h1>
                <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  La plataforma oficial de la Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones 
                  para conectar a nuestros estudiantes con las mejores oportunidades laborales y de pasantías.
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards de selección */}
            <div className="space-y-6">
              {/* Card Estudiante */}
              <Card hover className="border-2 border-transparent hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                    ${isDark ? 'bg-blue-600' : 'bg-blue-100'}
                  `}>
                    <GraduationCap size={32} className={isDark ? 'text-white' : 'text-blue-600'} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Soy Estudiante
                    </h3>
                    <p className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Crea tu portafolio digital, muestra tus proyectos, gestiona tu información académica 
                      y conecta con oportunidades de pasantías y empleo.
                    </p>
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={() => handleUserTypeSelect('estudiante')}
                      className="group"
                    >
                      <span>Acceder como Estudiante</span>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card Empresa */}
              <Card hover className="border-2 border-transparent hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                    ${isDark ? 'bg-purple-600' : 'bg-purple-100'}
                  `}>
                    <Building2 size={32} className={isDark ? 'text-white' : 'text-purple-600'} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Soy Empresa
                    </h3>
                    <p className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Descubre el talento joven de la FICCT, publica ofertas de pasantías y empleo, 
                      y encuentra los perfiles técnicos que tu empresa necesita.
                    </p>
                    <Button 
                      variant="secondary" 
                      fullWidth 
                      onClick={() => handleUserTypeSelect('empresa')}
                      className="group"
                    >
                      <span>Acceder como Empresa</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Por qué elegir FICCT Talent
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              La plataforma diseñada específicamente para la comunidad de la FICCT
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:transform hover:scale-105 transition-all duration-300">
                  <div className={`
                    w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                    ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}
                  `}>
                    <Icon size={32} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ¿Listo para comenzar?
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Únete a la plataforma que está transformando la forma en que estudiantes y empresas se conectan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => handleUserTypeSelect('estudiante')}
              className="px-8 py-4 text-lg"
            >
              <GraduationCap size={24} className="mr-2" />
              Soy Estudiante
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => handleUserTypeSelect('empresa')}
              className="px-8 py-4 text-lg"
            >
              <Building2 size={24} className="mr-2" />
              Soy Empresa
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className="container mx-auto px-6 text-center">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            © 2024 FICCT - Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones. 
            Universidad Autónoma Gabriel René Moreno.
          </p>
        </div>
      </footer>
    </div>
  );
};