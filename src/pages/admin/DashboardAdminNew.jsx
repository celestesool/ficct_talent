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

                // Fetch real data from backend
                const response = await api.get('/admin/dashboard-stats');
                
                if (response.data) {
                    setStats(response.data);
                    
                    // Build recent activity from real data
                    const activities = [];
                    
                    if (response.data.recentRegistrations) {
                        response.data.recentRegistrations.forEach(reg => {
                            activities.push({
                                type: reg.userType === 'student' ? 'student' : 'company',
                                message: `Nuevo ${reg.userType === 'student' ? 'estudiante' : 'empresa'} registrado: ${reg.name}`,
                                time: formatTimeAgo(reg.createdAt),
                                icon: reg.userType === 'student' ? Users : Building
                            });
                        });
                    }
                    
                    if (response.data.recentJobs) {
                        response.data.recentJobs.forEach(job => {
                            activities.push({
                                type: 'job',
                                message: `Nueva oferta publicada: ${job.title}`,
                                time: formatTimeAgo(job.createdAt),
                                icon: Briefcase
                            });
                        });
                    }
                    
                    if (response.data.recentApplications) {
                        response.data.recentApplications.forEach(app => {
                            activities.push({
                                type: 'application',
                                message: `Nueva postulación a ${app.jobTitle}`,
                                time: formatTimeAgo(app.appliedAt),
                                icon: FileText
                            });
                        });
                    }
                    
                    // Sort by most recent
                    activities.sort((a, b) => b.time.localeCompare(a.time));
                    setRecentActivity(activities.slice(0, 10));
                }
            } catch (err) {
                console.error('Error loading admin dashboard:', err);
                setError('No se pudieron cargar las estadísticas del dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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

    const statCards = [
        {
            title: 'Total Estudiantes',
            value: stats.totalStudents || 0,
            icon: Users,
            color: 'blue',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-200 dark:border-blue-700'
        },
        {
            title: 'Total Empresas',
            value: stats.totalCompanies || 0,
            icon: Building,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-200 dark:border-purple-700'
        },
        {
            title: 'Ofertas Activas',
            value: stats.activeJobs || 0,
            icon: Briefcase,
            color: 'green',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-green-200 dark:border-green-700'
        },
        {
            title: 'Postulaciones Totales',
            value: stats.totalApplications || 0,
            icon: FileText,
            color: 'orange',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400',
            borderColor: 'border-orange-200 dark:border-orange-700'
        },
        {
            title: 'Contrataciones',
            value: stats.totalHires || 0,
            icon: CheckCircle,
            color: 'teal',
            bgColor: 'bg-teal-50 dark:bg-teal-900/20',
            textColor: 'text-teal-600 dark:text-teal-400',
            borderColor: 'border-teal-200 dark:border-teal-700'
        },
        {
            title: 'Usuarios Pendientes',
            value: stats.pendingUsers || 0,
            icon: Clock,
            color: 'yellow',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            borderColor: 'border-yellow-200 dark:border-yellow-700'
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Panel de Administración
                    </h1>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Vista general del sistema FICCT Talent
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className={`border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-300`}>
                                <div className="flex items-start justify-between p-5">
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {stat.title}
                                        </p>
                                        <h3 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {stat.value}
                                        </h3>
                                    </div>
                                    <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                                        <Icon className={stat.textColor} size={28} strokeWidth={2} />
                                    </div>
                                </div>
                            </Card>
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
                                            <div className={`p-2 rounded-lg ${
                                                activity.type === 'student' ? 'bg-blue-100 dark:bg-blue-900/20' :
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
                                Acciones Rápidas
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <Button
                                fullWidth
                                variant="outline"
                                onClick={() => navigate('/admin/moderation')}
                                className="justify-start"
                            >
                                <Users size={20} className="mr-2" />
                                Gestionar Usuarios
                            </Button>
                            <Button
                                fullWidth
                                variant="outline"
                                onClick={() => navigate('/admin/announcements')}
                                className="justify-start"
                            >
                                <TrendingUp size={20} className="mr-2" />
                                Gestionar Anuncios
                            </Button>
                            {stats.reportedUsers > 0 && (
                                <div className={`p-3 rounded-lg border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20`}>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {stats.reportedUsers} reporte(s) pendiente(s)
                                        </span>
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
