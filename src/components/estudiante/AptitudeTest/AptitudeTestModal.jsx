import {
  AlertCircle,
  Brain,
  CheckCircle,
  Clock,
  Loader,
  Play,
  SkipForward,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { jobService } from '../../../api/services/jobService';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  evaluateTestAnswers,
  generateAptitudeTest
} from '../../../services/aptitudeTestService';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

export const AptitudeTestModal = ({ jobData, onClose }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [generatingTest, setGeneratingTest] = useState(false);
  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    loadJobContextAndGenerateTest();
  }, []);

  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !testCompleted) {
      handleTestCompletion();
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, testCompleted]);

  const loadJobContext = async () => {
    const result = await jobService.getJobWithCompanyWithErrorHandling(jobData.jobId);

    if (result.success) {
      // Simular la generación de preguntas basadas en el contexto del job
      const generatedTest = generateTestQuestions(result.data);
      setTestData(generatedTest);
    } else {
      console.error('Error loading job context:', result.error);
    }
    setLoading(false);
  };

  const loadJobContextAndGenerateTest = async () => {
    try {
      setGeneratingTest(true);

      // 1. Obtener contexto del job
      const jobResult = await jobService.getJobWithCompanyWithErrorHandling(jobData.jobId);
      if (jobResult.success) {
        // 2. Generar prueba con IA
        const generatedTest = await generateAptitudeTest(jobResult.data);
        setTestData(generatedTest);
      } else {
        throw new Error('No se pudo cargar el contexto del trabajo');
      }
    } catch (error) {
      console.error('Error generating test:', error);
      // Fallback a prueba por defecto
      setTestData(getDefaultTest());
    } finally {
      setLoading(false);
      setGeneratingTest(false);
    }
  };

  const generateTestQuestions = (jobContext) => {
    // Esto es un mock - en la implementación real llamarías a la API de OpenAI
    const { job, company } = jobContext;

    return {
      title: `Prueba de Aptitud - ${job.title}`,
      description: `Evaluación técnica para el puesto de ${job.title} en ${company.name}`,
      duration: 1800, // 30 minutos
      totalQuestions: 5,
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: `¿Cuál es tu enfoque principal para desarrollar una feature en ${job.requirements?.includes('React') ? 'React' : 'el framework mencionado'}?`,
          options: [
            'Planificación detallada antes de codificar',
            'Prototipo rápido y iteraciones',
            'Seguir patrones establecidos en el proyecto',
            'Consultar con el equipo primero'
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          type: 'multiple_choice',
          question: `En ${company.name}, que se dedica a ${company.description?.substring(0, 50)}..., ¿cómo priorizarías las tareas?`,
          options: [
            'Por fecha de entrega',
            'Por impacto en el negocio',
            'Por complejidad técnica',
            'Por dependencias con otros equipos'
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          type: 'code',
          question: 'Escribe una función que verifique si un string es un palíndromo',
          language: 'javascript',
          correctAnswer: null // Se evaluaría automáticamente
        },
        {
          id: 4,
          type: 'multiple_choice',
          question: '¿Cómo manejas los conflictos en el código?',
          options: [
            'Reviso cuidadosamente ambos lados',
            'Consulto con los desarrolladores involucrados',
            'Sigo las guías del equipo',
            'Pruebo ambas soluciones'
          ],
          correctAnswer: 0
        },
        {
          id: 5,
          type: 'text',
          question: `Describe cómo abordarías un problema complejo en ${job.title}`,
          correctAnswer: null // Evaluación cualitativa
        }
      ]
    };
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleTestCompletion();
    }
  };

  const handleTestCompletion = async () => {
    setTestCompleted(true);
    setTestStarted(false);

    // Evaluar respuestas con IA
    try {
      const jobResult = await jobService.getJobWithCompanyWithErrorHandling(jobData.jobId);
      if (jobResult.success) {
        const testResults = {
          answers: userAnswers,
          questions: testData.questions,
          timeSpent: 1800 - timeLeft
        };

        const evaluationResult = await evaluateTestAnswers(testResults, jobResult.data);
        setEvaluation(evaluationResult);
      }
    } catch (error) {
      console.error('Error evaluating test:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || generatingTest) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {generatingTest ? 'Generando prueba...' : 'Cargando...'}
            </h2>
          </div>
          <div className="flex justify-center items-center py-12 flex-col">
            <Loader className="animate-spin h-12 w-12 text-primary-600 mb-4" />
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {generatingTest
                ? 'Personalizando la prueba para el puesto...'
                : 'Preparando evaluación...'
              }
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {testData?.title}
            </h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {testData?.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
          >
            <X size={24} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {!testStarted && !testCompleted && (
            <div className="text-center py-8">
              <Brain size={64} className={`mx-auto mb-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Preparado para la prueba
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  <Clock className="mx-auto mb-2" size={32} />
                  <p>Duración: 30 minutos</p>
                </div>
                <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  <Brain className="mx-auto mb-2" size={32} />
                  <p>{testData?.totalQuestions} preguntas</p>
                </div>
                <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  <AlertCircle className="mx-auto mb-2" size={32} />
                  <p>No puedes pausar la prueba</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => setTestStarted(true)}>
                <div className="flex items-center gap-2">
                  <Play size={18} />
                  Comenzar Prueba
                </div>
              </Button>
            </div>
          )}

          {testStarted && !testCompleted && testData && (
            <div>
              {/* Timer y Progreso */}
              <div className="flex justify-between items-center mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock size={20} className={timeLeft < 300 ? 'text-red-500' : 'text-primary-500'} />
                  <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Pregunta {currentQuestion + 1} de {testData.totalQuestions}
                </div>
              </div>

              {/* Pregunta Actual */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {testData.questions[currentQuestion].question}
                </h3>

                {testData.questions[currentQuestion].type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {testData.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(testData.questions[currentQuestion].id, index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${userAnswers[testData.questions[currentQuestion].id] === index
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                          } ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {testData.questions[currentQuestion].type === 'code' && (
                  <textarea
                    placeholder="Escribe tu código aquí..."
                    className={`w-full h-48 p-4 rounded-lg border-2 font-mono text-sm ${isDark
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    onChange={(e) => handleAnswerSelect(testData.questions[currentQuestion].id, e.target.value)}
                  />
                )}

                {testData.questions[currentQuestion].type === 'text' && (
                  <textarea
                    placeholder="Escribe tu respuesta aquí..."
                    className={`w-full h-32 p-4 rounded-lg border-2 ${isDark
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    onChange={(e) => handleAnswerSelect(testData.questions[currentQuestion].id, e.target.value)}
                  />
                )}
              </div>

              {/* Navegación */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  disabled={!userAnswers[testData.questions[currentQuestion].id]}
                >
                  {currentQuestion === testData.totalQuestions - 1 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      Finalizar
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SkipForward size={18} />
                      Siguiente
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {testCompleted && (
            <div className="text-center py-8">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ¡Prueba Completada!
              </h3>

              {evaluation && (
                <div className="text-left mb-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Puntuación: {evaluation.score}/10</h4>
                    <p className="text-sm">{evaluation.feedback}</p>
                  </div>
                </div>
              )}

              <Button variant="primary" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};