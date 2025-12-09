import {
    Bell,
    Briefcase,
    CheckCheck,
    Clock,
    MessageSquare,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export const NotificationDropdown = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    // Mock data - Esto será reemplazado por datos reales del backend
    useEffect(() => {
        const mockNotifications = [
            {
                id: 1,
                type: 'job_match',
                title: 'Nueva oferta que coincide con tu perfil',
                message: 'Desarrollador Full Stack en TechCorp Bolivia',
                timestamp: new Date(Date.now() - 5 * 60000), // 5 minutos atrás
                read: false,
                actionUrl: '/estudiante/ofertas',
                icon: 'briefcase'
            },
            {
                id: 2,
                type: 'application_update',
                title: 'Actualización de postulación',
                message: 'Tu postulación a "Frontend Developer" fue vista por la empresa',
                timestamp: new Date(Date.now() - 2 * 3600000), // 2 horas atrás
                read: false,
                actionUrl: '/estudiante/postulaciones',
                icon: 'clock'
            },
            {
                id: 3,
                type: 'message',
                title: 'Nuevo mensaje',
                message: 'Innovatech S.R.L. te ha enviado un mensaje',
                timestamp: new Date(Date.now() - 24 * 3600000), // 1 día atrás
                read: true,
                actionUrl: '/estudiante/mensajes',
                icon: 'message'
            },
            {
                id: 4,
                type: 'recommendation',
                title: 'Recomendación de empleo',
                message: '3 nuevas ofertas basadas en tus habilidades de React y Node.js',
                timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 días atrás
                read: true,
                actionUrl: '/estudiante/ofertas',
                icon: 'briefcase'
            },
            {
                id: 5,
                type: 'profile_view',
                title: 'Perfil visto',
                message: '2 empresas vieron tu perfil esta semana',
                timestamp: new Date(Date.now() - 3 * 24 * 3600000), // 3 días atrás
                read: true,
                actionUrl: '/estudiante/perfil',
                icon: 'clock'
            }
        ];
        setNotifications(mockNotifications);
    }, []);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (iconType) => {
        const iconProps = { size: 18 };
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

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days === 1) return 'Ayer';
        return `Hace ${days} días`;
    };

    const handleNotificationClick = (notification) => {
        // Marcar como leída
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );

        // Navegar a la URL de acción
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }

        setIsOpen(false);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id, e) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón de notificaciones */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          relative p-2.5 rounded-lg transition-all duration-200
          ${isDark
                        ? 'hover:bg-slate-800 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-600'
                    }
        `}
            >
                <Bell size={20} />

                {/* Badge de contador */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown de notificaciones */}
            {isOpen && (
                <div className={`
          absolute right-0 mt-2 w-96 max-h-[600px] rounded-xl shadow-2xl border overflow-hidden z-50
          ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }
        `}>
                    {/* Header */}
                    <div className={`
            px-4 py-3 border-b flex items-center justify-between
            ${isDark ? 'border-slate-700' : 'border-slate-200'}
          `}>
                        <div>
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Notificaciones
                            </h3>
                            {unreadCount > 0 && (
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {unreadCount} sin leer
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className={`
                    p-2 rounded-lg transition-colors text-xs font-medium
                    ${isDark
                                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                        }
                  `}
                                    title="Marcar todas como leídas"
                                >
                                    <CheckCheck size={16} />
                                </button>
                            )}

                            <button
                                onClick={() => setIsOpen(false)}
                                className={`
                  p-2 rounded-lg transition-colors
                  ${isDark
                                        ? 'hover:bg-slate-700 text-slate-400'
                                        : 'hover:bg-slate-100 text-slate-600'
                                    }
                `}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-[450px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                  ${isDark ? 'bg-slate-700' : 'bg-slate-100'}
                `}>
                                    <Bell size={32} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                </div>
                                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    No tienes notificaciones
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`
                      w-full px-4 py-3 text-left transition-all duration-200 relative group
                      ${!notification.read
                                                ? isDark
                                                    ? 'bg-primary-900/20 hover:bg-primary-900/30'
                                                    : 'bg-primary-50 hover:bg-primary-100'
                                                : isDark
                                                    ? 'hover:bg-slate-700'
                                                    : 'hover:bg-slate-50'
                                            }
                    `}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icono */}
                                            <div className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
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
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className={`
                            text-sm font-semibold line-clamp-1
                            ${isDark ? 'text-white' : 'text-slate-900'}
                          `}>
                                                        {notification.title}
                                                    </h4>

                                                    {/* Indicador de no leída */}
                                                    {!notification.read && (
                                                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-1.5"></span>
                                                    )}
                                                </div>

                                                <p className={`
                          text-xs line-clamp-2 mb-2
                          ${isDark ? 'text-slate-400' : 'text-slate-600'}
                        `}>
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className={`
                            text-xs
                            ${isDark ? 'text-slate-500' : 'text-slate-500'}
                          `}>
                                                        {getTimeAgo(notification.timestamp)}
                                                    </span>

                                                    {/* Botón eliminar */}
                                                    <button
                                                        onClick={(e) => deleteNotification(notification.id, e)}
                                                        className={`
                              opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all
                              ${isDark
                                                                ? 'hover:bg-red-900/30 text-red-400'
                                                                : 'hover:bg-red-50 text-red-600'
                                                            }
                            `}
                                                        title="Eliminar notificación"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className={`
              px-4 py-3 border-t space-y-2
              ${isDark ? 'border-slate-700' : 'border-slate-200'}
            `}>
                            <button
                                onClick={() => {
                                    navigate('/estudiante/notificaciones');
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full py-2 rounded-lg text-sm font-medium transition-colors
                  ${isDark
                                        ? 'text-primary-400 hover:bg-primary-900/20'
                                        : 'text-primary-600 hover:bg-primary-50'
                                    }
                `}
                            >
                                Ver todas las notificaciones
                            </button>
                            <button
                                onClick={clearAll}
                                className={`
                  w-full py-2 rounded-lg text-sm font-medium transition-colors
                  ${isDark
                                        ? 'text-red-400 hover:bg-red-900/20'
                                        : 'text-red-600 hover:bg-red-50'
                                    }
                `}
                            >
                                Limpiar todas
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
