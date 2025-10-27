import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un usuario en localStorage al cargar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials, userType) => {
    try {
      const response = await authService.login(credentials, userType);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Funciones de registro (si las necesitas)
  const registerStudent = async (studentData) => {
    return await authService.registerStudent(studentData);
  };

  const registerCompany = async (companyData) => {
    return await authService.registerCompany(companyData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login, 
      logout,
      registerStudent,
      registerCompany
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);