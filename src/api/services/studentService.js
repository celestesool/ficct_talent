import axios from 'axios';
import { API_BASE } from '../api';

export const studentService = {

  // Método con manejo de errores integrado
  getStudentByIdWithErrorHandling: async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE}/students/${studentId}`);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      // Manejo específico para 404 (estudiante no encontrado)
      if (error.response?.status === 404) {
        return {
          data: null,
          error: 'Estudiante no encontrado',
          success: false
        };
      }

      return {
        data: null,
        error: error.response?.data?.message || 'Error al cargar los datos del estudiante',
        success: false
      };
    }
  },

  // Método para actualizar perfil con manejo de errores integrado
  updateStudentProfileWithErrorHandling: async (studentId, updateData) => {
    try {
      const response = await axios.patch(`${API_BASE}/students/${studentId}`, updateData);
      return {
        data: response.data,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || 'Error al actualizar el perfil del estudiante',
        success: false
      };
    }
  },

};