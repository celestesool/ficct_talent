import {
    AlertCircle,
    ArrowLeft,
    Award,
    BookOpen,
    Brain,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Play,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { testService } from '../../api/services/testService';

const TestsPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('available'); // available, history
    const studentId = localStorage.getItem('user_id');

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        setLoading(true);
        const [testsResult, historyResult] = await Promise.all([
            testService.getAvailableTests(studentId),
            testService.getTestHistory(studentId)
        ]);

        if (testsResult.success) {
            setTests(testsResult.data);
        }
        if (historyResult.success) {
            setHistory(historyResult.data);
        }
        setLoading(false);
    };

    const handleStartTest = (applicationId) => {
        navigate(`/estudiante/tests/${applicationId}/start`);
    };

    const handleViewResults = (testId) => {
        navigate(`/estudiante/tests/${testId}/results`);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'yellow', text: 'Pendiente', icon: Clock },
            completed: { color: 'green', text: 'Completado', icon: CheckCircle },
            expired: { color: 'red', text: 'Expirado', icon: AlertCircle }
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
        ${badge.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
        ${badge.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
      `}>
                <Icon size={14} />
                {badge.text}
            </span>
        );
    };

    const getScoreBadge = (score) => {
        let color = 'red';
        if (score >= 90) color = 'green';
        else if (score >= 70) color = 'blue';
        else if (score >= 50) color = 'yellow';

        return (
            <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-bold
        ${color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
        ${color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
        ${color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
        ${color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
      `}>
                <Award size={18} />
                {score}%
            </div>
        );
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = date - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return 'Expirado';
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Mañana';
        return `${days} días`;
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <Brain className="animate-pulse mx-auto mb-4 text-primary-600" size={48} />
                    <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Cargando tests...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Button variant="outline" onClick={() => navigate('/estudiante/dashboard')}>
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary-500 to-purple-500"></div>
                        <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Tests de Práctica
                        </h1>
                    </div>
                    <p className={`text-base lg:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Practica con tests generados por IA basados en tus postulaciones
                    </p>
                </div>

                {/* Banner informativo */}
                <Card className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-700">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                            <Brain className="text-primary-600 dark:text-primary-400" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Tests Generados por Inteligencia Artificial
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Cada test es único y se adapta a las habilidades requeridas en la vacante a la que postulaste.
                                Incluye preguntas técnicas, de código y conceptuales para evaluar tu nivel.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`
              px-6 py-3 rounded-lg font-medium transition-all
              ${activeTab === 'available'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : isDark
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-white text-slate-600 hover:text-slate-900'
                            }
            `}
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} />
                            Tests Disponibles ({tests.filter(t => t.status === 'pending').length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`
              px-6 py-3 rounded-lg font-medium transition-all
              ${activeTab === 'history'
                                ? 'bg-primary-600 text-white shadow-lg'
                                : isDark
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-white text-slate-600 hover:text-slate-900'
                            }
            `}
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp size={18} />
                            Historial ({history.length})
                        </div>
                    </button>
                </div>

                {/* Tests Disponibles */}
                {activeTab === 'available' && (
                    <div className="space-y-4">
                        {tests.filter(t => t.status === 'pending').length === 0 ? (
                            <Card className="text-center py-16">
                                <div className={`
                  w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                  ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
                `}>
                                    <BookOpen size={40} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    No hay tests disponibles
                                </h3>
                                <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Los tests se generan automáticamente cuando te postulas a una vacante
                                </p>
                                <Button variant="primary" onClick={() => navigate('/estudiante/ofertas')}>
                                    <Briefcase size={18} className="mr-2" />
                                    Buscar Ofertas
                                </Button>
                            </Card>
                        ) : (
                            tests.filter(t => t.status === 'pending').map((test) => (
                                <Card key={test.id} hover className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Info del test */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        {test.jobTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Briefcase size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                                                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {test.companyName}
                                                        </span>
                                                    </div>
                                                </div>
                                                {getStatusBadge(test.status)}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <Clock size={16} />
                                                    <span className="text-sm">30 minutos</span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <BookOpen size={16} />
                                                    <span className="text-sm">5 preguntas</span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <Calendar size={16} />
                                                    <span className="text-sm">Expira en: {formatDate(test.expiresAt)}</span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <Award size={16} />
                                                    <span className="text-sm">60 puntos</span>
                                                </div>
                                            </div>

                                            <div className={`
                        p-4 rounded-lg mb-4
                        ${isDark ? 'bg-slate-800' : 'bg-slate-50'}
                      `}>
                                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    Test generado por IA con preguntas técnicas, de código y conceptuales
                                                    adaptadas a las habilidades requeridas para esta posición.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Acción */}
                                        <div className="flex flex-col justify-center items-center lg:items-end gap-3">
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={() => handleStartTest(test.applicationId)}
                                                className="w-full lg:w-auto"
                                            >
                                                <Play size={18} className="mr-2" />
                                                Iniciar Test
                                            </Button>
                                            <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                Una vez iniciado, no podrás pausarlo
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Historial */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <Card className="text-center py-16">
                                <div className={`
                  w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                  ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
                `}>
                                    <TrendingUp size={40} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Sin historial de tests
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Completa tu primer test para ver tu historial aquí
                                </p>
                            </Card>
                        ) : (
                            history.map((test) => (
                                <Card key={test.id} hover className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Info del test */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        {test.jobTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Briefcase size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                                                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {test.companyName}
                                                        </span>
                                                    </div>
                                                </div>
                                                {getScoreBadge(test.score)}
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <Award size={16} />
                                                    <span className="text-sm">{test.totalPoints}/{test.maxPoints} pts</span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <Clock size={16} />
                                                    <span className="text-sm">{test.duration} min</span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <Calendar size={16} />
                                                    <span className="text-sm">
                                                        {new Date(test.completedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    <CheckCircle size={16} />
                                                    <span className="text-sm">Completado</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acción */}
                                        <div className="flex flex-col justify-center items-center lg:items-end">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewResults(test.testId)}
                                            >
                                                Ver Resultados
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default TestsPage;
