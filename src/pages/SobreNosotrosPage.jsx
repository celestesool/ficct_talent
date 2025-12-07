import { useTheme } from "../contexts/ThemeContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { Users, ShieldCheck, Code, TrendingUp, Target, Briefcase } from "lucide-react";

export const SobreNosotrosPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"} transition-colors duration-300`}>

      {/* NAVBAR */}
      <header className="border-b" style={{
        borderColor: isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(226, 232, 240, 0.8)"
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">

            {/* Logo institucional */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
              <img
                src="/images/logo.png"
                alt="FICCT TALENT"
                className="w-16 h-auto object-contain"
              />
              <div>
                <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                  FICCT TALENT
                </h1>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Universidad Autónoma Gabriel René Moreno
                </p>
              </div>
            </div>

            {/* Navegación */}
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate("/")}
                className={`${isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"} 
                  text-sm font-medium transition-colors`}
              >
                Inicio
              </button>

              <button
                onClick={() => navigate("/sobre-nosotros")}
                className={`${isDark ? "text-white" : "text-slate-900"} text-sm font-semibold`}
              >
                Sobre Nosotros
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO CON LOGO GRANDE */}
      <section className={`py-20 bg-gradient-to-r ${isDark ? "from-primary-900 to-slate-900" : "from-primary-600 to-accent-600"}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">

          <img
            src="/images/logo.png"
            alt="Logo FICCT Talent"
            className="w-32 h-auto mx-auto mb-6 drop-shadow-xl opacity-90"
          />

          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-white"}`}>
            Sobre Nosotros
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-slate-300" : "text-gray-100"}`}>
            Plataforma oficial de vinculación laboral de la Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones.
          </p>
        </div>
      </section>

      {/* IDENTIDAD */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
            Declaración de Identidad
          </h2>
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            La Bolsa de Trabajo Digital FICCT es una iniciativa institucional respaldada por la FICCT-UAGRM. 
            Su propósito es conectar el talento tecnológico formado en nuestras aulas con oportunidades laborales 
            reales y pertinentes dentro del mercado profesional nacional.
          </p>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className={`py-20 ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">

          <Card className="p-8">
            <h3 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Misión
            </h3>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Facilitar la inserción laboral de estudiantes FICCT mediante una plataforma segura y eficiente que 
              conecta talento con empresas del sector tecnológico.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Visión
            </h3>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Consolidarnos como la plataforma líder de vinculación laboral universitaria en Bolivia, 
              reconocida por su calidad, innovación y aporte al desarrollo profesional temprano.
            </p>
          </Card>
        </div>
      </section>

      {/* POR QUÉ EXISTIMOS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? "text-white" : "text-slate-900"}`}>
            Por qué existimos
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            <Card className="p-8">
              <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Users size={20} /> Estudiantes
              </h3>
              <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Centralizamos oportunidades reales, pasantías y empleos relacionados directamente con las áreas 
                de estudio de la FICCT.
              </p>
            </Card>

            <Card className="p-8">
              <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Briefcase size={20} /> Empresas
              </h3>
              <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Ofrecemos talento joven, capacitado y verificado, reduciendo el tiempo y esfuerzo en los procesos 
                de reclutamiento.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* TECNOLOGÍA */}
      <section className={`py-20 ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-slate-900"}`}>
            Tecnología
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="p-8">
              <Code className={`${isDark ? "text-primary-400" : "text-primary-600"} mx-auto mb-4`} size={34} />
              <h4 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>React</h4>
              <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>Frontend moderno y responsivo</p>
            </Card>

            <Card className="p-8">
              <Target className={`${isDark ? "text-accent-400" : "text-accent-600"} mx-auto mb-4`} size={34} />
              <h4 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>NestJS</h4>
              <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>Backend escalable y robusto</p>
            </Card>

            <Card className="p-8">
              <TrendingUp className={`${isDark ? "text-green-400" : "text-green-600"} mx-auto mb-4`} size={34} />
              <h4 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>PostgreSQL</h4>
              <p className={`${isDark ? "text-slate-300" : "text-slate-600"}`}>Datos seguros y consistentes</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
          Regresar al inicio
        </h2>
        <Button
          variant="primary"
          className="px-6 py-3"
          onClick={() => navigate("/")}
        >
          Ir al Home
        </Button>
      </section>

    </div>
  );
};
