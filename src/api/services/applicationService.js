import axios from 'axios';
import { API_BASE } from '../api';

export const applicationService = {

  applyToJob: async (applicationData) => {
    try {
      const response = await axios.post(`${API_BASE}/applications`, applicationData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Error al enviar la postulación'
      };
    }
  },

  // Método para obtener todas las postulaciones del estudiante
  getStudentApplications: async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE}/applications/student/${studentId}`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar las postulaciones',
        success: false
      };
    }
  },

  // Método para cancelar una postulación
  withdrawApplication: async (applicationId, studentId) => {
    try {
      const response = await axios.delete(`${API_BASE}/applications/${applicationId}/withdraw`, {
        data: { student_id: studentId }
      });
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cancelar la postulación',
        success: false
      };
    }
  },

  // Método para obtener el historial de una aplicación
  getApplicationTimeline: async (applicationId) => {
    try {
      const response = await axios.get(`${API_BASE}/application-history/application/${applicationId}`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar el historial',
        success: false
      };
    }
  },

  // Método para obtener los detalles de una aplicación por ID
  getApplicationById: async (applicationId) => {
    try {
      const response = await axios.get(`${API_BASE}/applications/${applicationId}`);

      // Mapeo de estados del backend (español) a frontend (inglés) para consistencia
      const statusMap = {
        'aplicado': 'applied',
        'revisado': 'reviewed',
        'entrevista': 'interview',
        'prueba_tecnica': 'technical_test',
        'entrevista_final': 'final_interview',
        'aceptado': 'accepted',
        'rechazado': 'rejected',
        'cancelado': 'withdrawn'
      };

      let data = response.data;
      if (data && data.status) {
        data.status = statusMap[data.status] || data.status;
      }

      return {
        success: true,
        data: data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Error al cargar los detalles de la postulación'
      };
    }
  }
};