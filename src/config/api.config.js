/**
 * Configuración centralizada de la API
 * 
 * Variables de entorno:
 * - VITE_API_BASE_URL: URL del backend (definir en .env)
 * 
 * Desarrollo: http://localhost:3000
 * Producción: URL de tu servidor (Render, Vercel, etc.)
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 60000, // 60 segundos (aumentado para generación de IA)
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Export directo para compatibilidad
export const API_BASE = API_CONFIG.BASE_URL;

// Endpoints comunes (opcional, para documentación)
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',

  // Companies
  COMPANIES: '/companies',
  COMPANY_PROFILE: (id) => `/companies/${id}/profile`,
  COMPANY_VIEWS: (id) => `/companies/${id}/views/count`,
  TRACK_VIEW: (id) => `/companies/${id}/track-view`,

  // Jobs
  JOBS: '/jobs',
  JOB_BY_ID: (id) => `/jobs/${id}`,
  JOB_APPLICATIONS: (id) => `/jobs/${id}/applications`,

  // Students
  STUDENTS: '/students',
  STUDENT_CV: (id) => `/students/${id}/cv-data`,

  // Applications
  APPLICATIONS: '/applications',
};

export default API_CONFIG;
