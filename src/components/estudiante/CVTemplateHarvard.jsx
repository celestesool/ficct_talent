import { Mail, MapPin, Phone } from 'lucide-react';

export const CVTemplateHarvard = ({ cvData, isEditing, onEdit }) => {
  const formatDate = (date) => {
    if (!date) return 'Presente';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Fecha invalida';
    }
  };

  if (!cvData) {
    return (
      <div className="bg-white text-black p-8 shadow-lg" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
        <div className="text-center text-red-500">
          <h2>Error: Datos del CV no disponibles</h2>
        </div>
      </div>
    );
  }

  const student = cvData.student || {};
  const academicInfo = cvData.academic_info && cvData.academic_info.length > 0 ? cvData.academic_info[0] : {};
  const skills = cvData.skills || [];
  const projects = cvData.projects || [];
  const certifications = cvData.certifications || [];

  return (
    <div id="cv-content" className="bg-white text-black shadow-lg" style={{ maxWidth: '210mm', padding: '10mm 12mm', fontSize: '13px', lineHeight: '1.4' }}>
      {/* HEADER - Nombre centrado y en mayusculas */}
      <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
        <h1 className="text-xl font-bold text-gray-900 mb-1 tracking-widest uppercase">
          {student.first_name} {student.last_name}
        </h1>
        <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Mail size={11} />
            {student.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={11} />
            {student.phone_number || 'No especificado'}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            Santa Cruz, Bolivia
          </span>
        </div>
      </div>

      {/* RESUMEN PROFESIONAL */}
      {student.bio && (
        <section className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 mb-1 uppercase tracking-wider">
            Resumen Profesional
          </h2>
          {isEditing ? (
            <textarea
              value={student.bio || ''}
              onChange={(e) => onEdit('student.bio', e.target.value)}
              className="w-full p-1 border border-gray-300 rounded text-xs"
              rows="2"
            />
          ) : (
            <p className="text-xs text-gray-700 text-justify leading-tight">
              {student.bio}
            </p>
          )}
        </section>
      )}

      {/* EDUCACION */}
      <section className="mb-2">
        <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 mb-1 uppercase tracking-wider">
          Educacion
        </h2>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-xs text-gray-900">
              {academicInfo.degree} en {academicInfo.major}
            </p>
            <p className="text-xs text-gray-600">{academicInfo.institution}</p>
          </div>
          <span className="text-xs text-gray-500">
            {academicInfo.start_year} - {academicInfo.graduation_year || academicInfo.estimated_graduation_year || 'Presente'}
          </span>
        </div>
        {academicInfo.GPA && (
          <p className="text-xs text-gray-500">Promedio: {academicInfo.GPA}</p>
        )}
      </section>

      {/* HABILIDADES TECNICAS - En linea */}
      {skills.length > 0 && (
        <section className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 mb-1 uppercase tracking-wider">
            Habilidades Tecnicas
          </h2>
          <p className="text-xs text-gray-700">
            {skills.map((skill, idx) => (
              <span key={skill.id || idx}>
                <strong>{skill.name}</strong> ({skill.level})
                {idx < skills.length - 1 && ' • '}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* PROYECTOS */}
      {projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 mb-1 uppercase tracking-wider">
            Proyectos Destacados
          </h2>
          {projects.map((project, idx) => (
            <div key={project.id || idx} className="mb-2">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-xs text-gray-900">{project.title}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatDate(project.start_date)} - {formatDate(project.end_date)}
                </span>
              </div>
              {isEditing ? (
                <textarea
                  value={project.description}
                  onChange={(e) => onEdit(`projects[${idx}].description`, e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  rows="2"
                />
              ) : (
                <p className="text-xs text-gray-600 text-justify leading-tight">
                  {project.description}
                </p>
              )}
              {project.project_url && (
                <p className="text-xs text-gray-500 italic">{project.project_url}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Tecnologias:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICACIONES - Compacto */}
      {certifications.length > 0 && (
        <section className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 mb-1 uppercase tracking-wider">
            Certificaciones
          </h2>
          {certifications.map((cert, idx) => (
            <div key={cert.id || idx} className="flex justify-between items-start mb-1">
              <div>
                <p className="font-semibold text-xs text-gray-900">{cert.name}</p>
                <p className="text-xs text-gray-600">{cert.issuing_organization}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                {formatDate(cert.issue_date)}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* INFORMACION ADICIONAL - Compacto */}
      <section className="mb-2">
        <h2 className="text-xs font-bold text-gray-900 border-b border-gray-300 mb-1 uppercase tracking-wider">
          Informacion Adicional
        </h2>
        <p className="text-xs text-gray-600">
          <strong>CI:</strong> {student.CI} | <strong>Matricula:</strong> {student.registration_number}
          {student.birthDate && <span> | <strong>Nacimiento:</strong> {formatDate(student.birthDate)}</span>}
        </p>
      </section>

      {/* FOOTER */}
      <div className="mt-3 pt-2 border-t border-gray-200 text-center text-xs text-gray-400">
        CV generado por FICCT Talent - UAGRM | {new Date().toLocaleDateString('es-ES')}
      </div>
    </div>
  );
};