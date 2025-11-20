import axios from 'axios';
import { API_BASE } from '../api';

export const academicService = {

  // Método con manejo de errores integrado
  getAcademicInfoByStudentIdWithErrorHandling: async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE}/academic-info/student/${studentId}`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      // Manejo específico para 404 (información académica no encontrada)
      if (error.response?.status === 404) {
        return {
          data: null,
          error: 'Información académica no encontrada',
          success: false
        };
      }

      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar la información académica',
        success: false
      };
    }
  },

  // Método para crear información académica con manejo de errores integrado
  createAcademicInfoWithErrorHandling: async (studentId, academicData) => {
    try {
      const response = await axios.post(`${API_BASE}/academic-info/student/${studentId}`, academicData);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al crear la información académica',
        success: false
      };
    }
  },

};