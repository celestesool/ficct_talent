import { useTheme } from '../../contexts/ThemeContext';
import { CVTemplateHarvard } from './CVTemplateHarvard';

export const CVPreview = ({ data, isEditing, onEdit }) => { // ← data en lugar de cvData
  const { isDark } = useTheme();

  // Verificar que data no sea undefined
  if (!data) {
    return (
      <div className={`${isDark ? 'bg-slate-800' : 'bg-slate-100'} p-4 rounded-lg`}>
        <div className="text-center text-red-500 py-8">
          <h2>Error: No hay datos para mostrar</h2>
          <p>Los datos del CV no están disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${isDark ? 'bg-slate-800' : 'bg-slate-100'} 
      p-4 rounded-lg overflow-auto
    `}>
      <div className="flex justify-center">
        <div className="transform scale-90 origin-top">
          <CVTemplateHarvard
            cvData={data} // ← Pasar data como cvData
            isEditing={isEditing}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
};