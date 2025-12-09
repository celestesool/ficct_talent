// src/services/cvSharingService.js
import { supabase } from './supabaseClient';
import { generatePDFBlob } from '../utils/pdfExporter';

export const cvSharingService = {
  /**
   * Genera enlace público del CV subido a Supabase Storage
   */
  async generateCVLink(editedData, studentName) {
    try {
      // 1. Generar PDF Blob
      const pdfBlob = await generatePDFBlob('cv-content');
      if (!pdfBlob) throw new Error('No se pudo generar el PDF');

      // 2. Nombre seguro y único
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const fileName = `cv_${safeName}_${timestamp}.pdf`;

      // 3. Subir a Supabase (bucket 'cvs' público)
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true, // Sobrescribe si existe
          cacheControl: '3600',
        });

      if (uploadError) {
        if (uploadError.message.includes('duplicate')) {
          // Intenta sobrescribir explícitamente
          const { error: overwriteError } = await supabase.storage
            .from('cvs')
            .upload(fileName, pdfBlob, { upsert: true });
          if (overwriteError) throw overwriteError;
        } else {
          throw uploadError;
        }
      }

      // 4. Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) throw new Error('No se generó la URL pública');

      return {
        success: true,
        url: publicUrl,
        expires: 'Nunca (público)',
        type: 'supabase',
        message: 'CV subido a Supabase. Enlace generado.'
      };

    } catch (error) {
      console.error('Error en cvSharingService:', error);
      return {
        success: false,
        url: '',
        expires: '',
        message: `Error: ${error.message || 'Falló la subida'}`
      };
    }
  }
};