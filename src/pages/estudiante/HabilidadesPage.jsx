import {
  Code,
  Plus,
  Search,
  Star,
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

export const HabilidadesPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [skills, setSkills] = useState([]);

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user?.id) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        // Fetch student skills
        const response = await api.get(`/skills/student/${user.id}`);
        
        if (response.data && Array.isArray(response.data)) {
          // Map proficiency level names to numeric values (1-5)
          const levelMap = {
            'principiante': 1,
            'basico': 2,
            'intermedio': 3,
            'avanzado': 4,
            'experto': 5
          };
          
          const formattedSkills = response.data.map(studentSkill => ({
            id: studentSkill.id,
            name: studentSkill.skill?.name || 'Sin nombre',
            level: levelMap[studentSkill.level?.toLowerCase()] || 3,
            category: 'Lenguaje de Programación', // Default category
            years_experience: studentSkill.years_experience || 0
          }));
          setSkills(formattedSkills);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('No se pudieron cargar las habilidades');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [user?.id]);

  const categories = [
    'Lenguaje de Programación',
    'Framework',
    'Backend',
    'Frontend',
    'Base de Datos',
    'Herramienta',
    'Soft Skill',
    'Idioma'
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && skillLevel) {
      const skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: skillLevel,
        category: 'Lenguaje de Programación' // Categoría por defecto
      };
      setSkills([...skills, skill]);
      setNewSkill('');
      setSkillLevel(3);
    }
  };

  const handleDeleteSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleUpdateLevel = (id, newLevel) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, level: newLevel } : skill
    ));
  };

  const filteredSkills = skills.filter(skill =>
    skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelStars = (level) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < level ? 'text-yellow-500 fill-current' : 'text-slate-400'}
        onClick={() => handleUpdateLevel(skill.id, i + 1)}
      />
    ));
  };

  const skillsByCategory = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mis Habilidades
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Gestiona tus habilidades técnicas y de soft skills
              </p>
            </div>
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
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Panel de Agregar Habilidad */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Agregar Habilidad
              </h3>

              <div className="space-y-4">
                <Input
                  label="Nombre de la Habilidad"
                  type="text"
                  placeholder="Ej: TypeScript, Docker..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  icon={Code}
                />

                <div className="mb-4">
                  <label className={`block mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Nivel de Competencia
                  </label>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSkillLevel(level)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={level <= skillLevel ? 'text-yellow-500 fill-current' : 'text-slate-400'}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {skillLevel === 1 && 'Principiante'}
                    {skillLevel === 2 && 'Básico'}
                    {skillLevel === 3 && 'Intermedio'}
                    {skillLevel === 4 && 'Avanzado'}
                    {skillLevel === 5 && 'Experto'}
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  fullWidth
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={18} />
                    Agregar Habilidad
                  </div>
                </Button>
              </div>
            </Card>

            {/* Estadísticas */}
            <Card className="mt-6">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Total Habilidades
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {skills.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Nivel Promedio
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Categorías
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {new Set(skills.map(s => s.category)).size}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Lista de Habilidades */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Mis Habilidades ({skills.length})
                </h3>
                <div className="relative w-64">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar habilidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                      ${isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }
                    `}
                  />
                </div>
              </div>

              {Object.keys(skillsByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No hay habilidades
                  </h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Comienza agregando tus primeras habilidades
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h4 className={`font-bold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {category} ({categorySkills.length})
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className={`
                              p-4 rounded-lg border-2 flex justify-between items-center
                              ${isDark
                                ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                              }
                            `}
                          >
                            <div>
                              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {skill.name}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {getLevelStars(skill.level)}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                                }`}
                            >
                              <X size={16} className="text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};