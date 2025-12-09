import {
  ArrowRight,
  Award,
  Bell,
  Brain,
  Briefcase,
  Clock,
  Code,
  Eye,
  FileText,
  Sparkles,
  TrendingUp,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import { adminService } from '../../api/services/adminService';
import { Megaphone } from 'lucide-react';
import { dashboardCache } from '../../utils/cacheManager';

export const DashboardEstudiante = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    projects: 0,
    certifications: 0,
    skills: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [profileViewCount, setProfileViewCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.email) {
        console.log('No user email found');
        setLoading(false);
        return;
      }

      try {
        const startTime = performance.now();

        // ✅ OPTIMIZACIÓN: Usar caché para student ID
        const studentRes = await dashboardCache.get(
          `student_${user.email}`,
          () => api.get(`/students/email/${user.email}`),
          60 * 60 * 1000 // 1 hora
        );

        const studentId = studentRes.data?.id;

        if (!studentId) {
          console.error('Student ID not found for email:', user.email);
          setLoading(false);
          return;
        }

        // ✅ OPTIMIZACIÓN: Cargar TODO en paralelo (no secuencial)
        const results = await Promise.all([
          dashboardCache.get(
            `projects_${studentId}`,
            () => api.get(`/projects/student/${studentId}`),
            10 * 60 * 1000 // 10 minutos
          ),
          dashboardCache.get(
            `certs_${studentId}`,
            () => api.get(`/certifications/student/${studentId}`),
            10 * 60 * 1000
          ),
          dashboardCache.get(
            `skills_${studentId}`,
            () => api.get(`/skills/student/${studentId}`),
            10 * 60 * 1000
          ),
          dashboardCache.get(
            `applications_${studentId}`,
            () => api.get(`/applications/student/${studentId}`),
            10 * 60 * 1000
          ),
          dashboardCache.get(
            'announcements',
            () => adminService.getAnnouncements(),
            30 * 60 * 1000 // 30 minutos
          ),
          // Fetch viewers en paralelo (no bloquea)
          api.get(`/students/${studentId}/recent-viewers`, { params: { limit: 3 } })
            .catch(() => ({ data: [] })),
          api.get(`/students/${studentId}/views/count`, { params: { days: 7 } })
            .catch(() => ({ data: { count: 0 } }))
        ]);

        const [projectsRes, certsRes, skillsRes, applicationsRes, announcements, viewersRes, viewCountRes] = results;

        const endTime = performance.now();
        console.log(`⚡ Student dashboard loaded in ${(endTime - startTime).toFixed(2)}ms`);

        setCounts({
          projects: projectsRes.data?.length || 0,
          certifications: certsRes.data?.length || 0,
          skills: skillsRes.data?.length || 0,
          applications: applicationsRes.data?.length || 0
        });

        // Build recent activity from real data
        const activities = [];

        // Add profile viewers
        if (viewersRes.data?.length > 0) {
          viewersRes.data.forEach(viewer => {
            activities.push({
              text: `${viewer.company?.name || 'Una empresa'} vio tu perfil`,
              time: formatTimeAgo(viewer.viewed_at),
              icon: Eye,
              color: 'text-purple-600'
            });
          });
        }

        // Add recent applications
        if (applicationsRes.data?.length > 0) {
          applicationsRes.data.slice(0, 2).forEach(app => {
            activities.push({
              text: `Postulaste a "${app.job?.title || 'Oferta laboral'}"`,
              company: app.job?.company?.name || 'Empresa',
              time: formatTimeAgo(app.created_at),
              icon: Briefcase,
              color: 'text-primary-600'
            });
          });
        }

        // Add recent projects
        if (projectsRes.data?.length > 0) {
          const recentProject = projectsRes.data[0];
          activities.push({
            text: `Agregaste el proyecto "${recentProject.title}"`,
            time: formatTimeAgo(recentProject.created_at),
            icon: Code,
            color: 'text-accent-600'
          });
        }

        setRecentActivity(activities.slice(0, 5));
        setProfileViewCount(viewCountRes.data?.count || 0);

        // ✅ OPTIMIZACIÓN: Filtrar anuncios en frontend (ya en caché)
        if (announcements) {
          const filtered = announcements.filter(a => a.target === 'students' || a.target === 'all');
          setAnnouncements(filtered.slice(0, 3));
        }

      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();

    // Limpiar caché al desmontar
    return () => {
      dashboardCache.clearAll();
    };
  }, [user?.email]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Hace un momento';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  };

  const stats = [
    {
      label: 'Proyectos',
      value: loading ? '...' : counts.projects.toString(),
      icon: Code,
      color: 'blue',
      bgLight: 'bg-primary-50',
      bgDark: 'bg-primary-500/10',
      textColor: 'text-primary-600',
      borderColor: 'border-primary-200 dark:border-primary-500/30'
    },
    {
      label: 'Certificaciones',
      value: loading ? '...' : counts.certifications.toString(),
      icon: Award,
      color: 'purple',
      bgLight: 'bg-accent-300',
      bgDark: 'bg-accent-3000/10',
      textColor: 'text-accent-600',
      borderColor: 'border-accent-400 dark:border-accent-3000/30'
    },
    {
      label: 'Habilidades',
      value: loading ? '...' : counts.skills.toString(),
      icon: TrendingUp,
      color: 'green',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-500/10',
      textColor: 'text-green-600',
      borderColor: 'border-green-200 dark:border-green-500/30'
    },
    {
      label: 'Postulaciones',
      value: loading ? '...' : counts.applications.toString(),
      icon: Briefcase,
      color: 'orange',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-500/10',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200 dark:border-orange-500/30'
    },
    {
      label: 'Vistas de Perfil',
      value: loading ? '...' : profileViewCount.toString(),
      icon: Eye,
      color: 'purple',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200 dark:border-purple-500/30',
      subtitle: '(Últimos 7 días)'
    },
  ];

  const quickActions = [
    {
      title: 'Mi Perfil',
      desc: 'Actualiza tu informacion personal',
      icon: User,
      path: '/estudiante/perfil',
      gradient: 'from-primary-500 to-primary-600',
      bgLight: 'bg-primary-50',
      bgDark: 'bg-primary-500/10',
      hoverBorder: 'hover:border-primary-400 dark:hover:border-primary-500'
    },
    {
      title: 'Proyectos',
      desc: 'Gestiona tu portafolio',
      icon: Code,
      path: '/estudiante/proyectos',
      gradient: 'from-cyan-500 to-teal-500',
      bgLight: 'bg-cyan-50',
      bgDark: 'bg-cyan-500/10',
      hoverBorder: 'hover:border-cyan-400 dark:hover:border-cyan-500'
    },
    {
      title: 'Certificaciones',
      desc: 'Agrega tus certificados',
      icon: Award,
      path: '/estudiante/certificaciones',
      gradient: 'from-green-500 to-emerald-500',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-500/10',
      hoverBorder: 'hover:border-green-400 dark:hover:border-green-500'
    },
    {
      title: 'Generar CV',
      desc: 'Crea tu CV profesional con IA',
      icon: FileText,
      path: '/estudiante/cv-generator',
      gradient: 'from-indigo-500 to-violet-500',
      bgLight: 'bg-indigo-50',
      bgDark: 'bg-indigo-500/10',
      hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-500',
      badge: 'IA'
    },
    {
      title: 'Tests de Practica',
      desc: 'Evalua tus conocimientos',
      icon: Brain,
      path: '/estudiante/tests',
      gradient: 'from-purple-500 to-pink-500',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-500/10',
      hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500',
      badge: 'IA'
    },
    {
      title: 'Ofertas Laborales',
      desc: 'Explora oportunidades',
      icon: Briefcase,
      path: '/estudiante/ofertas',
      gradient: 'from-orange-500 to-amber-500',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-500/10',
      hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-500'
    },
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Header con gradiente estilo premium */}
        <div className={`mb-8 p-6 lg:p-8 rounded-2xl ${isDark ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Bienvenido de nuevo
              </h1>
              <p className="text-white/80 text-sm lg:text-base">
                Gestiona tu perfil profesional y encuentra nuevas oportunidades
              </p>
            </div>
            <div className={`px-4 py-3 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-white/20'} backdrop-blur-sm`}>
              <p className="text-white/60 text-xs">Hoy es</p>
              <p className="text-white font-semibold text-sm">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
        </div>
        {/* Anuncios - Diseño mejorado */}
        {announcements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
              <h2 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Anuncios
              </h2>
              <Megaphone size={18} className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((announcement) => {
                const colors = {
                  info: {
                    gradient: 'from-blue-500 to-blue-600',
                    bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
                    border: 'border-blue-200 dark:border-blue-800',
                    icon: 'text-blue-500'
                  },
                  warning: {
                    gradient: 'from-yellow-500 to-orange-500',
                    bg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50',
                    border: 'border-yellow-200 dark:border-yellow-800',
                    icon: 'text-yellow-500'
                  },
                  success: {
                    gradient: 'from-green-500 to-emerald-500',
                    bg: isDark ? 'bg-green-900/20' : 'bg-green-50',
                    border: 'border-green-200 dark:border-green-800',
                    icon: 'text-green-500'
                  },
                  error: {
                    gradient: 'from-red-500 to-rose-500',
                    bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
                    border: 'border-red-200 dark:border-red-800',
                    icon: 'text-red-500'
                  }
                };
                const style = colors[announcement.type] || colors.info;

                return (
                  <div
                    key={announcement.id}
                    className={`
                      relative overflow-hidden rounded-xl border ${style.border} ${style.bg}
                      hover:shadow-lg transition-all duration-300
                    `}
                  >
                    {/* Barra superior con gradiente */}
                    <div className={`h-1.5 bg-gradient-to-r ${style.gradient}`}></div>

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                          <Megaphone size={16} className={style.icon} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {announcement.title}
                          </h3>
                          <p className={`text-sm line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {announcement.message}
                          </p>
                          <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {new Date(announcement.created_at).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Grid - Estilo premium con borde lateral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`
                relative overflow-hidden rounded-xl
                ${isDark ? 'bg-slate-800' : 'bg-white'}
                border-l-4 ${stat.borderColor.split(' ')[0]}
                shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
                hover:translate-y-[-2px]
              `}
            >
              <div className="flex items-center justify-between p-4 lg:p-5">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`
                  p-3 rounded-xl
                  ${isDark ? stat.bgDark : stat.bgLight}
                `}>
                  <stat.icon className={stat.textColor} size={24} strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones Rapidas - Grid 3x2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b from-primary-500 to-accent-500`}></div>
            <h2 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Acciones Rapidas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {quickActions.map((action, idx) => (
              <div
                key={idx}
                onClick={() => handleActionClick(action.path)}
                className={`
                  group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300
                  ${isDark ? 'bg-slate-800' : 'bg-white'}
                  border ${isDark ? 'border-slate-700' : 'border-slate-200'}
                  hover:shadow-xl hover:translate-y-[-4px]
                  ${action.hoverBorder}
                `}
              >
                {/* Barra de color superior */}
                <div className={`h-1 bg-gradient-to-r ${action.gradient}`}></div>

                <div className="p-5 lg:p-6">
                  {/* Badge IA */}
                  {action.badge && (
                    <div className="absolute top-4 right-4">
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

                  <h3 className={`font-bold text-base lg:text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    {action.desc}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                    <span>Ir ahora</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente - Ancho completo */}
        <div className="space-y-6">
          {/* Actividad Reciente */}
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

            {recentActivity.length > 0 ? (
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
            ) : (
              <div className="text-center py-8">
                <Bell size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No hay actividad reciente
                </p>
              </div>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudiante;