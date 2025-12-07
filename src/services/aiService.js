// Servicio de IA con Gemini

export const aiService = {
  // Mejora la descripción de proyecto con IA
  improveProjectDescription: async (projectData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `Desarrollo e implementación de ${projectData.title}, aplicando metodologías ágiles y mejores prácticas de ingeniería de software. Utilización de ${projectData.technologies.join(', ')} para crear una solución escalable y eficiente. ${projectData.description}`;
  },

  // Simula la generación de resumen profesional
  generateProfessionalSummary: async (studentData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `Estudiante de Ingeniería en Sistemas en la UAGRM con sólidos conocimientos en desarrollo de software y experiencia práctica en ${studentData.topSkills.join(', ')}. Apasionado por la tecnología y el desarrollo de soluciones innovadoras, con ${studentData.projectCount} proyectos completados y ${studentData.certCount} certificaciones profesionales. Busco oportunidades para aplicar mis habilidades técnicas y continuar mi crecimiento profesional en un entorno desafiante.`;
  },

  // Simula mejora de habilidades técnicas
  improveSkillDescription: async (skill) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const descriptions = {
      'React': 'Desarrollo de aplicaciones web modernas con React, implementando hooks, context API y optimización de rendimiento',
      'Node.js': 'Desarrollo backend con Node.js y Express, creación de APIs RESTful y manejo de bases de datos',
      'Python': 'Programación en Python para desarrollo web, análisis de datos y automatización de procesos',
      'JavaScript': 'Dominio de JavaScript moderno (ES6+), programación asíncrona y manipulación del DOM',
      'MongoDB': 'Diseño y gestión de bases de datos NoSQL con MongoDB, optimización de consultas',
      'SQL': 'Diseño de bases de datos relacionales, consultas complejas y optimización de rendimiento'
    };
    
    return descriptions[skill.name] || `Experiencia práctica en ${skill.name} con ${skill.years_experience} años de práctica`;
  },

  // Simula la generación completa del CV
  generateCompleteCV: async (studentProfile) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const summary = await aiService.generateProfessionalSummary({
      topSkills: studentProfile.skills.slice(0, 3).map(s => s.name),
      projectCount: studentProfile.projects.length,
      certCount: studentProfile.certifications.length
    });

    const improvedProjects = await Promise.all(
      studentProfile.projects.map(async (project) => ({
        ...project,
        aiDescription: await aiService.improveProjectDescription(project)
      }))
    );

    return {
      personalInfo: studentProfile.personalInfo,
      summary: summary,
      education: studentProfile.academicInfo,
      skills: studentProfile.skills,
      projects: improvedProjects,
      certifications: studentProfile.certifications,
      generatedAt: new Date().toISOString()
    };
  }
};

// NOTA: Para conectar con Gemini real, reemplaza esto con:
/*
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const aiService = {
  improveProjectDescription: async (projectData) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Mejora esta descripción de proyecto para un CV profesional: 
    Título: ${projectData.title}
    Descripción: ${projectData.description}
    Tecnologías: ${projectData.technologies.join(', ')}
    
    Genera una descripción profesional de 2-3 líneas que resalte logros y habilidades técnicas.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  },
  
  // Similar para las otras funciones...
};
*/