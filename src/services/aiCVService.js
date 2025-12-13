// src/api/services/aiCVService.js
const key = import.meta.env.VITE_GROQ_API_KEY;

if (!key) {
  throw new Error('Missing Groq API Key. Check your environment configuration.');
}

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
8. las palabras con acento, agregalas sin acento.

CV ACTUAL:
{JSON_INPUT}

Devuelve SOLO el JSON mejorado:
`;

// Función principal
export async function improveCVWithAI(currentCV) {
  const prompt = IMPROVE_CV_PROMPT.replace('{JSON_INPUT}', JSON.stringify(currentCV, null, 2));

  console.log('Enviando a Groq para mejorar CV...');
  console.log('Prompt:', prompt);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const textResponse = result.choices[0]?.message?.content;

    if (!textResponse) {
      throw new Error('No response content received');
    }

    console.log('Respuesta de Groq:', textResponse);

    const improvedCV = parseImprovedCV(textResponse);
    console.log('CV mejorado parseado:', improvedCV);

    return improvedCV;

  } catch (error) {
    console.error('Error mejorando CV con IA:', error);
    throw new Error('No se pudo mejorar el CV con IA');
  }
}

// Parsear respuesta de Groq
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