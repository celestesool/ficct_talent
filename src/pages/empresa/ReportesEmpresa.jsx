// src/pages/empresa/ReportesEmpresa.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Download,
    TrendingUp,
    Users,
    Briefcase,
    Eye,
    Calendar,
    BarChart3,
    PieChart,
    ArrowLeft,
    CheckCircle,
    Clock,
    XCircle,
    Image
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { companyJobService } from '../../api/services/companyService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {
    PieChart as RechartsPie,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

export const ReportesEmpresa = () => {
    const { isDark, currentTheme } = useTheme();
    const navigate = useNavigate();
    const colors = currentTheme?.colors || {};
    const accentColor = colors.accent || '#6366f1';

    const [loading, setLoading] = useState(true);
    const [exportingCharts, setExportingCharts] = useState(false);
    const chartsRef = useRef(null);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        inInterviewApplications: 0,
        inTechnicalTestApplications: 0,
        profileViews: 0,
        avgApplicationsPerJob: 0
    });
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [dateRange, setDateRange] = useState('all');
    const [applicationsTrend, setApplicationsTrend] = useState([]);

    useEffect(() => {
        loadReportData();
    }, [dateRange]);

    const loadReportData = async () => {
        try {
            setLoading(true);
            const companyId = localStorage.getItem('user_id');

            if (!companyId) {
                setLoading(false);
                return;
            }

            // Cargar datos
            const [jobsResult, viewsResult] = await Promise.all([
                companyJobService.getCompanyJobs(companyId),
                companyJobService.getViewsCount(companyId)
            ]);

            const jobList = jobsResult.success && Array.isArray(jobsResult.data)
                ? jobsResult.data
                : [];

            // Filtrar por rango de fechas si es necesario
            let filteredJobs = jobList;
            if (dateRange !== 'all') {
                const now = new Date();
                const daysAgo = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90;
                const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
                filteredJobs = jobList.filter(job => new Date(job.created_at) >= cutoffDate);
            }

            // Calcular estadísticas
            const activeJobs = filteredJobs.filter(job => job.is_active);
            const allApplications = filteredJobs.flatMap(job => job.applications || []);

            // Estados en español del backend
            const pending = allApplications.filter(app =>
                ['aplicado', 'revisado', 'entrevista', 'prueba_tecnica', 'entrevista_final'].includes(app.status?.toLowerCase())
            );
            const accepted = allApplications.filter(app =>
                app.status?.toLowerCase() === 'aceptado'
            );
            const rejected = allApplications.filter(app =>
                app.status?.toLowerCase() === 'rechazado'
            );
            const inInterview = allApplications.filter(app =>
                ['entrevista', 'entrevista_final'].includes(app.status?.toLowerCase())
            );
            const inTechnicalTest = allApplications.filter(app =>
                app.status?.toLowerCase() === 'prueba_tecnica'
            );

            setStats({
                totalJobs: filteredJobs.length,
                activeJobs: activeJobs.length,
                totalApplications: allApplications.length,
                pendingApplications: pending.length,
                acceptedApplications: accepted.length,
                rejectedApplications: rejected.length,
                inInterviewApplications: inInterview.length,
                inTechnicalTestApplications: inTechnicalTest.length,
                profileViews: viewsResult?.count || 0,
                avgApplicationsPerJob: filteredJobs.length > 0
                    ? (allApplications.length / filteredJobs.length).toFixed(1)
                    : 0
            });

            setJobs(filteredJobs);
            setApplications(allApplications);

            // Calcular tendencia de postulaciones por mes (últimos 6 meses)
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const trendData = [];
            const now = new Date();

            for (let i = 5; i >= 0; i--) {
                const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                const monthName = months[monthDate.getMonth()];

                const monthApplications = allApplications.filter(app => {
                    const appDate = new Date(app.applied_at || app.created_at);
                    return appDate >= monthDate && appDate <= monthEnd;
                });

                const monthJobs = filteredJobs.filter(job => {
                    const jobDate = new Date(job.created_at);
                    return jobDate >= monthDate && jobDate <= monthEnd;
                });

                trendData.push({
                    month: monthName,
                    postulaciones: monthApplications.length,
                    ofertas: monthJobs.length
                });
            }

            setApplicationsTrend(trendData);

        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('company_name') || 'Empresa';
        const today = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Título
        doc.setFontSize(20);
        doc.setTextColor(99, 102, 241);
        doc.text('Reporte de Estadísticas', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(companyName, 105, 28, { align: 'center' });
        doc.text(`Generado: ${today}`, 105, 35, { align: 'center' });

        // Línea separadora
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        // Resumen General
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Resumen General', 20, 50);

        // Tabla de estadísticas generales
        autoTable(doc, {
            startY: 55,
            head: [['Métrica', 'Valor']],
            body: [
                ['Total de Ofertas', stats.totalJobs.toString()],
                ['Ofertas Activas', stats.activeJobs.toString()],
                ['Total de Postulaciones', stats.totalApplications.toString()],
                ['Postulaciones Pendientes', stats.pendingApplications.toString()],
                ['Postulaciones Aceptadas', stats.acceptedApplications.toString()],
                ['Postulaciones Rechazadas', stats.rejectedApplications.toString()],
                ['Vistas del Perfil', stats.profileViews.toString()],
                ['Promedio Postulaciones/Oferta', stats.avgApplicationsPerJob.toString()]
            ],
            theme: 'striped',
            headStyles: { fillColor: [99, 102, 241] },
            styles: { fontSize: 10 }
        });

        // Detalle de Ofertas
        if (jobs.length > 0) {
            const finalY = doc.lastAutoTable?.finalY || 120;
            doc.setFontSize(14);
            doc.text('Detalle de Ofertas', 20, finalY + 15);

            autoTable(doc, {
                startY: finalY + 20,
                head: [['Título', 'Estado', 'Postulaciones', 'Fecha']],
                body: jobs.map(job => [
                    job.title.substring(0, 30) + (job.title.length > 30 ? '...' : ''),
                    job.is_active ? 'Activa' : 'Inactiva',
                    (job.applications?.length || 0).toString(),
                    new Date(job.created_at).toLocaleDateString('es-ES')
                ]),
                theme: 'striped',
                headStyles: { fillColor: [99, 102, 241] },
                styles: { fontSize: 9 }
            });
        }

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `FICCT Talent - Página ${i} de ${pageCount}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Descargar
        doc.save(`reporte-empresa-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Función para exportar gráficos a PDF
    const exportChartsToPDF = async () => {
        if (!chartsRef.current) return;

        setExportingCharts(true);
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const companyName = localStorage.getItem('company_name') || 'Empresa';
            const today = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Título
            doc.setFontSize(22);
            doc.setTextColor(99, 102, 241);
            doc.text('Estadísticas Visuales', pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text(companyName, pageWidth / 2, 30, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Generado: ${today}`, pageWidth / 2, 38, { align: 'center' });

            // Línea separadora
            doc.setDrawColor(99, 102, 241);
            doc.setLineWidth(0.5);
            doc.line(20, 45, pageWidth - 20, 45);

            // Capturar gráficos
            const canvas = await html2canvas(chartsRef.current, {
                scale: 2,
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let yPosition = 50;
            let remainingHeight = imgHeight;
            let sourceY = 0;

            while (remainingHeight > 0) {
                const availableHeight = pageHeight - yPosition - 15;
                const heightToDraw = Math.min(availableHeight, remainingHeight);

                // Crear un canvas temporal para la porción
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = (heightToDraw / imgWidth) * canvas.width;

                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(
                    canvas,
                    0, sourceY,
                    canvas.width, tempCanvas.height,
                    0, 0,
                    canvas.width, tempCanvas.height
                );

                const tempImgData = tempCanvas.toDataURL('image/png');
                doc.addImage(tempImgData, 'PNG', 10, yPosition, imgWidth, heightToDraw);

                remainingHeight -= heightToDraw;
                sourceY += tempCanvas.height;

                if (remainingHeight > 0) {
                    doc.addPage();
                    yPosition = 15;
                }
            }

            // Pie de página
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `FICCT Talent - Estadísticas Visuales - Página ${i} de ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 8,
                    { align: 'center' }
                );
            }

            doc.save(`estadisticas-empresa-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error exporting charts:', error);
            alert('Error al exportar gráficos. Por favor, intenta nuevamente.');
        } finally {
            setExportingCharts(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div
            className={`p-5 rounded-xl transition-all duration-200 hover:shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            style={{ boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.08)' }}
        >
            <div className="flex items-center justify-between mb-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon size={20} style={{ color }} />
                </div>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {loading ? '...' : value}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {title}
            </p>
            {subtitle && (
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/empresa/dashboard')}
                            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
                        >
                            <ArrowLeft size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                        </button>
                        <div>
                            <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Reportes y Estadísticas
                            </h1>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Analiza el rendimiento de tus ofertas laborales
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Filtro de fecha */}
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className={`
                                px-3 py-2 rounded-lg text-sm border
                                ${isDark
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'}
                            `}
                        >
                            <option value="all">Todo el tiempo</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                            <option value="quarter">Últimos 3 meses</option>
                        </select>

                        <div className="flex gap-2">
                            <Button onClick={exportToPDF} variant="primary">
                                <Download size={16} className="mr-2" />
                                Exportar PDF
                            </Button>
                            <Button
                                onClick={exportChartsToPDF}
                                variant="secondary"
                                disabled={exportingCharts}
                            >
                                <Image size={16} className="mr-2" />
                                {exportingCharts ? 'Generando...' : 'Descargar Estadísticas'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Estilo compacto */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Total Ofertas
                            </p>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                                <Briefcase className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} size={20} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.totalJobs}
                        </h3>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Activas
                            </p>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                                <CheckCircle className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={20} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.activeJobs}
                        </h3>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Postulaciones
                            </p>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                <Users className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.totalApplications}
                        </h3>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                En Proceso
                            </p>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                                <TrendingUp className={`${isDark ? 'text-amber-400' : 'text-amber-600'}`} size={20} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.pendingApplications}
                        </h3>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Aceptadas
                            </p>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                                <CheckCircle className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} size={20} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.acceptedApplications}
                        </h3>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Vistas Perfil
                            </p>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                <Eye className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.profileViews}
                        </h3>
                    </Card>
                </div>

                {/* Estadísticas de Postulaciones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Estado de Postulaciones */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <PieChart size={20} style={{ color: accentColor }} />
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Estado de Postulaciones
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Pendientes */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <Clock size={14} className="text-yellow-500" />
                                        Pendientes
                                    </span>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {stats.pendingApplications}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-yellow-500 transition-all duration-500"
                                        style={{
                                            width: stats.totalApplications > 0
                                                ? `${(stats.pendingApplications / stats.totalApplications) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Aceptadas */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <CheckCircle size={14} className="text-green-500" />
                                        Aceptadas
                                    </span>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {stats.acceptedApplications}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                                        style={{
                                            width: stats.totalApplications > 0
                                                ? `${(stats.acceptedApplications / stats.totalApplications) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* En Entrevista */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <Calendar size={14} className="text-purple-500" />
                                        En Entrevista
                                    </span>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {stats.inInterviewApplications}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-purple-500 transition-all duration-500"
                                        style={{
                                            width: stats.totalApplications > 0
                                                ? `${(stats.inInterviewApplications / stats.totalApplications) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Prueba Técnica */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <FileText size={14} className="text-orange-500" />
                                        Prueba Técnica
                                    </span>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {stats.inTechnicalTestApplications}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                        style={{
                                            width: stats.totalApplications > 0
                                                ? `${(stats.inTechnicalTestApplications / stats.totalApplications) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Rechazadas */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <XCircle size={14} className="text-red-500" />
                                        Rechazadas
                                    </span>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {stats.rejectedApplications}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-red-500 transition-all duration-500"
                                        style={{
                                            width: stats.totalApplications > 0
                                                ? `${(stats.rejectedApplications / stats.totalApplications) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Métricas Clave */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <BarChart3 size={20} style={{ color: accentColor }} />
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Métricas Clave
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Promedio por Oferta
                                </p>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {stats.avgApplicationsPerJob}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    postulaciones
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Tasa de Aceptación
                                </p>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {stats.totalApplications > 0
                                        ? ((stats.acceptedApplications / stats.totalApplications) * 100).toFixed(1)
                                        : 0}%
                                </p>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    del total
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Ofertas Inactivas
                                </p>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {stats.totalJobs - stats.activeJobs}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    cerradas
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Pendientes
                                </p>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {stats.pendingApplications}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    por revisar
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Gráficos - Envueltos con ref para exportar */}
                <div ref={chartsRef}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                        {/* Gráfico de Torta - Estado de Postulaciones */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <PieChart size={20} style={{ color: accentColor }} />
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Distribución de Postulaciones
                                </h3>
                            </div>

                            {stats.totalApplications > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <RechartsPie>
                                        <Pie
                                            data={[
                                                { name: 'En Proceso', value: stats.pendingApplications - stats.inInterviewApplications - stats.inTechnicalTestApplications, color: '#3b82f6' },
                                                { name: 'En Entrevista', value: stats.inInterviewApplications, color: '#8b5cf6' },
                                                { name: 'Prueba Técnica', value: stats.inTechnicalTestApplications, color: '#f97316' },
                                                { name: 'Aceptadas', value: stats.acceptedApplications, color: '#10b981' },
                                                { name: 'Rechazadas', value: stats.rejectedApplications, color: '#ef4444' }
                                            ].filter(item => item.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                                            outerRadius={110}
                                            innerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {[
                                                { name: 'En Proceso', value: stats.pendingApplications - stats.inInterviewApplications - stats.inTechnicalTestApplications, color: '#3b82f6' },
                                                { name: 'En Entrevista', value: stats.inInterviewApplications, color: '#8b5cf6' },
                                                { name: 'Prueba Técnica', value: stats.inTechnicalTestApplications, color: '#f97316' },
                                                { name: 'Aceptadas', value: stats.acceptedApplications, color: '#10b981' },
                                                { name: 'Rechazadas', value: stats.rejectedApplications, color: '#ef4444' }
                                            ].filter(item => item.value > 0).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value, name) => [`${value} postulaciones`, name]}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '20px' }}
                                            formatter={(value) => <span style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{value}</span>}
                                        />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center">
                                    <PieChart size={48} className={`mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        No hay postulaciones para mostrar
                                    </p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Los gráficos aparecerán cuando recibas postulaciones
                                    </p>
                                </div>
                            )}
                        </Card>

                        {/* Gráfico de Barras - Postulaciones por Oferta */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <BarChart3 size={20} style={{ color: accentColor }} />
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Postulaciones por Oferta
                                </h3>
                            </div>

                            {jobs.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart
                                        data={jobs.slice(0, 6).map(job => ({
                                            name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
                                            postulaciones: job.applications?.length || 0
                                        }))}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                                        <XAxis type="number" stroke={isDark ? '#94a3b8' : '#64748b'} />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            stroke={isDark ? '#94a3b8' : '#64748b'}
                                            width={120}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="postulaciones" fill={accentColor} radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        No hay ofertas para mostrar
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Gráfico de Tendencia - Full Width */}
                    <Card className="p-6 mb-8">
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp size={20} style={{ color: accentColor }} />
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Tendencia de Actividad (últimos 6 meses)
                            </h3>
                        </div>

                        {applicationsTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={applicationsTrend}>
                                    <defs>
                                        <linearGradient id="colorPostulaciones" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOfertas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                                    <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#64748b'} />
                                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="postulaciones"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorPostulaciones)"
                                        name="Postulaciones"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ofertas"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorOfertas)"
                                        name="Ofertas Creadas"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center">
                                <TrendingUp size={48} className={`mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    No hay datos de tendencia disponibles
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <FileText size={20} style={{ color: accentColor }} />
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Detalle de Ofertas
                        </h3>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {jobs.length} ofertas
                    </span>
                </div>

                {jobs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <th className={`text-left py-3 px-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Título
                                    </th>
                                    <th className={`text-center py-3 px-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Estado
                                    </th>
                                    <th className={`text-center py-3 px-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Postulaciones
                                    </th>
                                    <th className={`text-right py-3 px-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Fecha
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, idx) => (
                                    <tr
                                        key={job.id || idx}
                                        className={`border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}
                                    >
                                        <td className={`py-3 px-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <p className="font-medium">{job.title}</p>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {job.location || 'Sin ubicación'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`
                                                    inline-flex px-2 py-1 rounded-full text-xs font-medium
                                                    ${job.is_active
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}
                                                `}>
                                                {job.is_active ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className={`py-3 px-2 text-center font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {job.applications?.length || 0}
                                        </td>
                                        <td className={`py-3 px-2 text-right text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {new Date(job.created_at).toLocaleDateString('es-ES')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Briefcase size={40} className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            No hay ofertas para mostrar
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ReportesEmpresa;
