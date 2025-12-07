import {
  BookOpen,
  Calendar,
  Edit3,
  Plus,
  Save,
  TrendingUp,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Navbar } from '../../components/common/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const InfoAcademicaPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [academicInfo, setAcademicInfo] = useState({
    career: '',
    faculty: '',
    university: '',
    current_semester: '',
    enrollment_year: '',
    estimated_graduation: '',
    current_gpa: '',
    total_credits: '',
    completed_credits: ''
  });

  const [courses, setCourses] = useState([]);

  // Fetch academic info from API
  useEffect(() => {
    const fetchAcademicInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user?.id) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        // Fetch academic info
        const response = await api.get(`/academic-info/student/${user.id}`);
        
        if (response.data && response.data.length > 0) {
          const info = response.data[0];
          setAcademicInfo({
            career: info.major || '',
            faculty: info.faculty || '',
            university: info.institution || '',
            current_semester: info.current_semester || '',
            enrollment_year: info.start_year?.toString() || '',
            estimated_graduation: info.estimated_graduation_year?.toString() || '',
            current_gpa: info.GPA?.toString() || '',
            total_credits: '180',
            completed_credits: '150'
          });
        }
      } catch (err) {
        console.error('Error fetching academic info:', err);
        setError('No se pudo cargar la información académica');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicInfo();
  }, [user?.id]);

  const handleChange = (field, value) => {
    setAcademicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en la BD
    console.log('Guardando información académica:', academicInfo);
    setIsEditing(false);
    alert('Información académica actualizada correctamente');
  };

  // Calcular progreso de tiempo transcurrido
  const calculateTimeProgress = () => {
    const yearsPassed = new Date().getFullYear() - parseInt(academicInfo.enrollment_year);
    const totalYears = parseInt(academicInfo.estimated_graduation) - parseInt(academicInfo.enrollment_year);
    const progress = (yearsPassed / totalYears) * 100;
    return Math.min(Math.max(progress, 0), 100); // Asegurar que esté entre 0% y 100%
  };

  // Calcular progreso de créditos
  const calculateCreditsProgress = () => {
    const progress = (parseInt(academicInfo.completed_credits) / parseInt(academicInfo.total_credits)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Asegurar que esté entre 0% y 100%
  };

  const timeProgress = calculateTimeProgress();
  const creditsProgress = calculateCreditsProgress();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Información Académica
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Gestiona tu historial y progreso académico
              </p>
            </div>
            <Button
              variant={isEditing ? 'success' : 'primary'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <div className="flex items-center gap-2">
                {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                {isEditing ? 'Guardar Cambios' : 'Editar Información'}
              </div>
            </Button>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-red-900/20 border border-red-500/50' : 'bg-red-50 border border-red-200'}`}>
            <p className="text-red-600">⚠️ {error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!loading && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Información Universitaria
              </h3>

              <div className="space-y-4">
                <Input
                  label="Carrera"
                  type="text"
                  value={academicInfo.career}
                  onChange={(e) => handleChange('career', e.target.value)}
                  disabled={!isEditing}
                  icon={BookOpen}
                />

                <Input
                  label="Facultad"
                  type="text"
                  value={academicInfo.faculty}
                  onChange={(e) => handleChange('faculty', e.target.value)}
                  disabled={!isEditing}
                />

                <Input
                  label="Universidad"
                  type="text"
                  value={academicInfo.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  disabled={!isEditing}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Semestre Actual"
                    type="text"
                    value={academicInfo.current_semester}
                    onChange={(e) => handleChange('current_semester', e.target.value)}
                    disabled={!isEditing}
                  />

                  <Input
                    label="Año de Ingreso"
                    type="number"
                    value={academicInfo.enrollment_year}
                    onChange={(e) => handleChange('enrollment_year', e.target.value)}
                    disabled={!isEditing}
                    icon={Calendar}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Graduación Estimada"
                    type="number"
                    value={academicInfo.estimated_graduation}
                    onChange={(e) => handleChange('estimated_graduation', e.target.value)}
                    disabled={!isEditing}
                    icon={Calendar}
                  />

                  <Input
                    label="Promedio General"
                    type="text"
                    value={academicInfo.current_gpa}
                    onChange={(e) => handleChange('current_gpa', e.target.value)}
                    disabled={!isEditing}
                    icon={TrendingUp}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Créditos Completados"
                    type="number"
                    value={academicInfo.completed_credits}
                    onChange={(e) => handleChange('completed_credits', e.target.value)}
                    disabled={!isEditing}
                  />

                  <Input
                    label="Total de Créditos"
                    type="number"
                    value={academicInfo.total_credits}
                    onChange={(e) => handleChange('total_credits', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <Button variant="success" onClick={handleSave} fullWidth>
                    <div className="flex items-center justify-center gap-2">
                      <Save size={18} />
                      Guardar Cambios
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} fullWidth>
                    Cancelar
                  </Button>
                </div>
              )}
            </Card>

            {/* Cursos Destacados */}
            <Card className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Cursos Destacados
                </h3>
                <Button variant="outline">
                  <div className="flex items-center gap-2">
                    <Plus size={18} />
                    Agregar Curso
                  </div>
                </Button>
              </div>

              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`
                      p-4 rounded-lg border-2 flex justify-between items-center
                      ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                      }
                    `}
                  >
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {course.name}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Semestre: {course.semester}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Calificación: {course.grade}%
                        </span>
                      </div>
                    </div>
                    <button
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                        }`}
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Progreso y Estadísticas */}
          <div className="lg:col-span-1">
            {/* Progreso de Carrera */}
            <Card>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Progreso de Carrera
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Créditos completados
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                      {creditsProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all duration-300"
                      style={{ width: `${creditsProgress}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {academicInfo.completed_credits} de {academicInfo.total_credits} créditos
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Tiempo transcurrido
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {new Date().getFullYear() - parseInt(academicInfo.enrollment_year)} años
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full bg-green-600 rounded-full transition-all duration-300"
                      style={{ width: `${timeProgress}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {academicInfo.enrollment_year} - {academicInfo.estimated_graduation}
                  </p>
                </div>
              </div>
            </Card>

            {/* Estadísticas Académicas */}
            <Card className="mt-6">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Promedio General
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {academicInfo.current_gpa}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Semestre Actual
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {academicInfo.current_semester}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Años de Estudio
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {new Date().getFullYear() - parseInt(academicInfo.enrollment_year)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Cursos Destacados
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {courses.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
