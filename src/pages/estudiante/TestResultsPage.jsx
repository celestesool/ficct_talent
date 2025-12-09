import {
    Award,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Home,
    TrendingUp,
    X,
    XCircle
} from 'lucide-react';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';

const TestResultsPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { results } = location.state || {};

    const [expandedQuestions, setExpandedQuestions] = useState(new Set());

    if (!results) {
        navigate('/estudiante/tests');
        return null;
    }

    const toggleQuestion = (questionId) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) newExpanded.delete(questionId);
        else newExpanded.add(questionId);
        setExpandedQuestions(newExpanded);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'green';
        if (score >= 70) return 'blue';
        if (score >= 50) return 'yellow';
        return 'red';
    };

    const scoreColor = getScoreColor(results.score);

    const correctAnswers = results.results.filter(r => r.isCorrect).length;
    const totalQuestions = results.results.length;

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header de resultados */}
                <Card className={`mb-8 p-8 text-center bg-gradient-to-br
                    ${scoreColor === 'green' ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : ''}
                    ${scoreColor === 'blue' ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' : ''}
                    ${scoreColor === 'yellow' ? 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' : ''}
                    ${scoreColor === 'red' ? 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20' : ''}
                `}>
                    <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center
                        ${scoreColor === 'green' ? 'bg-green-100 dark:bg-green-900/40' : ''}
                        ${scoreColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' : ''}
                        ${scoreColor === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/40' : ''}
                        ${scoreColor === 'red' ? 'bg-red-100 dark:bg-red-900/40' : ''}
                    `}>
                        <div className="text-center">
                            <div className={`text-5xl font-bold
                                ${scoreColor === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                                ${scoreColor === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                                ${scoreColor === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                                ${scoreColor === 'red' ? 'text-red-600 dark:text-red-400' : ''}
                            `}>
                                {results.score}
                            </div>
                            <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                puntos
                            </div>
                        </div>
                    </div>

                    <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {results.feedback.message}
                    </h1>

                    <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Obtuviste {results.totalPoints} de {results.maxPoints} puntos posibles
                    </p>

                    <div className="flex items-center justify-center gap-8 mb-6">
                        <div className="text-center">
                            <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {correctAnswers}/{totalQuestions}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Correctas
                            </div>
                        </div>

                        <div className={`w-px h-12 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

                        <div className="text-center">
                            <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {results.score}%
                            </div>
                            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Precisión
                            </div>
                        </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg
                        ${scoreColor === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : ''}
                        ${scoreColor === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : ''}
                        ${scoreColor === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : ''}
                        ${scoreColor === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : ''}
                    `}>
                        <Award size={24} />
                        {results.feedback.level === 'excellent' && 'Excelente'}
                        {results.feedback.level === 'good' && 'Bueno'}
                        {results.feedback.level === 'average' && 'Regular'}
                        {results.feedback.level === 'needs-improvement' && 'Necesita Mejorar'}
                    </div>
                </Card>

                {/* Recomendaciones */}
                <Card className="mb-8 p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                            <TrendingUp className="text-primary-600 dark:text-primary-400" size={24} />
                        </div>

                        <div>
                            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Recomendaciones para Mejorar
                            </h2>

                            <ul className="space-y-2">
                                {results.feedback.recommendations.map((rec, index) => (
                                    <li key={index} className={`flex items-start gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <CheckCircle size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Detalles por pregunta */}
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Revisión Detallada
                    </h2>

                    <div className="space-y-4">
                        {results.results.map((result, index) => (
                            <Card key={result.questionId} className="overflow-hidden">
                                <button
                                    onClick={() => toggleQuestion(result.questionId)}
                                    className={`w-full p-6 text-left transition-colors
                                        ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}
                                    `}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                                ${result.isCorrect
                                                    ? 'bg-green-100 dark:bg-green-900/30'
                                                    : 'bg-red-100 dark:bg-red-900/30'
                                                }
                                            `}>
                                                {result.isCorrect ? (
                                                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                                                ) : (
                                                    <XCircle className="text-red-600 dark:text-red-400" size={20} />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        Pregunta {index + 1}
                                                    </h3>

                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                        ${result.isCorrect
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }
                                                    `}>
                                                        {result.isCorrect ? `+${result.points} pts` : '0 pts'}
                                                    </span>
                                                </div>

                                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {result.isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`p-2 rounded-lg transition-transform
                                            ${expandedQuestions.has(result.questionId) ? 'rotate-180' : ''}
                                            ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
                                        `}>
                                            <ChevronDown size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                                        </div>
                                    </div>
                                </button>

                                {/* CONTENIDO EXPANDIBLE */}
                                {expandedQuestions.has(result.questionId) && (
                                    <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <div className="pt-6 space-y-4">

                                            {/* Tu respuesta */}
                                            <div>
                                                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    Tu respuesta:
                                                </p>

                                                <div className={`p-4 rounded-lg
                                                    ${result.isCorrect
                                                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                    }
                                                `}>
                                                    <p className={`${result.isCorrect
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-red-700 dark:text-red-400'
                                                        }`}>
                                                        {result.userAnswer === null || result.userAnswer === undefined
                                                            ? 'Sin respuesta'
                                                            : result.type === 'multiple-choice' && result.options
                                                                ? result.options[result.userAnswer] || 'Sin respuesta'
                                                                : typeof result.userAnswer === 'boolean'
                                                                    ? result.userAnswer ? 'Verdadero' : 'Falso'
                                                                    : result.userAnswer}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Respuesta correcta */}
                                            {!result.isCorrect && (
                                                <div>
                                                    <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        Respuesta correcta:
                                                    </p>

                                                    <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                                                        <p className="text-green-700 dark:text-green-400">
                                                            {typeof result.correctAnswer === 'boolean'
                                                                ? result.correctAnswer ? 'Verdadero' : 'Falso'
                                                                : result.type === 'multiple-choice' && result.options
                                                                    ? result.options[result.correctAnswer]
                                                                    : result.correctAnswer}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Acciones */}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button
                                                    variant="outline"
                                                    fullWidth
                                                    onClick={() => navigate('/estudiante/tests')}
                                                >
                                                    <X size={18} className="mr-2" />
                                                    Ver Más Tests
                                                </Button>

                                                <Button
                                                    variant="primary"
                                                    fullWidth
                                                    onClick={() => navigate('/estudiante/dashboard')}
                                                >
                                                    <Home size={18} className="mr-2" />
                                                    Volver al Dashboard
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResultsPage;
