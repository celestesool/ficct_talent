import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Building,
    Clock,
    Activity,
    BarChart3
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import { dashboardCache } from '../../utils/cacheManager';

export const DashboardAdmin = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingUsers: 0,
        totalHires: 0,
        reportedUsers: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const startTime = performance.now();

                // ✅ OPTIMIZACIÓN: Usar caché para datos del admin
                const response = await dashboardCache.get(
                    'admin_dashboard_stats',
                    () => api.get('/admin/dashboard-stats'),
                    5 * 60 * 1000 // 5 minutos (datos de admin cambian frecuentemente)
                );

                if (response.data) {
                    setStats(response.data);

                    // Usar recentActivity directamente del backend
                    if (response.data.recentActivity && Array.isArray(response.data.recentActivity)) {
                        const activities = response.data.recentActivity.map(activity => {
                            // Mapear iconos basados en el tipo
                            let icon = Activity;
                            let activityType = 'default';

                            if (activity.type === 'user_registered') {
                                icon = Users;
                                activityType = 'student';
                            } else if (activity.type === 'job_posted') {
                                icon = Briefcase;
                                activityType = 'job';
                            } else if (activity.type === 'application') {
                                icon = FileText;
                                activityType = 'application';
                            }

                            return {
                                type: activityType,
                                message: activity.message,
                                time: formatTimeAgo(activity.time),
                                icon: icon
                            };
                        });

                        setRecentActivity(activities);
                    }

                    const endTime = performance.now();
                    console.log(`Admin dashboard loaded in ${(endTime - startTime).toFixed(2)}ms`);
                }
            } catch (err) {
                console.error('Error loading admin dashboard:', err);
                setError('No se pudieron cargar las estadísticas del dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Limpiar caché al desmontar
        return () => {
            dashboardCache.clear('admin_dashboard_stats');
        };
    }, []);

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

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <Card className="max-w-md">
                    <div className="text-center">
                        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Error al cargar datos
                        </h2>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{error}</p>
                    </div>
                </Card>
            </div>
        );
    }

    // Stats con diseño de gradientes premium
    const statCards = [
        {
            title: 'Total Estudiantes',
            value: stats.totalStudents || 0,
            icon: Users,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            title: 'Total Empresas',
            value: stats.totalCompanies || 0,
            icon: Building,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            title: 'Ofertas Activas',
            value: stats.activeJobs || 0,
            icon: Briefcase,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            title: 'Postulaciones Totales',
            value: stats.totalApplications || 0,
            icon: FileText,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            title: 'Contrataciones',
            value: stats.totalHires || 0,
            icon: CheckCircle,
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            title: 'Usuarios Pendientes',
            value: stats.pendingUsers || 0,
            icon: Clock,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header con gradiente */}
                <div className={`mb-8 p-6 rounded-2xl ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-white">
                                Panel de Administracion
                            </h1>
                            <p className="text-white/80">
                                Vista general del sistema FICCT Talent
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-sm">Ultima actualizacion</p>
                            <p className="text-white font-medium">
                                {new Date().toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Diseño Premium con Gradientes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:translate-y-[-4px] hover:scale-[1.02]"
                                style={{ background: stat.gradient }}
                            >
                                {/* Efecto de ola decorativa */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
                                    style={{
                                        background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' d=\'M0,160L48,138.7C96,117,192,75,288,80C384,85,480,139,576,154.7C672,171,768,149,864,133.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom',
                                        backgroundSize: 'cover'
                                    }}
                                />

                                <div className="relative p-6">
                                    {/* Icono en círculo semi-transparente */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: stat.iconBg }}
                                    >
                                        <Icon className="text-white" size={24} strokeWidth={2} />
                                    </div>

                                    {/* Label */}
                                    <p className="text-white/80 text-sm font-medium mb-1">
                                        {stat.title}
                                    </p>

                                    {/* Valor grande */}
                                    <p className="text-white text-3xl lg:text-4xl font-bold">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Alert for pending users */}
                {stats.pendingUsers > 0 && (
                    <Card className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-start justify-between p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-1" size={24} />
                                <div>
                                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Acción Requerida
                                    </h3>
                                    <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                        Hay {stats.pendingUsers} usuario(s) pendiente(s) de aprobación.
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate('/admin/moderation')}
                                size="sm"
                                variant="primary"
                            >
                                Ir a Moderación
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Activity className="text-primary-500" size={24} />
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Actividad Reciente
                                </h2>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-start gap-3 p-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                        >
                                            <div className={`p-2 rounded-lg ${activity.type === 'student' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                                activity.type === 'company' ? 'bg-purple-100 dark:bg-purple-900/20' :
                                                    activity.type === 'job' ? 'bg-green-100 dark:bg-green-900/20' :
                                                        'bg-orange-100 dark:bg-orange-900/20'
                                                }`}>
                                                <Icon className={
                                                    activity.type === 'student' ? 'text-blue-600 dark:text-blue-400' :
                                                        activity.type === 'company' ? 'text-purple-600 dark:text-purple-400' :
                                                            activity.type === 'job' ? 'text-green-600 dark:text-green-400' :
                                                                'text-orange-600 dark:text-orange-400'
                                                } size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {activity.message}
                                                </p>
                                                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <Activity className="mx-auto mb-2 text-slate-400" size={32} />
                                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                        No hay actividad reciente
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="text-primary-500" size={24} />
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Acciones Rapidas
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/admin/moderation')}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Users size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Gestionar Usuarios
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Moderar y administrar cuentas
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/admin/announcements')}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Gestionar Anuncios
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Crear y editar comunicados
                                    </p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/admin/reports')}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <BarChart3 size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Ver Reportes
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Estadisticas y metricas del sistema
                                    </p>
                                </div>
                            </button>

                            {stats.reportedUsers > 0 && (
                                <div className={`p-4 rounded-xl border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {stats.reportedUsers} reporte(s) pendiente(s)
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                                                Requiere atencion inmediata
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
