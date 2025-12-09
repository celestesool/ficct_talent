import api from '../../services/api';

export const statsService = {
    // Obtener estadísticas generales del dashboard
    async getDashboardStats() {
        try {
            const response = await api.get('/admin/stats/dashboard');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener estadísticas de estudiantes
    async getStudentStats() {
        try {
            const response = await api.get('/admin/stats/students');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching student stats:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener estadísticas de empresas
    async getCompanyStats() {
        try {
            const response = await api.get('/admin/stats/companies');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching company stats:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener estadísticas de ofertas laborales
    async getJobStats() {
        try {
            const response = await api.get('/admin/stats/jobs');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching job stats:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener estadísticas de postulaciones
    async getApplicationStats() {
        try {
            const response = await api.get('/admin/stats/applications');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching application stats:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener tendencias mensuales
    async getMonthlyTrends() {
        try {
            const response = await api.get('/admin/stats/trends/monthly');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching monthly trends:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener ofertas por categoría
    async getJobsByCategory() {
        try {
            const response = await api.get('/admin/stats/jobs/by-category');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching jobs by category:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener actividad reciente
    async getRecentActivity(limit = 10) {
        try {
            const response = await api.get('/admin/stats/activity/recent', {
                params: { limit }
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener reporte completo
    async getFullReport(startDate, endDate) {
        try {
            const response = await api.get('/admin/stats/report', {
                params: { startDate, endDate }
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching full report:', error);
            return { success: false, error: error.message };
        }
    },

    // Exportar reporte a PDF
    async exportReportPDF(startDate, endDate) {
        try {
            const response = await api.get('/admin/stats/export/pdf', {
                params: { startDate, endDate },
                responseType: 'blob'
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error exporting PDF:', error);
            return { success: false, error: error.message };
        }
    },

    // Exportar reporte a Excel
    async exportReportExcel(startDate, endDate) {
        try {
            const response = await api.get('/admin/stats/export/excel', {
                params: { startDate, endDate },
                responseType: 'blob'
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error exporting Excel:', error);
            return { success: false, error: error.message };
        }
    }
};
