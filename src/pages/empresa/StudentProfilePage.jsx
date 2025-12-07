import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  Code,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

export const StudentProfilePage = () => {
  const { studentId } = useParams();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const companyId = localStorage.getItem('user_id');
        
        // Obtener datos completos del estudiante
        const response = await api.get(`/students/${studentId}/cv-data`);
        setStudent(response.data);

        // Registrar vista del perfil
        if (companyId) {
          await api.post(`/students/${studentId}/track-view`, {
            company_id: companyId
          });
        }
      } catch (err) {
        console.error('Error loading student profile:', err);
        setError('No se pudo cargar el perfil del estudiante');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentProfile();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {error || 'No se encontró el perfil del estudiante'}
            </p>
            <Button onClick={() => navigate('/empresa/candidatos')}>
              Volver a Candidatos
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const academicInfo = student.academicInfo && student.academicInfo.length > 0 
    ? student.academicInfo[0] 
    : null;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header con botón volver */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/empresa/candidatos')}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a Candidatos
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Información Personal */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Información Personal */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isDark ? 'bg-primary-500/20' : 'bg-primary-100'
                }`}>
                  <User size={48} className="text-primary-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {student.first_name} {student.last_name}
                </h2>
                {academicInfo && (
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {academicInfo.major}
                  </p>
                )}
              </div>

              {/* Información de Contacto */}
              <div className="space-y-3">
                {student.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {student.email}
                    </span>
                  </div>
                )}
                {student.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {student.phone_number}
                    </span>
                  </div>
                )}
                {student.registration_number && (
                  <div className="flex items-center gap-2">
                    <User size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Matrícula: {student.registration_number}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Card de Información Académica */}
            {academicInfo && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="text-primary-600" size={20} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Información Académica
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Carrera
                    </p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {academicInfo.major}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Universidad
                    </p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {academicInfo.institution}
                    </p>
                  </div>
                  {academicInfo.GPA && (
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        Promedio
                      </p>
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {academicInfo.GPA}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Período
                    </p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {academicInfo.start_year} - {academicInfo.estimated_graduation_year || 'Presente'}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Habilidades */}
            {student.skills && student.skills.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-primary-600" size={20} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Habilidades Técnicas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.skills.map((skill, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {skill.skill?.name || skill.name || 'Habilidad'}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {skill.level || 'Intermedio'}
                        </span>
                      </div>
                      {skill.years_experience > 0 && (
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                          {skill.years_experience} {skill.years_experience === 1 ? 'año' : 'años'} de experiencia
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Proyectos */}
            {student.projects && student.projects.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="text-primary-600" size={20} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Proyectos
                  </h3>
                </div>
                <div className="space-y-4">
                  {student.projects.map((project, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {project.title}
                      </h4>
                      <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map((tech, techIdx) => (
                            <span
                              key={techIdx}
                              className={`px-2 py-1 rounded text-xs ${
                                isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-700'
                              }`}
                            >
                              {tech.name || tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs">
                        {project.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                              {new Date(project.start_date).toLocaleDateString()} - 
                              {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Presente'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Certificaciones */}
            {student.certifications && student.certifications.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-primary-600" size={20} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Certificaciones
                  </h3>
                </div>
                <div className="space-y-3">
                  {student.certifications.map((cert, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {cert.name}
                      </h4>
                      <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {cert.issuing_organization}
                      </p>
                      {cert.issue_date && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            Emitido: {new Date(cert.issue_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
