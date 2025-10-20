import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Router, useRouter } from './contexts/RouterContext';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { DashboardEstudiante } from './pages/estudiante/DashboardEstudiante';
import { DashboardEmpresa } from './pages/empresa/DashboardEmpresa';

const AppRoutes = () => {
  const { currentRoute } = useRouter();

  // Sistema de rutas simple
  const routes = {
    '/': <HomePage />,
    '/estudiante/login': <LoginPage />,
    '/estudiante/registro': <RegistroPage />,
    '/estudiante/dashboard': <DashboardEstudiante />,
    '/empresa/login': <LoginPage />,
    '/empresa/registro': <RegistroPage />,
    '/empresa/dashboard': <DashboardEmpresa />,
  };

  return routes[currentRoute] || <HomePage />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;