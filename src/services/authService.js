// src/services/authService.js
import { apiService } from './api';

export const authService = {
  // Registro de estudiante
  async registerStudent(studentData) {
    return apiService.post('/auth/register/student', {
      email: studentData.email,
      password: studentData.password,
      CI: parseInt(studentData.ci),
      registration_number: parseInt(studentData.registration_number),
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      phone_number: studentData.phone_number,
      birthDate: studentData.birthDate,
      bio: studentData.bio,
    });
  },

  // Registro de empresa
  async registerCompany(companyData) {
    return apiService.post('/auth/register/company', {
      email: companyData.email,
      password: companyData.password,
      name: companyData.name,
      description: companyData.description,
      website: companyData.website,
      phone_number: companyData.phone_number,
    });
  },

  // Login diferenciado por tipo de usuario
  async login(credentials, userType) {
    const endpoint =
      userType === 'estudiante'
        ? '/auth/login/student'
        : '/auth/login/company';

    const response = await apiService.post(endpoint, {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    return response;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getToken() {
    return localStorage.getItem('access_token');
  },
};
