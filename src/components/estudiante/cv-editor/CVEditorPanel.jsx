import { SectionEditor } from './SectionEditor';

export const CVEditorPanel = ({ data, onUpdateSection }) => {
  // Función para manejar cambios en secciones específicas
  const handleStudentBioChange = (content) => {
    onUpdateSection('student', {
      ...data.student,
      bio: content
    });
  };

  const handleProjectChange = (projectIndex, field, value) => {
    const updatedProjects = [...(data.projects || [])];
    if (!updatedProjects[projectIndex]) return;

    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      [field]: value
    };

    onUpdateSection('projects', updatedProjects);
  };

  const handleSkillChange = (skillIndex, field, value) => {
    const updatedSkills = [...(data.skills || [])];
    if (!updatedSkills[skillIndex]) return;

    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      [field]: value
    };

    onUpdateSection('skills', updatedSkills);
  };

  // Helper functions actualizadas
  const generateProjectsContent = (projects) => {
    if (!projects?.length) return 'Describe tus proyectos aquí...';

    return projects.map(project =>
      `<div class="project-item">
        <h3>${project.title || 'Proyecto sin título'}</h3>
        <p><strong>Fecha:</strong> ${project.start_date ? new Date(project.start_date).getFullYear() : 'No especificada'}</p>
        <p>${project.description || 'Descripción no disponible'}</p>
        ${project.technologies?.length ? `<p><strong>Tecnologías:</strong> ${project.technologies.join(', ')}</p>` : ''}
      </div>`
    ).join('<br/>');
  };

  const generateSkillsContent = (skills) => {
    if (!skills?.length) return 'Describe tus habilidades aquí...';

    // Agrupar por categoría si existe, sino usar "General"
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category || 'Habilidades Técnicas';
      if (!acc[category]) acc[category] = [];
      acc[category].push(`${skill.name} - ${skill.level}${skill.years_experience ? ` (${skill.years_experience} año${skill.years_experience > 1 ? 's' : ''})` : ''}`);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, skillList]) =>
      `<div class="skill-category">
        <h3>${category}</h3>
        <ul>
          ${skillList.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      </div>`
    ).join('<br/>');
  };

  return (
    <div className="editor-panel-content bg-white p-6 rounded-lg shadow-md">
      {/* Información Personal */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold mb-3">Información Personal</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={data.student?.first_name || ''}
              onChange={(e) => onUpdateSection('student', {
                ...data.student,
                first_name: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              value={data.student?.last_name || ''}
              onChange={(e) => onUpdateSection('student', {
                ...data.student,
                last_name: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={data.student?.email || ''}
              onChange={(e) => onUpdateSection('student', {
                ...data.student,
                email: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              value={data.student?.phone_number || ''}
              onChange={(e) => onUpdateSection('student', {
                ...data.student,
                phone_number: e.target.value
              })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Resumen profesional */}
      <SectionEditor
        title="Resumen Profesional"
        content={data.student?.bio || ''}
        onUpdate={handleStudentBioChange}
      />

      {/* Educación */}
      {data.academic_info?.length > 0 && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-bold mb-3">Información Académica</h2>
          {data.academic_info.map((academic, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <input
                    type="text"
                    value={academic.degree || ''}
                    onChange={(e) => {
                      const updatedAcademic = [...data.academic_info];
                      updatedAcademic[index] = { ...academic, degree: e.target.value };
                      onUpdateSection('academic_info', updatedAcademic);
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institución
                  </label>
                  <input
                    type="text"
                    value={academic.institution || ''}
                    onChange={(e) => {
                      const updatedAcademic = [...data.academic_info];
                      updatedAcademic[index] = { ...academic, institution: e.target.value };
                      onUpdateSection('academic_info', updatedAcademic);
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proyectos - Editor individual por proyecto */}
      {data.projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Proyectos</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Proyecto
                </label>
                <input
                  type="text"
                  value={project.title || ''}
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                />
                <SectionEditor
                  title={`Descripción del Proyecto - ${project.title || 'Proyecto ' + (index + 1)}`}
                  content={project.description || ''}
                  onUpdate={(content) => handleProjectChange(index, 'description', content)}
                  height={200}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Habilidades - Vista de edición mejorada */}
      {data.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Habilidades Técnicas</h2>
          <div className="grid grid-cols-1 gap-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded">
                <div className="flex-1">
                  <input
                    type="text"
                    value={skill.name || ''}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="Nombre de la habilidad"
                  />
                </div>
                <select
                  value={skill.level || 'beginner'}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  className="p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                  <option value="expert">Experto</option>
                </select>
                <input
                  type="number"
                  value={skill.years_experience || 0}
                  onChange={(e) => handleSkillChange(index, 'years_experience', parseInt(e.target.value) || 0)}
                  className="w-20 p-2 border border-gray-300 rounded text-sm"
                  placeholder="Años"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección personalizable 
      <button
        className="add-section-btn w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
        onClick={() => onUpdateSection('customSections', [
          ...(data.customSections || []),
          { title: 'Nueva Sección', content: '' }
        ])}
      >
        + Agregar nueva sección personalizada
      </button>*/}
    </div>
  );
};