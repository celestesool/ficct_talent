import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from '../../contexts/RouterContext';
import { Navbar } from '../../components/common/Navbar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  Plus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit3,
  Trash2,
  X,
  Save,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const OfertasPage = () => {
  const { isDark } = useTheme();
  const { navigate } = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      expires_at: '2024-03-15'
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
      expires_at: '2024-03-20'
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
      expires_at: '2024-03-10'
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
    const offerData = {
      ...newOffer,
      requirements: newOffer.requirements.split(',').map(r => r.trim()),
      id: editingOffer ? editingOffer.id : Date.now().toString(),
      applicants: editingOffer ? editingOffer.applicants : 0,
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
    if (window.confirm('¿Estás seguro de eliminar esta oferta?')) {
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
                         offer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { color: 'green', text: 'Activa', icon: CheckCircle };
      case 'paused':
        return { color: 'yellow', text: 'Pausada', icon: Clock };
      case 'expired':
        return { color: 'red', text: 'Expirada', icon: AlertCircle };
      default:
        return { color: 'gray', text: 'Desconocido', icon: AlertCircle };
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mis Ofertas de Trabajo
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Gestiona y publica ofertas de pasantías y empleo
              </p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Nueva Oferta
              </div>
            </Button>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-64">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  ${isDark 
                    ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }
                `}
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`
                  px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  ${isDark 
                    ? 'bg-slate-700 border-slate-600 text-slate-100' 
                    : 'bg-white border-slate-300 text-slate-900'
                  }
                `}
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="paused">Pausadas</option>
                <option value="expired">Expiradas</option>
              </select>

              <Button variant="outline">
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  Filtros
                </div>
              </Button>
            </div>
          </div>
        </Card>

        {/* Grid de Ofertas */}
        {filteredOffers.length === 0 ? (
          <Card>
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
              
              return (
                <Card key={offer.id} hover>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`
                        p-3 rounded-lg
                        ${isDark ? 'bg-purple-900/20' : 'bg-purple-100'}
                      `}>
                        <Briefcase size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {offer.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {offer.company} • {offer.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/empresa/ofertas/${offer.id}`)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        <Eye size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(offer)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        <Edit3 size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                      <Calendar size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Expira en {daysUntilExpiry} días
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

                    <div className="flex items-center gap-2">
                      <StatusIcon size={16} className={`text-${getStatusInfo(offer.status).color}-500`} />
                      <span className={`
                        text-sm font-medium
                        ${getStatusInfo(offer.status).color === 'green' ? 'text-green-600' :
                          getStatusInfo(offer.status).color === 'yellow' ? 'text-yellow-600' :
                          'text-red-600'
                        }
                      `}>
                        {getStatusInfo(offer.status).text}
                      </span>
                    </div>
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
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
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
                      w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                      ${isDark 
                        ? 'bg-slate-700 border-slate-600 text-slate-100' 
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
                      w-full px-4 py-3 rounded-lg transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                      ${isDark 
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' 
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