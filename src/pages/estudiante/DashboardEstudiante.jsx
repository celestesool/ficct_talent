import {
  ArrowRight,
  Award,
  Bell,
  Briefcase,
  Clock,
  Code,
  Eye,
  FileText,
  Sparkles,
  TrendingUp,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';

export const DashboardEstudiante = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Proyectos',
      value: '5',
      icon: Code,
      color: 'blue',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200 dark:border-blue-500/30'
    },
    {
      label: 'Certificaciones',
      value: '3',
      icon: Award,
      color: 'purple',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200 dark:border-purple-500/30'
    },
    {
      label: 'Habilidades',
      value: '12',
      icon: TrendingUp,
      color: 'green',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-500/10',
      textColor: 'text-green-600',
      borderColor: 'border-green-200 dark:border-green-500/30'
    },
    {
      label: 'Postulaciones',
      value: '8',
      icon: Briefcase,
      color: 'orange',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-500/10',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200 dark:border-orange-500/30'
    },
  ];

  const quickActions = [
    {
      title: 'Mi Perfil',
      desc: 'Actualiza tu información personal',
      icon: User,
      path: '/estudiante/perfil',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-500/10',
      hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500'
    },
    {
      title: 'Proyectos',
      desc: 'Gestiona tu portafolio',
      icon: Code,
      path: '/estudiante/proyectos',
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-500/10',
      hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500'
    },
    {
      title: 'Certificaciones',
      desc: 'Agrega tus certificados',
      icon: Award,
      path: '/estudiante/certificaciones',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-500/10',
      hoverBorder: 'hover:border-green-400 dark:hover:border-green-500'
    },
    {
      title: 'Generar CV',
      desc: 'Crea tu CV con IA',
      icon: FileText,
      path: '/estudiante/cv-generator',
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      bgDark: 'bg-indigo-500/10',
      hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-500',
      badge: 'IA'
    },
    {
      title: 'Ofertas',
      desc: 'Busca oportunidades',
      icon: Briefcase,
      path: '/estudiante/ofertas',
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-500/10',
      hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-500'
    },
    {
      title: 'Postulaciones',
      desc: 'Ver Postulaciones',
      icon: Briefcase,
      path: '/estudiante/postulaciones',
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-500/10',
      hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-500'
    },
  ];

  const recentActivity = [
    {
      text: 'Postulaste a "Desarrollador Frontend"',
      company: 'Tech Corp',
      time: 'Hace 2 horas',
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      text: 'Agregaste el proyecto "Sistema de Ventas"',
      time: 'Hace 1 día',
      icon: Code,
      color: 'text-purple-600'
    },
    {
      text: 'Empresa XYZ vio tu perfil',
      time: 'Hace 2 días',
      icon: Eye,
      color: 'text-green-600'
    },
  ];

  const recommendedOffers = [
    {
      title: 'Desarrollador React',
      company: 'Tech Solutions',
      type: 'Pasantía',
      match: '95%',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Data Analyst Intern',
      company: 'DataCorp',
      type: 'Tiempo Completo',
      match: '88%',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Header - MEJORADO */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500`}></div>
            <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dashboard
            </h1>
          </div>
          <p className={`text-base lg:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Bienvenido de nuevo, gestiona tu perfil y encuentra nuevas oportunidades
          </p>
        </div>

        {/* Stats Grid - MEJORADO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className={`
                border-2 ${stat.borderColor}
                hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer
                ${isDark ? 'hover:bg-slate-800' : 'hover:bg-white'}
              `}
            >
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className={`text-xs lg:text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`
                  p-4 rounded-2xl
                  ${isDark ? stat.bgDark : stat.bgLight}
                `}>
                  <stat.icon className={stat.textColor} size={28} strokeWidth={2} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Acciones Rápidas - MEJORADO */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500`}></div>
                  <h2 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Acciones Rápidas
                  </h2>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                {quickActions.map((action, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleActionClick(action.path)}
                    className={`
                      group relative p-5 lg:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${isDark
                        ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                        : 'border-slate-200 bg-white hover:shadow-lg'
                      }
                      ${action.hoverBorder}
                      hover:scale-105
                    `}
                  >
                    {/* Badge IA */}
                    {action.badge && (
                      <div className="absolute top-3 right-3">
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                          ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}
                        `}>
                          <Sparkles size={12} />
                          {action.badge}
                        </span>
                      </div>
                    )}

                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center mb-4
                      ${isDark ? action.bgDark : action.bgLight}
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      <action.icon
                        className={`bg-gradient-to-br ${action.gradient} bg-clip-text text-transparent`}
                        size={24}
                        strokeWidth={2.5}
                      />
                    </div>

                    <h3 className={`font-bold text-base lg:text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                      {action.desc}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      <span>Ir ahora</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Progreso del Perfil - MEJORADO */}
            <Card className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b from-green-500 to-emerald-500`}></div>
                  <h2 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Completa tu Perfil
                  </h2>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-bold
                  ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}
                `}>
                  75%
                </span>
              </div>

              <div className="space-y-5">
                {/* Barra de progreso */}
                <div>
                  <div className={`relative w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: '75%' }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Lista de tareas */}
                <div className={`space-y-3 p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  {[
                    { text: 'Información básica', done: true },
                    { text: 'Habilidades técnicas', done: true },
                    { text: 'Proyectos (3/5)', done: false, progress: true },
                    { text: 'Certificaciones', done: false }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                        ${item.done
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : item.progress
                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                            : isDark ? 'bg-slate-700' : 'bg-slate-300'
                        }
                      `}>
                        {item.done && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {item.progress && (
                          <Clock size={12} className="text-white" />
                        )}
                      </div>
                      <span className={`text-sm ${item.done
                        ? isDark ? 'text-slate-300' : 'text-slate-700'
                        : isDark ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/estudiante/perfil')}
                  className="py-3"
                >
                  <span className="flex items-center justify-center gap-2">
                    Completar Perfil
                    <ArrowRight size={18} />
                  </span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar derecha */}
          <div className="space-y-6">
            {/* Actividad Reciente - MEJORADA */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-500 to-red-500`}></div>
                  <h2 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Actividad
                  </h2>
                </div>
                <Bell size={20} className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className={`
                      pb-4 
                      ${idx !== recentActivity.length - 1 ? 'border-b' : ''} 
                      ${isDark ? 'border-slate-700' : 'border-slate-200'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isDark ? 'bg-slate-700' : 'bg-slate-100'}
                      `}>
                        <activity.icon size={16} className={activity.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {activity.text}
                        </p>
                        {activity.company && (
                          <p className={`text-xs font-semibold mb-1 ${activity.color}`}>
                            {activity.company}
                          </p>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock size={12} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Ofertas Recomendadas - MEJORADA */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500`}></div>
                <h2 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Para Ti
                </h2>
              </div>

              <div className="space-y-3">
                {recommendedOffers.map((offer, idx) => (
                  <div
                    key={idx}
                    className={`
                      relative p-4 rounded-xl cursor-pointer transition-all duration-300
                      ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-md border border-slate-200'}
                      group overflow-hidden
                    `}
                    onClick={() => navigate('/estudiante/ofertas')}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                    <div className="relative">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {offer.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {offer.company}
                          </p>
                        </div>
                        <span className={`
                          ml-2 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap
                          ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}
                        `}>
                          {offer.match}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          {offer.type}
                        </span>
                        <ArrowRight
                          size={16}
                          className={`${isDark ? 'text-slate-600' : 'text-slate-400'} group-hover:translate-x-1 transition-transform`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                fullWidth
                className="mt-4"
                onClick={() => navigate('/estudiante/ofertas')}
              >
                <span className="flex items-center justify-center gap-2">
                  Ver todas las ofertas
                  <ArrowRight size={16} />
                </span>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};