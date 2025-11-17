import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Páginas comunes
import { ConfirmEmailPage } from './pages/ConfirmEmailPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';

// Páginas de Estudiante
import { CertificacionesPage } from './pages/estudiante/CertificacionesPage';
import { DashboardEstudiante } from './pages/estudiante/DashboardEstudiante';
import { HabilidadesPage } from './pages/estudiante/HabilidadesPage';
import { InfoAcademicaPage } from './pages/estudiante/InfoAcademicaPage';
import JobSearch from './pages/estudiante/JobSearch';
import { PerfilPage } from './pages/estudiante/PerfilPage';
import { ProyectosPage } from './pages/estudiante/ProyectosPage';

// Páginas de Empresa
import { CandidatosPage } from './pages/empresa/CandidatosPage';
import { DashboardEmpresa } from './pages/empresa/DashboardEmpresa';
import { OfertasPage } from './pages/empresa/OfertasPage';

// Layouts
import { CompanyLayout } from './components/layout/CompanyLayout';
import { StudentLayout } from './components/layout/StudentLayout';
import { UserTypeProvider } from './contexts/userTypeContext';
import { CVEditor } from './pages/estudiante/CVEditor';
import { PostulacionesPage } from './pages/estudiante/PostulacionesPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserTypeProvider>
          <Router>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/:userType/login" element={<LoginPage />} />
              <Route path="/:userType/registro" element={<RegistroPage />} />
              <Route path="/confirmar" element={<ConfirmEmailPage />} />

              {/* Rutas de Estudiante */}
              <Route path="/estudiante" element={<StudentLayout />}>
                <Route index element={<DashboardEstudiante />} />
                <Route path="dashboard" element={<DashboardEstudiante />} />
                <Route path="perfil" element={<PerfilPage />} />
                <Route path="proyectos" element={<ProyectosPage />} />
                <Route path="certificaciones" element={<CertificacionesPage />} />
                <Route path="habilidades" element={<HabilidadesPage />} />
                <Route path="academico" element={<InfoAcademicaPage />} />
                <Route path="ofertas" element={<JobSearch />} />
                <Route path="postulaciones" element={<PostulacionesPage />} />
                <Route path="cv-generator" element={<CVEditor />} />
              </Route>

              {/* Rutas de Empresa */}
              <Route path="/empresa" element={<CompanyLayout />}>
                <Route index element={<DashboardEmpresa />} />
                <Route path="dashboard" element={<DashboardEmpresa />} />
                <Route path="ofertas" element={<OfertasPage />} />
                <Route path="ofertas/nueva" element={<OfertasPage />} />
                <Route path="ofertas/:id" element={<OfertasPage />} />
                <Route path="candidatos" element={<CandidatosPage />} />
                <Route path="candidatos/:id" element={<CandidatosPage />} />
              </Route>

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </UserTypeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;