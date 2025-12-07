// Página simple para mostrar candidatos recomendados por IA (CU18)
import { Sparkles, Mail, Eye, Star, TrendingUp, AlertCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { recommendationService } from '../../services/recommendationService';

export const RecommendationsPage = () => {
    const { isDark } = useTheme();
    const { jobId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (jobId) {
            loadRecommendations();
        }
    }, [jobId]);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            const candidates = await recommendationService.getRecommendedCandidatesForJob(jobId, 10);
            
            if (Array.isArray(candidates)) {
                setCandidates(candidates);
            } else {
                setError('No se pudieron cargar las recomendaciones');
            }
        } catch (err) {
            console.error('Error loading recommendations:', err);
            setError('Error al cargar las recomendaciones');
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600 bg-green-100';
        if (percentage >= 80) return 'text-primary-600 bg-primary-100';
        return 'text-yellow-600 bg-yellow-100';
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-primary-500" size={32} />
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Candidatos Recomendados por IA
                        </h1>
                    </div>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Nuestra IA ha encontrado {candidates.length} candidatos ideales para tu vacante
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <Card>
                        <div className="text-center py-12">
                            <Loader size={64} className={`mx-auto mb-4 animate-spin ${isDark ? 'text-primary-400' : 'text-primary-500'}`} />
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Analizando candidatos...
                            </p>
                        </div>
                    </Card>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-600" size={24} />
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>Error</h3>
                                <p className={isDark ? 'text-red-300' : 'text-red-600'}>{error}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Info Card */}
                {!loading && !error && (
                    <Card className="mb-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-200 dark:border-primary-700">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="text-primary-600 mt-1" size={24} />
                            <div>
                                <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    ¿Cómo funciona?
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Analizamos habilidades para encontrar los mejores matches para tu vacante.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Lista de Candidatos Recomendados */}
                {!loading && !error && (
                    <div className="grid gap-6">
                        {candidates.map((candidate, index) => (
                            <Card key={candidate.studentId} hover className="relative overflow-hidden">
                                {/* Badge de ranking */}
                                {index === 0 && (
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                                            <Star size={16} fill="currentColor" />
                                            Top Match
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-6">
                                    {/* Foto de perfil */}
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                                            {candidate.studentName.charAt(0)}
                                        </div>
                                    </div>

                                    {/* Información del candidato */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {candidate.studentName}
                                                </h3>
                                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                    ID: {candidate.studentId}
                                                </p>
                                            </div>

                                            {/* Match percentage */}
                                            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getMatchColor(candidate.matchPercentage)}`}>
                                                {candidate.matchPercentage}% Match
                                            </div>
                                        </div>

                                        {/* Skills coincidentes */}
                                        {candidate.matchedSkills.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    ✓ Skills que tiene
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.matchedSkills.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Skills faltantes */}
                                        {candidate.missingSkills.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    ⚠ Skills por aprender
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.missingSkills.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Acciones */}
                                        <div className="flex gap-3">
                                            <Button variant="primary">
                                                <Mail size={16} className="mr-2" />
                                                Contactar
                                            </Button>
                                            <Button variant="outline">
                                                <Eye size={16} className="mr-2" />
                                                Ver Perfil Completo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && !error && candidates.length === 0 && (
                    <Card>
                        <div className="text-center py-12">
                            <Sparkles size={64} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                No hay recomendaciones disponibles
                            </h3>
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                Selecciona una vacante para ver candidatos recomendados
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
