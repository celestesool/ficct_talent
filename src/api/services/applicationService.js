import axios from 'axios';
import { API_BASE } from '../api';

export const applicationService = {
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
  }
};