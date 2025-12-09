import {
    Bell,
    Briefcase,
    CheckCheck,
    Clock,
    MessageSquare,
    Send,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService } from '../../services/notificationService';

export const NotificationDropdown = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Detectar tipo de usuario
    const isEmpresa = location.pathname.includes('/empresa');

    // Cargar notificaciones reales
    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            let data;

            if (isEmpresa) {
                // Para empresas: generar desde aplicaciones
                data = await notificationService.getCompanyNotifications();
            } else {
                // Para estudiantes: usar el servicio normal
                data = await notificationService.getNotifications();
            }

            // Aplicar estado de lectura local
            const withReadState = (data || []).map(n => ({
                ...n,
                read: notificationService.isRead(n.id),
                timestamp: n.created_at ? new Date(n.created_at) : new Date()
            }));

            setNotifications(withReadState);
        } catch (error) {
            console.error('Error loading notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

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

    const getIcon = (type) => {
        const iconProps = { size: 18 };
        switch (type) {
            case 'new_application':
            case 'job_match':
                return <Send {...iconProps} />;
            case 'application_update':
            case 'application_status':
                return <Clock {...iconProps} />;
            case 'message':
                return <MessageSquare {...iconProps} />;
            case 'briefcase':
            case 'recommendation':
                return <Briefcase {...iconProps} />;
            default:
                return <Bell {...iconProps} />;
        }
    };

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days === 1) return 'Ayer';
        return `Hace ${days} dias`;
    };

    const handleNotificationClick = async (notification) => {
        // Marcar como leida
        await notificationService.markAsRead(notification.id);
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );

        // Navegar segun tipo de usuario
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        } else if (isEmpresa) {
            navigate('/empresa/candidatos');
        } else {
            navigate('/estudiante/postulaciones');
        }

        setIsOpen(false);
    };

    const markAllAsRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id, e) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getNotificationsUrl = () => {
        return isEmpresa ? '/empresa/notificaciones' : '/estudiante/notificaciones';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Boton de notificaciones */}
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
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
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
                                    title="Marcar todas como leidas"
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
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Cargando...
                                </p>
                            </div>
                        ) : notifications.length === 0 ? (
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
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`
                      w-full px-4 py-3 text-left transition-all duration-200 relative group cursor-pointer
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
                                                {getIcon(notification.type || notification.icon)}
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

                                                    {/* Indicador de no leida */}
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
                                                        {getTimeAgo(notification.timestamp || notification.created_at)}
                                                    </span>

                                                    {/* Boton eliminar - Cambiado de button a span */}
                                                    <span
                                                        onClick={(e) => deleteNotification(notification.id, e)}
                                                        className={`
                              opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all cursor-pointer
                              ${isDark
                                                                ? 'hover:bg-red-900/30 text-red-400'
                                                                : 'hover:bg-red-50 text-red-600'
                                                            }
                            `}
                                                        title="Eliminar notificacion"
                                                    >
                                                        <Trash2 size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer - Siempre visible */}
                    <div className={`
              px-4 py-3 border-t space-y-2
              ${isDark ? 'border-slate-700' : 'border-slate-200'}
            `}>
                        <button
                            onClick={() => {
                                navigate(getNotificationsUrl());
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
                        {notifications.length > 0 && (
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
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
