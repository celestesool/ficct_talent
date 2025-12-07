import { GoogleGenerativeAI } from "@google/generative-ai";
import behavioralQuestionsPrompt from './prompts/behavioral-questions.txt?raw';
import technicalQuestionsPrompt from './prompts/technical-questions.txt?raw';
import testEvaluationPrompt from './prompts/test-evaluation.txt?raw';
import testGenerationPrompt from './prompts/test-generation.txt?raw';

const key = import.meta.env.VITE_GEMINI_API_KEY;

if (!key) {
  throw new Error('Missing Gemini API Key. Check your environment configuration.');
}

const ai = new GoogleGenerativeAI(key);

// Generar prueba completa basada en el contexto del job
export async function generateAptitudeTest(jobContext) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Ajustar la estructura para que coincida con la respuesta del backend
  const job = jobContext.job || jobContext;
  const company = jobContext.company || jobContext.job?.company;

  if (!job || !company) {
    throw new Error('Estructura de datos incorrecta del backend');
  }

  const prompt = `
${testGenerationPrompt}

CONTEXTO DEL PUESTO:
- Título: ${job.title}
- Descripción: ${job.description}
- Requisitos: ${job.requirements}
- Responsabilidades: ${job.responsibilities}
- Tipo de empleo: ${job.job_type}
- Ubicación: ${job.location}

CONTEXTO DE LA EMPRESA:
- Nombre: ${company.name}
- Descripción: ${company.description}
- Industria: ${company.industry || 'Tecnología'}

Genera una prueba de aptitud que incluya preguntas técnicas, de comportamiento y casos prácticos específicos para este contexto.
  `;

  try {
    console.log('Enviando prompt a Gemini...');
    console.log('Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log('Respuesta completa de Gemini:', response);

    // **CORRECCIÓN: Extraer el texto correctamente**
    let textResponse;

    // Método 1: Intentar con la nueva API
    if (typeof response.text === 'function') {
      textResponse = response.text();
    }
    // Método 2: Acceder directamente desde la estructura
    else if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      textResponse = response.candidates[0].content.parts[0].text;
    }
    // Método 3: Fallback
    else {
      console.error('Estructura de respuesta no reconocida:', response);
      throw new Error('Estructura de respuesta no reconocida');
    }

    console.log('Texto extraído de Gemini:', textResponse);

    const parsedTest = parseGeneratedTest(textResponse);
    console.log('Test parseado:', parsedTest);

    return parsedTest;

  } catch (error) {
    console.error('Error generating test:', error);
    throw new Error('No se pudo generar la prueba de aptitud');
  }
}

// Generar preguntas técnicas específicas
export async function generateTechnicalQuestions(jobContext, numberOfQuestions = 5) {
  const job = jobContext.job || jobContext;
  const company = jobContext.company || jobContext.job?.company;

  const prompt = `
${technicalQuestionsPrompt}

CONTEXTO TÉCNICO:
- Puesto: ${job.title}
- Tecnologías: ${job.requirements}
- Descripción: ${job.description}
- Empresa: ${company.name}

Genera ${numberOfQuestions} preguntas técnicas específicas para evaluar las habilidades requeridas.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseTechnicalQuestions(response.text());
  } catch (error) {
    console.error('Error generating technical questions:', error);
    throw new Error('No se pudieron generar las preguntas técnicas');
  }
}

// Generar preguntas de comportamiento
export async function generateBehavioralQuestions(jobContext, numberOfQuestions = 3) {
  const job = jobContext.job || jobContext;
  const company = jobContext.company || jobContext.job?.company;

  const prompt = `
${behavioralQuestionsPrompt}

CONTEXTO:
- Puesto: ${job.title}
- Responsabilidades: ${job.responsibilities}
- Empresa: ${company.name}
- Industria: ${company.industry || 'Tecnología'}

Genera ${numberOfQuestions} preguntas de comportamiento relevantes para este puesto y empresa.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseBehavioralQuestions(response.text());
  } catch (error) {
    console.error('Error generating behavioral questions:', error);
    throw new Error('No se pudieron generar las preguntas de comportamiento');
  }
}

// Evaluar respuestas del candidato
export async function evaluateTestAnswers(testResults, jobContext) {
  const job = jobContext.job || jobContext;
  const company = jobContext.company || jobContext.job?.company;

  const prompt = `
${testEvaluationPrompt}

CONTEXTO DEL PUESTO:
- Título: ${job.title}
- Requisitos: ${job.requirements}
- Empresa: ${company.name}

RESULTADOS DEL TEST:
${JSON.stringify(testResults, null, 2)}

Evalúa las respuestas y proporciona un análisis detallado.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseEvaluation(response.text());
  } catch (error) {
    console.error('Error evaluating test:', error);
    throw new Error('No se pudo evaluar la prueba');
  }
}

// Chat en tiempo real para pruebas interactivas
export async function startInteractiveTest(jobContext) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: testGenerationPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: `Entendido. Soy un evaluador de aptitudes técnicas y profesionales. Estoy listo para realizar una evaluación para el puesto de ${jobContext.job.title} en ${jobContext.company.name}.`,
          },
        ],
      },
    ],
  });

  // Mensaje inicial para comenzar la evaluación
  const initialPrompt = `Comienza la evaluación para el puesto de ${jobContext.job.title}. Presenta la primera pregunta.`;
  const result = await chat.sendMessage(initialPrompt);
  const response = await result.response;

  return {
    chatSession: chat,
    currentQuestion: response.text(),
    questionCount: 1
  };
}

// Continuar con la siguiente pregunta
export async function continueInteractiveTest(chatSession, userAnswer, currentQuestionCount) {
  const result = await chatSession.sendMessage(userAnswer);
  const response = await result.response;

  return {
    nextQuestion: response.text(),
    questionCount: currentQuestionCount + 1
  };
}

// Funciones auxiliares para parsear respuestas
function parseGeneratedTest(text) {
  try {
    console.log('Texto a parsear:', text);

    // Limpiar el texto - quitar markdown code blocks
    let cleanText = text.trim();

    // Remover ```json y ``` si existen
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    cleanText = cleanText.trim();
    console.log('Texto limpio:', cleanText);

    // Intentar parsear como JSON
    if (cleanText.startsWith('{') || cleanText.startsWith('[')) {
      const parsed = JSON.parse(cleanText);
      console.log('JSON parseado exitosamente:', parsed);

      // Validar que tenga preguntas
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        console.warn('JSON no tiene array de questions, usando fallback');
        return getDefaultTest();
      }

      return parsed;
    }

    // Si no es JSON válido, usar fallback
    console.warn('No se pudo parsear como JSON, usando fallback');
    return getDefaultTest();

  } catch (error) {
    console.error('Error parsing generated test:', error);
    console.error('Error details:', error.message);
    return getDefaultTest();
  }
}

function parseTechnicalQuestions(text) {
  // Similar a parseGeneratedTest pero específico para preguntas técnicas
  return parseGeneratedTest(text);
}

function parseBehavioralQuestions(text) {
  // Similar a parseGeneratedTest pero específico para preguntas de comportamiento
  return parseGeneratedTest(text);
}

function parseEvaluation(text) {
  try {
    return {
      score: extractScore(text),
      feedback: text,
      strengths: extractStrengths(text),
      areasForImprovement: extractAreasForImprovement(text),
      recommendation: extractRecommendation(text)
    };
  } catch (error) {
    return {
      score: 0,
      feedback: text,
      strengths: [],
      areasForImprovement: [],
      recommendation: 'Revisar manualmente'
    };
  }
}

function extractScore(text) {
  const scoreMatch = text.match(/(\d+(?:\.\d+)?)\/10|(\d+)%/i);
  return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 7;
}

function extractStrengths(text) {
  const strengthMatch = text.match(/Fortalezas?:([^]*?)(?=Áreas|Debilidades|$)/i);
  return strengthMatch ? strengthMatch[1].split('\n').filter(s => s.trim()) : [];
}

function extractAreasForImprovement(text) {
  const improvementMatch = text.match(/(Áreas de mejora|Debilidades):([^]*?)(?=Recomendación|$)/i);
  return improvementMatch ? improvementMatch[2].split('\n').filter(s => s.trim()) : [];
}

function extractRecommendation(text) {
  const recommendationMatch = text.match(/Recomendación:([^]*)$/i);
  return recommendationMatch ? recommendationMatch[1].trim() : 'Considerar para siguiente fase';
}

function getDefaultTest() {
  return {
    title: "Prueba de Aptitud",
    description: "Evaluación técnica y profesional",
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "Describe tu experiencia con las tecnologías requeridas",
        options: [
          "Principiante - Conocimiento básico",
          "Intermedio - Experiencia práctica",
          "Avanzado - Experiencia profesional",
          "Experto - Puedo liderar proyectos"
        ]
      }
    ],
    totalQuestions: 1,
    duration: 1800
  };
}