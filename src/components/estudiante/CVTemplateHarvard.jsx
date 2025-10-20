import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export const CVTemplateHarvard = ({ cvData, isEditing, onEdit }) => {
  const formatDate = (date) => {
    if (!date) return 'Presente';
    return new Date(date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  return (
    <div id="cv-content" className="bg-white text-black p-8 shadow-lg" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      {/* HEADER */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cvData.personalInfo.first_name} {cvData.personalInfo.last_name}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Mail size={14} />
            <span>{cvData.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={14} />
            <span>{cvData.personalInfo.phone_number}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>Santa Cruz, Bolivia</span>
          </div>
        </div>
      </div>

      {/* RESUMEN PROFESIONAL */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
          Resumen Profesional
        </h2>
        {isEditing ? (
          <textarea
            value={cvData.summary}
            onChange={(e) => onEdit('summary', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            rows="4"
          />
        ) : (
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {cvData.summary}
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
              {cvData.education.degree || 'Ingeniería en Sistemas'}
            </h3>
            <span className="text-sm text-gray-600">
              {cvData.education.start_year} - {cvData.education.graduation_year || 'Presente'}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-1">
            {cvData.education.institution || 'Universidad Autónoma Gabriel René Moreno'}
          </p>
          <p className="text-sm text-gray-600">
            {cvData.education.major && `Especialidad: ${cvData.education.major}`}
          </p>
          {cvData.education.GPA && (
            <p className="text-sm text-gray-600">GPA: {cvData.education.GPA}/100</p>
          )}
        </div>
      </section>

      {/* HABILIDADES TÉCNICAS */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
          Habilidades Técnicas
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {cvData.skills.slice(0, 8).map((skill, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
              <span className="text-gray-800">
                {skill.name} - {skill.level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCIA EN PROYECTOS */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
          Proyectos Destacados
        </h2>
        {cvData.projects.map((project, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-900">{project.title}</h3>
              <span className="text-sm text-gray-600">
                {formatDate(project.start_date)} - {formatDate(project.end_date)}
              </span>
            </div>
            {isEditing ? (
              <textarea
                value={project.aiDescription || project.description}
                onChange={(e) => onEdit(`project-${idx}`, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                rows="3"
              />
            ) : (
              <p className="text-sm text-gray-700 mb-2 leading-relaxed text-justify">
                {project.aiDescription || project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIdx) => (
                <span
                  key={techIdx}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CERTIFICACIONES */}
      {cvData.certifications && cvData.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-400 mb-3 uppercase">
            Certificaciones
          </h2>
          {cvData.certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-700">{cert.issuing_organization}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(cert.issue_date)}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* FOOTER */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>CV generado a través de FICCT Talent - UAGRM</p>
      </div>
    </div>
  );
};