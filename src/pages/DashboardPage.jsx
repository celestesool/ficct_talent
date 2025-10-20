const DashboardPage = () => {
  const { navigate, userType } = useRouter();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Dashboard - {userType === 'estudiante' ? 'Estudiante' : 'Empresa'}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/')}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <Card>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Bienvenido al Dashboard
          </h2>
          <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
            Esta sección se desarrollará en los próximos sprints
          </p>
        </Card>
      </div>
    </div>
  );
};
