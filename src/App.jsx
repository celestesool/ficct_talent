import { AuthProvider } from './contexts/AuthContext';
import { Router, useRouter } from './contexts/RouterContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';

// Páginas de Estudiante
import JobSearch from './components/JobSearch';
import { CertificacionesPage } from './pages/estudiante/CertificacionesPage';
import { CVGeneratorPage } from './pages/estudiante/CVGeneratorPage'; // ⭐ NUEVO
import { DashboardEstudiante } from './pages/estudiante/DashboardEstudiante';
import { HabilidadesPage } from './pages/estudiante/HabilidadesPage';
import { InfoAcademicaPage } from './pages/estudiante/InfoAcademicaPage';
import { PerfilPage } from './pages/estudiante/PerfilPage';
import { ProyectosPage } from './pages/estudiante/ProyectosPage';

// Páginas de Empresa
import { CandidatosPage } from './pages/empresa/CandidatosPage';
import { DashboardEmpresa } from './pages/empresa/DashboardEmpresa';
import { OfertasPage } from './pages/empresa/OfertasPage';

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
    '/estudiante/ofertas': <JobSearch/>,
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