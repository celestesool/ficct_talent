import {
  ArrowLeft // ⭐ AÑADIDO: Icono para volver
  ,

  Award,
  BookOpen,
  Briefcase,
  Code,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

export const CandidatosPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate(); // ⭐ ACTUALIZADO: useNavigate hook
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ⭐ NUEVO: Función para navegar al dashboard
  const handleBackToDashboard = () => {
    navigate('/empresa/dashboard');
  };

  // ⭐ NUEVO: Función para contactar candidato
  const handleContactCandidate = (candidate) => {
    // Aquí podrías implementar lógica de contacto
    console.log('Contactando a:', candidate.name);
    alert(`Función de contacto para ${candidate.name} - Próximamente`);
  };

  // ⭐ NUEVO: Función para programar entrevista
  const handleScheduleInterview = (candidate) => {
    // Aquí podrías implementar lógica de programación
    console.log('Programando entrevista con:', candidate.name);
    alert(`Función de programar entrevista para ${candidate.name} - Próximamente`);
  };

  const [candidates, setCandidates] = useState([
    {
      id: '1',
      name: 'Juan Carlos Pérez García',
      email: 'juan.perez@uagrm.edu.bo',
      phone: '70123456',
      location: 'Santa Cruz, Bolivia',
      career: 'Ingeniería en Sistemas',
      semester: '8vo Semestre',
      gpa: '85.5',
      skills: ['React', 'Node.js', 'JavaScript', 'Python', 'MongoDB'],
      projects: 5,
      certifications: 3,
      match: 95,
      appliedFor: 'Desarrollador Frontend React',
      appliedDate: '2024-01-15',
      status: 'Nuevo'
    },
    {
      id: '2',
      name: 'María Elena González López',
      email: 'maria.gonzalez@uagrm.edu.bo',
      phone: '71234567',
      location: 'La Paz, Bolivia',
      career: 'Ingeniería en Sistemas',
      semester: '7mo Semestre',
      gpa: '88.2',
      skills: ['Java', 'Spring Boot', 'SQL', 'Docker', 'AWS'],
      projects: 3,
      certifications: 2,
      match: 87,
      appliedFor: 'Backend Developer',
      appliedDate: '2024-01-14',
      status: 'Revisado'
    },
    {
      id: '3',
      name: 'Carlos Andrés Ruiz Mendoza',
      email: 'carlos.ruiz@uagrm.edu.bo',
      phone: '72345678',
      location: 'Cochabamba, Bolivia',
      career: 'Ingeniería en Sistemas',
      semester: '9no Semestre',
      gpa: '82.1',
      skills: ['Angular', 'TypeScript', 'Firebase', 'Git', 'Scrum'],
      projects: 4,
      certifications: 4,
      match: 92,
      appliedFor: 'Desarrollador Frontend',
      appliedDate: '2024-01-13',
      status: 'Nuevo'
    },
    {
      id: '4',
      name: 'Ana Patricia Silva Rojas',
      email: 'ana.silva@uagrm.edu.bo',
      phone: '73456789',
      location: 'Santa Cruz, Bolivia',
      career: 'Ingeniería en Sistemas',
      semester: '6to Semestre',
      gpa: '90.3',
      skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow', 'SQL'],
      projects: 2,
      certifications: 1,
      match: 78,
      appliedFor: 'Data Science Intern',
      appliedDate: '2024-01-12',
      status: 'En proceso'
    }
  ]);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    candidate.appliedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.career.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (match >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    if (match >= 70) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nuevo':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Revisado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'En proceso':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const viewCandidateProfile = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeCandidateDetail = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header Mejorado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="mr-2"
            >
              <ArrowLeft size={18} />
            </Button>
            <div className={`w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500`}></div>
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Candidatos
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Encuentra y evalúa el talento joven para tu empresa
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <div className="flex items-center gap-2">
                <Download size={18} />
                Exportar
              </div>
            </Button>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Buscar por nombre, habilidades o puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                  ${isDark
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                  }
                `}
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <select
                className={`
                  px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${isDark
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                  }
                `}
              >
                <option>Todos los puestos</option>
                <option>Desarrollador Frontend</option>
                <option>Backend Developer</option>
                <option>Data Science</option>
              </select>

              <select
                className={`
                  px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${isDark
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                  }
                `}
              >
                <option>Todos los estados</option>
                <option>Nuevo</option>
                <option>Revisado</option>
                <option>En proceso</option>
              </select>

              <Button variant="outline">
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  Más Filtros
                </div>
              </Button>
            </div>
          </div>
        </Card>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {candidates.length}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total Candidatos</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 text-green-600`}>
              {candidates.filter(c => c.match >= 90).length}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Excelente Match</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 text-blue-600`}>
              {candidates.filter(c => c.status === 'Nuevo').length}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Nuevos</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 text-purple-600`}>
              {candidates.filter(c => c.location.includes('Santa Cruz')).length}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>De Santa Cruz</div>
          </Card>
        </div>

        {/* Grid de Candidatos */}
        {filteredCandidates.length === 0 ? (
          <Card className="p-8">
            <div className="text-center py-8">
              <User size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No se encontraron candidatos
              </h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay candidatos postulados'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} hover className="relative transition-all duration-200 hover:shadow-lg">
                {/* Match Score */}
                <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(candidate.match)}`}>
                  {candidate.match}% Match
                </div>

                {/* Status Badge */}
                <div className={`absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </div>

                <div className="flex items-start gap-4 mb-4 pt-2">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold
                    ${isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}
                  `}>
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {candidate.name}
                    </h3>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {candidate.career} • {candidate.semester}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {candidate.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <strong>Postulado para:</strong> {candidate.appliedFor}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Promedio: {candidate.gpa}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Habilidades */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${isDark
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-slate-100 text-slate-700'
                          }
                        `}
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className={`px-2 py-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        +{candidate.skills.length - 4} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Code size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {candidate.projects} proyectos
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {candidate.certifications} certs.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => viewCandidateProfile(candidate)}
                    fullWidth
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Eye size={16} />
                      Ver Perfil
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleContactCandidate(candidate)}
                  >
                    <Mail size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle de Candidato */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-4">
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                  ${isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}
                `}>
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedCandidate.name}
                  </h2>
                  <p className={`text-lg mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedCandidate.career} • {selectedCandidate.semester}
                  </p>
                  <p className={`mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <strong>Postulado para:</strong> {selectedCandidate.appliedFor}
                  </p>
                  <div className="flex gap-2">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(selectedCandidate.match)}`}>
                      {selectedCandidate.match}% Match
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedCandidate.status)}`}>
                      {selectedCandidate.status}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={closeCandidateDetail}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <X size={24} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Información de Contacto */}
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Información de Contacto
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {selectedCandidate.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {selectedCandidate.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {selectedCandidate.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      Postuló: {selectedCandidate.appliedDate}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Información Académica */}
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Información Académica
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Promedio:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedCandidate.gpa}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Proyectos:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedCandidate.projects}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Certificaciones:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedCandidate.certifications}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Semestre:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedCandidate.semester}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Habilidades */}
            <Card className="mt-6 p-6">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Habilidades Técnicas
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCandidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`
                      px-3 py-2 rounded-lg font-medium
                      ${isDark
                        ? 'bg-purple-900/20 text-purple-300 border border-purple-700'
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }
                    `}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Acciones */}
            <div className="flex gap-4 mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleContactCandidate(selectedCandidate)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail size={18} />
                  Contactar Candidato
                </div>
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleScheduleInterview(selectedCandidate)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Briefcase size={18} />
                  Programar Entrevista
                </div>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};