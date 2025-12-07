import axios from 'axios';
import { API_BASE } from './api';


const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // Obtener token del localStorage
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, simplemente retornarla
        return response;
    },
    (error) => {
        // Manejar errores comunes
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // No autorizado - token inválido o expirado
                    console.error(' No autorizado. Redirigiendo al login...');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');

                    // Redirigir al login solo si no estamos ya en la página de login
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Prohibido - sin permisos
                    console.error('No tienes permisos para realizar esta acción');
                    break;

                case 404:
                    // No encontrado
                    console.error(' Recurso no encontrado:', data.message);
                    break;

                case 500:
                    // Error del servidor
                    console.error(` Error ${status}:`, data.message);
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            console.error(' No se pudo conectar con el servidor. Verifica tu conexión.');
        } else {
            // Algo pasó al configurar la petición
            console.error(' Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
