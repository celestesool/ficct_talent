import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Code,
    Send,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { testService } from '../../api/services/testService';

const TestExecutionPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { applicationId } = useParams();

    const [loading, setLoading] = useState(true);
    const [test, setTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos en segundos
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTest();
    }, [applicationId]);

    useEffect(() => {
        if (!test) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [test]);

    const loadTest = async () => {
        setLoading(true);
        const result = await testService.generateTest(parseInt(applicationId));

        if (result.success) {
            setTest(result.data);
            setTimeLeft(result.data.duration * 60);
        } else {
            alert('Error al cargar el test');
            navigate('/estudiante/tests');
        }
        setLoading(false);
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        // Preparar respuestas para enviar
        const formattedAnswers = test.questions.map(q => {
            const userAnswer = answers[q.id];

            return {
                questionId: q.id,
                answer: userAnswer !== undefined ? userAnswer : null, // Enviar el índice tal cual
                correctAnswer: q.correctAnswer,
                points: q.points,
                type: q.type,
                options: q.options || null, // Incluir las opciones
                question: q.question // Incluir el texto de la pregunta
            };
        });

        const result = await testService.submitTest(test.testId, formattedAnswers);

        if (result.success) {
            // Enriquecer los resultados con options y question del test original
            const detailedResults = {
                ...result.data,
                results: result.data.results.map(r => {
                    const originalQuestion = test.questions.find(q => q.id === r.questionId);
                    return {
                        ...r,
                        options: originalQuestion?.options || r.options || null,
                        question: originalQuestion?.question || r.question || null,
                    };
                })
            };

            navigate(`/estudiante/tests/${test.testId}/results`, {
                state: { results: detailedResults }
            });
        } else {
            alert('Error al enviar el test');
            setSubmitting(false);
        }
    };

    const handleAutoSubmit = () => {
        if (!submitting) {
            alert('Se acabó el tiempo! El test se enviará automáticamente.');
            handleSubmit();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const answered = Object.keys(answers).length;
        return (answered / test.questions.length) * 100;
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <Clock className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
                    <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Generando test con IA...
                    </p>
                </div>
            </div>
        );
    }

    const question = test.questions[currentQuestion];
    const isAnswered = answers[question.id] !== undefined;

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>

            {/* Header fijo */}
            <div className={`
        sticky top-0 z-40 border-b
        ${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}
        backdrop-blur-md
      `}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {test.title}
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Pregunta {currentQuestion + 1} de {test.questions.length}
                            </p>
                        </div>

                        {/* Timer */}
                        <div className={`
              flex items-center gap-3 px-4 py-2 rounded-lg
              ${timeLeft < 300
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse'
                                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                            }
            `}>
                            <Clock size={20} />
                            <span className="text-lg font-bold font-mono">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Progreso: {Object.keys(answers).length}/{test.questions.length} respondidas
                            </span>
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {Math.round(getProgress())}%
                            </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${getProgress()}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <Card className="p-8 mb-6">
                    {/* Categoría y dificultad */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-700'}
            `}>
                            {question.category}
                        </span>
                        <span className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${question.difficulty === 'easy'
                                ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                : question.difficulty === 'medium'
                                    ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                    : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                            }
            `}>
                            {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                        </span>
                        <span className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}
            `}>
                            {question.points} puntos
                        </span>
                    </div>

                    {/* Pregunta */}
                    <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {question.question}
                    </h3>

                    {/* Código (si aplica) */}
                    {question.code && (
                        <div className={`
              mb-6 p-4 rounded-lg font-mono text-sm
              ${isDark ? 'bg-slate-800 text-green-400' : 'bg-slate-900 text-green-300'}
            `}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Code size={16} />
                                <span className="text-xs">Código</span>
                            </div>
                            <pre className="overflow-x-auto">{question.code}</pre>
                        </div>
                    )}

                    {/* Opciones según tipo de pregunta */}
                    {question.type === 'multiple-choice' && (
                        <div className="space-y-3">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(question.id, index)}
                                    className={`
                    w-full p-4 rounded-lg text-left transition-all border-2
                    ${answers[question.id] === index
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : isDark
                                                ? 'border-slate-700 hover:border-slate-600 bg-slate-800'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${answers[question.id] === index
                                                ? 'border-primary-500 bg-primary-500'
                                                : isDark ? 'border-slate-600' : 'border-slate-300'
                                            }
                    `}>
                                            {answers[question.id] === index && (
                                                <CheckCircle size={16} className="text-white" />
                                            )}
                                        </div>
                                        <span className={`
                      font-medium
                      ${answers[question.id] === index
                                                ? 'text-primary-700 dark:text-primary-400'
                                                : isDark ? 'text-slate-300' : 'text-slate-700'
                                            }
                    `}>
                                            {option}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {question.type === 'true-false' && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleAnswer(question.id, true)}
                                className={`
                  flex-1 p-6 rounded-lg text-center font-bold text-lg transition-all border-2
                  ${answers[question.id] === true
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : isDark
                                            ? 'border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-300'
                                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                    }
                `}
                            >
                                Verdadero
                            </button>
                            <button
                                onClick={() => handleAnswer(question.id, false)}
                                className={`
                  flex-1 p-6 rounded-lg text-center font-bold text-lg transition-all border-2
                  ${answers[question.id] === false
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                        : isDark
                                            ? 'border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-300'
                                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                    }
                `}
                            >
                                Falso
                            </button>
                        </div>
                    )}

                    {question.type === 'code' && (
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Tu respuesta:
                            </label>
                            <textarea
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswer(question.id, e.target.value)}
                                placeholder="Escribe tu código aquí..."
                                rows={8}
                                className={`
                  w-full p-4 rounded-lg font-mono text-sm border-2 transition-all
                  ${isDark
                                        ? 'bg-slate-800 border-slate-600 text-green-400 placeholder-slate-500'
                                        : 'bg-slate-900 border-slate-700 text-green-300 placeholder-slate-400'
                                    }
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                `}
                            />
                            {question.testCases && (
                                <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Casos de prueba:
                                    </p>
                                    {question.testCases.map((tc, i) => (
                                        <div key={i} className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Input: <code>{tc.input}</code> → Output: <code>{tc.output}</code>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                {/* Navegación */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                    >
                        <ChevronLeft size={18} className="mr-2" />
                        Anterior
                    </Button>

                    <div className="flex gap-2">
                        {test.questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`
                  w-10 h-10 rounded-lg font-semibold transition-all
                  ${index === currentQuestion
                                        ? 'bg-primary-600 text-white'
                                        : answers[test.questions[index].id] !== undefined
                                            ? isDark
                                                ? 'bg-green-900/30 text-green-400 border border-green-700'
                                                : 'bg-green-100 text-green-700 border border-green-300'
                                            : isDark
                                                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                                                : 'bg-white text-slate-600 border border-slate-200'
                                    }
                `}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestion === test.questions.length - 1 ? (
                        <Button
                            variant="primary"
                            onClick={() => setShowConfirmSubmit(true)}
                            disabled={Object.keys(answers).length === 0}
                        >
                            <Send size={18} className="mr-2" />
                            Enviar Test
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                        >
                            Siguiente
                            <ChevronRight size={18} className="ml-2" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    ¿Enviar test?
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Has respondido {Object.keys(answers).length} de {test.questions.length} preguntas.
                                    Una vez enviado, no podrás modificar tus respuestas.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setShowConfirmSubmit(false)}
                            >
                                <X size={18} className="mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                <Send size={18} className="mr-2" />
                                {submitting ? 'Enviando...' : 'Confirmar'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TestExecutionPage;
