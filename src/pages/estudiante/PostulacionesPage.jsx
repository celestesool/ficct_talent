import {
  Brain,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  Trash2,
  TrendingUp,
  XCircle
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../api/services/applicationService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ApplicationDetailsModal } from '../../components/estudiante/ApplicationDetailsModal';
import { AptitudeTestModal } from '../../components/estudiante/AptitudeTest/AptitudeTestModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const PostulacionesPage = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAptitudeTestModal, setShowAptitudeTestModal] = useState(false);
  const [selectedJobForTest, setSelectedJobForTest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const studentId = user?.id;

  // ------------------------------------------
  // Cargar postulaciones
  // ------------------------------------------

  useEffect(() => {
    if (isAuthenticated && studentId) {
      loadApplications();
    }
  }, [isAuthenticated, studentId]);

  const loadApplications = async () => {
    if (!studentId) return;

    setLoading(true);
    const result = await applicationService.getStudentApplications(studentId);
    if (result.success) {
      setApplications(result.data);
    } else {
      console.error('Error:', result.error);
    }
    setLoading(false);
  };

  // ------------------------------------------
  // Abrir detalles
  // ------------------------------------------

  const handleViewDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowDetailsModal(true);
  };

  // ------------------------------------------
  // NUEVO: Abrir test (REEMPLAZADO)
  // ------------------------------------------

  const handleOpenAptitudeTest = (application) => {
    navigate(`/estudiante/tests/${application.id}/start`);
  };

  // ------------------------------------------
  // Cancelar postulación
  // ------------------------------------------

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta postulación?')) return;

    const result = await applicationService.withdrawApplication(
      applicationId,
      studentId
    );

    if (result.success) {
      setApplications(
        applications.map(app =>
          app.id === applicationId
            ? {
              ...app,
              status: 'withdrawn',
              decided_at: new Date().toISOString()
            }
            : app
        )
      );

      if (showDetailsModal && selectedApplicationId === applicationId) {
        setShowDetailsModal(false);
      }
    } else {
      console.error("Error al cancelar postulación:", result.error);
    }
  };

  // ------------------------------------------
  // Config de estados
  // ------------------------------------------

  const getStatusConfig = (status) => {
    const configs = {
      applied: { color: 'blue', icon: Clock, label: 'Aplicado' },
      reviewed: { color: 'yellow', icon: Eye, label: 'Revisado' },
      interview: { color: 'purple', icon: Calendar, label: 'Entrevista' },
      technical_test: { color: 'indigo', icon: FileText, label: 'Prueba Técnica' },
      final_interview: { color: 'purple', icon: TrendingUp, label: 'Entrevista Final' },
      accepted: { color: 'green', icon: CheckCircle, label: 'Aceptado' },
      rejected: { color: 'red', icon: XCircle, label: 'Rechazado' },
      withdrawn: { color: 'gray', icon: XCircle, label: 'Cancelado' }
    };

    return configs[status] || configs.applied;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pendiente';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando postulaciones...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // Render principal
  // ------------------------------------------

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mis Postulaciones
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Seguimiento de todas tus aplicaciones a vacantes
              </p>
            </div>

            <Button variant="primary" onClick={() => navigate('/jobs')}>
              <div className="flex items-center gap-2">
                <Eye size={18} />
                Buscar Vacantes
              </div>
            </Button>
          </div>
        </div>

        {/* SIN POSTULACIONES */}
        {applications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No tienes postulaciones aún
              </h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                Comienza aplicando a vacantes que se ajusten a tu perfil
              </p>
              <Button variant="primary" onClick={() => navigate('/jobs')}>
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  Explorar Vacantes
                </div>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={application.id} hover className="relative">

                  {/* BADGE DE ESTADO */}
                  <div
                    className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                      ${statusConfig.color === 'blue' ? 'bg-primary-100 text-primary-800' : ''}
                      ${statusConfig.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${statusConfig.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                      ${statusConfig.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                      ${statusConfig.color === 'purple' ? 'bg-accent-300 text-accent-700' : ''}
                      ${statusConfig.color === 'indigo' ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${statusConfig.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}`}
                  >
                    <StatusIcon size={16} />
                    {statusConfig.label}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-lg ${isDark ? 'bg-primary-900/20' : 'bg-primary-100'}`}
                    >
                      <Building size={24} className="text-primary-600" />
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleOpenAptitudeTest(application)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                      >
                        <Brain size={16} className={isDark ? 'text-green-400' : 'text-green-600'} />
                      </button>

                      <button
                        onClick={() => handleViewDetails(application.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                      >
                        <Eye size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                      </button>

                      {!['accepted', 'rejected', 'withdrawn'].includes(application.status) && (
                        <button
                          onClick={() => handleWithdrawApplication(application.id)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                            }`}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CONTENIDO DE LA POSTULACIÓN */}
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {application.job.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Building size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {application.job.company.name}
                    </span>
                  </div>

                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {application.job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {application.job.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {application.job.salary_range || 'No especificado'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-600'}>Aplicado:</span>
                        <div className={isDark ? 'text-slate-300' : 'text-slate-900'}>
                          {formatDate(application.applied_at)}
                        </div>
                      </div>
                      <div>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-600'}>
                          Última actualización:
                        </span>
                        <div className={isDark ? 'text-slate-300' : 'text-slate-900'}>
                          {formatDate(
                            application.reviewed_at ||
                            application.interview_at ||
                            application.applied_at
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETALLES */}
      {showDetailsModal && selectedApplicationId && (
        <ApplicationDetailsModal
          applicationId={selectedApplicationId}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplicationId(null);
          }}
          onWithdraw={handleWithdrawApplication}
        />
      )}

      {/* MODAL TEST (si se usa en el futuro) */}
      {showAptitudeTestModal && selectedJobForTest && (
        <AptitudeTestModal
          jobData={selectedJobForTest}
          onClose={() => {
            setShowAptitudeTestModal(false);
            setSelectedJobForTest(null);
          }}
        />
      )}
    </div>
  );
};
