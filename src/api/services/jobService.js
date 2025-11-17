import axios from 'axios';
import { API_BASE } from '../api';

export const jobService = {

  // Método con manejo de errores integrado
  getJobWithCompanyWithErrorHandling: async (jobId) => {
    try {
      const response = await axios.get(`${API_BASE}/jobs/${jobId}/with-company`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar datos del job y empresa',
        success: false
      };
    }
  },

  getActiveJobsWithErrorHandling: async () => {
    try {
      const response = await axios.get(`${API_BASE}/jobs/active`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar las ofertas de empleo',
        success: false
      };
    }
  },

  getJobByIdWithErrorHandling: async (jobId) => {
    try {
      const response = await axios.get(`${API_BASE}/jobs/${jobId}`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      // Manejo específico para 404 (vacante no encontrada)
      if (error.response?.status === 404) {
        return {
          data: null,
          error: 'Vacante no encontrada',
          success: false
        };
      }

      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar el detalle de la vacante',
        success: false
      };
    }
  },

};