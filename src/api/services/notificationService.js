import api from '../axiosConfig';

// ========================================
// NOTIFICATION SERVICE - User Notifications
// ========================================

export const notificationService = {
    /**
     * Obtiene todas las notificaciones del usuario actual
     * @returns {Promise} Lista de notificaciones
     */
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    /**
     * Marca una notificación como leída
     * @param {string} notificationId - ID de la notificación
     * @returns {Promise} Notificación actualizada
     */
    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Marca todas las notificaciones como leídas
     * @returns {Promise} Resultado de la operación
     */
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/mark-all-read');
        return response.data;
    },

    /**
     * Elimina una notificación
     * @param {string} notificationId - ID de la notificación
     * @returns {Promise} Resultado de la operación
     */
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    },

    /**
     * Obtiene el conteo de notificaciones no leídas
     * @returns {Promise} Número de notificaciones no leídas
     */
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    }
};
