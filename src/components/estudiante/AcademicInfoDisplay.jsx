import { useEffect, useState } from 'react';
import { academicService } from '../../api/services/academicService';
import { Button } from '../../components/common/Button';

export const AcademicInfoDisplay = ({ studentId, isDark, onEdit }) => {
  const [academicData, setAcademicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademicInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await academicService.getAcademicInfoByStudentIdWithErrorHandling(studentId);
        if (response.success) {
          setAcademicData(response.data || []);
        } else {
          setError(response.error);
          setAcademicData([]);
        }
      } catch (err) {
        setError('Error inesperado al cargar la información académica');
        setAcademicData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicInfo();
  }, [studentId]);

  if (loading) {
    return (
      <div className={`p-4 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Cargando información académica...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-700'}`}>
        <p className="text-sm mb-2">Error al cargar la información académica</p>
        <p className="text-xs">{error}</p>
        <Button variant="primary" onClick={onEdit} className="mt-2">
          Ir a Información Académica
        </Button>
      </div>
    );
  }

  if (!academicData || academicData.length === 0) {
    return (
      <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
          No hay información académica disponible
        </p>
        <Button variant="primary" onClick={onEdit}>
          Agregar Información Académica
        </Button>
      </div>
    );
  }

  // Asumiendo que mostramos la primera entrada (puedes extender para múltiples si es necesario)
  const currentAcademic = academicData[0];

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Grado:</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.degree}</span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Carrera:</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.major}</span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Institución:</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.institution}</span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Año de inicio:</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.start_year}</span>
        </div>
        <div className="flex justify-between">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Año estimado de graduación:</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.estimated_graduation_year}</span>
        </div>
        {currentAcademic.graduation_year && (
          <div className="flex justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Año de graduación:</span>
            <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.graduation_year}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Promedio (GPA):</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentAcademic.GPA}</span>
        </div>
      </div>
      <Button variant="primary" onClick={onEdit} className="mt-4 w-full">
        Ir a Información Académica
      </Button>
    </div>
  );
};