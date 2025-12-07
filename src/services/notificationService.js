// src/services/notificationService.js
import { apiService } from './api';

export const notificationService = {
  /**
   * Obtener todas las notificaciones del usuario
   */
  async getNotifications() {
    try {
      const response = await apiService.get('/notifications');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  /**
   * Marcar una notificación como leída
   */
  async markAsRead(notificationId) {
    try {
      const response = await apiService.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead() {
    try {
      const response = await apiService.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Eliminar una notificación
   */
  async deleteNotification(notificationId) {
    try {
      const response = await apiService.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};
