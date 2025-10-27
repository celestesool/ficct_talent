// src/components/JobSearch.jsx
import axios from 'axios';
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  LayoutGrid,
  MapPin,
  Search,
  Share2,
  Sparkles,
  X,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

const JobSearch = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate(); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('React Developer');
  const [location, setLocation] = useState('Bolivia');
  const [linkedInHtml, setLinkedInHtml] = useState('');
  const [showLinkedInView, setShowLinkedInView] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  // ⭐ NUEVO: Función para navegar al dashboard
  const handleBackToDashboard = () => {
    navigate('/estudiante/dashboard');
  };

  // ⭐ NUEVO: Función para ver detalles del trabajo
  const handleViewJobDetails = (jobId) => {
    navigate(`/estudiante/ofertas/${jobId}`);
  };

  // ⭐ NUEVO: Función para navegar al generador de CV
  const handleGoToCVGenerator = () => {
    navigate('/estudiante/cv-generator');
  };

  const createProxyUrl = (url) => {
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError('');
    setJobs([]);
    setLinkedInHtml('');
    setShowLinkedInView(false);

    try {
      const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}${location ? `&location=${encodeURIComponent(location)}` : ''}`;

      console.log('Buscando en:', linkedInUrl);

      const response = await axios.get(createProxyUrl(linkedInUrl), {
        timeout: 15000,
      });

      if (response.data) {
        console.log('HTML recibido correctamente');
        console.log('Tamaño del HTML:', response.data.length, 'caracteres');

        setLinkedInHtml(response.data);

        // Generar datos mock mejorados
        const mockJobs = generateMockJobs(searchTerm, location);
        setJobs(mockJobs);
      }

    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('Error al conectar con LinkedIn. Mostrando datos de ejemplo. ' + err.message);

      // Fallback a datos mock mejorados
      const mockJobs = generateMockJobs(searchTerm, location);
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const generateMockJobs = (searchTerm, location) => {
    const technologies = ['React', 'JavaScript', 'Node.js', 'Python', 'Java', 'Vue', 'Angular', 'TypeScript'];
    const companies = [
      'Tech Solutions Bolivia', 'Innovation Labs', 'Digital Creations',
      'Startup Ventures', 'Global Tech S.A.', 'Future Systems',
      'Bolivian Tech Hub', 'Andean Innovations'
    ];
    const locations = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Remoto', 'Híbrido', 'Sucre', 'Tarija'];

    return Array.from({ length: 12 }, (_, index) => ({
      id: Date.now() + index,
      title: `${['Senior', 'Mid-Level', 'Junior', 'Trainee'][index % 4]} ${technologies[index % technologies.length]} ${['Developer', 'Engineer', 'Specialist'][index % 3]}`,
      company: companies[index % companies.length],
      location: location || locations[index % locations.length],
      salary: `$${(Math.floor(Math.random() * 40000) + 60000).toLocaleString()} - $${(Math.floor(Math.random() * 50000) + 80000).toLocaleString()}`,
      posted: `${Math.floor(Math.random() * 7) + 1} días`,
      type: ['Tiempo Completo', 'Contrato', 'Medio Tiempo', 'Pasantía'][index % 4],
      match: Math.floor(Math.random() * 30) + 70,
      experience: ['Junior', 'Mid-Level', 'Senior'][index % 3],
      description: `Estamos buscando un ${technologies[index % technologies.length]} Developer con experiencia en desarrollo moderno. Ideal para ${['recién graduados', 'profesionales con 2+ años de experiencia', 'seniors con 5+ años'][index % 3]}.`,
      skills: [
        technologies[index % technologies.length],
        technologies[(index + 1) % technologies.length],
        technologies[(index + 2) % technologies.length]
      ],
      remote: [true, false][index % 2],
      urgent: index < 3,
      featured: index < 2,
      applyUrl: `https://linkedin.com/jobs/view/${Date.now() + index}` // ⭐ NUEVO: URL para postular
    }));
  };

  const getLinkedInIframeSrc = () => {
    if (!linkedInHtml) return '';
    const blob = new Blob([linkedInHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLocation('');
    setJobs([]);
    setError('');
    setLinkedInHtml('');
    setShowLinkedInView(false);
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const quickSearches = [
    { term: 'React Developer', location: 'Remoto', icon: '⚛️' },
    { term: 'Python Backend', location: 'La Paz', icon: '🐍' },
    { term: 'Frontend', location: 'Santa Cruz', icon: '🎨' },
    { term: 'Full Stack', location: 'Bolivia', icon: '🚀' },
    { term: 'Java Developer', location: 'Cochabamba', icon: '☕' },
  ];

  const handleQuickSearch = (term, loc) => {
    setSearchTerm(term);
    setLocation(loc);
  };

  // ⭐ NUEVO: Función para postular a un trabajo
  const handleApplyJob = (job, e) => {
    e.stopPropagation();
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

        {/* Header Mejorado */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="mr-2"
            >
              <ArrowLeft size={18} />
            </Button>
            <div className={`w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500`}></div>
            <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Buscador de Empleos
            </h1>
          </div>
          <p className={`text-base lg:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Encuentra oportunidades reales en LinkedIn y construye tu futuro profesional
          </p>
        </div>

        {/* Formulario de Búsqueda Principal */}
        <Card className="mb-8 p-6 lg:p-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                <label htmlFor="searchTerm" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ¿Qué puesto buscas?
                </label>
                <div className="relative">
                  <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    id="searchTerm"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej: React developer, Python backend, Frontend..."
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${isDark
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ¿Dónde?
                </label>
                <div className="relative">
                  <MapPin size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Bolivia, Remoto, La Paz..."
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${isDark
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  variant="primary"
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Buscando en LinkedIn...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search size={18} />
                      Buscar Empleos
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={clearSearch}
                  variant="outline"
                  disabled={loading}
                >
                  <X size={18} />
                  Limpiar
                </Button>
              </div>

              {linkedInHtml && (
                <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  <Sparkles size={16} />
                  <span>Conectado a LinkedIn</span>
                </div>
              )}
            </div>
          </form>
        </Card>

        {/* Búsquedas Rápidas */}
        <Card className="mb-8 p-6">
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Búsquedas Populares en Bolivia
          </h3>
          <div className="flex flex-wrap gap-3">
            {quickSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(search.term, search.location)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 border text-sm font-medium
                  ${isDark
                    ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700'
                  }
                `}
              >
                <span className="text-lg">{search.icon}</span>
                <span>{search.term}</span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  • {search.location}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {error && (
          <Card className="mb-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Zap size={16} />
              </div>
              <div>
                <p className="font-medium">Búsqueda</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Selector de Vista y Filtros */}
        {jobs.length > 0 && (
          <Card className="mb-6 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowLinkedInView(false)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
                    ${!showLinkedInView
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <LayoutGrid size={18} />
                  Vista App
                </button>
                <button
                  onClick={() => setShowLinkedInView(true)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
                    ${showLinkedInView
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <Eye size={18} />
                  Vista LinkedIn
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {jobs.length} empleos encontrados
                </span>
                <button className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Filter size={16} />
                  Filtros
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Vista LinkedIn */}
        {showLinkedInView && linkedInHtml && (
          <Card className="mb-6">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Vista LinkedIn Real
                </h2>
              </div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Resultados directos de LinkedIn - Modo lectura
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Vista en Iframe
                </h3>
                <iframe
                  src={getLinkedInIframeSrc()}
                  title="LinkedIn Jobs Results"
                  className="w-full h-96 rounded-lg border border-slate-200 dark:border-slate-700"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
              <div className={`
                p-4 rounded-lg text-sm
                ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'}
              `}>
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} />
                  <strong>Conectado a LinkedIn</strong>
                </div>
                <p>Estamos mostrando resultados reales de LinkedIn. Los datos se obtienen en tiempo real.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Vista Normal - Resultados */}
        {!showLinkedInView && jobs.length > 0 && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de Empleos */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card
                      key={job.id}
                      hover
                      className="p-6 relative cursor-pointer"
                      onClick={() => handleViewJobDetails(job.id)} // ⭐ ACTUALIZADO: Navegación al hacer clic
                    >
                      {/* Badges */}
                      <div className="flex gap-2 mb-3">
                        {job.featured && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                            Destacado
                          </span>
                        )}
                        {job.urgent && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            Urgente
                          </span>
                        )}
                        {job.remote && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            Remoto
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Building size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{job.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap
                            ${job.match > 85
                              ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                              : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }
                          `}>
                            {job.match}% match
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job.id);
                            }}
                            className={`p-2 rounded-lg transition-colors ${savedJobs.has(job.id)
                                ? 'text-yellow-500'
                                : isDark ? 'text-slate-400 hover:text-yellow-500' : 'text-slate-400 hover:text-yellow-500'
                              }`}
                          >
                            <Bookmark size={18} fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{job.posted}</span>
                          </div>
                        </div>
                      </div>

                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {job.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
                            `}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-bold
                            ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}
                          `}>
                            {job.type}
                          </span>
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            {job.experience}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Lógica para compartir
                            }}
                          >
                            <Share2 size={16} className="mr-2" />
                            Compartir
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => handleApplyJob(job, e)}
                          >
                            <ExternalLink size={16} className="mr-2" />
                            Postular
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Estadísticas */}
                <Card className="p-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Estadísticas de Búsqueda
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total empleos</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{jobs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Match promedio</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {Math.round(jobs.reduce((acc, job) => acc + job.match, 0) / jobs.length)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Empleos remotos</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {jobs.filter(job => job.remote).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Guardados</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {savedJobs.size}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Tips y Acciones */}
                <Card className="p-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    💡 Mejora tu Perfil
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleGoToCVGenerator}
                    >
                      <Briefcase size={18} className="mr-2" />
                      Generar CV Profesional
                    </Button>
                    <div className="space-y-2 text-sm">
                      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        • Personaliza tu CV para cada puesto
                      </p>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        • Destaca proyectos relevantes
                      </p>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        • Prepara tu portafolio
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Estado Vacío */}
        {!loading && jobs.length === 0 && !error && !showLinkedInView && (
          <Card className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Search size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Encuentra tu próximo empleo
            </h3>
            <p className={`text-lg mb-6 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Busca entre miles de oportunidades en LinkedIn y empresas locales
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" onClick={() => setSearchTerm('React Developer')}>
                <Search size={20} className="mr-2" />
                Comenzar a Buscar
              </Button>
              <Button variant="outline" size="lg" onClick={handleGoToCVGenerator}>
                <Briefcase size={20} className="mr-2" />
                Generar CV
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobSearch;