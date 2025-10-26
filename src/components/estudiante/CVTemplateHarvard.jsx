import { Mail, MapPin, Phone } from 'lucide-react';

export const CVTemplateHarvard = ({ cvData, isEditing, onEdit }) => {
  // Función segura para acceder a datos anidados
  const getSafe = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  const formatDate = (date) => {
    if (!date) return 'Presente';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Si cvData es undefined o null, mostrar mensaje de error
  if (!cvData) {
    return (
      <div className="bg-white text-black p-8 shadow-lg" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
        <div className="text-center text-red-500">
          <h2>Error: Datos del CV no disponibles</h2>
          <p>No se pudieron cargar los datos del estudiante</p>
        </div>
      </div>
    );
  }

  // Datos directos de la estructura real
  const student = cvData.student || {};
  const academicInfo = cvData.academic_info && cvData.academic_info.length > 0 ? cvData.academic_info[0] : {};
  const skills = cvData.skills || [];
  const projects = cvData.projects || [];
  const certifications = cvData.certifications || [];

  return (
    <div id="cv-content" className="bg-white text-black p-8 shadow-lg" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      {/* HEADER */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {student.first_name} {student.last_name}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Mail size={14} />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={14} />
            <span>{student.phone_number || 'No especificado'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>Santa Cruz, Bolivia</span>
          </div>
          {student.profile_photo_url && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={student.profile_photo_url}
                alt={`${student.first_name} ${student.last_name}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* RESUMEN PROFESIONAL */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
          Resumen Profesional
        </h2>
        {isEditing ? (
          <textarea
            value={student.bio || ''}
            onChange={(e) => onEdit('student.bio', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            rows="4"
            placeholder="Escribe tu resumen profesional..."
          />
        ) : (
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {student.bio || 'Resumen profesional no disponible.'}
          </p>
        )}
      </section>

      {/* EDUCACIÓN */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
          Educación
        </h2>
        <div className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-900">
              {academicInfo.degree || 'Carrera no especificada'}
            </h3>
            <span className="text-sm text-gray-600">
              {academicInfo.start_year} - {academicInfo.graduation_year || academicInfo.estimated_graduation_year || 'Presente'}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-1">
            {academicInfo.institution || 'Institución no especificada'}
          </p>
          {academicInfo.major && (
            <p className="text-sm text-gray-600">
              Especialidad: {academicInfo.major}
            </p>
          )}
          {academicInfo.GPA && (
            <p className="text-sm text-gray-600">GPA: {academicInfo.GPA}/5.0</p>
          )}
        </div>
      </section>

      {/* HABILIDADES TÉCNICAS */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
            Habilidades Técnicas
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, idx) => (
              <div key={skill.id || idx} className="flex items-center text-sm">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
                <span className="text-gray-800 capitalize">
                  {skill.name} - {skill.level}
                  {skill.years_experience > 0 && ` (${skill.years_experience} año${skill.years_experience > 1 ? 's' : ''})`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCIA EN PROYECTOS */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
            Proyectos Destacados
          </h2>
          {projects.map((project, idx) => (
            <div key={project.id || idx} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{project.title}</h3>
                <span className="text-sm text-gray-600">
                  {formatDate(project.start_date)} - {formatDate(project.end_date)}
                </span>
              </div>
              {isEditing ? (
                <textarea
                  value={project.description}
                  onChange={(e) => onEdit(`projects[${idx}].description`, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                  rows="3"
                  placeholder="Describe el proyecto..."
                />
              ) : (
                <p className="text-sm text-gray-700 mb-2 leading-relaxed text-justify">
                  {project.description}
                </p>
              )}
              {project.project_url && (
                <div className="mb-2">
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    🔗 Ver proyecto
                  </a>
                </div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded capitalize"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICACIONES */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
            Certificaciones
          </h2>
          {certifications.map((cert, idx) => (
            <div key={cert.id || idx} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-700">{cert.issuing_organization}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(cert.issue_date)}
                  {cert.expiration_date && ` - ${formatDate(cert.expiration_date)}`}
                </span>
              </div>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  🔗 Ver certificado
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* INFORMACIÓN ADICIONAL */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
          Información Adicional
        </h2>
        <div className="text-sm text-gray-700">
          <p><strong>Cédula de Identidad:</strong> {student.CI}</p>
          <p><strong>Número de Matrícula:</strong> {student.registration_number}</p>
          {student.birthDate && (
            <p><strong>Fecha de Nacimiento:</strong> {formatDate(student.birthDate)}</p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>CV generado a través de FICCT Talent - UAGRM</p>
        <p>Generado el: {new Date().toLocaleDateString('es-ES')}</p>
      </div>
    </div>
  );
};