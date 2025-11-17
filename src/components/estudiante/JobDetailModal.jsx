import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertCircle,
  Bookmark, Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Clock3,
  DollarSign,
  ExternalLink, MapPin,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { applicationService } from '../../api/services/applicationService';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

const JobDetailModal = ({ job, isOpen, onClose, onSaveToggle, isSaved, currentStudentId }) => {
  const { isDark } = useTheme();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Application form state
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  if (!isOpen || !job) return null;

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return format(new Date(date), "dd 'de' MMMM, yyyy", { locale: es });
  };

  const formatDateTime = (date) => {
    if (!date) return '—';
    return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es });
  };

  const formatSalary = (salary) => salary || 'No especificado';

  // Verificar si el estudiante actual ya aplicó
  console.log(job)
  console.log(currentStudentId)

  const myApplication = job.applications?.find(app => app.student_id === currentStudentId);
  const totalApplications = job.applications?.length || 0;

  // Estado de la aplicación
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pendiente': return { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Clock3 };
      case 'revisada': return { label: 'En revisión', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: Clock3 };
      case 'entrevista': return { label: 'Entrevista agendada', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', icon: Calendar };
      case 'aceptado': return { label: '¡Aceptado!', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle2 };
      case 'rechazado': return { label: 'No seleccionado', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: AlertCircle };
      default: return { label: 'Sin estado', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: Clock3 };
    }
  };

  const handleApply = () => {
    // Check for temp CV link and auto-fill if valid
    const tempLink = localStorage.getItem('temp_cv_link');
    if (tempLink) {
      try {
        const { url, expires } = JSON.parse(tempLink);
        if (Date.now() < expires) {
          setResumeUrl(url);
        }
      } catch (e) {
        // Ignore parse error
      }
    }
    setShowApplicationModal(true);
  };

  const handleGenerateCV = () => {
    localStorage.setItem('pending_job', JSON.stringify({ id: job.id, name: job.title }));
    window.location.href = '/estudiante/cv-editor';
  };

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim()) {
      setApplicationError('La carta de presentación es requerida.');
      return;
    }

    setIsApplying(true);
    setApplicationError('');
    setApplicationSuccess(false);

    const applicationData = {
      job_id: job.id,
      student_id: currentStudentId,
      cover_letter: coverLetter.trim(),
      resume_url: resumeUrl.trim() || null, // Optional
    };

    try {
      const result = await applicationService.applyToJob(applicationData);
      if (result.success) {
        setApplicationSuccess(true);
        setTimeout(() => {
          setShowApplicationModal(false);
          onClose();
        }, 2000);
      } else {
        setApplicationError(result.error || 'Error al enviar la postulación');
      }
    } catch (error) {
      setApplicationError('Error inesperado al enviar la postulación');
    } finally {
      setIsApplying(false);
    }
  };

  const ApplicationModal = () => {
    if (!showApplicationModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Aplicar a {job.title}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowApplicationModal(false)}>
              <X size={24} />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Cover Letter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Carta de presentación *
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Expresa tu interés en el puesto y por qué eres el candidato ideal..."
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'border-slate-300'}`}
                disabled={isApplying}
              />
            </div>

            {/* Resume URL */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                URL de CV (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://ejemplo.com/tu-cv.pdf"
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'border-slate-300'}`}
                  disabled={isApplying}
                />
                {!resumeUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCV}
                    disabled={isApplying}
                  >
                    Generar CV
                  </Button>
                )}
              </div>
            </div>

            {applicationError && (
              <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 rounded-lg text-sm">
                {applicationError}
              </div>
            )}

            {applicationSuccess && (
              <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-lg text-sm">
                ¡Postulación enviada exitosamente!
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={handleSubmitApplication}
                disabled={isApplying || !coverLetter.trim()}
                className="flex-1"
              >
                {isApplying ? 'Enviando...' : 'Aplicar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowApplicationModal(false)}
                disabled={isApplying}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className={`relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          {/* Header con logo */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-inherit">
            <div className="flex items-center gap-4">
              {job.company?.logo_url ? (
                <img src={job.company.logo_url} alt={job.company.name} className="w-16 h-16 rounded-xl object-contain bg-white p-2 shadow-lg" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {job.company?.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {job.title}
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {job.company?.name || 'Empresa confidencial'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={24} />
            </Button>
          </div>

          <div className="p-6 lg:p-8 space-y-8">
            {/* Badges principales + estadísticas */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full font-medium">
                {job.job_type === 'full-time' ? 'Tiempo completo' :
                  job.job_type === 'part-time' ? 'Medio tiempo' :
                    job.job_type === 'internship' ? 'Pasantía' :
                      job.job_type?.charAt(0).toUpperCase() + job.job_type?.slice(1)}
              </span>
              <span className={`px-4 py-2 rounded-full font-medium ${job.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                {job.is_active ? 'Activa' : 'Cerrada'}
              </span>
              {job.location.toLowerCase().includes('remot') && (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full font-medium">
                  Trabajo Remoto
                </span>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Users size={18} />
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {totalApplications} {totalApplications === 1 ? 'postulante' : 'postulantes'}
                </span>
              </div>
            </div>

            {/* Info rápida */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ubicación</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <DollarSign size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Salario</p>
                  <p className="font-semibold">{formatSalary(job.salary_range)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Fecha límite</p>
                  <p className="font-semibold">{formatDate(job.deadline)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Clock size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Publicado</p>
                  <p className="font-semibold">{formatDate(job.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Estado de MI aplicación */}
            {myApplication && (
              <Card className="p-6 border-2 border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${getStatusConfig(myApplication.status).color}`}>
                      {React.createElement(getStatusConfig(myApplication.status).icon, { size: 24 })}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Tu postulación</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Aplicaste el {formatDateTime(myApplication.applied_at)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusConfig(myApplication.status).color}`}>
                    {getStatusConfig(myApplication.status).label}
                  </span>
                </div>
                {myApplication.interview_at && (
                  <p className="mt-3 text-sm font-medium text-purple-600 dark:text-purple-400">
                    Entrevista programada: {formatDateTime(myApplication.interview_at)}
                  </p>
                )}
                {myApplication.company_notes && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <p className="text-sm font-medium">Notas de la empresa:</p>
                    <p className="text-sm mt-1">{myApplication.company_notes}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Descripción */}
            <Card className="p-6">
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Descripción del puesto
              </h3>
              <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}
                dangerouslySetInnerHTML={{ __html: (job.description || 'No hay descripción disponible.').replace(/\n/g, '<br>') }} />
            </Card>

            {/* Requisitos */}
            {job.requirements && (
              <Card className="p-6">
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Requisitos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.split(',').map((req, i) => (
                    <span key={i} className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-sm font-medium">
                      {req.trim()}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Responsabilidades */}
            {job.responsibilities && (
              <Card className="p-6">
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Responsabilidades
                </h3>
                <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}
                  dangerouslySetInnerHTML={{ __html: job.responsibilities.replace(/\n/g, '<br>') }} />
              </Card>
            )}

            {/* Sobre la empresa */}
            {job.company?.description && (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Sobre {job.company.name}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {job.company.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  {job.company.website && (
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <ExternalLink size={16} /> Sitio web
                    </a>
                  )}
                  {job.company.email && (
                    <a href={`mailto:${job.company.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      Contacto
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {!myApplication && job.is_active && (
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleApply}
                >
                  <Briefcase size={20} className="mr-2" />
                  Aplicar Ahora
                </Button>
              )}

              {myApplication && (
                <Button variant="primary" size="lg" disabled className="flex-1">
                  <CheckCircle2 size={20} className="mr-2" />
                  Ya aplicaste
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={() => onSaveToggle(job.id)}
                className="flex-1"
              >
                <Bookmark size={20} className="mr-2" fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Guardada' : 'Guardar vacante'}
              </Button>

              <Button variant="outline" size="lg" onClick={onClose}>
                Cerrar
              </Button>
            </div>

            {/* Footer */}
            <div className={`text-center text-xs pt-8 border-t ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
              <p>
                ID: {job.id} • Publicado el {formatDate(job.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal />
    </>
  );
};

export default JobDetailModal;