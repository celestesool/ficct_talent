// src/pages/empresa/CandidatosPage.jsx
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Code,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  X
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { Navbar } from "../../components/common/Navbar";
import { useTheme } from "../../contexts/ThemeContext";
import { apiService } from "../../services/api";

export const CandidatosPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");

  const [filterPosition, setFilterPosition] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewModal, setInterviewModal] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");

  // ===============================================
  // LOAD REAL CANDIDATES FROM BACKEND
  // ===============================================
  const loadCandidates = async () => {
    try {
      const companyId = localStorage.getItem("user_id");
      if (!companyId) return;

      const res = await apiService.get(`/applications/company/${companyId}`);
      const data = Array.isArray(res.data) ? res.data : [];

      const mapped = data.map((c) => ({
        id: c.application_id,
        studentId: c.student.id,
        name: c.student.first_name + " " + c.student.last_name,
        email: c.student.email,
        phone: c.student.phone_number,
        birthDate: c.student.birthDate,
        appliedFor: c.job_title,
        appliedDate: new Date(c.applied_at).toLocaleDateString(),
        gpa: c.academicInfo?.[0]?.GPA ?? 0,
        institution: c.academicInfo?.[0]?.institution ?? "No especificado",
        certifications: c.certifications.length,
        projects: c.projects.length,
        skills: c.skills.map((s) => s.skill.name),
        match: c.match,
        status: c.status,
        location: "Santa Cruz",
        raw: c,
      }));

      setCandidates(mapped);
    } catch (err) {
      console.error("Error loading candidates:", err);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // ===============================================
  // FILTERING
  // ===============================================
  const filtered = candidates.filter((c) => {
    const q = search.toLowerCase();

    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.appliedFor.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));

    const matchPosition =
      filterPosition === "all" || c.appliedFor.includes(filterPosition);

    const matchLocation =
      filterLocation === "all" || c.location.includes(filterLocation);

    return matchSearch && matchPosition && matchLocation;
  });

  // ===============================================
  // COLOR UTILITIES
  // ===============================================
  const matchColor = (m) => {
    if (m >= 85) return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    if (m >= 70) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
    return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
  };

  const statusColor = (s) => {
    switch (s) {
      case "aplicado":
        return "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300";
      case "revisado":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // ===============================================
  // CONTACTAR (GMAIL)
  // ===============================================
  const contact = (c) => {
    window.location.href = `mailto:${c.email}?subject=Contacto%20de%20empresa&body=Hola%20${c.name}`;
  };

  // ===============================================
  // PROGRAMAR ENTREVISTA (modal)
  // ===============================================
  const openInterviewModal = (candidate) => {
    setInterviewModal(candidate);
  };

  const sendInterview = async () => {
    try {
      await apiService.patch(
        `/applications/${interviewModal.id}/status`,
        { status: "interview" }
      );

      alert("Entrevista programada correctamente.");
      setInterviewModal(null);
      setInterviewDate("");
      loadCandidates();
    } catch (err) {
      console.error(err);
      alert("Error al programar entrevista.");
    }
  };

  // ===============================================
  // RETURN UI
  // ===============================================
  return (
    <div className={isDark ? "bg-slate-900 min-h-screen" : "bg-gray-50 min-h-screen"}>

      {/* HEADER */}
      <div className="container mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate("/empresa/dashboard")}>
            <ArrowLeft size={18} />
          </Button>

          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary-500 to-accent-3000"></div>

          <div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Candidatos
            </h1>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Encuentra y evalúa talento para tus vacantes
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar candidato / skill / puesto"
                className="w-full pl-10 px-4 py-3 border rounded-xl"
              />
            </div>

            {/* Position */}
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              <option value="all">Puestos</option>
              <option value="Front">Frontend</option>
              <option value="Back">Backend</option>
              <option value="Data">Data Science</option>
            </select>

            {/* Location – always Santa Cruz */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              <option value="all">Ubicación</option>
              <option value="Santa Cruz">Santa Cruz</option>
            </select>

          </div>
        </Card>

        {/* NO RESULTS */}
        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <User size={48} className="mx-auto mb-4 text-slate-400" />
            <p>No se encontraron candidatos.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filtered.map((c) => (
              <Card
                key={c.id}
                className="p-6 hover:shadow-lg transition"
              >

                {/* Bubbles */}
                <div className="flex justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(c.status)}`}>
                    {c.status}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${matchColor(c.match)}`}>
                    {c.match}% Match
                  </span>
                </div>

                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold
                    ${isDark ? "bg-accent-600 text-white" : "bg-accent-300 text-accent-700"}
                  `}>
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {c.name}
                    </h2>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {c.appliedFor}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {c.skills.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      className={`
                        px-3 py-1 text-xs rounded-lg
                        ${isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"}
                      `}
                    >
                      {s}
                    </span>
                  ))}
                  {c.skills.length > 4 && (
                    <span className="text-xs text-slate-500">
                      +{c.skills.length - 4} más
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Code size={14} className="text-slate-500" />
                    {c.projects} proyectos
                  </div>

                  <div className="flex items-center gap-1">
                    <Briefcase size={14} className="text-slate-500" />
                    {c.certifications} certs.
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button fullWidth variant="primary" onClick={() => setSelectedCandidate(c)}>
                    <Eye size={16} /> Ver Perfil
                  </Button>

                  <Button variant="outline" onClick={() => contact(c)}>
                    <Mail size={16} />
                  </Button>
                </div>

              </Card>
            ))}

          </div>
        )}

      </div>

      {/* ================================
           MODAL PERFIL COMPLETO
      ================================= */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-4">

                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                  ${isDark ? "bg-accent-600 text-white" : "bg-accent-300 text-accent-700"}
                `}>
                  {selectedCandidate.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {selectedCandidate.name}
                  </h2>

                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    {selectedCandidate.appliedFor}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${matchColor(selectedCandidate.match)}`}>
                      {selectedCandidate.match}% Match
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(selectedCandidate.status)}`}>
                      {selectedCandidate.status}
                    </span>
                  </div>
                </div>

              </div>

              <button onClick={() => setSelectedCandidate(null)} className="p-2">
                <X size={24} className={isDark ? "text-slate-400" : "text-slate-600"} />
              </button>
            </div>

            {/* Info */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Contact */}
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Información de Contacto
                </h3>

                <div className="space-y-3">

                  <div className="flex gap-3">
                    <Mail size={18} className="text-slate-500" />
                    {selectedCandidate.email}
                  </div>

                  <div className="flex gap-3">
                    <Phone size={18} className="text-slate-500" />
                    {selectedCandidate.phone}
                  </div>

                  <div className="flex gap-3">
                    <MapPin size={18} className="text-slate-500" />
                    Santa Cruz
                  </div>

                  <div className="flex gap-3">
                    <Calendar size={18} className="text-slate-500" />
                    Aplicó el: {selectedCandidate.appliedDate}
                  </div>

                </div>
              </Card>

              {/* Academic */}
              <Card className="p-6">
                <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Información Académica
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">GPA:</span>
                    <span>{selectedCandidate.gpa}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Institución:</span>
                    <span>{selectedCandidate.institution}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Proyectos:</span>
                    <span>{selectedCandidate.projects}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Certificaciones:</span>
                    <span>{selectedCandidate.certifications}</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* Skills */}
            <Card className="mt-6 p-6">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Habilidades Técnicas
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedCandidate.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium
                      ${isDark ? "bg-accent-700/20 text-accent-400" : "bg-accent-300 text-accent-700"}
                    `}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 mt-6">

              <Button
                variant="primary"
                fullWidth
                onClick={() => contact(selectedCandidate)}
              >
                <Mail size={16} /> Contactar
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => openInterviewModal(selectedCandidate)}
              >
                <Briefcase size={16} /> Programar Entrevista
              </Button>

              <Button
                variant="outline"
                disabled
                fullWidth
              >
                <Download size={16} /> CV (Próximamente)
              </Button>

            </div>

          </Card>
        </div>
      )}

      {/* ================================
           MODAL ENTREVISTA
      ================================= */}
      {interviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Programar Entrevista
            </h2>

            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4"
            />

            <div className="flex gap-2">
              <Button fullWidth variant="primary" onClick={sendInterview}>
                Confirmar
              </Button>

              <Button
                fullWidth
                variant="outline"
                onClick={() => setInterviewModal(null)}
              >
                Cancelar
              </Button>
            </div>

          </Card>
        </div>
      )}

    </div>
  );
};
