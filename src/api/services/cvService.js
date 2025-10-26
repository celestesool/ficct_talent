import axios from 'axios';

const API_BASE = 'https://group-project-nest-backend.onrender.com';

export const cvService = {
  // Método básico - solo hace la petición
  getCVData: async (studentId) => {
    const response = await axios.get(`${API_BASE}/students/${studentId}/cv-data`);
    return response.data;
  },

  // Método con manejo de errores integrado
  getCVDataWithErrorHandling: async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE}/students/${studentId}/cv-data`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar datos del CV',
        success: false
      };
    }
  }
};