import {
  Briefcase,
  CheckCircle,
  Eye,
  FileText,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

export const DashboardEmpresa = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const stats = [
    { label: 'Ofertas Activas', value: '12', icon: Briefcase, color: 'purple' },
    { label: 'Candidatos', value: '48', icon: Users, color: 'blue' },
    { label: 'Vistas del Perfil', value: '234', icon: Eye, color: 'green' },
    { label: 'Contrataciones', value: '7', icon: CheckCircle, color: 'orange' },
  ];

  const recentOffers = [
    {
      title: 'Desarrollador Frontend',
      applicants: 15,
      status: 'Activa',
      posted: 'Hace 3 días',
      statusColor: 'green'
    },
    {
      title: 'Data Scientist',
      applicants: 8,
      status: 'Activa',
      posted: 'Hace 1 semana',
      statusColor: 'green'
    },
    {
      title: 'Backend Developer',
      applicants: 23,
      status: 'En revisión',
      posted: 'Hace 2 semanas',
      statusColor: 'yellow'
    },
  ];

  const topCandidates = [
    { name: 'Juan Pérez', skills: 'React, Node.js, Python', match: '95%' },
    { name: 'María González', skills: 'Java, Spring, SQL', match: '92%' },
    { name: 'Carlos Ruiz', skills: 'Angular, TypeScript', match: '88%' },
  ];

  // ⭐⭐ ACTUALIZADO: Funciones de navegación
  const handleNewOffer = () => {
    navigate('/empresa/ofertas/nueva');
  };

  const handleViewAllOffers = () => {
    navigate('/empresa/ofertas');
  };

  const handleViewOfferDetails = (offerId) => {
    navigate(`/empresa/ofertas/${offerId}`);
  };

  const handleViewAllCandidates = () => {
    navigate('/empresa/candidatos');
  };

  const handleViewCandidateDetails = (candidateId) => {
    navigate(`/empresa/candidatos/${candidateId}`);
  };

  const handleViewReports = () => {
    navigate('/empresa/reportes');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>

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
            <Button variant="secondary" onClick={handleNewOffer}>
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Nueva Oferta
              </div>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                  <stat.icon className={`${stat.color === 'purple' ? 'text-purple-600' :
                      stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                          'text-orange-600'
                    }`} size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ofertas Recientes */}
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
                {recentOffers.map((offer, idx) => (
                  <div
                    key={idx}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isDark
                        ? 'border-slate-700 hover:border-purple-500 hover:bg-slate-700'
                        : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50'
                      }
                    `}
                    onClick={() => handleViewOfferDetails(idx + 1)}
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
                ))}
              </div>
            </Card>

            {/* Gráfico de Actividad */}
            <Card className="mt-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Actividad del Mes
              </h2>
              <div className={`h-48 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div className="text-center">
                  <TrendingUp size={48} className={isDark ? 'text-slate-500 mb-2' : 'text-slate-400 mb-2'} />
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Gráfico de actividad (próximamente)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Candidatos Destacados */}
          <div>
            <Card>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Candidatos Destacados
              </h2>
              <div className="space-y-4">
                {topCandidates.map((candidate, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg cursor-pointer ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-purple-50 hover:bg-purple-100'}`}
                    onClick={() => handleViewCandidateDetails(idx + 1)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {candidate.name}
                      </p>
                      <span className="text-sm font-bold text-purple-600">
                        {candidate.match}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {candidate.skills}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth className="mt-4" onClick={handleViewAllCandidates}>
                Ver todos los candidatos
              </Button>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="mt-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleNewOffer}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all
                    ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Plus size={20} className="text-purple-600" />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Publicar Oferta
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleViewAllCandidates}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all
                    ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-blue-600" />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Buscar Candidatos
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleViewReports}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all
                    ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}
                  `}
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