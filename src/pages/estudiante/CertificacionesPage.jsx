import {
  Award,
  Building2,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

export const CertificacionesPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  const [certifications, setCertifications] = useState([
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuing_organization: 'Amazon Web Services',
      issue_date: '2023-06-15',
      expiration_date: '2026-06-15',
      credential_url: 'https://aws.amazon.com/verification/cert123'
    },
    {
      id: '2',
      name: 'Professional Scrum Master I',
      issuing_organization: 'Scrum.org',
      issue_date: '2023-09-20',
      expiration_date: null,
      credential_url: 'https://scrum.org/certificates/cert456'
    },
    {
      id: '3',
      name: 'MongoDB Developer Certification',
      issuing_organization: 'MongoDB University',
      issue_date: '2024-01-10',
      expiration_date: '2026-01-10',
      credential_url: 'https://university.mongodb.com/cert789'
    }
  ]);

  const [newCert, setNewCert] = useState({
    name: '',
    issuing_organization: '',
    issue_date: '',
    expiration_date: '',
    credential_url: ''
  });

  const handleOpenModal = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setNewCert(cert);
    } else {
      setEditingCert(null);
      setNewCert({
        name: '',
        issuing_organization: '',
        issue_date: '',
        expiration_date: '',
        credential_url: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveCert = () => {
    const certData = {
      ...newCert,
      id: editingCert ? editingCert.id : Date.now().toString()
    };

    if (editingCert) {
      setCertifications(certifications.map(c => c.id === editingCert.id ? certData : c));
    } else {
      setCertifications([...certifications, certData]);
    }

    setShowModal(false);
    setNewCert({
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
      credential_url: ''
    });
  };

  const handleDeleteCert = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta certificación?')) {
      setCertifications(certifications.filter(c => c.id !== id));
    }
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getStatus = (cert) => {
    if (!cert.expiration_date) {
      return { text: 'No expira', color: 'green' };
    }
    if (isExpired(cert.expiration_date)) {
      return { text: 'Expirada', color: 'red' };
    }

    const expDate = new Date(cert.expiration_date);
    const monthsUntilExpiry = (expDate - new Date()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsUntilExpiry < 6) {
      return { text: 'Próxima a expirar', color: 'orange' };
    }

    return { text: 'Válida', color: 'green' };
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
                Mis Certificaciones
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Gestiona tus certificaciones y credenciales profesionales
              </p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Agregar Certificación
              </div>
            </Button>
          </div>
        </div>

        {/* Grid de Certificaciones */}
        {certifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Award size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No tienes certificaciones aún
              </h3>
              <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Agrega tus certificaciones para mostrar tus credenciales a las empresas
              </p>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <div className="flex items-center gap-2">
                  <Plus size={18} />
                  Agregar Primera Certificación
                </div>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => {
              const status = getStatus(cert);
              return (
                <Card key={cert.id} hover>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`
                      p-3 rounded-lg
                      ${isDark ? 'bg-green-900/20' : 'bg-green-100'}
                    `}>
                      <Award size={24} className="text-green-600" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(cert)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                      >
                        <Edit3 size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                          }`}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cert.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {cert.issuing_organization}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Emitida: {new Date(cert.issue_date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {cert.expiration_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                          Expira: {new Date(cert.expiration_date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${status.color === 'green'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : status.color === 'orange'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }
                    `}>
                      {status.text}
                    </span>
                  </div>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border-2 transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={16} />
                      Ver Credencial
                    </a>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Agregar/Editar Certificación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {editingCert ? 'Editar Certificación' : 'Agregar Nueva Certificación'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <X size={24} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre de la Certificación"
                type="text"
                placeholder="Ej: AWS Certified Solutions Architect"
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                required
                icon={Award}
              />

              <Input
                label="Organización Emisora"
                type="text"
                placeholder="Ej: Amazon Web Services"
                value={newCert.issuing_organization}
                onChange={(e) => setNewCert({ ...newCert, issuing_organization: e.target.value })}
                required
                icon={Building2}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Fecha de Emisión"
                  type="date"
                  value={newCert.issue_date}
                  onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                  required
                  icon={Calendar}
                />

                <Input
                  label="Fecha de Expiración"
                  type="date"
                  value={newCert.expiration_date}
                  onChange={(e) => setNewCert({ ...newCert, expiration_date: e.target.value })}
                  icon={Calendar}
                />
              </div>

              <Input
                label="URL de la Credencial"
                type="url"
                placeholder="https://platform.com/verification/abc123"
                value={newCert.credential_url}
                onChange={(e) => setNewCert({ ...newCert, credential_url: e.target.value })}
                icon={LinkIcon}
              />

              <div className="flex gap-4 mt-6">
                <Button variant="primary" onClick={handleSaveCert} fullWidth>
                  <div className="flex items-center justify-center gap-2">
                    <Save size={18} />
                    {editingCert ? 'Guardar Cambios' : 'Agregar Certificación'}
                  </div>
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)} fullWidth>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};