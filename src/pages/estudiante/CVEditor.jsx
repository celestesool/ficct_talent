import {
  CheckCircle,
  Download,
  Link,
  Loader,
  Mail, Sparkles, X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { CVEditorPanel } from '../../components/estudiante/cv-editor/CVEditorPanel';
import { CVPreview } from '../../components/estudiante/CVPreview';
import { improveCVWithAI } from '../../services/aiCVService';
import { cvSharingService } from '../../services/cvSharingService';
import { emailService } from '../../services/emailService';
import { useCVStore } from '../../store/cvStore';
import { exportToPDF } from '../../utils/pdfExporter';

export const CVEditor = () => {
  const studentId = localStorage.getItem('user_id');
  const {
    cvData,
    editedData,
    isLoading,
    error,
    loadCVData,
    updateCVSection,
  } = useCVStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkMessage, setLinkMessage] = useState('');
  const [isRealEmail, setIsRealEmail] = useState(false);

  useEffect(() => {
    if (studentId) loadCVData(studentId);
  }, [studentId, loadCVData]);

  const handleUpdateSection = (section, newData) => {
    updateCVSection(section, newData);
  };

  if (isLoading) return <LoadingSpinner text="Cargando datos del CV..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => loadCVData(studentId)} />;
  if (!editedData) return <ErrorMessage message="No se pudieron cargar los datos del CV" onRetry={() => loadCVData(studentId)} />;

  // IA
  const handleGenerateCV = async () => {
    setIsGenerating(true);
    try {
      const improvedCV = await improveCVWithAI(editedData);
      if (improvedCV) {
        useCVStore.getState().setEditedData(improvedCV);
        alert('¡CV mejorado con IA! Revisa los cambios.');
      }
    } catch (err) {
      alert('No se pudo mejorar el CV. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  // PDF
  const handleExportPDF = () => {
    const filename = `CV-${editedData.student?.last_name || 'Estudiante'}-${editedData.student?.first_name || ''}`;
    exportToPDF('cv-content', filename);
  };

  // GENERAR ENLACE
  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    setLinkMessage('Generando enlace...');

    try {
      const studentName = `${editedData.student?.first_name || ''} ${editedData.student?.last_name || ''}`.trim() || 'Estudiante';
      const result = await cvSharingService.generateCVLink(editedData, studentName);

      if (result.success) {
        setShareLink(result.url);
        setLinkMessage('Enlace generado y copiado al portapapeles');
        await navigator.clipboard.writeText(result.url);
      } else {
        setLinkMessage(result.message || 'Error al generar enlace');
      }
    } catch (error) {
      setLinkMessage('Error inesperado');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // GUARDAR LINK TEMPORAL
  const handleSaveTempLink = async () => {
    setIsGeneratingLink(true);
    try {
      const studentName = `${editedData.student?.first_name || ''} ${editedData.student?.last_name || ''}`.trim() || 'Estudiante';
      const result = await cvSharingService.generateCVLink(editedData, studentName);

      if (result.success) {
        const expiration = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
        localStorage.setItem('temp_cv_link', JSON.stringify({ url: result.url, expires: expiration }));
        alert('Link de CV guardado temporalmente por 24 horas');
      } else {
        alert(result.message || 'Error al generar enlace');
      }
    } catch (error) {
      alert('Error inesperado al generar el enlace');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // COPIAR ENLACE
  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      alert('Enlace copiado al portapapeles');
    }
  };

  // ENVIAR POR EMAIL
  const handleShareLinkByEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLinkMessage('Ingresa un correo válido');
      return;
    }
    if (!shareLink) {
      setLinkMessage('Primero genera un enlace');
      return;
    }

    setIsSharing(true);
    setLinkMessage('Enviando email...');

    try {
      const studentName = `${editedData.student?.first_name || ''} ${editedData.student?.last_name || ''}`.trim() || 'Estudiante';
      const result = await emailService.sendCVLink(email, studentName, shareLink);

      setLinkMessage(result.message);
      setIsRealEmail(result.isRealEmail);

      if (result.success) {
        setTimeout(() => {
          setShowLinkModal(false);
          setEmail('');
          setShareLink('');
          setLinkMessage('');
          setIsRealEmail(false);
        }, 3000);
      }
    } catch (error) {
      setLinkMessage('Error enviando email');
    } finally {
      setIsSharing(false);
    }
  };

  // MODAL DE ENLACE
  const LinkModal = () => {
    if (!showLinkModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold text-slate-900">Compartir CV</h3>
            <button
              onClick={() => {
                setShowLinkModal(false);
                setEmail('');
                setLinkMessage('');
                setShareLink('');
                setIsRealEmail(false);
              }}
              className="p-2 rounded-full hover:bg-slate-100 transition"
              disabled={isGeneratingLink || isSharing}
            >
              <X size={22} className="text-slate-600" />
            </button>
          </div>

          <div className="space-y-5">
            <p className="text-slate-600">
              Genera un enlace público para compartir tu CV por WhatsApp, LinkedIn o correo.
            </p>

            {!shareLink ? (
              <Button
                variant="primary"
                fullWidth
                onClick={handleGenerateLink}
                disabled={isGeneratingLink}
                className="text-lg py-3"
              >
                {isGeneratingLink ? 'Generando...' : 'Generar Enlace Público'}
              </Button>
            ) : (
              <>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800 mb-2">Enlace generado</p>
                  <div className="p-3 bg-white border rounded text-xs font-mono text-emerald-700 break-all">
                    {shareLink}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" fullWidth onClick={handleCopyLink}>
                    Copiar Enlace
                  </Button>
                  <Button variant="outline" fullWidth onClick={() => setShareLink('')}>
                    Nuevo Enlace
                  </Button>
                </div>

                <div className="border-t pt-5">
                  <p className="text-sm font-medium text-slate-700 mb-3">Enviar por correo</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="reclutador@empresa.com"
                      className="flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSharing}
                    />
                    <Button
                      variant="primary"
                      onClick={handleShareLinkByEmail}
                      disabled={isSharing || !email}
                      className="px-5"
                    >
                      {isSharing ? <Loader className="animate-spin" size={18} /> : <Mail size={18} />}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {linkMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${linkMessage.includes('enviado') || linkMessage.includes('copiado')
                ? 'bg-emerald-100 text-emerald-800'
                : linkMessage.includes('Error')
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
                }`}>
                {linkMessage.includes('enviado') || linkMessage.includes('copiado') ? (
                  <CheckCircle size={18} />
                ) : null}
                <span>{linkMessage}</span>
                {isRealEmail && <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">REAL</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cv-editor min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de CV</h1>
          <p className="text-gray-600 mt-2">Edita y ve los cambios en tiempo real</p>
        </div>
        <div className="flex gap-4">
          <Button variant="primary" onClick={handleGenerateCV} disabled={isGenerating}>
            {isGenerating ? (
              <><Loader className="animate-spin" size={18} /> Mejorando...</>
            ) : (
              <><Sparkles size={18} /> Mejorar con IA</>
            )}
          </Button>
          <Button variant="secondary" onClick={handleExportPDF}>
            <Download size={18} className="mr-2" /> Descargar PDF
          </Button>
          <Button variant="success" onClick={() => setShowLinkModal(true)} disabled={isGeneratingLink}>
            <Link size={18} className="mr-2" /> Compartir Enlace
          </Button>
          <Button variant="info" onClick={handleSaveTempLink} disabled={isGeneratingLink}>
            <Link size={18} className="mr-2" /> Guardar Link Temporal (24h)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Editor</h2>
          <CVEditorPanel data={editedData} onUpdateSection={handleUpdateSection} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Vista Previa</h2>
          <div id="cv-content">
            <CVPreview data={editedData} isEditing={false} />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => loadCVData(studentId)}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Restablecer Cambios
        </button>
      </div>

      <LinkModal />
    </div>
  );
};