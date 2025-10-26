import { useEffect } from 'react';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { CVEditorPanel } from '../../components/estudiante/cv-editor/CVEditorPanel';
import { CVPreview } from '../../components/estudiante/CVPreview';
import { useCVStore } from '../../store/cvStore';

export const CVEditor = ({ studentId }) => {
  const {
    cvData,
    editedData,
    isLoading,
    error,
    loadCVData,
    updateCVSection
  } = useCVStore();

  useEffect(() => {
    if (studentId) {
      loadCVData(studentId);
    }
  }, [studentId, loadCVData]);

  const handleUpdateSection = (section, newData) => {
    updateCVSection(section, newData);
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando datos del CV..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => loadCVData(studentId)}
      />
    );
  }

  if (!editedData) {
    return (
      <ErrorMessage
        message="No se pudieron cargar los datos del CV"
        onRetry={() => loadCVData(studentId)}
      />
    );
  }

  return (
    <div className="cv-editor min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editor de CV</h1>
        <p className="text-gray-600 mt-2">
          Edita tu información y ve los cambios en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de edición */}
        <div className="editor-column">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Editor</h2>
            <CVEditorPanel
              data={editedData}
              onUpdateSection={handleUpdateSection}
            />
          </div>
        </div>

        {/* Vista previa */}
        <div className="preview-column">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Vista Previa</h2>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <CVPreview
                data={editedData} // ← Esto se pasa como 'data' al CVPreview
                isEditing={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => loadCVData(studentId)}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ↺ Restablecer Cambios
        </button>
      </div>
    </div>
  );
};