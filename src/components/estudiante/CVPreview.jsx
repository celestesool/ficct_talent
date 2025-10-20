import React from 'react';
import { CVTemplateHarvard } from './CVTemplateHarvard';
import { useTheme } from '../../contexts/ThemeContext';

export const CVPreview = ({ cvData, isEditing, onEdit }) => {
  const { isDark } = useTheme();

  return (
    <div className={`
      ${isDark ? 'bg-slate-800' : 'bg-slate-100'} 
      p-4 rounded-lg overflow-auto
    `}>
      <div className="flex justify-center">
        <div className="transform scale-90 origin-top">
          <CVTemplateHarvard 
            cvData={cvData} 
            isEditing={isEditing}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
};