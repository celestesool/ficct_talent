import {
  Calendar,
  Code,
  Edit3,
  Link as LinkIcon,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { useTheme } from '../../contexts/ThemeContext';

export const ProyectosPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'Sistema de Gestión Universitaria',
      description: 'Plataforma web para la gestión de estudiantes, cursos y calificaciones',
      start_date: '2023-03-01',
      end_date: '2023-08-15',
      project_url: 'https://github.com/usuario/proyecto1',
      technologies: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: '2',
      title: 'App de Delivery',
      description: 'Aplicación móvil para pedidos de comida con sistema de seguimiento en tiempo real',
      start_date: '2023-09-01',
      end_date: '2023-12-20',
      project_url: 'https://github.com/usuario/proyecto2',
      technologies: ['React Native', 'Firebase', 'Google Maps API']
    },
    {
      id: '3',
      title: 'Dashboard Analytics',
      description: 'Panel de control para visualización de datos y generación de reportes',
      start_date: '2024-01-10',
      end_date: null,
      project_url: 'https://github.com/usuario/proyecto3',
      technologies: ['Vue.js', 'D3.js', 'Python']
    }
  ]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    project_url: '',
    technologies: ''
  });

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setNewProject({
        ...project,
        technologies: project.technologies.join(', ')
      });
    } else {
      setEditingProject(null);
      setNewProject({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        project_url: '',
        technologies: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveProject = () => {
    const projectData = {
      ...newProject,
      technologies: newProject.technologies.split(',').map(t => t.trim()),
      id: editingProject ? editingProject.id : Date.now().toString()
    };

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? projectData : p));
    } else {
      setProjects([...projects, projectData]);
    }

    setShowModal(false);
    setNewProject({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      project_url: '',
      technologies: ''
    });
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mis Proyectos
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Muestra tu portafolio de proyectos a las empresas
              </p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Agregar Proyecto
              </div>
            </Button>
          </div>
        </div>

        {/* Grid de Proyectos */}
        {projects.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Code size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No tienes proyectos aún
              </h3>
              <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Comienza agregando tu primer proyecto para mostrar tu trabajo
              </p>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <div className="flex items-center gap-2">
                  <Plus size={18} />
                  Agregar Primer Proyecto
                </div>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} hover>
                <div className="flex justify-between items-start mb-4">
                  <div className={`
                    p-3 rounded-lg
                    ${isDark ? 'bg-blue-900/20' : 'bg-blue-100'}
                  `}>
                    <Code size={24} className="text-blue-600" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                    >
                      <Edit3 size={16} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                        }`}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {project.title}
                </h3>

                <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {new Date(project.start_date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                      {' - '}
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
                        : 'Presente'
                      }
                    </span>
                  </div>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <LinkIcon size={16} />
                      Ver proyecto
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${isDark
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                        }
                      `}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={`px-2 py-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      +{project.technologies.length - 3} más
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Agregar/Editar Proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {editingProject ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <X size={24} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Título del Proyecto"
                type="text"
                placeholder="Ej: Sistema de Gestión"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />

              <div className="mb-4">
                <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe tu proyecto, las tecnologías usadas y tu rol..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows="4"
                  required
                  className={`
                    w-full px-4 py-3 rounded-lg transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    ${isDark
                      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }
                  `}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Fecha de Inicio"
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                  required
                  icon={Calendar}
                />

                <Input
                  label="Fecha de Fin"
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                  icon={Calendar}
                />
              </div>

              <Input
                label="URL del Proyecto"
                type="url"
                placeholder="https://github.com/usuario/proyecto"
                value={newProject.project_url}
                onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
                icon={LinkIcon}
              />

              <Input
                label="Tecnologías"
                type="text"
                placeholder="React, Node.js, MongoDB (separadas por comas)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                icon={Code}
              />

              <div className="flex gap-4 mt-6">
                <Button variant="primary" onClick={handleSaveProject} fullWidth>
                  <div className="flex items-center justify-center gap-2">
                    <Save size={18} />
                    {editingProject ? 'Guardar Cambios' : 'Agregar Proyecto'}
                  </div>
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)} fullWidth>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};