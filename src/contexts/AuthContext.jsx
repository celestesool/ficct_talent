import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulamos un usuario autenticado con id estático
  useEffect(() => {
    const mockUser = {
      id: 'c1528cb3-fecd-4427-8d81-055214884fc3',
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@example.com',
    };

    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);