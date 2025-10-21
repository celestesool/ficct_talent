// src/components/JobSearch.jsx
import axios from 'axios';
import { useState } from 'react';
import './JobSearch.css';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('react developer');
  const [location, setLocation] = useState('');
  const [linkedInHtml, setLinkedInHtml] = useState('');
  const [showLinkedInView, setShowLinkedInView] = useState(false);

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
      
      console.log('🔍 Buscando en:', linkedInUrl);

      const response = await axios.get(createProxyUrl(linkedInUrl), {
        timeout: 15000,
      });

      if (response.data) {
        console.log('✅ HTML recibido correctamente');
        console.log('Tamaño del HTML:', response.data.length, 'caracteres');
        
        // Guardar el HTML para mostrarlo
        setLinkedInHtml(response.data);
        setShowLinkedInView(true);
        
        // También generar datos mock para mostrar en paralelo
        const mockJobs = generateMockJobs(searchTerm, location);
        setJobs(mockJobs);
      }

    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('Error al conectar con LinkedIn: ' + err.message);
      
      // Fallback a datos mock
      const mockJobs = generateMockJobs(searchTerm, location);
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const generateMockJobs = (searchTerm, location) => {
    const technologies = ['React', 'JavaScript', 'Node.js', 'Python', 'Java'];
    const companies = ['Tech Solutions', 'Innovation Labs', 'Digital Creations', 'Startup Ventures'];
    
    return Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index,
      title: `${['Senior', 'Mid-Level', 'Junior'][index % 3]} ${technologies[index % technologies.length]} Developer`,
      company: companies[index % companies.length],
      location: location || 'Remote',
      salary: `$${Math.floor(Math.random() * 40000) + 60000} - $${Math.floor(Math.random() * 50000) + 80000}`,
      posted: `${Math.floor(Math.random() * 7) + 1} days ago`,
      type: ['Full-time', 'Contract'][index % 2],
    }));
  };

  // Función para crear un blob del HTML y mostrarlo en iframe
  const getLinkedInIframeSrc = () => {
    if (!linkedInHtml) return '';
    
    // Crear un blob con el HTML
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

  return (
    <div className="job-search-container">
      <div className="job-search-header">
        <h1 className="job-search-title">🔍 Buscador de Empleos</h1>
        <p className="job-search-subtitle">
          Resultados reales de LinkedIn + Datos de ejemplo
        </p>
      </div>

      <form onSubmit={handleSearch} className="job-search-form">
        <div className="search-fields">
          <div className="form-group">
            <label htmlFor="searchTerm" className="form-label">
              Puesto o tecnología
            </label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: React developer, Python, Frontend..."
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Ubicación
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Remote, Bolivia, USA..."
              className="form-input"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="search-button"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Buscando en LinkedIn...
              </>
            ) : (
              '🔍 Buscar en LinkedIn'
            )}
          </button>

          <button
            type="button"
            onClick={clearSearch}
            className="clear-button"
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Selector de vista */}
      {jobs.length > 0 && linkedInHtml && (
        <div className="view-selector">
          <button
            onClick={() => setShowLinkedInView(false)}
            className={`view-btn ${!showLinkedInView ? 'active' : ''}`}
          >
            📊 Vista App
          </button>
          <button
            onClick={() => setShowLinkedInView(true)}
            className={`view-btn ${showLinkedInView ? 'active' : ''}`}
          >
            🌐 Vista LinkedIn Real
          </button>
        </div>
      )}

      {/* Vista de LinkedIn Real */}
      {showLinkedInView && linkedInHtml && (
        <div className="linkedin-view">
          <div className="view-header">
            <h2>🌐 Vista Real de LinkedIn</h2>
            <p>Mostrando resultados directos de LinkedIn ({linkedInHtml.length} caracteres de HTML)</p>
          </div>

          <div className="iframe-container">
            <h3>Vista en Iframe (puede tener limitaciones):</h3>
            <iframe
              src={getLinkedInIframeSrc()}
              title="LinkedIn Jobs Results"
              className="linkedin-iframe"
              sandbox="allow-same-origin allow-scripts"
            />
            <p className="iframe-note">
              <strong>Nota:</strong> El iframe puede tener estilos rotos debido a políticas de seguridad.
              Los resultados reales se están obteniendo correctamente.
            </p>
          </div>
        </div>
      )}

      {/* Vista normal de la app */}
      {!showLinkedInView && jobs.length > 0 && (
        <div className="jobs-results">
          <div className="results-header">
            <h2 className="results-title">
              📄 Empleos Encontrados: {jobs.length}
            </h2>
            <p className="results-subtitle">
              {searchTerm} {location && `en ${location}`}
              {linkedInHtml && (
                <span className="real-data-badge"> ✅ + Datos reales de LinkedIn obtenidos</span>
              )}
            </p>
          </div>

          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                
                <div className="job-company">
                  <strong>🏢 {job.company}</strong>
                </div>
                
                <div className="job-details">
                  <span className="job-location">📍 {job.location}</span>
                  <span className="job-salary">💰 {job.salary}</span>
                  <span className="job-posted">📅 {job.posted}</span>
                </div>

                <div className="job-card-actions">
                  <button className="apply-button">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && jobs.length === 0 && !error && !showLinkedInView && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No hay búsquedas recientes</h3>
          <p>Ingresa un puesto o tecnología para buscar en LinkedIn</p>
        </div>
      )}
    </div>
  );
};

export default JobSearch;