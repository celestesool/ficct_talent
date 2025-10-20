import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Router, useRouter } from './contexts/RouterContext';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';

// Páginas de Estudiante
import { DashboardEstudiante } from './pages/estudiante/DashboardEstudiante';
import { PerfilPage } from './pages/estudiante/PerfilPage';
import { ProyectosPage } from './pages/estudiante/ProyectosPage';
import { CertificacionesPage } from './pages/estudiante/CertificacionesPage';
import { HabilidadesPage } from './pages/estudiante/HabilidadesPage';
import { InfoAcademicaPage } from './pages/estudiante/InfoAcademicaPage';
import { CVGeneratorPage } from './pages/estudiante/CVGeneratorPage'; // ⭐ NUEVO

// Páginas de Empresa
import { DashboardEmpresa } from './pages/empresa/DashboardEmpresa';
import { OfertasPage } from './pages/empresa/OfertasPage';
import { CandidatosPage } from './pages/empresa/CandidatosPage';

const AppRoutes = () => {
  const { currentRoute } = useRouter();

  // Sistema de rutas completo
  const routes = {
    // Página principal
    '/': <HomePage />,
    
    // Rutas de autenticación
    '/estudiante/login': <LoginPage />,
    '/estudiante/registro': <RegistroPage />,
    '/empresa/login': <LoginPage />,
    '/empresa/registro': <RegistroPage />,
    
    // Rutas de Estudiante
    '/estudiante/dashboard': <DashboardEstudiante />,
    '/estudiante/perfil': <PerfilPage />,
    '/estudiante/proyectos': <ProyectosPage />,
    '/estudiante/certificaciones': <CertificacionesPage />,
    '/estudiante/habilidades': <HabilidadesPage />,
    '/estudiante/academico': <InfoAcademicaPage />,
    '/estudiante/cv-generator': <CVGeneratorPage />, // ⭐ NUEVA RUTA
    
    // Rutas de Empresa
    '/empresa/dashboard': <DashboardEmpresa />,
    '/empresa/ofertas': <OfertasPage />,
    '/empresa/candidatos': <CandidatosPage />,
    '/empresa/ofertas/nueva': <OfertasPage />,
    '/empresa/ofertas/:id': <OfertasPage />,
    '/empresa/candidatos/:id': <CandidatosPage />,
    
    // Rutas adicionales
    '/estudiante/ofertas': <DashboardEstudiante />,
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