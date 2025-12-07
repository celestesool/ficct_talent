// src/services/adminAuthService.js
import { apiService } from './api';

export const adminAuthService = {
  /**
   * Login de administrador
   * @param {string} email - Email del admin
   * @param {string} password - Contraseña del admin
   * @returns {Promise} Token y datos del admin
   */
  async adminLogin(email, password) {
    try {
      const response = await apiService.post('/auth/admin/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al iniciar sesión como admin'
      );
    }
  },

  /**
   * Obtener perfil del admin actual
   */
  async getProfile(adminId) {
    try {
      const response = await apiService.get(`/auth/admin/profile/${adminId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener perfil del admin');
    }
  },

  /**
   * Crear nuevo admin (solo super_admin)
   */
  async createAdmin(adminData) {
    try {
      const response = await apiService.post('/auth/admin/create', adminData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al crear nuevo admin'
      );
    }
  },

  /**
   * Listar todos los admins (solo super_admin)
   */
  async listAdmins() {
    try {
      const response = await apiService.get('/auth/admin/list');
      return response.data;
    } catch (error) {
      throw new Error('Error al listar admins');
    }
  }
};
