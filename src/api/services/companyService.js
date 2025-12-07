import axios from 'axios';
import { API_BASE } from '../api';

// Servicio para gestión de ofertas de empresa (CU10)
export const companyJobService = {

    // Obtener ofertas de una empresa
    getCompanyJobs: async (companyId) => {
        try {
            const response = await axios.get(`${API_BASE}/jobs?company=${companyId}`);
            return {
                data: response.data,
                error: null,
                success: true
            };
        } catch (error) {
            return {
                data: [],
                error: error.response?.data?.message || 'Error al cargar las ofertas',
                success: false
            };
        }
    },

    // Crear nueva oferta
    createJob: async (jobData) => {
        try {
            const response = await axios.post(`${API_BASE}/jobs`, jobData);
            return {
                data: response.data,
                error: null,
                success: true
            };
        } catch (error) {
            return {
                data: null,
                error: error.response?.data?.message || 'Error al crear la oferta',
                success: false
            };
        }
    },

    // Actualizar oferta
    updateJob: async (jobId, jobData) => {
        try {
            const response = await axios.patch(`${API_BASE}/jobs/${jobId}`, jobData);
            return {
                data: response.data,
                error: null,
                success: true
            };
        } catch (error) {
            return {
                data: null,
                error: error.response?.data?.message || 'Error al actualizar la oferta',
                success: false
            };
        }
    },

    // Eliminar oferta
    deleteJob: async (jobId) => {
        try {
            await axios.delete(`${API_BASE}/jobs/${jobId}`);
            return {
                data: null,
                error: null,
                success: true
            };
        } catch (error) {
            return {
                data: null,
                error: error.response?.data?.message || 'Error al eliminar la oferta',
                success: false
            };
        }
    },

    // Obtener candidatos de una oferta
    getJobCandidates: async (jobId) => {
        try {
            const response = await axios.get(`${API_BASE}/jobs/${jobId}/applications`);
            return {
                data: response.data,
                error: null,
                success: true
            };
        } catch (error) {
            return {
                data: [],
                error: error.response?.data?.message || 'Error al cargar los candidatos',
                success: false
            };
        }
    },

    // Obtener conteo de vistas de perfil
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
