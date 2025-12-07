import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import api from '../../services/api';
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Calendar,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export const CompanyProfilePage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student email from localStorage and fetch real student ID
        const userStr = localStorage.getItem('user');
        let studentId = null;
        
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const userEmail = user.email;
            if (userEmail) {
              const studentRes = await api.get(`/students/email/${userEmail}`);
              studentId = studentRes.data.id;
            }
          } catch (err) {
            console.log('Could not fetch student ID:', err);
          }
        }

        // Fetch company details
        const companyResponse = await api.get(`/companies/${companyId}`);
        console.log('Company data:', companyResponse.data);
        setCompany(companyResponse.data);

        // Fetch company's active job listings using query parameter
        const jobsResponse = await api.get(`/jobs?company=${companyId}`);
        console.log('Jobs data:', jobsResponse.data);
        setJobs(jobsResponse.data.filter(job => job.is_active));

        // Track profile view (only if student is logged in)
        if (studentId) {
          console.log('Tracking view with studentId:', studentId, 'companyId:', companyId);
          const viewResponse = await api.post(`/companies/${companyId}/track-view`, {
            student_id: studentId,
          });
          console.log('View tracked:', viewResponse.data);
        } else {
          console.log('No studentId found, view not tracked');
        }
      } catch (err) {
        console.error('Error fetching company profile:', err);
        setError('No se pudo cargar el perfil de la empresa. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Empresa no encontrada'} />
          <Button
            onClick={() => navigate('/estudiante/ofertas')}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a búsqueda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Company Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="text-center">
                {/* Company Logo */}
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white" />
                </div>

                {/* Company Name */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {company.name}
                </h1>

                {/* Industry */}
                {company.industry && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {company.industry}
                  </p>
                )}

                {/* Contact Information */}
                <div className="space-y-3 text-left">
                  {company.email && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                        {company.email}
                      </a>
                    </div>
                  )}

                  {company.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${company.phone}`} className="hover:text-blue-600">
                        {company.phone}
                      </a>
                    </div>
                  )}

                  {company.website && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4 mr-2" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 flex items-center"
                      >
                        Sitio web
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {company.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {company.location}
                    </div>
                  )}

                  {company.size && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      {company.size} empleados
                    </div>
                  )}

                  {company.created_at && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Miembro desde {new Date(company.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Content - Description and Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Description */}
            {company.description && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Acerca de la Empresa
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {company.description}
                </p>
              </Card>
            )}

            {/* Active Job Listings */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Ofertas Activas ({jobs.length})
                </h2>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Esta empresa no tiene ofertas activas en este momento.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        {job.salary_range && (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {job.salary_range}
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {job.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.location && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location}
                          </span>
                        )}
                        {job.employment_type && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            {job.employment_type}
                          </span>
                        )}
                        {job.remote && (
                          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            Remoto
                          </span>
                        )}
                      </div>

                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.required_skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.required_skills.length > 5 && (
                            <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                              +{job.required_skills.length - 5} más
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Publicado {new Date(job.created_at).toLocaleDateString('es-ES')}
                        </span>
                        <Button
                          onClick={() => navigate('/estudiante/ofertas', { state: { selectedJobId: job.id } })}
                          size="sm"
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Company Stats */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Estadísticas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {jobs.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Ofertas Activas
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Postulaciones Totales
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
