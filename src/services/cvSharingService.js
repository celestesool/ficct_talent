// src/services/cvSharingService.js
import { supabase } from './supabaseClient';
import { generatePDFBlob } from '../utils/pdfExporter';
import axios from 'axios';
import { API_BASE } from '../api/api';

export const cvSharingService = {
  /**
   * Genera enlace permanente del CV guardándolo en la base de datos
   */
  async generateCVLink(editedData, studentName) {
    try {
      // 1. Generar PDF Blob
      const pdfBlob = await generatePDFBlob('cv-content');
      if (!pdfBlob) throw new Error('No se pudo generar el PDF');

      // 2. Convertir Blob a Base64
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // 3. Guardar en la base de datos
      const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const storageKey = `cv_${safeName}_${timestamp}`;
      
      // Guardar en base de datos vía API
      const studentId = localStorage.getItem('user_id');
      
    
      try {
        await axios.post(`${API_BASE}/students/${studentId}/cv`, {
          storageKey: storageKey,
          cvData: base64Data,
          studentName: studentName,
          generatedAt: new Date().toISOString()
        });
      } catch (apiError) {
        console.warn('No se pudo guardar en base de datos, usando localStorage como fallback:', apiError);
      }

      // 4. También guardar en localStorage como caché
      localStorage.setItem(storageKey, JSON.stringify({
        data: base64Data,
        studentName,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 año
      }));

      // 5. Crear URL permanente
      const cvUrl = `${window.location.origin}/cv/${storageKey}`;

      return {
        success: true,
        url: cvUrl,
        expires: 'Permanente',
        type: 'database',
        message: 'CV guardado permanentemente'
      };

    } catch (error) {
      console.error('Error en cvSharingService:', error);
      return {
        success: false,
        url: '',
        expires: '',
        message: `Error: ${error.message || 'No se pudo generar el enlace'}`
      };
    }
  },

  /**
   * Obtiene un CV guardado desde la base de datos o localStorage
   */
  async getCVFromStorage(storageKey) {
    try {
      // 1. Intentar obtener de la base de datos primero
      try {
        const response = await axios.get(`${API_BASE}/cvs/${storageKey}`);
        if (response.data) {
          return {
            data: response.data.cvData,
            studentName: response.data.studentName,
            generatedAt: response.data.generatedAt
          };
        }
      } catch (apiError) {
        console.log('No se encontró en base de datos, intentando localStorage...');
      }

      // 2. Fallback a localStorage
      const cvData = localStorage.getItem(storageKey);
      if (!cvData) return null;

      const parsed = JSON.parse(cvData);
      
      // Ya no verificamos expiración (ahora son permanentes)
      return parsed;
    } catch (error) {
      console.error('Error al recuperar CV:', error);
      return null;
    }
  },

  /**
   * Limpia CVs expirados de localStorage
   */
  cleanupExpiredCVs() {
    try {
      const now = new Date();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cv_')) {
          const cvData = localStorage.getItem(key);
          const parsed = JSON.parse(cvData);
          if (new Date() > new Date(parsed.expiresAt)) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error limpiando CVs expirados:', error);
    }
  }
};