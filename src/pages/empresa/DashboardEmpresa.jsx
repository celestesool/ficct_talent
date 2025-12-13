// src/pages/empresa/DashboardEmpresa.jsx
import {
  Briefcase,
  CheckCircle,
  Eye,
  FileText,
  Plus,
  TrendingUp,
  Users,
  Clock,
  Send,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { adminService } from '../../api/services/adminService';
import { Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { companyJobService } from '../../api/services/companyService';
import { recommendationService } from '../../services/recommendationService';
import { dashboardCache } from '../../utils/cacheManager';

export const DashboardEmpresa = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [profileViews, setProfileViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // =====================================================
  // LOAD DASHBOARD DATA - OPTIMIZED WITH PARALLEL LOADING
  // =====================================================
  useEffect(() => {
    loadDashboardData();

    // Limpiar caché al desmontar
    return () => {
      dashboardCache.clearAll();
    };
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      const companyId = localStorage.getItem("user_id");
      if (!companyId) {
        console.error("No company user_id found in localStorage");
        setLoading(false);
        return;
      }

      // ✅ OPTIMIZACIÓN 1: Cargar en paralelo (no secuencial)
      const startTime = performance.now();

      const [jobsResult, viewsResult, announcementsResult] = await Promise.all([
        dashboardCache.get(
          `jobs_${companyId}`,
          () => companyJobService.getCompanyJobs(companyId),
          10 * 60 * 1000 // 10 minutos
        ),
        dashboardCache.get(
          `views_${companyId}`,
          () => companyJobService.getViewsCount(companyId),
          10 * 60 * 1000
        ),
        dashboardCache.get(
          'announcements',
          () => adminService.getAnnouncements(),
          30 * 60 * 1000 // 30 minutos
        )
      ]);

      const endTime = performance.now();
      console.log(`⚡ Dashboard data loaded in ${(endTime - startTime).toFixed(2)}ms`);

      // Ensure jobs is always an array
      const jobList = jobsResult.success && Array.isArray(jobsResult.data)
        ? jobsResult.data
        : [];

      // ===========================
      //  AUTOMAP JOB DATA
      // ===========================
      const mappedJobs = jobList.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        requirements: job.requirements ? job.requirements.split(',') : [],
        salary: job.salary_range || "No especificado",
        location: job.location,
        posted: new Date(job.created_at).toLocaleDateString(),
        expires_at: job.deadline ? new Date(job.deadline).toLocaleDateString() : "Sin fecha",
        applicantsCount: job.applications ? job.applications.length : 0,
        is_active: job.is_active,
        statusColor: job.is_active ? "green" : "yellow",
        job_type: job.job_type,
        raw: job
      }));

      setOffers(mappedJobs);

      // ===========================
      // 2) LOAD APPLICANTS - OPTIMIZED (Sin loop de requests)
      // ===========================
      const applicantList = [];
      const activityList = [];

      // ✅ OPTIMIZACIÓN 2: Recolectar todos los match scores en paralelo
      const matchPromises = [];
      const matchMap = new Map();

      jobList.forEach(job => {
        if (job.applications && Array.isArray(job.applications)) {
          job.applications.forEach(app => {
            if (app.student) {
              const cacheKey = `match_${app.student.id}_${job.id}`;
              matchPromises.push(
                dashboardCache.get(
                  cacheKey,
                  () => recommendationService.getDetailedMatchScore(app.student.id, job.id),
                  15 * 60 * 1000 // 15 minutos
                ).then(result => {
                  matchMap.set(cacheKey, result?.matchScore || 0);
                }).catch(() => {
                  matchMap.set(cacheKey, 0);
                })
              );
            }
          });
        }
      });

      // Esperar a que todos los matches se carguen en paralelo
      if (matchPromises.length > 0) {
        await Promise.all(matchPromises);
      }

      // Ahora construir candidatos con match scores ya cacheados
      jobList.forEach(job => {
        if (job.applications && Array.isArray(job.applications)) {
          job.applications.forEach(app => {
            if (app.student) {
              const s = app.student;
              const cacheKey = `match_${s.id}_${job.id}`;
              const matchScore = matchMap.get(cacheKey) || 0;

              applicantList.push({
                id: app.id,
                studentId: s.id,
                name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
                skills: [],
                match: matchScore,
                appliedFor: job.title,
                email: s.email || s.user?.email || '',
              });

              activityList.push({
                id: app.id,
                type: 'application',
                title: `${s.first_name || 'Candidato'} aplicó a ${job.title}`,
                date: app.applied_at || app.created_at,
                icon: 'send'
              });
            }
          });
        }

        activityList.push({
          id: `job-${job.id}`,
          type: 'job',
          title: `Oferta "${job.title}" publicada`,
          date: job.created_at,
          icon: 'plus'
        });
      });

      // Ordenar actividad por fecha descendente
      activityList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentActivity(activityList.slice(0, 5));

      setCandidates(applicantList);

      // 3) SET VIEWS AND ANNOUNCEMENTS
      setProfileViews(viewsResult || 0);

      if (announcementsResult) {
        const filtered = announcementsResult.filter(a => a.target === 'companies' || a.target === 'all');
        setAnnouncements(filtered.slice(0, 3));
      }

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // ORIGINAL NAVIGATION FUNCTIONS
  // =====================================================
  const handleNewOffer = () => navigate('/empresa/ofertas/nueva');
  const handleViewAllOffers = () => navigate('/empresa/ofertas');
  const handleViewOfferDetails = (id) => navigate(`/empresa/ofertas/${id}`);
  const handleViewAllCandidates = () => navigate('/empresa/candidatos');
  const handleViewCandidateDetails = (id) => navigate(`/empresa/candidatos/${id}`);
  const handleViewReports = () => navigate('/empresa/reportes');

  // =====================================================
  // UPDATED STATS (REAL DATA)
  // =====================================================

  // Contar contrataciones (status = 'aceptado')
  const hiredCount = offers.reduce((total, offer) => {
    const hired = offer.raw?.applications?.filter(app => app.status === 'aceptado').length || 0;
    return total + hired;
  }, 0);

  // Stats con diseño de gradientes premium
  const stats = [
    {
      label: 'Ofertas Activas',
      value: offers.filter(o => o.is_active).length,
      icon: Briefcase,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
    },
    {
      label: 'Candidatos',
      value: candidates.length,
      icon: Users,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
    },
    {
      label: 'Vistas del Perfil',
      value: profileViews,
      icon: Eye,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
    },
    {
      label: 'Contrataciones',
      value: hiredCount,
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
    },
  ];

  // =====================================================
  // RECENT OFFERS FIXED (REAL DATA)
  // =====================================================
  const recentOffers = offers.slice(0, 3).map(offer => ({
    id: offer.id,
    title: offer.title,
    applicants: offer.applicantsCount,
    posted: offer.posted,
    status: offer.is_active ? "Activa" : "Inactiva",
    statusColor: offer.statusColor
  }));

  const topCandidates = candidates.slice(0, 3);

  // =====================================================
  // UI (UNCHANGED)
  // =====================================================
  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Dashboard Empresa
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Gestiona tus ofertas y encuentra el mejor talento
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/empresa/reportes')}>
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  Reportes
                </div>
              </Button>
              <Button variant="primary" onClick={handleNewOffer}>
                <div className="flex items-center gap-2">
                  <Plus size={18} />
                  Nueva Oferta
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Anuncios */}
        {announcements.length > 0 && (
          <Card className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Anuncios
              </h2>
              <Megaphone size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
            </div>

            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`
            p-3 rounded-lg border-l-4
            ${announcement.type === 'info' ? 'border-blue-500' :
                      announcement.type === 'warning' ? 'border-yellow-500' :
                        announcement.type === 'success' ? 'border-green-500' : 'border-red-500'}
            ${isDark ? 'bg-slate-700' : 'bg-slate-100'}
          `}
                >
                  <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {announcement.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {announcement.message}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {new Date(announcement.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Stats Grid - Diseño Premium con Gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:translate-y-[-4px] hover:scale-[1.02]"
              style={{ background: stat.gradient }}
            >
              {/* Efecto de ola decorativa */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
                style={{
                  background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' d=\'M0,160L48,138.7C96,117,192,75,288,80C384,85,480,139,576,154.7C672,171,768,149,864,133.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom',
                  backgroundSize: 'cover'
                }}
              />

              <div className="relative p-6">
                {/* Icono en círculo semi-transparente */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: stat.iconBg }}
                >
                  <stat.icon className="text-white" size={24} strokeWidth={2} />
                </div>

                {/* Label */}
                <p className="text-white/80 text-sm font-medium mb-1">
                  {stat.label}
                </p>

                {/* Valor grande */}
                <p className="text-white text-3xl lg:text-4xl font-bold">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Offers */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Ofertas Recientes
                </h2>
                <Button variant="outline" onClick={handleViewAllOffers}>
                  Ver todas
                </Button>
              </div>

              <div className="space-y-4">
                {recentOffers.length === 0 ? (
                  <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <p>No hay ofertas publicadas aún</p>
                    <Button variant="secondary" onClick={handleNewOffer} className="mt-4">
                      Publicar primera oferta
                    </Button>
                  </div>
                ) : (
                  recentOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isDark
                          ? 'border-slate-700 hover:border-accent-3000 hover:bg-slate-700'
                          : 'border-slate-200 hover:border-accent-400 hover:bg-accent-300'
                        }`}
                      onClick={() => handleViewOfferDetails(offer.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {offer.title}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {offer.posted}
                          </p>
                        </div>

                        <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${offer.statusColor === 'green'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }
                      `}>
                          {offer.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {offer.applicants} candidatos
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Actividad Reciente */}
            <Card className="mt-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Actividad Reciente
              </h2>

              {recentActivity.length === 0 ? (
                <div className={`h-32 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div className="text-center">
                    <Clock size={32} className={isDark ? 'text-slate-500 mb-2 mx-auto' : 'text-slate-400 mb-2 mx-auto'} />
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      No hay actividad reciente
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-3 rounded-lg border-l-4 ${activity.type === 'application'
                        ? 'border-primary-500'
                        : 'border-green-500'
                        } ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${activity.type === 'application'
                          ? 'bg-primary-100 dark:bg-primary-900/30'
                          : 'bg-green-100 dark:bg-green-900/30'
                          }`}>
                          {activity.type === 'application' ? (
                            <Send size={14} className="text-primary-600" />
                          ) : (
                            <Plus size={14} className="text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {activity.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {activity.date ? new Date(activity.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Top Candidates */}
          <div>
            <Card>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Candidatos Destacados
              </h2>

              <div className="space-y-4">
                {topCandidates.length === 0 ? (
                  <div className={`text-center py-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <UserPlus size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No hay candidatos aún</p>
                  </div>
                ) : (
                  topCandidates.map((candidate, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      onClick={() => handleViewCandidateDetails(candidate.studentId || candidate.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {candidate.name || 'Candidato'}
                        </p>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${candidate.match >= 70
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : candidate.match >= 40
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {candidate.match}%
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {candidate.appliedFor || 'Sin puesto especificado'}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <Button variant="outline" fullWidth className="mt-4" onClick={handleViewAllCandidates}>
                Ver todos los candidatos
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Acciones Rápidas
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handleNewOffer}
                  className={`w-full p-3 rounded-lg text-left ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Plus size={20} className="text-accent-600" />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Publicar Oferta
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleViewAllCandidates}
                  className={`w-full p-3 rounded-lg text-left ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-primary-600" />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Buscar Candidatos
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleViewReports}
                  className={`w-full p-3 rounded-lg text-left ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-green-600" />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Ver Reportes
                    </span>
                  </div>
                </button>
              </div>

            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
