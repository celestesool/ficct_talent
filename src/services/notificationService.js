// src/services/notificationService.js
// Servicio ligero de notificaciones basado en localStorage y datos existentes

export const notificationService = {
  /**
   * Obtener notificaciones para estudiantes
   * Como no hay endpoint de notificaciones, usamos las aplicaciones del estudiante
   */
  async getNotifications() {
    try {
      const studentId = localStorage.getItem('user_id');
      if (!studentId) return [];

      // Intentar obtener aplicaciones del estudiante desde un endpoint que exista
      const response = await fetch(`http://localhost:3000/jobs`);
      if (!response.ok) return [];

      const jobs = await response.json();
      const notifications = [];

      // Buscar si el estudiante ha aplicado a algún trabajo
      jobs.forEach(job => {
        if (job.applications && Array.isArray(job.applications)) {
          job.applications.forEach(app => {
            if (app.student_id === studentId || app.student?.id === studentId) {
              notifications.push({
                id: app.id,
                type: 'application_status',
                title: 'Estado de postulacion',
                message: `Tu aplicacion a "${job.title}" esta en estado: ${app.status || 'pendiente'}`,
                created_at: app.applied_at || app.created_at,
                read: this.isRead(app.id)
              });
            }
          });
        }
      });

      notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return notifications.slice(0, 10);
    } catch (error) {
      console.warn('Could not load student notifications:', error.message);
      return [];
    }
  },

  /**
   * Obtener notificaciones para empresa (genera desde aplicaciones a sus ofertas)
   */
  async getCompanyNotifications() {
    try {
      const companyId = localStorage.getItem('user_id');
      if (!companyId) return [];

      const response = await fetch(`http://localhost:3000/jobs/company/${companyId}`);
      if (!response.ok) return [];

      const jobs = await response.json();
      const notifications = [];

      jobs.forEach(job => {
        if (job.applications && Array.isArray(job.applications)) {
          job.applications.forEach(app => {
            if (app.student) {
              notifications.push({
                id: app.id,
                type: 'new_application',
                title: 'Nueva postulacion',
                message: `${app.student.first_name || 'Un candidato'} ${app.student.last_name || ''} aplico a "${job.title}"`,
                created_at: app.applied_at || app.created_at || new Date().toISOString(),
                read: this.isRead(app.id)
              });
            }
          });
        }
      });

      notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return notifications.slice(0, 10);
    } catch (error) {
      console.warn('Could not load company notifications:', error.message);
      return [];
    }
  },

  /**
   * Marcar una notificación como leída (localStorage)
   */
  async markAsRead(notificationId) {
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readIds.includes(notificationId)) {
      readIds.push(notificationId);
      localStorage.setItem('readNotifications', JSON.stringify(readIds));
    }
    return { success: true };
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead() {
    localStorage.setItem('allNotificationsRead', Date.now().toString());
    return { success: true };
  },

  /**
   * Verificar si una notificación está leída (localStorage)
   */
  isRead(notificationId) {
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    return readIds.includes(notificationId);
  },

  /**
   * Limpiar estado de lectura
   */
  clearReadState() {
    localStorage.removeItem('readNotifications');
    localStorage.removeItem('allNotificationsRead');
  }
};
