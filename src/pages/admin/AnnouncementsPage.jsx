// Página de Comunicados Masivos (CU16)
import { Send, Users, Building, Globe, MessageSquare, Eye, Plus, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { adminService } from '../../api/services/adminService';

export const AnnouncementsPage = () => {
    const { isDark } = useTheme();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        target: 'students'
    });

    // Cargar anuncios
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAnnouncements();
            setAnnouncements(data);
        } catch (err) {
            console.error('Error al cargar anuncios:', err);
            setError('No se pudieron cargar los anuncios');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!formData.title || !formData.message) {
            alert('⚠️ Completa todos los campos');
            return;
        }

        try {
            setSending(true);
            await adminService.createAnnouncement(formData);

            // Recargar anuncios
            await fetchAnnouncements();

            setShowModal(false);
            setFormData({ title: '', message: '', type: 'info', target: 'students' });
            alert('✅ Comunicado enviado exitosamente');
        } catch (err) {
            console.error('Error al enviar comunicado:', err);
            alert('❌ Error al enviar comunicado');
        } finally {
            setSending(false);
        }
    };

    const getTargetInfo = (target) => {
        const targets = {
            students: { icon: Users, label: 'Estudiantes', color: 'text-primary-600' },
            companies: { icon: Building, label: 'Empresas', color: 'text-accent-600' },
            all: { icon: Globe, label: 'Todos', color: 'text-green-600' }
        };
        return targets[target] || targets.students;
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando anuncios...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <Card className="max-w-md">
                    <div className="text-center">
                        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Error al cargar datos
                        </h2>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{error}</p>
                        <Button onClick={fetchAnnouncements} className="mt-4">Reintentar</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Comunicados Masivos
                            </h1>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Envía mensajes a estudiantes, empresas o todos los usuarios
                            </p>
                        </div>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            <Plus size={18} className="mr-2" />
                            Nuevo Comunicado
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Total Enviados
                                </p>
                                <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {announcements.length}
                                </h3>
                            </div>
                            <MessageSquare className="text-primary-600" size={40} />
                        </div>
                    </Card>

                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Anuncios Activos
                                </p>
                                <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {announcements.filter(a => a.is_active).length}
                                </h3>
                            </div>
                            <Eye className="text-green-600" size={40} />
                        </div>
                    </Card>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {announcements.map((announcement) => {
                        const targetInfo = getTargetInfo(announcement.target);
                        const TargetIcon = targetInfo.icon;

                        return (
                            <Card key={announcement.id} hover>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <TargetIcon className={targetInfo.color} size={32} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {announcement.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${announcement.target === 'students' ? 'bg-primary-100 text-primary-800' :
                                                    announcement.target === 'companies' ? 'bg-accent-100 text-accent-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {targetInfo.label}
                                            </span>
                                        </div>

                                        <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {announcement.message}
                                        </p>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Enviado</p>
                                                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {new Date(announcement.created_at).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Tipo</p>
                                                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {announcement.type}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Estado</p>
                                                <p className={`text-sm font-medium ${announcement.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                    {announcement.is_active ? 'Activo' : 'Inactivo'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {announcements.length === 0 && (
                    <Card>
                        <div className="text-center py-12">
                            <MessageSquare size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                No hay comunicados enviados
                            </h3>
                            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Crea tu primer comunicado masivo
                            </p>
                            <Button variant="primary" onClick={() => setShowModal(true)}>
                                <Plus size={18} className="mr-2" />
                                Crear Comunicado
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Nuevo Comunicado Masivo
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ej: Bienvenida al nuevo semestre"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${isDark
                                                ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                                            } focus:border-primary-500 focus:outline-none`}
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Mensaje *
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Escribe tu mensaje aquí..."
                                        rows={6}
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${isDark
                                                ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                                            } focus:border-primary-500 focus:outline-none`}
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Tipo *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${isDark
                                                ? 'bg-slate-800 border-slate-600 text-white'
                                                : 'bg-white border-slate-300 text-slate-900'
                                            } focus:border-primary-500 focus:outline-none`}
                                    >
                                        <option value="info">Información</option>
                                        <option value="warning">Advertencia</option>
                                        <option value="success">Éxito</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>

                                {/* Target */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Destinatarios *
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setFormData({ ...formData, target: 'students' })}
                                            className={`p-4 rounded-lg border-2 transition-all ${formData.target === 'students'
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                    : isDark
                                                        ? 'border-slate-600 hover:border-slate-500'
                                                        : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                        >
                                            <Users className={formData.target === 'students' ? 'text-primary-600' : 'text-slate-500'} size={24} style={{ margin: '0 auto 0.5rem' }} />
                                            <p className={`text-sm font-medium ${formData.target === 'students' ? 'text-primary-600' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Estudiantes
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => setFormData({ ...formData, target: 'companies' })}
                                            className={`p-4 rounded-lg border-2 transition-all ${formData.target === 'companies'
                                                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                                                    : isDark
                                                        ? 'border-slate-600 hover:border-slate-500'
                                                        : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                        >
                                            <Building className={formData.target === 'companies' ? 'text-accent-600' : 'text-slate-500'} size={24} style={{ margin: '0 auto 0.5rem' }} />
                                            <p className={`text-sm font-medium ${formData.target === 'companies' ? 'text-accent-600' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Empresas
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => setFormData({ ...formData, target: 'all' })}
                                            className={`p-4 rounded-lg border-2 transition-all ${formData.target === 'all'
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                    : isDark
                                                        ? 'border-slate-600 hover:border-slate-500'
                                                        : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                        >
                                            <Globe className={formData.target === 'all' ? 'text-green-600' : 'text-slate-500'} size={24} style={{ margin: '0 auto 0.5rem' }} />
                                            <p className={`text-sm font-medium ${formData.target === 'all' ? 'text-green-600' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Todos
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button variant="primary" fullWidth onClick={handleSend} disabled={sending}>
                                        {sending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Enviar Comunicado
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" onClick={() => setShowModal(false)} disabled={sending}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};
