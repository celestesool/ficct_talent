import {
    ArrowLeft,
    Bell,
    Briefcase,
    CheckCheck,
    Clock,
    Filter,
    MessageSquare,
    Search,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';

const NotificationsPage = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - Esto será reemplazado por datos reales del backend
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'job_match',
            title: 'Nueva oferta que coincide con tu perfil',
            message: 'Desarrollador Full Stack en TechCorp Bolivia. Esta posición requiere experiencia en React, Node.js y MongoDB.',
            timestamp: new Date(Date.now() - 5 * 60000),
            read: false,
            actionUrl: '/estudiante/ofertas',
            icon: 'briefcase',
            category: 'Ofertas'
        },
        {
            id: 2,
            type: 'application_update',
            title: 'Actualización de postulación',
            message: 'Tu postulación a "Frontend Developer" en Innovatech fue vista por la empresa. Podrían contactarte pronto.',
            timestamp: new Date(Date.now() - 2 * 3600000),
            read: false,
            actionUrl: '/estudiante/postulaciones',
            icon: 'clock',
            category: 'Postulaciones'
        },
        {
            id: 3,
            type: 'message',
            title: 'Nuevo mensaje',
            message: 'Innovatech S.R.L. te ha enviado un mensaje sobre tu postulación. Revisa tu bandeja de mensajes.',
            timestamp: new Date(Date.now() - 24 * 3600000),
            read: true,
            actionUrl: '/estudiante/mensajes',
            icon: 'message',
            category: 'Mensajes'
        },
        {
            id: 4,
            type: 'recommendation',
            title: 'Recomendación de empleo',
            message: '3 nuevas ofertas basadas en tus habilidades de React y Node.js. Revisa las oportunidades que mejor se ajustan a tu perfil.',
            timestamp: new Date(Date.now() - 2 * 24 * 3600000),
            read: true,
            actionUrl: '/estudiante/ofertas',
            icon: 'briefcase',
            category: 'Ofertas'
        },
        {
            id: 5,
            type: 'profile_view',
            title: 'Perfil visto',
            message: '2 empresas vieron tu perfil esta semana. Mantén tu información actualizada para atraer más oportunidades.',
            timestamp: new Date(Date.now() - 3 * 24 * 3600000),
            read: true,
            actionUrl: '/estudiante/perfil',
            icon: 'clock',
            category: 'Perfil'
        },
        {
            id: 6,
            type: 'job_match',
            title: 'Oferta destacada',
            message: 'Backend Developer en StartupBolivia. Salario competitivo y trabajo remoto disponible.',
            timestamp: new Date(Date.now() - 4 * 24 * 3600000),
            read: true,
            actionUrl: '/estudiante/ofertas',
            icon: 'briefcase',
            category: 'Ofertas'
        },
        {
            id: 7,
            type: 'application_update',
            title: 'Postulación rechazada',
            message: 'Lamentablemente tu postulación a "DevOps Engineer" no fue seleccionada. Sigue buscando nuevas oportunidades.',
            timestamp: new Date(Date.now() - 5 * 24 * 3600000),
            read: true,
            actionUrl: '/estudiante/postulaciones',
            icon: 'clock',
            category: 'Postulaciones'
        }
    ]);

    const getIcon = (iconType) => {
        const iconProps = { size: 20 };
        switch (iconType) {
            case 'briefcase': return <Briefcase {...iconProps} />;
            case 'message': return <MessageSquare {...iconProps} />;
            case 'clock': return <Clock {...iconProps} />;
            default: return <Bell {...iconProps} />;
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (days === 1) return 'Ayer';
        if (days < 7) return `Hace ${days} días`;
        if (days < 30) return `Hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;
        return `Hace ${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''}`;
    };

    const handleNotificationClick = (notification) => {
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
            setNotifications([]);
        }
    };

    // Filtrar notificaciones
    const filteredNotifications = notifications
        .filter(n => {
            if (filter === 'unread') return !n.read;
            if (filter === 'read') return n.read;
            return true;
        })
        .filter(n => {
            if (!searchTerm) return true;
            return n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.category.toLowerCase().includes(searchTerm.toLowerCase());
        });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Button variant="outline" onClick={() => navigate('/estudiante/dashboard')}>
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary-500 to-accent-3000"></div>
                        <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Notificaciones
                        </h1>
                    </div>
                    <p className={`text-base lg:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Mantente al día con todas tus actualizaciones
                    </p>
                </div>

                {/* Barra de acciones */}
                <Card className="mb-6 p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                        {/* Búsqueda */}
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar notificaciones..."
                                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all
                  ${isDark
                                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                                    }
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                `}
                            />
                        </div>

                        {/* Filtros y acciones */}
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Filtro */}
                            <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${filter === 'all'
                                            ? 'bg-primary-600 text-white'
                                            : isDark
                                                ? 'text-slate-400 hover:text-white'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }
                  `}
                                >
                                    Todas ({notifications.length})
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${filter === 'unread'
                                            ? 'bg-primary-600 text-white'
                                            : isDark
                                                ? 'text-slate-400 hover:text-white'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }
                  `}
                                >
                                    Sin leer ({unreadCount})
                                </button>
                                <button
                                    onClick={() => setFilter('read')}
                                    className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${filter === 'read'
                                            ? 'bg-primary-600 text-white'
                                            : isDark
                                                ? 'text-slate-400 hover:text-white'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }
                  `}
                                >
                                    Leídas ({notifications.length - unreadCount})
                                </button>
                            </div>

                            {/* Acciones */}
                            {unreadCount > 0 && (
                                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                                    <CheckCheck size={16} className="mr-2" />
                                    Marcar todas como leídas
                                </Button>
                            )}

                            {notifications.length > 0 && (
                                <Button variant="outline" size="sm" onClick={clearAll}>
                                    <Trash2 size={16} className="mr-2" />
                                    Limpiar todas
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Lista de notificaciones */}
                {filteredNotifications.length === 0 ? (
                    <Card className="text-center py-16">
                        <div className={`
              w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
              ${isDark ? 'bg-slate-800' : 'bg-slate-100'}
            `}>
                            <Bell size={40} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {searchTerm ? 'No se encontraron notificaciones' : 'No tienes notificaciones'}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {searchTerm
                                ? 'Intenta con otros términos de búsqueda'
                                : 'Cuando recibas notificaciones, aparecerán aquí'
                            }
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <Card
                                key={notification.id}
                                hover
                                className={`
                  p-5 cursor-pointer transition-all
                  ${!notification.read
                                        ? isDark
                                            ? 'bg-primary-900/10 border-primary-500/30'
                                            : 'bg-primary-50 border-primary-200'
                                        : ''
                                    }
                `}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex gap-4">
                                    {/* Icono */}
                                    <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                    ${!notification.read
                                            ? 'bg-primary-500 text-white'
                                            : isDark
                                                ? 'bg-slate-700 text-slate-400'
                                                : 'bg-slate-200 text-slate-600'
                                        }
                  `}>
                                        {getIcon(notification.icon)}
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`
                            text-lg font-bold
                            ${isDark ? 'text-white' : 'text-slate-900'}
                          `}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                                                    )}
                                                </div>
                                                <span className={`
                          inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2
                          ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
                        `}>
                                                    {notification.category}
                                                </span>
                                            </div>

                                            {/* Botón eliminar */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                                className={`
                          p-2 rounded-lg transition-all
                          ${isDark
                                                        ? 'hover:bg-red-900/30 text-red-400'
                                                        : 'hover:bg-red-50 text-red-600'
                                                    }
                        `}
                                                title="Eliminar notificación"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <p className={`
                      text-sm mb-3 leading-relaxed
                      ${isDark ? 'text-slate-400' : 'text-slate-600'}
                    `}>
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                            <span className={`
                        text-xs
                        ${isDark ? 'text-slate-500' : 'text-slate-500'}
                      `}>
                                                {getTimeAgo(notification.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
