import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp, AlertTriangle, CheckCircle, Building } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { adminService } from '../../api/services/adminService';

export const DashboardAdmin = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    // Cargar datos del dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminService.getDashboardStats();
                setDashboardData(data);
            } catch (err) {
                console.error('Error al cargar dashboard:', err);
                setError('No se pudieron cargar las estadísticas del dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Mostrar loading
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

    // Mostrar error
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

    const stats = [
        {
            title: 'Total Usuarios',
            value: dashboardData?.totalUsers || 0,
            change: '+12%',
            icon: Users,
            color: 'primary',
            bgColor: 'bg-primary-100 dark:bg-primary-900/20',
            textColor: 'text-primary-600'
        },
        {
            title: 'Ofertas Activas',
            value: dashboardData?.activeJobs || 0,
            change: '+5',
            icon: Briefcase,
            color: 'accent',
            bgColor: 'bg-accent-100 dark:bg-accent-900/20',
            textColor: 'text-accent-600'
        },
        {
            title: 'Postulaciones',
            value: dashboardData?.totalApplications || 0,
            change: '+18%',
            icon: FileText,
            color: 'green',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            textColor: 'text-green-600'
        },
        {
            title: 'Pendientes',
            value: dashboardData?.pendingUsers || 0,
            change: `${dashboardData?.pendingUsers || 0} nuevos`,
            icon: AlertTriangle,
            color: 'yellow',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
            textColor: 'text-yellow-600'
        }
    ];

    const recentActivity = dashboardData?.recentActivity || [];

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Dashboard Administrativo
                    </h1>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Vista general del sistema FICCT Talent
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} hover>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {stat.title}
                                        </p>
                                        <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {stat.value}
                                        </h3>
                                        <p className="text-sm text-green-600 mt-1">
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={stat.textColor} size={24} />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Actividad Reciente
                            </h2>
                            <TrendingUp className="text-primary-500" size={20} />
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1">
                                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {activity.message}
                                        </p>
                                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Estadísticas Rápidas
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                                <div className="flex items-center gap-3">
                                    <Users className="text-primary-600" size={20} />
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Estudiantes</span>
                                </div>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{dashboardData?.totalStudents || 0}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                                <div className="flex items-center gap-3">
                                    <Building className="text-accent-600" size={20} />
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Empresas</span>
                                </div>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{dashboardData?.totalCompanies || 0}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-600" size={20} />
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Contrataciones</span>
                                </div>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{dashboardData?.totalHires || 0}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-yellow-600" size={20} />
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Reportes</span>
                                </div>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{dashboardData?.reportedUsers || 0}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Actions Alert */}
                {(dashboardData?.pendingUsers || 0) > 0 && (
                    <Card className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-yellow-600 mt-1" size={24} />
                            <div>
                                <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Acción Requerida
                                </h3>
                                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                    Hay {pendingUsers} cuenta(s) pendiente(s) de aprobación.
                                    <a href="/admin/moderation" className="ml-2 underline text-primary-600 hover:text-primary-700">
                                        Ir a Moderación →
                                    </a>
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
