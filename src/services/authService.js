// src/services/authService.js
import { apiService } from './api';

export const authService = {
  // Registro estudiante
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

  // Registro empresa
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

  // Login
  async login(credentials, userType) {
    const endpoint =
      userType === 'estudiante'
        ? '/auth/login/student'
        : '/auth/login/company';

    const axiosResponse = await apiService.post(endpoint, {
      email: credentials.email,
      password: credentials.password,
    });

    // Axios returns: { data: {...}, status: ... }
    const response = axiosResponse.data;

    if (!response || !response.user) {
      throw new Error('Login response is missing "user"');
    }

    // Normalize user
    const normalizedUser = {
      id: response.user.id,
      email: response.user.email,
      user_type: response.user.user_type,
      name:
        response.user.name ||
        response.user.first_name ||
        response.user.last_name ||
        null,
    };

    // Store tokens
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    // Store user ID needed for companies/jobs
    localStorage.setItem('user_id', normalizedUser.id);

    // Store normalized user
    localStorage.setItem('user', JSON.stringify(normalizedUser));

    return {
      ...response,
      user: normalizedUser,
    };
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getToken() {
    return localStorage.getItem('access_token');
  },
};
