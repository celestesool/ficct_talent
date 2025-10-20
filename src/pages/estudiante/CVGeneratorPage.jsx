import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from '../../contexts/RouterContext';
import { Navbar } from '../../components/common/Navbar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CVPreview } from '../../components/estudiante/CVPreview';
import { aiService } from '../../services/aiService';
import { exportToPDF } from '../../utils/pdfExporter';
import { 
  FileText,
  Download,
  Sparkles,
  Edit3,
  Save,
  RefreshCw,
  Eye,
  Loader
} from 'lucide-react';

export const CVGeneratorPage = () => {
  const { isDark } = useTheme();
  const { navigate } = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cvGenerated, setCvGenerated] = useState(false);

  // Mock data del estudiante (después vendrá del context/BD)
  const [studentProfile] = useState({
    personalInfo: {
      first_name: 'Juan Carlos',
      last_name: 'Pérez García',
      email: 'juan.perez@uagrm.edu.bo',
      phone_number: '70123456',
      ci: '12345678',
      registration_number: '2021000000'
    },
    academicInfo: {
      degree: 'Ingeniería en Sistemas',
      major: 'Desarrollo de Software',
      institution: 'Universidad Autónoma Gabriel René Moreno',
      start_year: '2021',
      estimated_graduation_year: '2026',
      graduation_year: null,
      GPA: 85
    },
    skills: [
      { name: 'React', level: 'Avanzado', years_experience: 2 },
      { name: 'Node.js', level: 'Intermedio', years_experience: 2 },
      { name: 'Python', level: 'Avanzado', years_experience: 3 },
      { name: 'MongoDB', level: 'Intermedio', years_experience: 1 },
      { name: 'JavaScript', level: 'Avanzado', years_experience: 3 },
      { name: 'SQL', level: 'Intermedio', years_experience: 2 }
    ],
    projects: [
      {
        id: '1',
        title: 'Sistema de Gestión Universitaria',
        description: 'Desarrollo de plataforma web para gestión académica',
        start_date: '2023-03-01',
        end_date: '2023-08-15',
        project_url: 'https://github.com/usuario/proyecto1',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: '2',
        title: 'App de Delivery',
        description: 'Aplicación móvil para pedidos de comida',
        start_date: '2023-09-01',
        end_date: '2023-12-20',
        project_url: 'https://github.com/usuario/proyecto2',
        technologies: ['React Native', 'Firebase']
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect',
        issuing_organization: 'Amazon Web Services',
        issue_date: '2023-06-15',
        expiration_date: '2026-06-15'
      },
      {
        id: '2',
        name: 'Professional Scrum Master I',
        issuing_organization: 'Scrum.org',
        issue_date: '2023-09-20'
      }
    ]
  });

  const [cvData, setCvData] = useState({
    personalInfo: studentProfile.personalInfo,
    summary: '',
    education: studentProfile.academicInfo,
    skills: studentProfile.skills,
    projects: studentProfile.projects,
    certifications: studentProfile.certifications
  });

  const handleGenerateCV = async () => {
    setIsGenerating(true);
    try {
      // Llamada al servicio de IA (mock por ahora)
      const generatedCV = await aiService.generateCompleteCV(studentProfile);
      setCvData(generatedCV);
      setCvGenerated(true);
    } catch (error) {
      console.error('Error generando CV:', error);
      alert('Error al generar el CV. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditField = (field, value) => {
    setCvData(prev => {
      if (field.startsWith('project-')) {
        const projectIndex = parseInt(field.split('-')[1]);
        const newProjects = [...prev.projects];
        newProjects[projectIndex].aiDescription = value;
        return { ...prev, projects: newProjects };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleExportPDF = () => {
    exportToPDF('cv-content', `CV-${studentProfile.personalInfo.last_name}-${studentProfile.personalInfo.first_name}`);
  };

  const handleImproveSection = async (section) => {
    setIsGenerating(true);
    try {
      if (section === 'summary') {
        const improved = await aiService.generateProfessionalSummary({
          topSkills: studentProfile.skills.slice(0, 3).map(s => s.name),
          projectCount: studentProfile.projects.length,
          certCount: studentProfile.certifications.length
        });
        setCvData(prev => ({ ...prev, summary: improved }));
      }
    } catch (error) {
      console.error('Error mejorando sección:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Generador de CV con IA
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Crea tu CV profesional optimizado con inteligencia artificial
              </p>
            </div>
            {!cvGenerated && (
              <Button 
                variant="primary" 
                onClick={handleGenerateCV}
                disabled={isGenerating}
              >
                <div className="flex items-center gap-2">
                  {isGenerating ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  {isGenerating ? 'Generando...' : 'Generar CV con IA'}
                </div>
              </Button>
            )}
          </div>
        </div>

        {!cvGenerated ? (
          /* Vista antes de generar */
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <div className="text-center py-12">
                <FileText size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tu CV profesional en segundos
                </h3>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  La IA analizará tu perfil, proyectos y certificaciones para crear un CV optimizado en formato Harvard
                </p>
                <Button variant="primary" onClick={handleGenerateCV} disabled={isGenerating}>
                  <div className="flex items-center gap-2">
                    {isGenerating ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {isGenerating ? 'Generando con IA...' : 'Generar mi CV'}
                  </div>
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ¿Qué incluirá tu CV?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Resumen profesional optimizado
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      La IA crea un resumen impactante basado en tus habilidades
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Descripción mejorada de proyectos
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Tus {studentProfile.projects.length} proyectos con descripciones profesionales
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Formato Harvard profesional
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Diseño limpio y profesional aceptado internacionalmente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Editable antes de exportar
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Revisa y ajusta cualquier sección antes de descargar
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Vista después de generar */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Panel de controles */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Acciones
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant={isEditing ? 'success' : 'primary'}
                    fullWidth
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                      {isEditing ? 'Guardar Cambios' : 'Editar CV'}
                    </div>
                  </Button>

                  <Button 
                    variant="secondary"
                    fullWidth
                    onClick={handleExportPDF}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download size={18} />
                      Descargar PDF
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    fullWidth
                    onClick={handleGenerateCV}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isGenerating ? <Loader className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                      Regenerar con IA
                    </div>
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Mejorar Secciones
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    fullWidth
                    onClick={() => handleImproveSection('summary')}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles size={16} />
                      Mejorar Resumen
                    </div>
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Información
                </h3>
                <div className={`text-sm space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <p>✓ CV generado con IA</p>
                  <p>✓ Formato Harvard</p>
                  <p>✓ {studentProfile.projects.length} proyectos incluidos</p>
                  <p>✓ {studentProfile.certifications.length} certificaciones</p>
                  <p>✓ {studentProfile.skills.length} habilidades técnicas</p>
                </div>
              </Card>
            </div>

            {/* Preview del CV */}
            <div className="lg:col-span-2">
              <CVPreview 
                cvData={cvData}
                isEditing={isEditing}
                onEdit={handleEditField}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};