import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  Eye,
  FileText,
  Globe,
  GraduationCap,
  History,
  Info, Trash2, TrendingUp,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { applicationService } from '../../api/services/applicationService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';

export const ApplicationDetailsModal = ({ applicationId, onClose, onWithdraw }) => {
  const { isDark } = useTheme();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!applicationId) return;

      setLoading(true);
      setError(null);
      try {
        const result = await applicationService.getApplicationById(applicationId);

        if (result.success) {
          setApplication(result.data);
        } else {
          setError(result.error || 'Error al cargar detalles');
        }
      } catch (err) {
        setError('Error al cargar detalles');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const getStatusConfig = (status) => {
    const configs = {
      applied: { color: 'blue', icon: Clock, label: 'Aplicado', description: 'Tu postulación ha sido recibida y está en revisión inicial.' },
      reviewed: { color: 'yellow', icon: Eye, label: 'Revisado', description: 'Tu perfil ha sido evaluado por el equipo de reclutamiento.' },
      interview: { color: 'purple', icon: Calendar, label: 'Entrevista', description: 'Has sido invitado a una entrevista. ¡Prepárate!' },
      technical_test: { color: 'indigo', icon: FileText, label: 'Prueba Técnica', description: 'Es hora de demostrar tus habilidades técnicas.' },
      final_interview: { color: 'purple', icon: TrendingUp, label: 'Entrevista Final', description: 'Último paso antes de la decisión.' },
      accepted: { color: 'green', icon: CheckCircle, label: 'Aceptado', description: '¡Felicidades! Has sido seleccionado para el puesto.' },
      rejected: { color: 'red', icon: XCircle, label: 'Rechazado', description: 'Lamentamos informarte que no has sido seleccionado esta vez.' },
      withdrawn: { color: 'gray', icon: XCircle, label: 'Cancelado', description: 'La postulación ha sido retirada.' }
    };

    return configs[status] || configs.applied;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pendiente';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getJobTypeLabel = (jobType) => {
    const typeMap = {
      'full-time': 'Tiempo Completo',
      'part-time': 'Medio Tiempo',
      'contract': 'Contrato',
      'freelance': 'Freelance',
      'internship': 'Pasantía'
    };
    return typeMap[jobType] || jobType?.replace('-', ' ').toUpperCase() || 'No especificado';
  };

  const getHistoryItems = () => {
    const History = [];
    const dates = {
      applied_at: { label: 'Aplicación Enviada', icon: ClockIcon, status: 'applied' },
      reviewed_at: { label: 'Revisión Realizada', icon: Eye, status: 'reviewed' },
      interview_at: { label: 'Entrevista Programada', icon: Calendar, status: 'interview' },
      technical_test_at: { label: 'Prueba Técnica Completada', icon: FileText, status: 'technical_test' },
      decided_at: { label: 'Decisión Final', icon: TrendingUp, status: 'final_interview' }
    };

    Object.entries(dates).forEach(([key, item]) => {
      const date = application[key];
      const isCompleted = application.status === 'accepted' || application.status === 'rejected' || application.status === 'withdrawn' || (key === 'applied_at');
      const currentStatus = getStatusConfig(application.status);

      History.push({
        ...item,
        date: formatDate(date),
        completed: date !== null && isCompleted,
        isCurrent: application.status === item.status && date !== null,
        description: date ? `Completado el ${formatDate(date)}` : 'Pendiente de actualización'
      });
    });

    return History;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando detalles...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <div className="text-center py-8">
            <p className={isDark ? 'text-slate-400' : 'text-red-600'}>{error}</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;
  const HistoryItems = getHistoryItems();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit p-4 -mx-4 -mt-4">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Detalles de la Postulación
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
          >
            <XCircle size={24} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Énfasis en Estado de la Aplicación - Sección Principal */}
          <div className="border-l-4 border-primary-500 pl-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-full bg-${statusConfig.color}-100 ${statusConfig.color === 'gray' ? 'border border-gray-200' : ''}`}>
                <StatusIcon size={24} className={`text-${statusConfig.color}-600`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {statusConfig.label}
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {statusConfig.description}
                </p>
              </div>
            </div>

            {/* History de Estados */}
            <div className="mt-6">
              <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <History size={16} />
                Progreso de tu Postulación
              </h4>
              <div className="space-y-4">
                {HistoryItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                      item.completed ? `bg-${statusConfig.color}-100 text-${statusConfig.color}-600` :
                      item.isCurrent ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-200' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {item.date !== 'Pendiente' ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                        {item.label}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Información del Puesto - Mapeo Completo */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Briefcase size={20} />
              Información del Puesto
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Título:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.title}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Tipo de Trabajo:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{getJobTypeLabel(application.job.job_type)}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Ubicación:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.location}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Rango Salarial:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.salary_range || 'No especificado'}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Activo:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    application.job.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {application.job.is_active ? 'Sí' : 'No'}
                  </span>
                </p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Fecha Límite:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>
                  {formatDate(application.job.deadline)}
                </p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Creado:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>
                  {formatDate(application.job.created_at)}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Actualizado:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>
                  {formatDate(application.job.updated_at)}
                </p>
              </div>

              {/* Descripciones Detalladas */}
              <div className="md:col-span-2">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Descripción del Puesto:</span>
                <div className={`mt-1 p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {application.job.description}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Requisitos:</span>
                <div className={`mt-1 p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {application.job.requirements || 'No especificados'}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Responsabilidades:</span>
                <div className={`mt-1 p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {application.job.responsibilities || 'No especificadas'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la Empresa */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Building size={20} />
              Información de la Empresa
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Nombre:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.company.name}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Descripción:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.company.description}</p>
              </div>
              {application.job.company.website && (
                <div>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Sitio Web:</span>
                  <a
                    href={application.job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mt-1"
                  >
                    <Globe size={16} />
                    Visitar sitio
                  </a>
                </div>
              )}
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Email:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.company.email}</p>
              </div>
              <div>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Teléfono:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{application.job.company.phone_number}</p>
              </div>
              <div className="md:col-span-2">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Creada:</span>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>
                  {formatDate(application.job.company.created_at)} (Actualizada: {formatDate(application.job.company.updated_at)})
                </p>
              </div>
            </div>
          </div>
         
          {/* Carta de Presentación */}
          {application.cover_letter && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <FileText size={20} />
                Carta de Presentación
              </h3>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}

          {/* Curriculum Vitae */}
          {application.resume_url && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <GraduationCap size={20} />
                Curriculum Vitae
              </h3>
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-primary-600 hover:text-primary-700 flex items-center gap-2 p-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                <FileText size={20} />
                Ver CV Enviado ({formatDate(application.created_at)})
              </a>
            </div>
          )}

          {/* Notas de la Empresa */}
          {application.company_notes && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Info size={20} />
                Notas de la Empresa
              </h3>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {application.company_notes}
                </p>
              </div>
            </div>
          )}

          {/* Información Adicional */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Creada:</span>
              <p className={isDark ? 'text-white' : 'text-slate-900'}>{formatDate(application.created_at)}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
            {!['accepted', 'rejected', 'withdrawn'].includes(application.status) && (
              <Button
                variant="danger"
                onClick={() => {
                  onWithdraw(application.id);
                  onClose();
                }}
                className="flex-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trash2 size={18} />
                  Cancelar Postulación
                </div>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};