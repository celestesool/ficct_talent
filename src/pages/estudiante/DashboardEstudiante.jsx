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
    User,
    FolderOpen,
    Target
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import { adminService } from '../../api/services/adminService';
import { Megaphone } from 'lucide-react';
import { dashboardCache } from '../../utils/cacheManager';

export const DashboardEstudiante = () => {
    const { isDark, currentTheme } = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();
    const colors = currentTheme?.colors || {};
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
                setLoading(false);
                return;
            }

            try {
                const studentRes = await dashboardCache.get(
                    `student_${user.email}`,
                    () => api.get(`/students/email/${user.email}`),
                    60 * 60 * 1000
                );

                const studentId = studentRes.data?.id;
                if (!studentId) {
                    setLoading(false);
                    return;
                }

                const results = await Promise.all([
                    dashboardCache.get(`projects_${studentId}`, () => api.get(`/projects/student/${studentId}`), 10 * 60 * 1000),
                    dashboardCache.get(`certs_${studentId}`, () => api.get(`/certifications/student/${studentId}`), 10 * 60 * 1000),
                    dashboardCache.get(`skills_${studentId}`, () => api.get(`/skills/student/${studentId}`), 10 * 60 * 1000),
                    dashboardCache.get(`applications_${studentId}`, () => api.get(`/applications/student/${studentId}`), 10 * 60 * 1000),
                    dashboardCache.get('announcements', () => adminService.getAnnouncements(), 30 * 60 * 1000),
                    api.get(`/students/${studentId}/recent-viewers`, { params: { limit: 3 } }).catch(() => ({ data: [] })),
                    api.get(`/students/${studentId}/views/count`, { params: { days: 7 } }).catch(() => ({ data: { count: 0 } }))
                ]);

                const [projectsRes, certsRes, skillsRes, applicationsRes, announcementsData, viewersRes, viewCountRes] = results;

                setCounts({
                    projects: projectsRes.data?.length || 0,
                    certifications: certsRes.data?.length || 0,
                    skills: skillsRes.data?.length || 0,
                    applications: applicationsRes.data?.length || 0
                });

                const activities = [];
                if (viewersRes.data?.length > 0) {
                    viewersRes.data.forEach(viewer => {
                        activities.push({
                            text: `${viewer.company?.name || 'Una empresa'} vio tu perfil`,
                            time: formatTimeAgo(viewer.viewed_at),
                            icon: Eye,
                            color: '#8b5cf6'
                        });
                    });
                }
                if (applicationsRes.data?.length > 0) {
                    applicationsRes.data.slice(0, 2).forEach(app => {
                        activities.push({
                            text: `Postulaste a "${app.job?.title || 'Oferta'}"`,
                            time: formatTimeAgo(app.created_at),
                            icon: Briefcase,
                            color: '#3b82f6'
                        });
                    });
                }

                setRecentActivity(activities.slice(0, 4));
                setProfileViewCount(viewCountRes.data?.count || 0);

                if (announcementsData) {
                    const filtered = announcementsData.filter(a => a.target === 'students' || a.target === 'all');
                    setAnnouncements(filtered.slice(0, 2));
                }
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
        return () => dashboardCache.clearAll();
    }, [user?.email]);

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Hace un momento';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'Hace un momento';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
        return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
    };

    // Stats estilo admin - limpio y minimalista
    const stats = [
        {
            label: 'Proyectos',
            value: counts.projects,
            icon: Code,
            color: 'indigo',
            bgLight: 'bg-indigo-100',
            bgDark: 'bg-indigo-900/30',
            textLight: 'text-indigo-600',
            textDark: 'text-indigo-400'
        },
        {
            label: 'Certificaciones',
            value: counts.certifications,
            icon: Award,
            color: 'green',
            bgLight: 'bg-green-100',
            bgDark: 'bg-green-900/30',
            textLight: 'text-green-600',
            textDark: 'text-green-400'
        },
        {
            label: 'Habilidades',
            value: counts.skills,
            icon: TrendingUp,
            color: 'blue',
            bgLight: 'bg-blue-100',
            bgDark: 'bg-blue-900/30',
            textLight: 'text-blue-600',
            textDark: 'text-blue-400'
        },
        {
            label: 'Postulaciones',
            value: counts.applications,
            icon: Briefcase,
            color: 'pink',
            bgLight: 'bg-pink-100',
            bgDark: 'bg-pink-900/30',
            textLight: 'text-pink-600',
            textDark: 'text-pink-400'
        },
        {
            label: 'Vistas',
            value: profileViewCount,
            icon: Eye,
            color: 'orange',
            bgLight: 'bg-orange-100',
            bgDark: 'bg-orange-900/30',
            textLight: 'text-orange-600',
            textDark: 'text-orange-400',
            subtitle: '7 días'
        },
    ];

    // Acciones rápidas - Diseño minimalista con formas geométricas
    const quickActions = [
        {
            title: 'Mi Perfil',
            description: 'Información personal y contacto',
            icon: User,
            path: '/estudiante/perfil',
        },
        {
            title: 'Proyectos',
            description: 'Tu portafolio de proyectos',
            icon: FolderOpen,
            path: '/estudiante/proyectos',
        },
        {
            title: 'Certificaciones',
            description: 'Certificados y cursos',
            icon: Award,
            path: '/estudiante/certificaciones',
        },
        {
            title: 'Generar CV',
            description: 'CV profesional con IA',
            icon: FileText,
            path: '/estudiante/cv-generator',
            badge: 'IA'
        },
        {
            title: 'Tests',
            description: 'Evalúa tus conocimientos',
            icon: Brain,
            path: '/estudiante/tests',
            badge: 'IA'
        },
        {
            title: 'Ofertas',
            description: 'Oportunidades de trabajo',
            icon: Target,
            path: '/estudiante/ofertas',
        },
    ];

    const accentColor = colors.accent || '#6366f1';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

                {/* Header simple */}
                <div className="mb-6">
                    <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Bienvenido, {user?.firstName || 'Estudiante'}
                    </h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Gestiona tu perfil profesional y encuentra nuevas oportunidades
                    </p>
                </div>

                {/* Anuncios - Encapsulados con fondo del tema */}
                {announcements.length > 0 && (
                    <div
                        className="mb-8 max-w-5xl mx-auto p-6 rounded-2xl border relative"
                        style={{
                            backgroundColor: isDark ? `${accentColor}40` : `${accentColor}26`,
                            borderColor: `${accentColor}33`
                        }}
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Megaphone size={20} style={{ color: accentColor }} />
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Anuncios
                            </h2>
                        </div>

                        <div className={`grid gap-4 ${announcements.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {announcements.map((ann) => {
                                // Usar el color del tema para todos los anuncios
                                const style = {
                                    bg: isDark ? `${accentColor}26` : `${accentColor}14`,
                                    border: `${accentColor}4D`,
                                    iconBg: `${accentColor}40`,
                                    textColor: isDark ? 'text-slate-100' : 'text-slate-900',
                                    textSecondary: isDark ? 'text-slate-300' : 'text-slate-700'
                                };

                                return (
                                    <Card
                                        key={ann.id}
                                        className="p-5 transition-all duration-200 hover:shadow-md cursor-pointer border"
                                        style={{
                                            backgroundColor: style.bg,
                                            borderColor: style.border
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: style.iconBg }}
                                            >
                                                <Megaphone size={20} style={{ color: accentColor }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-base mb-1.5 ${style.textColor}`}>
                                                    {ann.title}
                                                </h3>
                                                <p className={`text-sm line-clamp-2 ${style.textSecondary}`}>
                                                    {ann.message}
                                                </p>
                                                {ann.created_at && (
                                                    <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {new Date(ann.created_at).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Stats Grid - Estilo Admin Limpio */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="p-3">
                            <div className="flex items-start justify-between mb-2">
                                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {stat.label}
                                </p>
                                <div className={`p-2 rounded-lg ${isDark ? stat.bgDark : stat.bgLight}`}>
                                    <stat.icon className={`${isDark ? stat.textDark : stat.textLight}`} size={22} />
                                </div>
                            </div>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {stat.value}
                            </h3>
                            {stat.subtitle && (
                                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {stat.subtitle}
                                </p>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Layout principal: 2/3 + 1/3 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Columna izquierda - Acciones Rápidas */}
                    <div className="lg:col-span-2">
                        <h2 className={`text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Acciones Rápidas
                        </h2>

                        {/* Grid de cards - 2 columnas para más espacio */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                            {quickActions.map((action, idx) => (
                                <Card
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className={`
                                        group cursor-pointer transition-all duration-300
                                        hover:shadow-xl hover:translate-y-[-4px]
                                        p-6 pb-8
                                        border-b-8
                                    `}
                                    style={{
                                        borderBottomColor: accentColor,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                    }}
                                >
                                    {/* Badge IA en esquina superior derecha */}
                                    {action.badge && (
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm"
                                                style={{ backgroundColor: accentColor }}
                                            >
                                                <Sparkles size={10} />
                                                {action.badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Ícono centrado grande */}
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: `${accentColor}15` }}
                                        >
                                            <action.icon size={32} style={{ color: accentColor }} />
                                        </div>
                                    </div>

                                    {/* Título centrado */}
                                    <h3 className={`font-bold text-base mb-2 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {action.title}
                                    </h3>

                                    {/* Descripción centrada */}
                                    <p className={`text-sm leading-relaxed text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {action.description}
                                    </p>

                                    {/* Indicador de acción en hover */}
                                    <div className="mt-4 flex justify-center">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span
                                                className="text-xs font-medium"
                                                style={{ color: accentColor }}
                                            >
                                                Ir
                                            </span>
                                            <ArrowRight
                                                size={14}
                                                style={{ color: accentColor }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Columna derecha - Sidebar */}
                    <div className="space-y-5 mt-11">

                        {/* Tu Progreso - Ahora primero */}
                        <div
                            className={`rounded-lg p-5 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                        >
                            <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Tu Progreso
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Perfil completado</span>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>75%</span>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: '75%', backgroundColor: accentColor }}
                                    />
                                </div>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Completa tu perfil para aumentar tu visibilidad
                                </p>
                            </div>
                        </div>

                        {/* Actividad Reciente - Ahora segundo */}
                        <div
                            className={`rounded-lg p-5 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Actividad Reciente
                                </h3>
                                <Bell size={16} className={isDark ? 'text-slate-400' : 'text-slate-400'} />
                            </div>

                            {recentActivity.length > 0 ? (
                                <div className="space-y-3">
                                    {recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: `${activity.color}15` }}
                                            >
                                                <activity.icon size={14} style={{ color: activity.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {activity.text}
                                                </p>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Bell size={24} className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Sin actividad reciente
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Consejos Rápidos - Nueva sección */}
                        <div
                            className={`rounded-lg p-5 border-l-4`}
                            style={{
                                backgroundColor: isDark ? `${accentColor}10` : `${accentColor}05`,
                                borderLeftColor: accentColor,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                            }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={18} style={{ color: accentColor }} />
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Consejos Rápidos
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Actualiza tu perfil regularmente para destacar
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Agrega proyectos recientes para mostrar tus habilidades
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Postula a ofertas que coincidan con tu perfil
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardEstudiante;