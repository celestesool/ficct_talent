// Página simple para mostrar notificaciones (CU13)
import { Bell, BellOff, CheckCheck, Eye, FileText, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService } from '../../services/notificationService';

export const NotificationsPage = () => {
    const { isDark } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            // Usar el método especial para empresas que genera desde aplicaciones reales
            const data = await notificationService.getCompanyNotifications();
            // Aplicar estado de lectura local
            const withReadState = data.map(n => ({
                ...n,
                read: notificationService.isRead(n.id)
            }));
            setNotifications(withReadState);
        } catch (error) {
            console.error('Error loading notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type) => {
        const iconClass = isDark ? 'text-slate-300' : 'text-slate-600';
        switch (type) {
            case 'new_application':
                return <Send size={24} className="text-primary-500" />;
            case 'application_status':
                return <CheckCircle size={24} className="text-green-500" />;
            case 'job_expiring':
                return <Clock size={24} className="text-yellow-500" />;
            case 'alert':
                return <AlertCircle size={24} className="text-red-500" />;
            default:
                return <Bell size={24} className={iconClass} />;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Notificaciones
                            </h1>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'No tienes notificaciones nuevas'}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Button variant="outline" onClick={markAllAsRead}>
                                <CheckCheck size={18} className="mr-2" />
                                Marcar todas como leídas
                            </Button>
                        )}
                    </div>
                </div>

                {/* Lista de Notificaciones */}
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            hover
                            className={`relative ${!notification.read ? (isDark ? 'bg-primary-900/10 border-primary-500/30' : 'bg-primary-50 border-primary-200') : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} ${!notification.read ? '' : 'opacity-60'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.read && (
                                            <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                                                Nuevo
                                            </span>
                                        )}
                                    </div>
                                    <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {notification.message}
                                    </p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {new Date(notification.created_at).toLocaleString('es-ES')}
                                        </span>
                                        {!notification.read && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <Eye size={16} className="mr-2" />
                                                Marcar como leída
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <Card>
                        <div className="text-center py-12">
                            <BellOff size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                No tienes notificaciones
                            </h3>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Te notificaremos cuando haya nuevas postulaciones
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
