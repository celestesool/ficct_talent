import api from '../axiosConfig';

// ========================================
// RECOMMENDATION SERVICE - Jobs for Students & Candidates for Jobs
// ========================================

export const recommendationService = {
    // ========================================
    // FOR STUDENTS
    // ========================================
    /**
     * Obtiene empleos recomendados para un estudiante
     * @param {string} studentId - ID del estudiante
     * @param {number} limit - Número máximo de recomendaciones (default: 5)
     * @returns {Promise} Lista de empleos recomendados con match score
     */
    getRecommendedJobsForStudent: async (studentId, limit = 5) => {
        const response = await api.get(`/recommendations/jobs-for-student/${studentId}`, {
            params: { limit }
        });
        return response.data;
    },

    // ========================================
    // FOR COMPANIES
    // ========================================
    /**
     * Obtiene candidatos recomendados para un empleo
     * @param {string} jobId - ID del empleo
     * @param {number} limit - Número máximo de candidatos (default: 10)
     * @returns {Promise} Lista de candidatos recomendados con match score
     */
    getRecommendedCandidatesForJob: async (jobId, limit = 10) => {
        const response = await api.get(`/recommendations/candidates-for-job/${jobId}`, {
            params: { limit }
        });
        return response.data;
    },

    // ========================================
    // DETAILED MATCH SCORE
    // ========================================
    /**
     * Calcula el score de matching detallado entre un estudiante y un empleo
     * @param {string} studentId - ID del estudiante
     * @param {string} jobId - ID del empleo
     * @returns {Promise} Score detallado de matching
     */
    getDetailedMatchScore: async (studentId, jobId) => {
        const response = await api.get(`/recommendations/match-score/${studentId}/${jobId}`);
        return response.data;
    }
};
