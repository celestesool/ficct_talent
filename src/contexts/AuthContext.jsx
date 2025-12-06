import { createContext, useContext, useState } from 'react';
// import { authService } from '../services/authService'; // ⚠️ Comentado para modo diseño

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🎨 MODO DISEÑO: Usuario simulado sin backend
  const mockUser = {
    id: 1,
    email: 'estudiante@demo.com',
    user_type: 'estudiante',
    name: 'Juan Pérez',
    first_name: 'Juan',
    last_name: 'Pérez'
  };

  const [user, setUser] = useState(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (credentials, userType) => {
    // 🎨 MODO DISEÑO: Login simulado
    console.log('🎨 Login simulado (sin backend):', credentials, userType);

    // Simular usuario según tipo
    const simulatedUser = userType === 'empresa'
      ? { id: 2, email: credentials.email, user_type: 'empresa', name: 'Empresa Demo' }
      : { id: 1, email: credentials.email, user_type: 'estudiante', name: 'Estudiante Demo' };

    setUser(simulatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(simulatedUser));

    return { user: simulatedUser };

    /* ⚠️ Comentado: llamada real al backend
    try {
      const response = await authService.login(credentials, userType);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
    */
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    console.log('🎨 Logout simulado');
  };

  // 🎨 MODO DISEÑO: Registro simulado
  const registerStudent = async (studentData) => {
    console.log('🎨 Registro estudiante simulado (sin backend):', studentData);
    return { success: true, message: 'Registro simulado exitoso' };
  };

  const registerCompany = async (companyData) => {
    console.log('🎨 Registro empresa simulado (sin backend):', companyData);
    return { success: true, message: 'Registro simulado exitoso' };
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