import {
    ArrowDown,
    ArrowUp,
    BarChart3,
    Briefcase,
    Building,
    Calendar,
    Download,
    FileText,
    Filter,
    RefreshCw,
    TrendingUp,
    Users,
    AlertCircle,
    Activity,
    Zap,
    ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { statsService } from '../../api/services/statsService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, 365 días
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [jobsByCategory, setJobsByCategory] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    // Colores para categorías
    const categoryColors = {
        'Desarrollo': '#3b82f6',
        'Datos': '#10b981',
        'Otros': '#f59e0b'
    };

    useEffect(() => {
        loadStats();
    }, [dateRange]);

    const loadStats = async (retries = 3) => {
        setLoading(true);
        setError(null);

        try {
            // Cargar estadísticas del dashboard con reintentos
            let dashboardResult, trendsResult, categoriesResult, activityResult;
            let lastError = null;

            for (let attempt = 0; attempt < retries; attempt++) {
                try {
                    [dashboardResult, trendsResult, categoriesResult, activityResult] = await Promise.all([
                        statsService.getDashboardStats(),
                        statsService.getMonthlyTrends(),
                        statsService.getJobsByCategory(),
                        statsService.getRecentActivity(8)
                    ]);
                    break; // Éxito, salir del loop
                } catch (err) {
                    lastError = err;
                    if (attempt < retries - 1) {
                        // Esperar antes de reintentar (backoff exponencial)
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                    }
                }
            }

            if (dashboardResult?.success) {
                // Mapear la estructura del backend a la estructura esperada por el frontend
                const backendData = dashboardResult.data;
                setStats({
                    totalStudents: backendData.students.total,
                    totalCompanies: backendData.companies.total,
                    totalJobs: backendData.jobs.total,
                    totalApplications: backendData.applications.total,
                    activeJobs: backendData.jobs.active,
                    pendingApplications: backendData.applications.pending,
                    studentsGrowth: backendData.students.growth,
                    companiesGrowth: backendData.companies.growth,
                    jobsGrowth: backendData.jobs.growth,
                    applicationsGrowth: backendData.applications.growth
                });
            } else {
                setError(dashboardResult?.error || 'Error al cargar estadísticas');
            }

            if (trendsResult?.success) {
                setTrends(trendsResult.data);
            }

            // Procesar categorías con colores
            if (categoriesResult?.success) {
                const categoriesWithColors = categoriesResult.data.map(cat => ({
                    ...cat,
                    color: categoryColors[cat.name] || '#94a3b8'
                }));
                setJobsByCategory(categoriesWithColors);
            }

            // Procesar actividad reciente
            if (activityResult?.success) {
                setRecentActivity(activityResult.data);
            }
        } catch (err) {
            console.error('Error loading stats after retries:', err);
            setError('Error al cargar estadísticas. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Título principal
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241);
        doc.text('FICCT Talent', 105, 20, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text('Reporte de Estadísticas', 105, 28, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Generado: ${today}`, 105, 35, { align: 'center' });

        // Línea separadora
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        // Resumen General
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Resumen General', 20, 50);

        // Tabla de estadísticas principales
        autoTable(doc, {
            startY: 55,
            head: [['Métrica', 'Total', 'Activos', 'Crecimiento']],
            body: [
                ['Estudiantes', stats?.totalStudents?.toString() || '0', Math.floor((stats?.totalStudents || 0) * 0.85).toString(), `+${stats?.studentsGrowth || 0}%`],
                ['Empresas', stats?.totalCompanies?.toString() || '0', Math.floor((stats?.totalCompanies || 0) * 0.9).toString(), `+${stats?.companiesGrowth || 0}%`],
                ['Ofertas Laborales', stats?.totalJobs?.toString() || '0', stats?.activeJobs?.toString() || '0', `${stats?.jobsGrowth || 0}%`],
                ['Postulaciones', stats?.totalApplications?.toString() || '0', stats?.pendingApplications?.toString() || '0', `+${stats?.applicationsGrowth || 0}%`]
            ],
            theme: 'striped',
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { fontStyle: 'bold' },
                3: { halign: 'center' }
            }
        });

        // Estado de Postulaciones
        const finalY1 = doc.lastAutoTable?.finalY || 100;
        doc.setFontSize(14);
        doc.text('Estado de Postulaciones', 20, finalY1 + 15);

        autoTable(doc, {
            startY: finalY1 + 20,
            head: [['Estado', 'Cantidad']],
            body: [
                ['Pendiente', '67'],
                ['En revisión', '45'],
                ['Aceptada', '89'],
                ['Rechazada', '33']
            ],
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            styles: { fontSize: 10 }
        });

        // Habilidades más demandadas
        const finalY2 = doc.lastAutoTable?.finalY || 150;
        doc.setFontSize(14);
        doc.text('Habilidades Más Demandadas', 20, finalY2 + 15);

        autoTable(doc, {
            startY: finalY2 + 20,
            head: [['Habilidad', 'Demanda']],
            body: [
                ['JavaScript', '92'],
                ['React', '89'],
                ['Node.js', '76'],
                ['Python', '68'],
                ['SQL', '61'],
                ['TypeScript', '54']
            ],
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129], textColor: 255 },
            styles: { fontSize: 10 }
        });

        // Ofertas por Categoría
        if (jobsByCategory.length > 0) {
            const finalY3 = doc.lastAutoTable?.finalY || 200;

            // Nueva página si es necesario
            if (finalY3 > 230) {
                doc.addPage();
                doc.setFontSize(14);
                doc.text('Ofertas por Categoría', 20, 20);

                autoTable(doc, {
                    startY: 25,
                    head: [['Categoría', 'Cantidad']],
                    body: jobsByCategory.map(cat => [cat.name, cat.value.toString()]),
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                    styles: { fontSize: 10 }
                });
            } else {
                doc.setFontSize(14);
                doc.text('Ofertas por Categoría', 20, finalY3 + 15);

                autoTable(doc, {
                    startY: finalY3 + 20,
                    head: [['Categoría', 'Cantidad']],
                    body: jobsByCategory.map(cat => [cat.name, cat.value.toString()]),
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                    styles: { fontSize: 10 }
                });
            }
        }

        // Pie de página en todas las páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `FICCT Talent - Reporte Administrativo - Página ${i} de ${pageCount}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Descargar
        doc.save(`reporte-ficct-talent-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleExportExcel = async () => {
        const result = await statsService.exportReportExcel();
        if (result.success) {
            const url = window.URL.createObjectURL(result.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-ficct-talent-${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
        }
    };

    const applicationStatus = [
        { name: 'Pendiente', value: 67, color: '#f59e0b' },
        { name: 'En revisión', value: 45, color: '#3b82f6' },
        { name: 'Aceptada', value: 89, color: '#10b981' },
        { name: 'Rechazada', value: 33, color: '#ef4444' }
    ];

    const topSkills = [
        { skill: 'React', count: 89 },
        { skill: 'Node.js', count: 76 },
        { skill: 'Python', count: 68 },
        { skill: 'JavaScript', count: 92 },
        { skill: 'TypeScript', count: 54 },
        { skill: 'SQL', count: 61 }
    ];

    // Usar stats directamente si está disponible, sino mostrar mensaje de carga
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
                    <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Cargando estadísticas...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Card className="p-8 max-w-md">
                    <div className="text-center">
                        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Error al cargar estadísticas
                        </h2>
                        <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {error.includes('Token') || error.includes('401')
                                ? 'Necesitas iniciar sesión como administrador para ver esta página.'
                                : error}
                        </p>
                        <Button onClick={loadStats} variant="primary">
                            <RefreshCw size={16} className="mr-2" />
                            Reintentar
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
                    <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Cargando estadísticas...
                    </p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, growth, color = 'primary' }) => (
        <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {title}
                    </p>
                    <h3 className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {value.toLocaleString()}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                    <Icon className={`text-${color}-600 dark:text-${color}-400`} size={24} />
                </div>
            </div>
            {growth !== undefined && (
                <div className="flex items-center gap-2">
                    {growth >= 0 ? (
                        <ArrowUp size={16} className="text-green-500" />
                    ) : (
                        <ArrowDown size={16} className="text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(growth)}%
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        vs mes anterior
                    </span>
                </div>
            )}
        </Card>
    );

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
                    <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Cargando estadísticas...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary-500 to-accent-3000"></div>
                        <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Reportes y Estadísticas
                        </h1>
                    </div>
                    <p className={`text-base lg:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Análisis completo de la plataforma FICCT Talent
                    </p>
                </div>

                {/* Barra de acciones */}
                <Card className="mb-6 p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                        {/* Filtro de rango de fechas */}
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className={`
                  px-4 py-2 rounded-lg border transition-all
                  ${isDark
                                        ? 'bg-slate-800 border-slate-600 text-white'
                                        : 'bg-white border-slate-200 text-slate-900'
                                    }
                `}
                            >
                                <option value="7">Últimos 7 días</option>
                                <option value="30">Últimos 30 días</option>
                                <option value="90">Últimos 90 días</option>
                                <option value="365">Último año</option>
                            </select>
                        </div>

                        {/* Botones de exportación */}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={loadStats}>
                                <RefreshCw size={16} className="mr-2" />
                                Actualizar
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportExcel}>
                                <Download size={16} className="mr-2" />
                                Excel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleExportPDF}>
                                <FileText size={16} className="mr-2" />
                                PDF
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Tarjetas de estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Estudiantes"
                        value={stats.totalStudents}
                        icon={Users}
                        growth={stats.studentsGrowth}
                        color="primary"
                    />
                    <StatCard
                        title="Total Empresas"
                        value={stats.totalCompanies}
                        icon={Building}
                        growth={stats.companiesGrowth}
                        color="accent"
                    />
                    <StatCard
                        title="Ofertas Activas"
                        value={stats.activeJobs}
                        icon={Briefcase}
                        growth={stats.jobsGrowth}
                        color="green"
                    />
                    <StatCard
                        title="Postulaciones"
                        value={stats.totalApplications}
                        icon={TrendingUp}
                        growth={stats.applicationsGrowth}
                        color="purple"
                    />
                </div>

                {/* Gráficos principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Tendencia mensual */}
                    <Card className="p-6">
                        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Tendencia Mensual
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#64748b'} />
                                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="students" stroke="#3b82f6" name="Estudiantes" strokeWidth={2} />
                                <Line type="monotone" dataKey="companies" stroke="#8b5cf6" name="Empresas" strokeWidth={2} />
                                <Line type="monotone" dataKey="jobs" stroke="#10b981" name="Ofertas" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Ofertas por categoría */}
                    <Card className="p-6">
                        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Ofertas por Categoría
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={jobsByCategory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {jobsByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Estado de postulaciones */}
                    <Card className="p-6">
                        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Estado de Postulaciones
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={applicationStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
                                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {applicationStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Habilidades más demandadas */}
                    <Card className="p-6">
                        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Habilidades Más Demandadas
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topSkills} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                                <XAxis type="number" stroke={isDark ? '#94a3b8' : '#64748b'} />
                                <YAxis dataKey="skill" type="category" stroke={isDark ? '#94a3b8' : '#64748b'} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Gráfico de área - Crecimiento acumulado */}
                <Card className="p-6 mb-8">
                    <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Crecimiento Acumulado
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                            <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#64748b'} />
                            <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Postulaciones" />
                            <Area type="monotone" dataKey="jobs" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Ofertas" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Tabla de resumen */}
                <Card className="p-6">
                    <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Resumen General
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Métrica
                                    </th>
                                    <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Total
                                    </th>
                                    <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Activos
                                    </th>
                                    <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Crecimiento
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Estudiantes</td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
                                        {stats?.totalStudents || 0}
                                    </td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {Math.floor((stats?.totalStudents || 0) * 0.85)}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        <span className="text-green-500 font-semibold">+{stats?.studentsGrowth || 0}%</span>
                                    </td>
                                </tr>
                                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Empresas</td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
                                        {stats?.totalCompanies || 0}
                                    </td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {Math.floor((stats?.totalCompanies || 0) * 0.9)}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        <span className="text-green-500 font-semibold">+{stats?.companiesGrowth || 0}%</span>
                                    </td>
                                </tr>
                                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Ofertas Laborales</td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
                                        {stats?.totalJobs || 0}
                                    </td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {stats?.activeJobs || 0}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        <span className="text-red-500 font-semibold">{stats?.jobsGrowth || 0}%</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Postulaciones</td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>
                                        {stats?.totalApplications || 0}
                                    </td>
                                    <td className={`text-right py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {stats?.pendingApplications || 0}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        <span className="text-green-500 font-semibold">+{stats?.applicationsGrowth || 0}%</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>



            </div>
        </div>
    );
};

export default ReportsPage;
