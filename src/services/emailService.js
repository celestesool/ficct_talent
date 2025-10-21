// services/emailService.js
import emailjs from '@emailjs/browser';

// REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES REALES
const EMAILJS_CONFIG = {
  serviceId: 'service_v3zypxe', // REEMPLAZA con tu Service ID real
  templateId: 'template_xu6l4tm', // REEMPLAZA con tu Template ID real  
  publicKey: '6bo9CLtG75L5QBqvp' // REEMPLAZA con tu Public Key real
};

export const emailService = {
  async sendRealEmail(toEmail, studentName, cvData) {
    try {
      console.log('🚀 Iniciando envío de email real a:', toEmail);
      
      const templateParams = {
        to_email: toEmail,
        student_name: studentName,
        career: cvData.education?.degree || 'Ingeniería en Sistemas',
        skills: cvData.skills?.slice(0, 4).map(s => s.name).join(', ') || 'React, Node.js, Python',
        projects_count: cvData.projects?.length || 0,
        date: new Date().toLocaleString('es-BO'),
        reply_to: 'mamjhoss@gmail.com'
      };

      console.log('📤 Enviando con configuración:', EMAILJS_CONFIG);
      console.log('📝 Parámetros del template:', templateParams);

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('✅ Email enviado exitosamente:', result);
      
      return {
        success: true,
        message: `¡Email REAL enviado a ${toEmail}!`,
        emailId: result.text,
        timestamp: new Date().toISOString(),
        isRealEmail: true
      };

    } catch (error) {
      console.error('❌ Error EmailJS:', error);
      return {
        success: false,
        error: error.text || error.message,
        fallback: true
      };
    }
  }
};