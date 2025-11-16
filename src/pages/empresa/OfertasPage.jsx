// src/pages/empresa/OfertasPage.jsx

import {
  AlertCircle,
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { useTheme } from '../../contexts/ThemeContext';
import apiService from '../../services/api.js';

const OfertasPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [offers, setOffers] = useState([]);

  // Automapped OFFER form
  const [newOffer, setNewOffer] = useState({
    title: '',
    location: '',
    salary: '',
    type: 'Tiempo completo',
    description: '',
    requirements: '',
    expires_at: ''
  });

  // -------------------------------------------------------
  // LOAD ALL REAL JOBS FROM BACKEND
  // -------------------------------------------------------
  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const companyId = localStorage.getItem("user_id");
      if (!companyId) return;

      const response = await apiService.get(`/jobs/company/${companyId}`);
      const jobs = response.jobs || response.data || response.items || [];
      setOffers(jobs);


      // Load applicants count per job
      for (const job of jobs) {
        const appsResp = await apiService.get(`/applications/job/${job.id}`);
        job.applicants = Array.isArray(appsResp) ? appsResp.length : 0;
      }

      setOffers(jobs);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  }

  // -------------------------------------------------------
  // OPEN MODAL (mapped to backend fields)
  // -------------------------------------------------------
  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setNewOffer({
        title: offer.title,
        location: offer.location,
        salary: offer.salary_range || '',
        type: offer.job_type,
        description: offer.description,
        requirements: offer.requirements || '',
        expires_at: offer.deadline?.split('T')[0] || ''
      });
    } else {
      setEditingOffer(null);
      setNewOffer({
        title: '',
        location: '',
        salary: '',
        type: 'Tiempo completo',
        description: '',
        requirements: '',
        expires_at: ''
      });
    }

    setShowModal(true);
  };

  // -------------------------------------------------------
  // SAVE OFFER → CREATE / UPDATE
  // -------------------------------------------------------
  const handleSaveOffer = async () => {
    const companyId = localStorage.getItem("user_id");

    const payload = {
      title: newOffer.title,
      description: newOffer.description,
      requirements: newOffer.requirements,
      salary_range: newOffer.salary,
      job_type: newOffer.type,
      location: newOffer.location,
      deadline: newOffer.expires_at,
      company_id: companyId
    };

    try {
      if (editingOffer) {
        await apiService.patch(`/jobs/${editingOffer.id}`, payload);
      } else {
        await apiService.post("/jobs", payload);
      }

      setShowModal(false);
      loadOffers();
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Error al guardar la oferta");
    }
  };

  // -------------------------------------------------------
  // DELETE OFFER
  // -------------------------------------------------------
  const handleDeleteOffer = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta oferta?")) return;

    try {
      await apiService.delete(`/jobs/${id}`);
      loadOffers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error al eliminar la oferta");
    }
  };

  // -------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------
  const handleViewOfferDetails = (id) => {
    navigate(`/empresa/ofertas/${id}`);
  };

  // -------------------------------------------------------
  // FILTERS
  // -------------------------------------------------------
  const safeOffers = Array.isArray(offers) ? offers : [];

  const filteredOffers = safeOffers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && offer.is_active) ||
      (filterStatus === "paused" && !offer.is_active);

    return matchesSearch && matchesFilter;
  });

  // Status mapping
  const getStatusInfo = (isActive) => {
    if (isActive) return { color: 'green', text: 'Activa', icon: CheckCircle };
    return { color: 'yellow', text: 'Pausada', icon: Clock };
  };

  // Expiration
  const getDaysUntilExpiry = (deadline) => {
    if (!deadline) return "N/A";
    const today = new Date();
    const exp = new Date(deadline);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  // -------------------------------------------------------
  // UI (NOT MODIFIED)
  // -------------------------------------------------------
  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>

      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mis Ofertas de Trabajo
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Gestiona y publica ofertas de empleo y pasantías
            </p>
          </div>

          <Button variant="primary" onClick={() => handleOpenModal()}>
            <div className="flex items-center gap-2">
              <Plus size={18} />
              Nueva Oferta
            </div>
          </Button>
        </div>

        {/* FILTERS */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-slate-100"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 rounded-lg border-2 ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-slate-100"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="paused">Pausadas</option>
              </select>

              <Button variant="outline">
                <Filter size={18} />
                Filtros
              </Button>
            </div>

          </div>
        </Card>

        {/* LIST OF OFFERS */}
        {filteredOffers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Briefcase size={64} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No hay ofertas aún
              </h3>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredOffers.map((offer) => {
              const info = getStatusInfo(offer.is_active);
              const days = getDaysUntilExpiry(offer.deadline);

              return (
                <Card key={offer.id} hover>

                  <div className="flex justify-between mb-4">

                    {/* Main Info */}
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
                        <Briefcase className="text-purple-600" size={24} />
                      </div>

                      <div>
                        <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {offer.title}
                        </h3>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                          {offer.location}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => handleViewOfferDetails(offer.id)}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleOpenModal(offer)}>
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteOffer(offer.id)}>
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>

                  </div>

                  <p className={isDark ? "text-slate-300" : "text-slate-700"}>
                    {offer.description}
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

                    <div className="flex gap-2">
                      <DollarSign size={16} />
                      {offer.salary_range || "Sin salario"}
                    </div>

                    <div className="flex gap-2">
                      <Clock size={16} />
                      {offer.job_type}
                    </div>

                    <div className="flex gap-2">
                      <Users size={16} />
                      {offer.applicants} postulantes
                    </div>

                    <div className="flex gap-2">
                      <Calendar size={16} />
                      Expira en {days} días
                    </div>

                  </div>

                  <div className="flex justify-between mt-4">

                    {/* Requirements */}
                    <div className="flex flex-wrap gap-2">
                      {(offer.requirements || "")
                        .split(",")
                        .slice(0, 3)
                        .map((r, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-200 rounded text-xs">
                            {r.trim()}
                          </span>
                        ))}
                    </div>

                    {/* Status */}
                    <div className="flex gap-2 items-center">
                      <info.icon size={16} className={`text-${info.color}-500`} />
                      <span className={`font-medium text-${info.color}-600`}>
                        {info.text}
                      </span>
                    </div>

                  </div>

                </Card>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL BELOW — NO CHANGE (AUTOMAPPED FIELDS) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {editingOffer ? "Editar Oferta" : "Nueva Oferta"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">

                <Input
                  label="Título"
                  icon={Briefcase}
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                />

                <Input
                  label="Ubicación"
                  icon={MapPin}
                  value={newOffer.location}
                  onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                />

                <Input
                  label="Salario"
                  icon={DollarSign}
                  value={newOffer.salary}
                  onChange={(e) => setNewOffer({ ...newOffer, salary: e.target.value })}
                />

                <select
                  value={newOffer.type}
                  onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                >
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Medio tiempo">Medio tiempo</option>
                  <option value="Por horas">Por horas</option>
                  <option value="Pasantía">Pasantía</option>
                  <option value="Freelance">Freelance</option>
                </select>

              </div>

              <div className="space-y-4">

                <Input
                  label="Fecha de Expiración"
                  icon={Calendar}
                  type="date"
                  value={newOffer.expires_at}
                  onChange={(e) => setNewOffer({ ...newOffer, expires_at: e.target.value })}
                />

                <textarea
                  rows={4}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Descripción"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                />

                <Input
                  label="Requisitos"
                  value={newOffer.requirements}
                  onChange={(e) => setNewOffer({ ...newOffer, requirements: e.target.value })}
                />

              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="primary" fullWidth onClick={handleSaveOffer}>
                <Save /> {editingOffer ? "Guardar" : "Publicar"}
              </Button>
              <Button variant="outline" fullWidth onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
            </div>

          </Card>
        </div>
      )}

    </div>
  );
};

export { OfertasPage };
