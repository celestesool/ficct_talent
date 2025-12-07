import axios from 'axios';
import { API_BASE, ENDPOINTS } from '../config/api.config';

export const companyProfileService = {
  // Registrar vista de perfil
  trackView: async (companyId, studentId = null) => {
    try {
      await axios.post(`${API_BASE}/companies/${companyId}/track-view`, {
        student_id: studentId
      });
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  },

  // Obtener conteo de vistas
  getViewsCount: async (companyId, days = 30) => {
    try {
      const response = await axios.get(`${API_BASE}/companies/${companyId}/views/count?days=${days}`);
      return response.data.count || 0;
    } catch (error) {
      console.error('Error getting views count:', error);
      return 0;
    }
  }
};
