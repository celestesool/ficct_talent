import {
  AlertCircle,
  ArrowLeft // ⭐ AÑADIDO: Icono para volver
  ,

  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  Filter,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Navbar } from '../common/Navbar';

export const OfertasPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate(); // ⭐ ACTUALIZADO: useNavigate hook
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // ⭐ NUEVO: Función para navegar al dashboard
  const handleBackToDashboard = () => {
    navigate('/empresa/dashboard');
  };

  // ⭐ NUEVO: Función para ver detalles de oferta
  const handleViewOfferDetails = (offerId) => {
    navigate(`/empresa/ofertas/${offerId}`);
  };

  // ⭐ NUEVO: Función para ver candidatos de una oferta
  const handleViewCandidates = (offerId) => {
    navigate(`/empresa/candidatos?offer=${offerId}`);
  };

  const [offers, setOffers] = useState([
    {
      id: '1',
      title: 'Desarrollador Frontend React',
      company: 'Tech Solutions SA',
      location: 'Santa Cruz, Bolivia',
      salary: 'Bs 5000 - 7000',
      type: 'Tiempo completo',
      category: 'Desarrollo Web',
      description: 'Buscamos desarrollador Frontend con experiencia en React para unirse a nuestro equipo de innovación.',
      requirements: ['React', 'JavaScript', 'CSS', 'Git'],
      applicants: 15,
      status: 'active',
      created_at: '2024-01-15',
      expires_at: '2024-03-15',
      views: 234,
      matches: 8
    },
    {
      id: '2',
      title: 'Data Scientist Junior',
      company: 'DataCorp Bolivia',
      location: 'La Paz, Bolivia',
      salary: 'Bs 4000 - 6000',
      type: 'Medio tiempo',
      category: 'Ciencia de Datos',
      description: 'Oportunidad para recién graduados en carreras de tecnología con interés en análisis de datos.',
      requirements: ['Python', 'SQL', 'Machine Learning', 'Pandas'],
      applicants: 8,
      status: 'active',
      created_at: '2024-01-20',
      expires_at: '2024-03-20',
      views: 156,
      matches: 3
    },
    {
      id: '3',
      title: 'Backend Developer Node.js',
      company: 'Startup Innovadora',
      location: 'Cochabamba, Bolivia',
      salary: 'Bs 6000 - 8000',
      type: 'Tiempo completo',
      category: 'Desarrollo Backend',
      description: 'Desarrollador Backend con experiencia en Node.js y bases de datos NoSQL.',
      requirements: ['Node.js', 'MongoDB', 'Express', 'API REST'],
      applicants: 23,
      status: 'paused',
      created_at: '2024-01-10',
      expires_at: '2024-03-10',
      views: 189,
      matches: 12
    },
    {
      id: '4',
      title: 'Pasantía en Desarrollo Móvil',
      company: 'Mobile First Bolivia',
      location: 'Santa Cruz, Bolivia',
      salary: 'Bs 2000 - 3000',
      type: 'Pasantía',
      category: 'Desarrollo Móvil',
      description: 'Pasantía para estudiantes de últimos semestres interesados en desarrollo de aplicaciones móviles.',
      requirements: ['React Native', 'JavaScript', 'Git', 'Firebase'],
      applicants: 32,
      status: 'active',
      created_at: '2024-01-25',
      expires_at: '2024-02-28',
      views: 321,
      matches: 15
    }
  ]);

  const [newOffer, setNewOffer] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Tiempo completo',
    category: '',
    description: '',
    requirements: '',
    expires_at: ''
  });

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setNewOffer({
        ...offer,
        requirements: offer.requirements.join(', ')
      });
    } else {
      setEditingOffer(null);
      setNewOffer({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Tiempo completo',
        category: '',
        description: '',
        requirements: '',
        expires_at: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveOffer = () => {
    if (!newOffer.title || !newOffer.company || !newOffer.location || !newOffer.description || !newOffer.expires_at) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const offerData = {
      ...newOffer,
      requirements: newOffer.requirements.split(',').map(r => r.trim()).filter(r => r),
      id: editingOffer ? editingOffer.id : Date.now().toString(),
      applicants: editingOffer ? editingOffer.applicants : 0,
      views: editingOffer ? editingOffer.views : 0,
      matches: editingOffer ? editingOffer.matches : 0,
      status: editingOffer ? editingOffer.status : 'active',
      created_at: editingOffer ? editingOffer.created_at : new Date().toISOString().split('T')[0]
    };

    if (editingOffer) {
      setOffers(offers.map(o => o.id === editingOffer.id ? offerData : o));
    } else {
      setOffers([...offers, offerData]);
    }

    setShowModal(false);
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setOffers(offers.map(offer =>
      offer.id === id ? { ...offer, status: newStatus } : offer
    ));
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { color: 'green', text: 'Activa', icon: CheckCircle, bgColor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
      case 'paused':
        return { color: 'yellow', text: 'Pausada', icon: Clock, bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' };
      case 'expired':
        return { color: 'red', text: 'Expirada', icon: AlertCircle, bgColor: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' };
      default:
        return { color: 'gray', text: 'Desconocido', icon: AlertCircle, bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' };
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  // ⭐ NUEVO: Estadísticas rápidas
  const stats = {
    total: offers.length,
    active: offers.filter(o => o.status === 'active').length,
    applicants: offers.reduce((sum, offer) => sum + offer.applicants, 0),
    matches: offers.reduce((sum, offer) => sum + offer.matches, 0)
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>

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
                Mis Ofertas de Trabajo
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Gestiona y publica ofertas de pasantías y empleo
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Nueva Oferta
              </div>
            </Button>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {stats.total}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total Ofertas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 text-green-600`}>
              {stats.active}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Activas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 text-blue-600`}>
              {stats.applicants}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Postulantes</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 text-purple-600`}>
              {stats.matches}
            </div>
            <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>Matches</div>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Buscar ofertas por título, categoría o empresa..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`
                  px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${isDark
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                  }
                `}
              >
                <option value="all">Todas las ofertas</option>
                <option value="active">Activas</option>
                <option value="paused">Pausadas</option>
                <option value="expired">Expiradas</option>
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

        {/* Grid de Ofertas */}
        {filteredOffers.length === 0 ? (
          <Card className="p-8">
            <div className="text-center py-12">
              <Briefcase size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No hay ofertas {searchTerm || filterStatus !== 'all' ? 'que coincidan' : ''}
              </h3>
              <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchTerm || filterStatus !== 'all'
                  ? 'Intenta con otros términos de búsqueda o filtros'
                  : 'Comienza publicando tu primera oferta de trabajo'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <div className="flex items-center gap-2">
                    <Plus size={18} />
                    Publicar Primera Oferta
                  </div>
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredOffers.map((offer) => {
              const StatusIcon = getStatusInfo(offer.status).icon;
              const daysUntilExpiry = getDaysUntilExpiry(offer.expires_at);
              const statusInfo = getStatusInfo(offer.status);

              return (
                <Card key={offer.id} hover className="transition-all duration-200 hover:shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`
                        p-3 rounded-lg
                        ${isDark ? 'bg-purple-900/20' : 'bg-purple-100'}
                      `}>
                        <Briefcase size={24} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {offer.title}
                        </h3>
                        <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {offer.company} • {offer.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor}`}>
                            <StatusIcon size={12} className="inline mr-1" />
                            {statusInfo.text}
                          </span>
                          <span className={`text-xs font-medium ${getExpiryColor(daysUntilExpiry)}`}>
                            Expira en {daysUntilExpiry} días
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewOfferDetails(offer.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                        title="Ver detalles"
                      >
                        <Eye size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(offer)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                        title="Editar oferta"
                      >
                        <Edit3 size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                          }`}
                        title="Eliminar oferta"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className={`mb-4 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {offer.description}
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {offer.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {offer.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {offer.applicants} postulantes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {offer.views} vistas
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {offer.requirements.slice(0, 3).map((req, idx) => (
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
                          {req}
                        </span>
                      ))}
                      {offer.requirements.length > 3 && (
                        <span className={`px-2 py-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          +{offer.requirements.length - 3} más
                        </span>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCandidates(offer.id)}
                    >
                      <Users size={14} className="mr-2" />
                      Ver Candidatos
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Agregar/Editar Oferta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {editingOffer ? 'Editar Oferta' : 'Nueva Oferta de Trabajo'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <X size={24} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Título del Puesto"
                  type="text"
                  placeholder="Ej: Desarrollador Frontend React"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  required
                  icon={Briefcase}
                />

                <Input
                  label="Empresa"
                  type="text"
                  placeholder="Nombre de tu empresa"
                  value={newOffer.company}
                  onChange={(e) => setNewOffer({ ...newOffer, company: e.target.value })}
                  required
                />

                <Input
                  label="Ubicación"
                  type="text"
                  placeholder="Ciudad, Departamento"
                  value={newOffer.location}
                  onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                  required
                  icon={MapPin}
                />

                <Input
                  label="Salario"
                  type="text"
                  placeholder="Ej: Bs 4000 - 6000"
                  value={newOffer.salary}
                  onChange={(e) => setNewOffer({ ...newOffer, salary: e.target.value })}
                  icon={DollarSign}
                />

                <div className="mb-4">
                  <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Tipo de Contrato
                  </label>
                  <select
                    value={newOffer.type}
                    onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value })}
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                      ${isDark
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                      }
                    `}
                  >
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Por horas">Por horas</option>
                    <option value="Pasantía">Pasantía</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Categoría"
                  type="text"
                  placeholder="Ej: Desarrollo Web, Data Science..."
                  value={newOffer.category}
                  onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                  required
                />

                <Input
                  label="Fecha de Expiración"
                  type="date"
                  value={newOffer.expires_at}
                  onChange={(e) => setNewOffer({ ...newOffer, expires_at: e.target.value })}
                  required
                  icon={Calendar}
                />

                <div className="mb-4">
                  <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Descripción del Puesto <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Describe las responsabilidades y oportunidades del puesto..."
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    rows="4"
                    required
                    className={`
                      w-full px-4 py-3 rounded-lg transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                      ${isDark
                        ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }
                    `}
                  />
                </div>

                <Input
                  label="Requisitos"
                  type="text"
                  placeholder="React, JavaScript, Node.js (separados por comas)"
                  value={newOffer.requirements}
                  onChange={(e) => setNewOffer({ ...newOffer, requirements: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="primary" onClick={handleSaveOffer} fullWidth>
                <div className="flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingOffer ? 'Guardar Cambios' : 'Publicar Oferta'}
                </div>
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)} fullWidth>
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};