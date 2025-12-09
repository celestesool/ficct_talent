import api from '../../services/api';

// Mock de preguntas generadas por IA
const mockQuestions = {
    'frontend-developer': [
        {
            id: 1,
            type: 'multiple-choice',
            difficulty: 'medium',
            category: 'React',
            question: '¿Cuál es la forma correcta de actualizar el estado en React cuando depende del estado anterior?',
            options: [
                'setState(newValue)',
                'setState(prevState => prevState + 1)',
                'this.state = newValue',
                'state = newValue'
            ],
            correctAnswer: 1,
            explanation: 'Cuando el nuevo estado depende del anterior, debes usar la forma funcional de setState para evitar problemas de concurrencia.',
            points: 10
        },
        {
            id: 2,
            type: 'code',
            difficulty: 'hard',
            category: 'JavaScript',
            question: 'Completa la función para que retorne un array con los números pares duplicados:',
            code: 'function duplicateEvens(arr) {\n  // Tu código aquí\n}',
            correctAnswer: 'return arr.filter(n => n % 2 === 0).map(n => n * 2);',
            testCases: [
                { input: '[1, 2, 3, 4, 5]', output: '[4, 8]' },
                { input: '[10, 15, 20]', output: '[20, 40]' }
            ],
            explanation: 'Primero filtramos los números pares con filter(), luego los duplicamos con map().',
            points: 15
        },
        {
            id: 3,
            type: 'multiple-choice',
            difficulty: 'easy',
            category: 'HTML/CSS',
            question: '¿Qué propiedad CSS se usa para hacer que un elemento sea flexible?',
            options: [
                'display: block',
                'display: flex',
                'position: relative',
                'float: left'
            ],
            correctAnswer: 1,
            explanation: 'display: flex convierte un elemento en un contenedor flexible, permitiendo usar Flexbox.',
            points: 5
        },
        {
            id: 4,
            type: 'true-false',
            difficulty: 'easy',
            category: 'React',
            question: 'Los hooks de React solo pueden ser usados en componentes de clase.',
            correctAnswer: false,
            explanation: 'Los hooks solo pueden ser usados en componentes funcionales, no en componentes de clase.',
            points: 5
        },
        {
            id: 5,
            type: 'code',
            difficulty: 'medium',
            category: 'JavaScript',
            question: 'Escribe una función que retorne el elemento más frecuente en un array:',
            code: 'function mostFrequent(arr) {\n  // Tu código aquí\n}',
            correctAnswer: 'const freq = {}; arr.forEach(n => freq[n] = (freq[n] || 0) + 1); return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);',
            testCases: [
                { input: '[1, 2, 2, 3, 3, 3]', output: '3' },
                { input: '[5, 5, 1, 1, 5]', output: '5' }
            ],
            explanation: 'Creamos un objeto para contar frecuencias, luego encontramos la clave con mayor valor.',
            points: 15
        }
    ],
    'backend-developer': [
        {
            id: 1,
            type: 'multiple-choice',
            difficulty: 'medium',
            category: 'Node.js',
            question: '¿Cuál es la diferencia entre req.params y req.query en Express?',
            options: [
                'No hay diferencia',
                'params son parámetros de ruta, query son parámetros de URL',
                'params son POST, query son GET',
                'params son opcionales, query son obligatorios'
            ],
            correctAnswer: 1,
            explanation: 'req.params contiene parámetros de ruta (/user/:id), mientras que req.query contiene parámetros de query string (?name=value).',
            points: 10
        },
        {
            id: 2,
            type: 'code',
            difficulty: 'hard',
            category: 'SQL',
            question: 'Escribe una query SQL para obtener los 5 productos más vendidos:',
            code: '-- Tu query aquí',
            correctAnswer: 'SELECT p.name, SUM(o.quantity) as total FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.id ORDER BY total DESC LIMIT 5;',
            testCases: [
                { input: 'products: 10, orders: 50', output: 'Top 5 products' }
            ],
            explanation: 'Usamos JOIN para relacionar productos con órdenes, GROUP BY para agrupar, y ORDER BY con LIMIT para obtener el top 5.',
            points: 15
        },
        {
            id: 3,
            type: 'multiple-choice',
            difficulty: 'medium',
            category: 'API REST',
            question: '¿Qué código HTTP se debe retornar al crear un recurso exitosamente?',
            options: [
                '200 OK',
                '201 Created',
                '204 No Content',
                '202 Accepted'
            ],
            correctAnswer: 1,
            explanation: '201 Created indica que el recurso fue creado exitosamente. 200 OK es para operaciones exitosas en general.',
            points: 10
        },
        {
            id: 4,
            type: 'true-false',
            difficulty: 'easy',
            category: 'Seguridad',
            question: 'Es seguro almacenar contraseñas en texto plano en la base de datos.',
            correctAnswer: false,
            explanation: 'Las contraseñas NUNCA deben almacenarse en texto plano. Siempre deben ser hasheadas con algoritmos como bcrypt.',
            points: 5
        },
        {
            id: 5,
            type: 'code',
            difficulty: 'medium',
            category: 'Node.js',
            question: 'Implementa un middleware de autenticación básico en Express:',
            code: 'function authMiddleware(req, res, next) {\n  // Tu código aquí\n}',
            correctAnswer: 'const token = req.headers.authorization; if (!token) return res.status(401).json({ error: "No token" }); try { const decoded = jwt.verify(token, SECRET); req.user = decoded; next(); } catch(e) { res.status(401).json({ error: "Invalid token" }); }',
            testCases: [
                { input: 'Valid token', output: 'next() called' },
                { input: 'No token', output: '401 error' }
            ],
            explanation: 'Verificamos que exista el token, lo validamos con JWT, y si es válido llamamos a next().',
            points: 15
        }
    ],
    'fullstack-developer': [
        {
            id: 1,
            type: 'multiple-choice',
            difficulty: 'hard',
            category: 'Arquitectura',
            question: '¿Qué patrón de diseño es más adecuado para manejar múltiples formas de autenticación?',
            options: [
                'Singleton',
                'Strategy',
                'Observer',
                'Factory'
            ],
            correctAnswer: 1,
            explanation: 'El patrón Strategy permite definir una familia de algoritmos (estrategias de autenticación) e intercambiarlos dinámicamente.',
            points: 15
        },
        {
            id: 2,
            type: 'code',
            difficulty: 'hard',
            category: 'Full Stack',
            question: 'Implementa un hook personalizado de React para hacer fetch con loading y error:',
            code: 'function useFetch(url) {\n  // Tu código aquí\n}',
            correctAnswer: 'const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); useEffect(() => { fetch(url).then(r => r.json()).then(setData).catch(setError).finally(() => setLoading(false)); }, [url]); return { data, loading, error };',
            testCases: [
                { input: 'Valid URL', output: '{ data, loading: false, error: null }' }
            ],
            explanation: 'Usamos useState para manejar data, loading y error, y useEffect para hacer el fetch cuando cambia la URL.',
            points: 20
        },
        {
            id: 3,
            type: 'multiple-choice',
            difficulty: 'medium',
            category: 'DevOps',
            question: '¿Qué herramienta se usa comúnmente para containerizar aplicaciones?',
            options: [
                'Git',
                'Docker',
                'NPM',
                'Webpack'
            ],
            correctAnswer: 1,
            explanation: 'Docker es la herramienta estándar para crear, desplegar y ejecutar aplicaciones en contenedores.',
            points: 10
        },
        {
            id: 4,
            type: 'true-false',
            difficulty: 'medium',
            category: 'Base de Datos',
            question: 'MongoDB es una base de datos relacional.',
            correctAnswer: false,
            explanation: 'MongoDB es una base de datos NoSQL orientada a documentos, no relacional.',
            points: 5
        },
        {
            id: 5,
            type: 'code',
            difficulty: 'hard',
            category: 'Optimización',
            question: 'Optimiza esta función para evitar cálculos repetidos usando memoización:',
            code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}',
            correctAnswer: 'const memo = {}; function fibonacci(n) { if (n <= 1) return n; if (memo[n]) return memo[n]; memo[n] = fibonacci(n-1) + fibonacci(n-2); return memo[n]; }',
            testCases: [
                { input: 'fibonacci(10)', output: '55' },
                { input: 'fibonacci(20)', output: '6765' }
            ],
            explanation: 'Usamos un objeto memo para almacenar resultados ya calculados y evitar recalcularlos.',
            points: 20
        }
    ]
};

export const testService = {
    // Generar test basado en una postulación
    async generateTest(applicationId) {
        try {
            // Intentar usar backend REAL con IA
            const response = await api.post('/tests/generate', { applicationId });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error generating test with backend:', error);
            console.warn('Falling back to mock data...');

            // Fallback: Mock con delay para simular IA
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Determinar tipo de test basado en el ID (mock)
            const testTypes = ['frontend-developer', 'backend-developer', 'fullstack-developer'];
            const testType = testTypes[applicationId % 3];

            return {
                success: true,
                data: {
                    testId: `test-${Date.now()}`,
                    applicationId,
                    title: `Test de ${testType.replace('-', ' ')}`,
                    description: 'Test generado por IA basado en las habilidades requeridas para esta vacante',
                    duration: 30, // minutos
                    totalQuestions: 5,
                    totalPoints: 60,
                    questions: mockQuestions[testType],
                    generatedAt: new Date().toISOString()
                }
            };
        }
    },

    // Obtener tests disponibles para el estudiante
    async getAvailableTests(studentId) {
        try {
            // INTENTAR OBTENER DATOS REALES DEL BACKEND
            try {
                const response = await api.get(`/tests/available/${studentId}`);
                return {
                    success: true,
                    data: response.data
                };
            } catch (backendError) {
                console.warn('Backend not available, trying to get from applications:', backendError.message);

                // FALLBACK: Obtener de postulaciones reales
                try {
                    const applicationsResponse = await api.get(`/applications/student/${studentId}`);
                    const applications = applicationsResponse.data;

                    // Convertir postulaciones a tests disponibles
                    const testsFromApplications = applications
                        .filter(app => app.status === 'pending' || app.status === 'in_review')
                        .map(app => ({
                            id: app.id,
                            applicationId: app.id,
                            jobTitle: app.job?.title || 'Oferta Laboral',
                            companyName: app.job?.company?.name || 'Empresa',
                            status: 'pending',
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        }));

                    if (testsFromApplications.length > 0) {
                        return {
                            success: true,
                            data: testsFromApplications
                        };
                    }
                } catch (applicationsError) {
                    console.warn('Applications endpoint not available:', applicationsError.message);
                }
            }

            // ÚLTIMO FALLBACK: Mock data para demo
            console.warn('Using mock data for tests');
            return {
                success: true,
                data: [
                    {
                        id: 1,
                        applicationId: 1,
                        jobTitle: 'Frontend Developer',
                        companyName: 'TechCorp Bolivia',
                        status: 'pending',
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 2,
                        applicationId: 2,
                        jobTitle: 'Full Stack Developer',
                        companyName: 'Innovatech S.R.L.',
                        status: 'pending',
                        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    {
                        id: 4,
                        applicationId: 4,
                        jobTitle: 'React Developer',
                        companyName: 'Digital Solutions',
                        status: 'pending',
                        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
                    }
                ]
            };
        } catch (error) {
            console.error('Error fetching available tests:', error);
            return { success: false, error: error.message };
        }
    },

    // Enviar respuestas del test
    async submitTest(testId, answers) {
        try {
            // const response = await api.post(`/tests/${testId}/submit`, { answers });

            // Mock: Calcular score
            await new Promise(resolve => setTimeout(resolve, 1500));

            const results = answers.map((answer, index) => {
                const isCorrect = this.checkAnswer(answer);
                return {
                    questionId: answer.questionId,
                    isCorrect,
                    userAnswer: answer.answer,
                    correctAnswer: answer.correctAnswer,
                    points: isCorrect ? answer.points : 0
                };
            });

            const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
            const maxPoints = answers.reduce((sum, a) => sum + a.points, 0);
            const score = Math.round((totalPoints / maxPoints) * 100);

            return {
                success: true,
                data: {
                    testId,
                    score,
                    totalPoints,
                    maxPoints,
                    results,
                    completedAt: new Date().toISOString(),
                    feedback: this.generateFeedback(score)
                }
            };
        } catch (error) {
            console.error('Error submitting test:', error);
            return { success: false, error: error.message };
        }
    },

    // Verificar respuesta
    checkAnswer(answer) {
        if (answer.type === 'multiple-choice') {
            return answer.answer === answer.correctAnswer;
        }
        if (answer.type === 'true-false') {
            return answer.answer === answer.correctAnswer;
        }
        if (answer.type === 'code') {
            // Simulación simple de verificación de código
            return answer.answer.trim().length > 20; // Mock
        }
        return false;
    },

    // Generar feedback basado en score
    generateFeedback(score) {
        if (score >= 90) {
            return {
                level: 'excellent',
                message: 'Excelente trabajo! Demuestras un dominio sólido de los conceptos.',
                recommendations: [
                    'Estás listo para roles senior',
                    'Considera aplicar a posiciones de liderazgo técnico',
                    'Comparte tu conocimiento con la comunidad'
                ]
            };
        } else if (score >= 70) {
            return {
                level: 'good',
                message: 'Buen desempeño! Tienes una base sólida.',
                recommendations: [
                    'Refuerza los temas donde tuviste errores',
                    'Practica más ejercicios de código',
                    'Revisa la documentación oficial'
                ]
            };
        } else if (score >= 50) {
            return {
                level: 'average',
                message: 'Desempeño aceptable, pero hay áreas de mejora.',
                recommendations: [
                    'Dedica más tiempo a estudiar los fundamentos',
                    'Realiza proyectos prácticos',
                    'Toma cursos online especializados'
                ]
            };
        } else {
            return {
                level: 'needs-improvement',
                message: 'Necesitas reforzar tus conocimientos en esta área.',
                recommendations: [
                    'Comienza con tutoriales básicos',
                    'Practica diariamente con ejercicios simples',
                    'Busca mentoría o cursos estructurados',
                    'No te desanimes, sigue practicando'
                ]
            };
        }
    },

    // Obtener historial de tests
    async getTestHistory(studentId) {
        try {
            // const response = await api.get(`/tests/history/${studentId}`);

            return {
                success: true,
                data: [
                    {
                        id: 1,
                        testId: 'test-123',
                        jobTitle: 'Backend Developer',
                        companyName: 'StartupBolivia',
                        score: 85,
                        totalPoints: 51,
                        maxPoints: 60,
                        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        duration: 28
                    },
                    {
                        id: 2,
                        testId: 'test-456',
                        jobTitle: 'Frontend Developer',
                        companyName: 'WebAgency',
                        score: 72,
                        totalPoints: 43,
                        maxPoints: 60,
                        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                        duration: 30
                    }
                ]
            };
        } catch (error) {
            console.error('Error fetching test history:', error);
            return { success: false, error: error.message };
        }
    }
};
