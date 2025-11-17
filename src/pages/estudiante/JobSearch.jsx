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
  Globe,
  LayoutGrid,
  MapPin,
  Search,
  Sparkles,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../api/services/jobService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import JobDetailModal from '../../components/estudiante/JobDetailModal';
import { useTheme } from '../../contexts/ThemeContext';

const JobSearch = () => {

  const studentId = localStorage.getItem('user_id');
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);           // Jobs que se muestran actualmente
  const [realJobs, setRealJobs] = useState([]);   // Jobs del backend
  const [loading, setLoading] = useState(false);  // Búsqueda LinkedIn
  const [loadingReal, setLoadingReal] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Bolivia');
  const [linkedInHtml, setLinkedInHtml] = useState('');
  const [showLinkedInView, setShowLinkedInView] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);

  // Cargar empleos reales al iniciar
  useEffect(() => {
    const loadRealJobs = async () => {
      setLoadingReal(true);
      const result = await jobService.getActiveJobsWithErrorHandling();

      if (result.success && result.data.length > 0) {
        setRealJobs(result.data);
        // Si no hay búsqueda activa, mostrar empleos reales
        if (jobs.length === 0 && searchTerm === '') {
          setJobs(result.data);
        }
      }
      setLoadingReal(false);
    };
    loadRealJobs();
  }, []);

  // Si se limpia la búsqueda y hay empleos reales → mostrarlos
  useEffect(() => {
    if (searchTerm === '' && realJobs.length > 0) {
      setJobs(realJobs);
      setShowLinkedInView(false);
      setLinkedInHtml('');
    }
  }, [searchTerm, realJobs]);

  const handleBackToDashboard = () => navigate('/estudiante/dashboard');
  const handleViewJobDetails = (jobId) => navigate(`/estudiante/ofertas/${jobId}`);
  const handleGoToCVGenerator = () => navigate('/estudiante/cv-generator');

  const createProxyUrl = (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError('');
    setLinkedInHtml('');
    setShowLinkedInView(false);

    try {
      const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}${location ? `&location=${encodeURIComponent(location)}` : ''}`;
      const response = await axios.get(createProxyUrl(linkedInUrl), { timeout: 15000 });

      if (response.data) {
        setLinkedInHtml(response.data);
        //const mockJobs = generateMockJobs(searchTerm, location);
        //setJobs(mockJobs);
      }
    } catch (err) {
      console.error('Error LinkedIn:', err);
      setError('No se pudo conectar con LinkedIn. Mostrando ofertas locales.');
      setJobs(realJobs.length > 0 ? realJobs : generateMockJobs(searchTerm, location));
    } finally {
      setLoading(false);
    }
  };

  const generateMockJobs = (searchTerm, location) => {
    const technologies = ['React', 'JavaScript', 'Node.js', 'Python', 'Java', 'Vue', 'Angular', 'TypeScript'];
    const companies = ['Tech Solutions Bolivia', 'DinoTech', 'UAGRM', 'Innovation Labs', 'Global Tech S.A.'];
    const locations = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Remoto', 'Híbrido'];

    return Array.from({ length: 12 }, (_, i) => ({
      id: `mock-${Date.now()}-${i}`,
      title: `${['Senior', 'Mid-Level', 'Junior'][i % 3]} ${technologies[i % technologies.length]} Developer`,
      company: companies[i % companies.length],
      location: location || locations[i % locations.length],
      salary: `$${(60000 + i * 5000).toLocaleString()} - $${(90000 + i * 5000).toLocaleString()}`,
      posted: `${i % 7 + 1} días`,
      type: ['Tiempo Completo', 'Contrato', 'Medio Tiempo'][i % 3],
      match: Math.floor(Math.random() * 30) + 70,
      experience: ['Junior', 'Mid-Level', 'Senior'][i % 3],
      description: `Buscamos desarrollador apasionado por ${technologies[i % technologies.length]}. ¡Únete a nuestro equipo en crecimiento!`,
      skills: technologies.slice(i % 3, (i % 3) + 4),
      remote: i % 2 === 0,
      urgent: i < 3,
      featured: i < 2,
      applyUrl: `https://linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}`,
      isMock: true
    }));
  };

  const getLinkedInIframeSrc = () => {
    if (!linkedInHtml) return '';
    const blob = new Blob([linkedInHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLocation('Bolivia');
    setError('');
    setLinkedInHtml('');
    setShowLinkedInView(false);
    if (realJobs.length > 0) {
      setJobs(realJobs);
    }
  };

  const toggleSaveJob = (jobId) => {
    const newSaved = new Set(savedJobs);
    newSaved.has(jobId) ? newSaved.delete(jobId) : newSaved.add(jobId);
    setSavedJobs(newSaved);
  };

  const handleQuickSearch = (term, loc) => {
    setSearchTerm(term);
    setLocation(loc);
  };

  const handleSeeDetails = async (job, e) => {
    // Si es un job real del backend
    setJobLoading(true);
    setIsModalOpen(true);

    // Si ya viene con todos los datos (viene de realJobs), úsalo directamente
    if (job.company && job.description) {
      setSelectedJob(job);
      setJobLoading(false);
      return;
    }

    // Si no, carga los detalles completos desde la API
    const result = await jobService.getJobByIdWithErrorHandling(job.id);
    if (result.success) {
      setSelectedJob(result.data);
    } else {
      alert(result.error || 'No se pudo cargar el detalle de la vacante');
      setIsModalOpen(false);
    }
    setJobLoading(false);
  };

  const quickSearches = [
    { term: 'React Developer', location: 'Remoto', icon: 'React' },
    { term: 'Python Backend', location: 'La Paz', icon: 'Python' },
    { term: 'Frontend', location: 'Santa Cruz', icon: 'Paintbrush' },
    { term: 'Full Stack', location: 'Bolivia', icon: 'Rocket' },
    { term: 'Java Developer', location: 'Cochabamba', icon: 'Coffee' },
  ];

  const formatSalary = (salary) => salary || 'No especificado';
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Reciente';
    const date = new Date(dateStr);
    const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    return daysAgo === 0 ? 'Hoy' : `Hace ${daysAgo} día${daysAgo > 1 ? 's' : ''}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" onClick={handleBackToDashboard}>
              <ArrowLeft size={18} />
            </Button>
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
            <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Buscador de Empleos
            </h1>
          </div>
          <p className={`text-base lg:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Ofertas locales reales + búsqueda global en LinkedIn
          </p>
        </div>

        {/* Formulario */}
        <Card className="mb-8 p-6 lg:p-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ¿Qué puesto buscas?
                </label>
                <div className="relative">
                  <Search size={20} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej: React developer, Python backend..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:border-blue-500`}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ¿Dónde?
                </label>
                <div className="relative">
                  <MapPin size={20} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Bolivia, Remoto..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:border-blue-500`}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex gap-3">
                <Button type="submit" disabled={loading || !searchTerm.trim()} variant="primary" className="min-w-[200px]">
                  {loading ? 'Buscando en LinkedIn...' : 'Buscar Empleos'}
                </Button>
                <Button type="button" onClick={clearSearch} variant="outline" disabled={loading}>
                  <X size={18} /> Limpiar
                </Button>
              </div>
              {linkedInHtml && (
                <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  <Sparkles size={16} /> Conectado a LinkedIn
                </div>
              )}
            </div>
          </form>
        </Card>

        {/* Búsquedas rápidas */}
        <Card className="mb-8 p-6">
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Búsquedas Populares en Bolivia
          </h3>
          <div className="flex flex-wrap gap-3">
            {quickSearches.map((s, i) => (
              <button key={i} onClick={() => handleQuickSearch(s.term, s.location)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-blue-50'}`}>
                <span className="text-lg">{s.icon}</span>
                <span>{s.term}</span>
                <span className="text-xs opacity-75">• {s.location}</span>
              </button>
            ))}
          </div>
        </Card>

        {error && (
          <Card className="mb-6 border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
              <Zap size={16} />
              <p className="text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Selector de vista */}
        {jobs.length > 0 && (
          <Card className="mb-6 p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex gap-2">
                <button onClick={() => setShowLinkedInView(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${!showLinkedInView ? 'bg-blue-600 text-white' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <LayoutGrid size={18} /> Vista App
                </button>
                <button onClick={() => setShowLinkedInView(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${showLinkedInView ? 'bg-purple-600 text-white' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Eye size={18} /> Vista LinkedIn
                </button>
              </div>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {jobs.length} empleo{jobs.length !== 1 ? 's' : ''} encontrado{jobs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </Card>
        )}

        {/* Vista LinkedIn */}
        {showLinkedInView && linkedInHtml && (
          <Card className="mb-6">
            <div className="p-6 border-b dark:border-slate-700">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Globe size={20} /> Resultados reales de LinkedIn
              </h2>
            </div>
            <iframe src={getLinkedInIframeSrc()} className="w-full h-screen rounded-b-lg" sandbox="allow-same-origin allow-scripts" />
          </Card>
        )}

        {/* Vista App - Jobs reales o mock */}
        {!showLinkedInView && jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  hover
                  className="p-6 relative"
                >
                  <div className="flex gap-2 mb-3">
                    {job.featured && <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">Destacado</span>}
                    {job.urgent && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">Urgente</span>}
                    {job.remote && <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">Remoto</span>}
                    {job.isMock === false && <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">Local</span>}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Building size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {job.company?.name || job.company}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.match && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.match > 85 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                          {job.match}% match
                        </span>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                        className={`p-2 rounded-lg transition-colors ${savedJobs.has(job.id) ? 'text-yellow-500' : isDark ? 'text-slate-400 hover:text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}>
                        <Bookmark size={18} fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1"><MapPin size={16} /> {job.location}</div>
                    <div className="flex items-center gap-1"><DollarSign size={16} /> {formatSalary(job.salary_range || job.salary)}</div>
                    <div className="flex items-center gap-1"><Calendar size={16} /> {job.created_at ? formatDate(job.created_at) : job.posted}</div>
                  </div>

                  <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(job.requirements ? job.requirements.split(',').map(s => s.trim()) : job.skills || []).slice(0, 6).map((skill, i) => (
                      <span key={i} className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        {job.job_type ? (job.job_type === 'full-time' ? 'Tiempo completo' : job.job_type === 'part-time' ? 'Medio tiempo' : 'Freelance') : job.type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={(e) => {
                        handleSeeDetails(job, e);
                      }}>
                        <ExternalLink size={16} className="mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Estadísticas</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total</span> <strong>{jobs.length}</strong></div>
                  {jobs.some(j => j.match) && <div className="flex justify-between"><span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Match promedio</span> <strong>{Math.round(jobs.reduce((a, j) => a + (j.match || 0), 0) / jobs.filter(j => j.match).length)}%</strong></div>}
                  <div className="flex justify-between"><span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Guardados</span> <strong>{savedJobs.size}</strong></div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Mejora tu Perfil</h3>
                <Button variant="primary" fullWidth onClick={handleGoToCVGenerator}>
                  <Briefcase size={18} className="mr-2" /> Generar CV Profesional
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!loading && !loadingReal && jobs.length === 0 && (
          <Card className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Search size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {realJobs.length > 0 ? 'Explora las ofertas disponibles' : 'Encuentra tu próximo empleo'}
            </h3>
            <Button variant="primary" size="lg" onClick={() => setSearchTerm('Developer')}>
              Comenzar a Buscar
            </Button>
          </Card>
        )}
      </div>
      {isModalOpen && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedJob(null); }}
          onSaveToggle={toggleSaveJob}
          isSaved={savedJobs.has(selectedJob?.id)}
          currentStudentId={studentId}
        />
      )}
    </div>
  );
};

export default JobSearch;