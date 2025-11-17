import {
  Briefcase,
  Calendar,
  Camera,
  Edit3,
  Mail,
  Phone,
  Save,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../api/services/studentService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { useTheme } from '../../contexts/ThemeContext';

export const PerfilPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const studentId = "ab4ea2c5-0261-4696-9e05-6edb2459f030";

  const [profileData, setProfileData] = useState({
    id: '',
    ci: '',
    registration_number: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    profilePhotoUrl: null,
    birthDate: '',
    email: '',
    bio: '',
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await studentService.getStudentByIdWithErrorHandling(studentId);
        if (response.success) {
          const data = response.data;
          setProfileData({
            id: data.id,
            ci: data.CI,
            registration_number: data.registration_number,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            profilePhotoUrl: data.profile_photo_url,
            birthDate: new Date(data.birthDate).toISOString().split('T')[0],
            email: data.email,
            bio: data.bio,
            createdAt: new Date(data.created_at).toLocaleDateString('es-BO'),
            updatedAt: new Date(data.updated_at).toLocaleDateString('es-BO')
          });
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Error inesperado al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const updateData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      phone_number: profileData.phone_number,
      profile_photo_url: profileData.profilePhotoUrl,
      bio: profileData.bio
    };

    try {
      const response = await studentService.updateStudentProfileWithErrorHandling(profileData.id, updateData);
      if (response.success) {
        // Actualizar localmente las fechas si la respuesta incluye updated_at
        if (response.data?.updated_at) {
          setProfileData(prev => ({
            ...prev,
            updatedAt: new Date(response.data.updated_at).toLocaleDateString('es-BO')
          }));
        }
        setIsEditing(false);
        alert('Perfil actualizado correctamente');
      } else {
        setError(response.error);
        alert('Error al actualizar: ' + response.error);
      }
    } catch (err) {
      setError('Error inesperado al actualizar el perfil');
      alert('Error inesperado al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  // ⭐⭐ ACTUALIZADO: Funciones de navegación
  const handleGoToAcademicInfo = () => {
    navigate('/estudiante/academico');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Cargando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-700'}`}>
          <h2 className="text-lg font-bold mb-2">Error al cargar el perfil</h2>
          <p>{error}</p>
        </div>
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
                Mi Perfil
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Administra tu información personal y académica
              </p>
            </div>
            <Button
              variant={isEditing ? 'success' : 'primary'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
            >
              <div className="flex items-center gap-2">
                {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                {saving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Editar Perfil')}
              </div>
            </Button>
          </div>
          {error && (
            <p className={`mt-2 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Foto y datos básicos */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                {/* Foto de perfil */}
                <div className="relative inline-block mb-4">
                  {profileData.profilePhotoUrl ? (
                    <img
                      src="/images/perfil.jpg"
                      alt="Foto de perfil"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`
                      w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold
                      ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {profileData.first_name.charAt(0)}{profileData.last_name.charAt(0)}
                    </div>
                  )}
                  {isEditing && (
                    <button className={`
                      absolute bottom-0 right-0 p-2 rounded-full 
                      ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-100'}
                      border-2 ${isDark ? 'border-slate-600' : 'border-slate-300'}
                    `}>
                      <Camera size={18} className="text-blue-600" />
                    </button>
                  )}
                </div>

                <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {profileData.first_name} {profileData.last_name}
                </h2>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                  Estudiante de Ing. en Sistemas
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'} mb-4`}>
                  Registro: {profileData.registration_number}
                </p>

                {/* Bio */}
                <div className={`p-4 rounded-lg text-left ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {profileData.bio}
                  </p>
                </div>
              </div>
            </Card>

            {/* Estadísticas rápidas */}
            <Card className="mt-6">
              <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Proyectos
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Certificaciones
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    3
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Habilidades
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    12
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Formulario */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Información Personal
              </h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Cédula de Identidad"
                    type="text"
                    value={profileData.ci}
                    onChange={(e) => handleChange('ci', e.target.value)}
                    disabled={!isEditing || true} // No editable via este endpoint
                    icon={User}
                  />

                  <Input
                    label="Registro Universitario"
                    type="text"
                    value={profileData.registration_number}
                    onChange={(e) => handleChange('registration_number', e.target.value)}
                    disabled={!isEditing || true} // No editable via este endpoint
                    icon={Briefcase}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nombres"
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    disabled={!isEditing}
                    icon={User}
                  />

                  <Input
                    label="Apellidos"
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Correo Electrónico"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={!isEditing || true} // No editable via este endpoint
                    icon={Mail}
                  />

                  <Input
                    label="Teléfono"
                    type="tel"
                    value={profileData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    disabled={!isEditing}
                    icon={Phone}
                  />
                </div>

                <Input
                  label="Fecha de Nacimiento"
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  disabled={!isEditing || true} // No editable via este endpoint
                  icon={Calendar}
                />

                <div className="mb-4">
                  <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Biografía
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows="4"
                    className={`
                      w-full px-4 py-3 rounded-lg transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                      ${isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }
                      ${!isEditing && 'opacity-60 cursor-not-allowed'}
                    `}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <Button variant="success" onClick={handleSave} fullWidth disabled={saving}>
                    <div className="flex items-center justify-center gap-2">
                      <Save size={18} />
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} fullWidth disabled={saving}>
                    Cancelar
                  </Button>
                </div>
              )}
            </Card>

            {/* Información de la Cuenta */}
            <Card className="mt-6">
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Información de la Cuenta
              </h3>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>ID de Usuario:</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{profileData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Creado el:</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{profileData.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Última actualización:</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{profileData.updatedAt}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Información Académica */}
            <Card className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Información Académica
                </h3>
                <Button variant="outline" onClick={handleGoToAcademicInfo}>
                  Editar
                </Button>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                  Esta sección se gestiona en el módulo de Información Académica
                </p>
                <Button variant="primary" onClick={handleGoToAcademicInfo}>
                  Ir a Información Académica
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};