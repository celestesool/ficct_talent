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

    // Stats minimalistas
    const stats = [
        { label: 'Proyectos', value: counts.projects, icon: Code, color: '#6366f1' },
        { label: 'Certificaciones', value: counts.certifications, icon: Award, color: '#ec4899' },
        { label: 'Habilidades', value: counts.skills, icon: TrendingUp, color: '#06b6d4' },
        { label: 'Postulaciones', value: counts.applications, icon: Briefcase, color: '#f59e0b' },
        { label: 'Vistas', value: profileViewCount, icon: Eye, color: '#8b5cf6', subtitle: '7 días' },
    ];

    // Acciones rápidas estilo Polaroid
    const quickActions = [
        {
            title: 'Mi Perfil',
            description: 'Actualiza tu información personal y datos de contacto',
            icon: User,
            path: '/estudiante/perfil',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
            accentColor: '#6366f1',
        },
        {
            title: 'Proyectos',
            description: 'Gestiona tu portafolio de proyectos',
            icon: FolderOpen,
            path: '/estudiante/proyectos',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
            accentColor: '#06b6d4',
        },
        {
            title: 'Certificaciones',
            description: 'Agrega tus certificados y cursos',
            icon: Award,
            path: '/estudiante/certificaciones',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop',
            accentColor: '#10b981',
        },
        {
            title: 'Generar CV',
            description: 'Crea tu CV profesional con IA',
            icon: FileText,
            path: '/estudiante/cv-generator',
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop',
            accentColor: '#8b5cf6',
            badge: 'IA'
        },
        {
            title: 'Tests de Práctica',
            description: 'Evalúa tus conocimientos',
            icon: Brain,
            path: '/estudiante/tests',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
            accentColor: '#ec4899',
            badge: 'IA'
        },
        {
            title: 'Ofertas Laborales',
            description: 'Explora oportunidades de trabajo',
            icon: Target,
            path: '/estudiante/ofertas',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop',
            accentColor: '#f59e0b',
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

                {/* Anuncios - Diseño con más color */}
                {announcements.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Megaphone size={18} style={{ color: accentColor }} />
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Anuncios
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {announcements.map((ann) => {
                                const typeStyles = {
                                    info: {
                                        gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                        iconBg: 'rgba(255,255,255,0.2)'
                                    },
                                    warning: {
                                        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                        iconBg: 'rgba(255,255,255,0.2)'
                                    },
                                    success: {
                                        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                        iconBg: 'rgba(255,255,255,0.2)'
                                    },
                                    error: {
                                        gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                                        iconBg: 'rgba(255,255,255,0.2)'
                                    },
                                };
                                const style = typeStyles[ann.type] || typeStyles.info;

                                return (
                                    <div
                                        key={ann.id}
                                        className="relative p-4 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
                                        style={{ background: style.gradient }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: style.iconBg }}
                                            >
                                                <Megaphone size={16} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm mb-1 text-white">
                                                    {ann.title}
                                                </h3>
                                                <p className="text-xs line-clamp-2 text-white/80">
                                                    {ann.message}
                                                </p>
                                                {ann.created_at && (
                                                    <p className="text-xs mt-2 text-white/60">
                                                        {new Date(ann.created_at).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Stats Grid - Minimalista con detalle de tema */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className={`
                                relative p-4 rounded-2xl transition-all duration-200 hover:shadow-lg cursor-pointer overflow-hidden
                                ${isDark ? 'bg-slate-800' : 'bg-white'}
                            `}
                            style={{
                                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            {/* Línea de acento con color del tema */}
                            <div
                                className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                                style={{ backgroundColor: accentColor }}
                            />

                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${accentColor}10` }}
                                >
                                    <stat.icon size={18} style={{ color: accentColor }} />
                                </div>
                            </div>
                            <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {loading ? '...' : stat.value}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {stat.label}
                                {stat.subtitle && <span className="opacity-70"> · {stat.subtitle}</span>}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Layout principal: 2/3 + 1/3 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Columna izquierda - Acciones Rápidas */}
                    <div className="lg:col-span-2">
                        <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Acciones Rápidas
                        </h2>

                        {/* Grid de cards estilo Polaroid - Mayor separación */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {quickActions.map((action, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className={`
                    group cursor-pointer transition-all duration-300
                    hover:shadow-xl hover:translate-y-[-4px]
                    ${isDark ? 'bg-slate-800' : 'bg-white'}
                    rounded-md overflow-hidden
                  `}
                                    style={{
                                        border: isDark ? '4px solid #334155' : '4px solid #ffffff',
                                        boxShadow: isDark
                                            ? '0 2px 8px rgba(0,0,0,0.3)'
                                            : '0 2px 12px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    {/* Imagen con overlay sutil */}
                                    <div className="relative h-32 overflow-hidden">
                                        <img
                                            src={action.image}
                                            alt={action.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Badge IA */}
                                        {action.badge && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-purple-500 text-white shadow-sm">
                                                    <Sparkles size={10} />
                                                    {action.badge}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenido estilo Polaroid */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <action.icon size={16} style={{ color: action.accentColor }} />
                                            <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {action.title}
                                            </h3>
                                        </div>
                                        <p className={`text-xs line-clamp-2 mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {action.description}
                                        </p>

                                        <div
                                            className="flex items-center gap-1 text-xs font-medium"
                                            style={{ color: action.accentColor }}
                                        >
                                            <span>Ver más</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Columna derecha - Sidebar */}
                    <div className="space-y-5">

                        {/* Actividad Reciente */}
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
                                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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

                        {/* Tu Progreso */}
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

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardEstudiante;