import api from '../axiosConfig';

// ========================================
// ADMIN SERVICE - Dashboard, Moderation, Announcements
// ========================================

export const adminService = {
    // ========================================
    // DASHBOARD
    // ========================================
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard-stats');
        return response.data;
    },

    // ========================================
    // USER MODERATION
    // ========================================
    getUsersForModeration: async () => {
        const response = await api.get('/admin/moderation/users');
        return response.data;
    },

    updateUserStatus: async (userId, status, reason = null) => {
        const response = await api.patch(`/admin/moderation/users/${userId}/status`, {
            status,
            reason
        });
        return response.data;
    },

    // ========================================
    // ANNOUNCEMENTS
    // ========================================
    getAnnouncements: async () => {
        const response = await api.get('/admin/announcements');
        return response.data;
    },

    createAnnouncement: async (announcementData) => {
        const response = await api.post('/admin/announcements', announcementData);
        return response.data;
    },

    deleteAnnouncement: async (announcementId) => {
        const response = await api.delete(`/admin/announcements/${announcementId}`);
        return response.data;
    }
};
