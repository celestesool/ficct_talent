import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from '../../contexts/RouterContext';
import { Navbar } from '../../components/common/Navbar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  User, 
  Briefcase, 
  Award, 
  Code, 
  TrendingUp,
  BookOpen,
  MessageSquare,
  Bell
} from 'lucide-react';

export const DashboardEstudiante = () => {
  const { isDark } = useTheme();
  const { navigate } = useRouter();

  const stats = [
    { label: 'Proyectos', value: '5', icon: Code, color: 'blue' },
    { label: 'Certificaciones', value: '3', icon: Award, color: 'purple' },
    { label: 'Habilidades', value: '12', icon: TrendingUp, color: 'green' },
    { label: 'Postulaciones', value: '8', icon: Briefcase, color: 'orange' },
  ];

  const quickActions = [
    { 
      title: 'Mi Perfil', 
      desc: 'Actualiza tu información personal', 
      icon: User, 
      path: '/estudiante/perfil',
      color: 'blue'
    },
    { 
      title: 'Proyectos', 
      desc: 'Gestiona tu portafolio', 
      icon: Code, 
      path: '/estudiante/proyectos',
      color: 'purple'
    },
    { 
      title: 'Certificaciones', 
      desc: 'Agrega tus certificados', 
      icon: Award, 
      path: '/estudiante/certificaciones',
      color: 'green'
    },
    { 
      title: 'Ofertas', 
      desc: 'Busca oportunidades', 
      icon: Briefcase, 
      path: '/estudiante/ofertas',
      color: 'orange'
    },
  ];

  const recentActivity = [
    { text: 'Postulaste a "Desarrollador Frontend" en Tech Corp', time: 'Hace 2 horas' },
    { text: 'Agregaste el proyecto "Sistema de Ventas"', time: 'Hace 1 día' },
    { text: 'Empresa XYZ vio tu perfil', time: 'Hace 2 días' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Dashboard del Estudiante
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Bienvenido de nuevo, gestiona tu perfil y busca oportunidades
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                  'bg-orange-100 dark:bg-orange-900/20'
                }`}>
                  <stat.icon className={`${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    'text-orange-600'
                  }`} size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Acciones Rápidas */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Acciones Rápidas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isDark 
                        ? 'border-slate-700 hover:border-blue-500 hover:bg-slate-700' 
                        : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className={`w-10 h-10 rounded-lg ${
                      action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      action.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-orange-100 dark:bg-orange-900/20'
                    } flex items-center justify-center mb-3`}>
                      <action.icon className={`${
                        action.color === 'blue' ? 'text-blue-600' :
                        action.color === 'purple' ? 'text-purple-600' :
                        action.color === 'green' ? 'text-green-600' :
                        'text-orange-600'
                      }`} size={20} />
                    </div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {action.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Progreso del Perfil */}
            <Card className="mt-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Completa tu Perfil
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Progreso general
                    </span>
                    <span className="text-sm font-bold text-blue-600">75%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <p>✅ Información básica</p>
                  <p>✅ Habilidades</p>
                  <p>⏳ Proyectos (3/5)</p>
                  <p>❌ Certificaciones pendientes</p>
                </div>
                <Button variant="primary" fullWidth onClick={() => navigate('/estudiante/perfil')}>
                  Completar Perfil
                </Button>
              </div>
            </Card>
          </div>

          {/* Actividad Reciente */}
          <div>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Actividad Reciente
                </h2>
                <Bell size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className={`pb-4 ${idx !== recentActivity.length - 1 ? 'border-b' : ''} ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activity.text}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Ofertas Recomendadas */}
            <Card className="mt-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ofertas para ti
              </h2>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Desarrollador React
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tech Solutions
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-purple-50'}`}>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Data Analyst Intern
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    DataCorp
                  </p>
                </div>
              </div>
              <Button variant="outline" fullWidth className="mt-4" onClick={() => navigate('/estudiante/ofertas')}>
                Ver todas las ofertas
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};