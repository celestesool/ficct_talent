// src/utils/pdfExporter.js
import html2pdf from 'html2pdf.js';

/**
 * Descarga el PDF del elemento
 * @param {string} elementId - ID del contenedor (ej: 'cv-content')
 * @param {string} filename - Nombre del archivo (sin .pdf)
 */
export const exportToPDF = (elementId, filename = 'CV-UAGRM') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Elemento no encontrado:', elementId);
    return;
  }

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  html2pdf().set(options).from(element).save();
};

/**
 * Genera un Blob del PDF (para subir a Supabase)
 * @param {string} elementId - ID del contenedor
 * @returns {Promise<Blob|null>} Blob del PDF o null si falla
 */
export const generatePDFBlob = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Elemento no encontrado para generar Blob:', elementId);
    return null;
  }

  const options = {
    margin: 10,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  try {
    const pdfBlob = await html2pdf()
      .set(options)
      .from(element)
      .output('blob');

    return pdfBlob;
  } catch (error) {
    console.error('Error generando PDF Blob:', error);
    return null;
  }
};