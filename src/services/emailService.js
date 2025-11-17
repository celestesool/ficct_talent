// src/services/emailService.js
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: 'service_v3zypxe',
  templateId: 'template_xu6l4tm',
  publicKey: '6bo9CLtG75L5QBqvp'
};

export const emailService = {
  /**
   * Envía el CV por enlace (único método activo)
   */
  async sendCVLink(toEmail, studentName, cvLink, expires = 'Nunca expira') {
    const templateParams = {
      to_email: toEmail,
      student_name: studentName,
      cv_link: cvLink,
      expires: expires,
      date: new Date().toLocaleDateString('es-BO'),
      reply_to: 'mamjhoss@gmail.com',
      subject: `CV de ${studentName} - Enlace de descarga`,
    };

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return {
        success: true,
        message: `Enlace enviado a ${toEmail}`,
        isRealEmail: true
      };
    } catch (error) {
      console.warn('EmailJS falló, simulando envío...', error);
      // Simulación para desarrollo
      await new Promise(r => setTimeout(r, 1500));
      return {
        success: true,
        message: `Email simulado a ${toEmail} (modo demo)`,
        isRealEmail: false,
        simulated: true
      };
    }
  }
};