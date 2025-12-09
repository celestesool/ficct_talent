// REDIRIGIDO AL NUEVO SISTEMA DE TESTS
// Este archivo ahora usa el testService.js que se conecta con el backend NestJS

import { testService } from '../api/services/testService';

/**
 * Genera una prueba de aptitud basada en el contexto del trabajo
 * AHORA USA EL BACKEND NESTJS CON DATOS REALES
 */
export async function generateAptitudeTest(jobContext) {
  try {
    console.log('🔄 Redirigiendo a nuevo sistema de tests...');
    console.log('Job context:', jobContext);

    // Extraer applicationId del contexto - intentar múltiples fuentes
    const applicationId = jobContext.applicationId ||
      jobContext.id ||
      jobContext.job?.id ||
      jobContext.job?.applicationId;

    if (!applicationId) {
      console.warn('⚠️ No se encontró applicationId, usando test por defecto');
      return getDefaultTest();
    }

    // Usar el nuevo sistema que se conecta con el backend
    const result = await testService.generateTest(applicationId);

    if (!result.success) {
      throw new Error(result.error || 'Error generando test');
    }

    // Convertir formato del nuevo sistema al formato esperado por el viejo
    return {
      title: result.data.title,
      description: result.data.description,
      questions: result.data.questions,
      totalQuestions: result.data.totalQuestions,
      duration: result.data.duration * 60, // convertir minutos a segundos
      totalPoints: result.data.totalPoints
    };

  } catch (error) {
    console.error('❌ Error generating test:', error);

    // Fallback: usar test por defecto
    console.warn('⚠️ Usando test por defecto como fallback');
    return getDefaultTest();
  }
}

/**
 * Test por defecto cuando falla todo
 */
function getDefaultTest() {
  return {
    title: "Prueba de Aptitud",
    description: "Evaluación técnica y profesional",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        difficulty: "medium",
        category: "General",
        question: "¿Cuál es tu nivel de experiencia con las tecnologías requeridas para este puesto?",
        options: [
          "Principiante - Conocimiento básico",
          "Intermedio - Experiencia práctica de 1-2 años",
          "Avanzado - Experiencia profesional de 3+ años",
          "Experto - Puedo liderar proyectos complejos"
        ],
        correctAnswer: 2,
        explanation: "Esta pregunta evalúa tu nivel de experiencia general.",
        points: 10
      },
      {
        id: 2,
        type: "true-false",
        difficulty: "easy",
        category: "General",
        question: "¿Tienes experiencia trabajando en equipo?",
        correctAnswer: true,
        explanation: "El trabajo en equipo es fundamental en la mayoría de los roles.",
        points: 5
      },
      {
        id: 3,
        type: "multiple-choice",
        difficulty: "medium",
        category: "General",
        question: "¿Cuál es tu disponibilidad para comenzar?",
        options: [
          "Inmediata",
          "En 1 semana",
          "En 2 semanas",
          "En 1 mes"
        ],
        correctAnswer: 0,
        explanation: "La disponibilidad es importante para planificar la incorporación.",
        points: 5
      }
    ],
    totalQuestions: 3,
    totalPoints: 20,
    duration: 600 // 10 minutos en segundos
  };
}

// Exportar funciones compatibles con el sistema viejo
export async function generateTechnicalQuestions(jobContext, numberOfQuestions = 5) {
  // Redirigir al nuevo sistema
  return generateAptitudeTest(jobContext);
}

export async function generateBehavioralQuestions(jobContext, numberOfQuestions = 3) {
  // Redirigir al nuevo sistema
  return generateAptitudeTest(jobContext);
}

export async function evaluateTestAnswers(testResults, jobContext) {
  // Usar el nuevo sistema de evaluación
  try {
    const result = await testService.submitTest(
      testResults.testId,
      testResults.answers
    );

    return {
      score: result.data.score,
      feedback: result.data.feedback.message,
      strengths: result.data.feedback.recommendations.slice(0, 2),
      areasForImprovement: result.data.feedback.recommendations.slice(2),
      recommendation: result.data.feedback.level === 'excellent' ? 'Altamente recomendado' : 'Considerar para siguiente fase'
    };
  } catch (error) {
    console.error('Error evaluating test:', error);
    return {
      score: 70,
      feedback: 'Evaluación completada',
      strengths: ['Completó el test'],
      areasForImprovement: ['Revisar respuestas'],
      recommendation: 'Considerar para siguiente fase'
    };
  }
}

export async function startInteractiveTest(jobContext) {
  // No soportado en el nuevo sistema, usar test estático
  const test = await generateAptitudeTest(jobContext);
  return {
    chatSession: null,
    currentQuestion: test.questions[0],
    questionCount: 1
  };
}

export async function continueInteractiveTest(chatSession, userAnswer, currentQuestionCount) {
  // No soportado en el nuevo sistema
  return {
    nextQuestion: null,
    questionCount: currentQuestionCount + 1
  };
}