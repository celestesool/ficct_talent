// Moderación de Cuentas de Usuario (CU14)
import { CheckCircle, XCircle, Ban, Eye, AlertCircle, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { adminService } from '../../api/services/adminService';

export const ModerationPage = () => {
    const { isDark } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'suspended'

    // Cargar usuarios
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getUsersForModeration();
            setUsers(data);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await adminService.updateUserStatus(userId, 'approved');
            // Actualizar localmente
            setUsers(users.map(u =>
                u.id === userId ? { ...u, status: 'approved' } : u
            ));
            alert('Usuario aprobado correctamente');
        } catch (err) {
            console.error('Error al aprobar usuario:', err);
            alert('Error al aprobar usuario');
        }
    };

    const handleSuspend = async (userId) => {
        if (window.confirm('¿Estás seguro de suspender esta cuenta?')) {
            try {
                await adminService.updateUserStatus(userId, 'suspended');
                setUsers(users.map(u =>
                    u.id === userId ? { ...u, status: 'suspended' } : u
                ));
                alert('Usuario suspendido');
            } catch (err) {
                console.error('Error al suspender usuario:', err);
                alert('Error al suspender usuario');
            }
        }
    };

    const handleReject = async (userId) => {
        if (window.confirm('⚠️ ¿Rechazar esta solicitud?')) {
            try {
                await adminService.updateUserStatus(userId, 'rejected');
                setUsers(users.map(u =>
                    u.id === userId ? { ...u, status: 'rejected' } : u
                ));
                alert('Usuario rechazado');
            } catch (err) {
                console.error('Error al rechazar usuario:', err);
                alert('Error al rechazar usuario');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
            suspended: { label: 'Suspendido', color: 'bg-red-100 text-red-800' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                {badge.label}
            </span>
        );
    };

    const getUserTypeLabel = (type) => {
        return type === 'student' ? ' Estudiante' : ' Empresa';
    };

    // Mostrar loading
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    // Mostrar error
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
                        <Button onClick={fetchUsers} className="mt-4">Reintentar</Button>
                    </div>
                </Card>
            </div>
        );
    }

    const filteredUsers = users.filter(u => filter === 'all' || u.status === filter);

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Moderación de Usuarios
                    </h1>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Aprobar, suspender o eliminar cuentas de usuario
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="flex flex-wrap gap-3">
                        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Filtrar por estado:
                        </span>
                        {['all', 'pending', 'approved', 'suspended'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                    ? 'bg-primary-600 text-white'
                                    : isDark
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                            >
                                {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendientes' : status === 'approved' ? 'Aprobados' : 'Suspendidos'}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="text-center">
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total</p>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{users.length}</p>
                    </Card>
                    <Card className="text-center bg-yellow-50 dark:bg-yellow-900/20">
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
                    </Card>
                    <Card className="text-center bg-green-50 dark:bg-green-900/20">
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Aprobados</p>
                        <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'approved').length}</p>
                    </Card>
                    <Card className="text-center bg-red-50 dark:bg-red-900/20">
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Reportados</p>
                        <p className="text-2xl font-bold text-red-600">{users.filter(u => u.reported_count > 0).length}</p>
                    </Card>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                    {filteredUsers.map((user) => (
                        <Card key={user.id} hover className="relative">
                            {user.reported_count > 0 && (
                                <div className="absolute top-4 right-4">
                                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-bold">
                                        <AlertCircle size={14} />
                                        {user.reported_count} Reporte(s)
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-3 rounded-full ${isDark ? 'bg-primary-900/20' : 'bg-primary-100'}`}>
                                            <Mail className="text-primary-600" size={20} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {user.email}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {getUserTypeLabel(user.user_type)}
                                                {user.company_name && ` • ${user.company_name}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Estado</p>
                                            <div className="mt-1">{getStatusBadge(user.status)}</div>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Registro</p>
                                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {new Date(user.created_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Perfil</p>
                                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {user.profile_complete ? '✅ Completo' : '⚠️ Incompleto'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>ID</p>
                                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                #{user.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reports */}
                                    {user.reports && user.reports.length > 0 && (
                                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <p className="text-sm font-bold text-red-800 dark:text-red-400 mb-2">Reportes:</p>
                                            <ul className="space-y-1">
                                                {user.reports.map((report, i) => (
                                                    <li key={i} className="text-xs text-red-700 dark:text-red-300">
                                                        • {report.reason} ({report.date})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 lg:w-48">
                                    {user.status === 'pending' && (
                                        <>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleApprove(user.id)}
                                                fullWidth
                                            >
                                                <CheckCircle size={16} className="mr-2" />
                                                Aprobar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleReject(user.id)}
                                                fullWidth
                                            >
                                                <XCircle size={16} className="mr-2" />
                                                Rechazar
                                            </Button>
                                        </>
                                    )}

                                    {user.status === 'approved' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                fullWidth
                                            >
                                                <Eye size={16} className="mr-2" />
                                                Ver Perfil
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleSuspend(user.id)}
                                                fullWidth
                                            >
                                                <Ban size={16} className="mr-2" />
                                                Suspender
                                            </Button>
                                        </>
                                    )}

                                    {user.status === 'suspended' && (
                                        <>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleApprove(user.id)}
                                                fullWidth
                                            >
                                                <CheckCircle size={16} className="mr-2" />
                                                Reactivar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(user.id)}
                                                fullWidth
                                            >
                                                <XCircle size={16} className="mr-2" />
                                                Eliminar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <Card>
                        <div className="text-center py-12">
                            <CheckCircle size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                No hay usuarios en esta categoría
                            </h3>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Cambia el filtro para ver otros usuarios
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
