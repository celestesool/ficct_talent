
import html2pdf from 'html2pdf.js';

export const exportToPDF = (elementId, filename = 'CV-UAGRM') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('Elemento no encontrado');
    return;
  }

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  html2pdf().set(options).from(element).save();
};

// Función alternativa para generar blob (útil para preview)
export const generatePDFBlob = async (elementId) => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('Elemento no encontrado');
    return null;
  }

  const options = {
    margin: 10,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    const pdf = await html2pdf().set(options).from(element).output('blob');
    return pdf;
  } catch (error) {
    console.error('Error generando PDF:', error);
    return null;
  }
};