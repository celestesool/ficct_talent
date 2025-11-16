// src/api/services/aiCVService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const key = import.meta.env.VITE_GEMINI_API_KEY;

if (!key) {
  throw new Error('Missing Gemini API Key. Check your environment configuration.');
}

const ai = new GoogleGenerativeAI(key);

// Prompt estricto para mejorar el CV
const IMPROVE_CV_PROMPT = `
Eres un experto en redacción de CVs para reclutadores de tecnología.

TAREA: Mejora el siguiente CV para hacerlo más profesional, impactante y atractivo.

REGLAS ESTRICTAS:
1. NO agregues ni elimines campos.
2. NO cambies nombres de propiedades.
3. Solo mejora el texto dentro de los campos existentes.
4. Usa lenguaje técnico, cuantificable y orientado a resultados.
5. Mantén el mismo idioma del CV original.
6. Si un campo está vacío, déjalo vacío (no inventes).
7. Devuelve SOLO el JSON mejorado, sin markdown, sin explicaciones.

CV ACTUAL:
{JSON_INPUT}

Devuelve SOLO el JSON mejorado:
`;

// Función principal
export async function improveCVWithAI(currentCV) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = IMPROVE_CV_PROMPT.replace('{JSON_INPUT}', JSON.stringify(currentCV, null, 2));

  console.log('Enviando a Gemini para mejorar CV...');
  console.log('Prompt:', prompt);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extraer texto (compatible con diferentes versiones)
    let textResponse;
    if (typeof response.text === 'function') {
      textResponse = response.text();
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
      textResponse = response.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Estructura de respuesta no reconocida');
    }

    console.log('Respuesta de Gemini:', textResponse);

    const improvedCV = parseImprovedCV(textResponse);
    console.log('CV mejorado parseado:', improvedCV);

    return improvedCV;

  } catch (error) {
    console.error('Error mejorando CV con IA:', error);
    throw new Error('No se pudo mejorar el CV con IA');
  }
}

// Parsear respuesta de Gemini
function parseImprovedCV(text) {
  try {
    let cleanText = text.trim();

    // Quitar bloques de código
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    cleanText = cleanText.trim();

    // Intentar parsear JSON
    if (cleanText.startsWith('{') || cleanText.startsWith('[')) {
      const parsed = JSON.parse(cleanText);

      // Validar que tenga al menos student
      if (!parsed.student && !parsed.projects && !parsed.skills) {
        console.warn('JSON no tiene estructura de CV, usando fallback');
        return null;
      }

      return parsed;
    }

    console.warn('No se pudo parsear como JSON');
    return null;

  } catch (error) {
    console.error('Error parseando CV mejorado:', error);
    return null;
  }
}