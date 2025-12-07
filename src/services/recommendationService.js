import { apiService } from './api';

/**
 * Servicio para obtener recomendaciones inteligentes
 * Integra con el backend ML
 */
export const recommendationService = {
  /**
   * Obtiene empleos recomendados para un estudiante
   * @param {string} studentId - ID del estudiante
   * @param {number} limit - Número máximo de recomendaciones
   * @returns {Promise} Lista de empleos recomendados
   */
  async getRecommendedJobsForStudent(studentId, limit = 5) {
    try {
      const response = await apiService.get(
        `/recommendations/jobs-for-student/${studentId}?limit=${limit}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      return [];
    }
  },

  /**
   * Obtiene candidatos recomendados para una vacante
   * @param {string} jobId - ID de la vacante
   * @param {number} limit - Número máximo de candidatos
   * @returns {Promise} Lista de candidatos recomendados
   */
  async getRecommendedCandidatesForJob(jobId, limit = 10) {
    try {
      const response = await apiService.get(
        `/recommendations/candidates-for-job/${jobId}?limit=${limit}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recommended candidates:', error);
      return [];
    }
  },

  /**
   * Obtiene score de matching detallado entre estudiante y vacante
   * @param {string} studentId - ID del estudiante
   * @param {string} jobId - ID de la vacante
   * @returns {Promise} Objeto con scores detallados
   */
  async getDetailedMatchScore(studentId, jobId) {
    try {
      const response = await apiService.get(
        `/recommendations/match-score/${studentId}/${jobId}`
      );
      return response.data || null;
    } catch (error) {
      console.error('Error fetching match score:', error);
      return null;
    }
  },
};
