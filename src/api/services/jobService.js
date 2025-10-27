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

};