import { create } from 'zustand';
import { cvService } from '../api/services/cvService';

export const useCVStore = create((set, get) => ({
  // Estado
  cvData: null,
  isLoading: false,
  error: null,
  editedData: null,

  // Acciones
  loadCVData: async (studentId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await cvService.getCVDataWithErrorHandling(studentId);

      if (result.success) {
        set({
          cvData: result.data,
          editedData: result.data,
          isLoading: false
        });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Error inesperado', isLoading: false });
    }
  },

  updateCVSection: (path, value) => {
    const { editedData } = get();

    // Lógica simple para actualizar paths como 'student.bio'
    const paths = path.split('.');
    const newData = { ...editedData };
    let current = newData;

    for (let i = 0; i < paths.length - 1; i++) {
      current = current[paths[i]];
    }

    current[paths[paths.length - 1]] = value;

    set({ editedData: newData });
  },

  addCustomSection: (sectionData) => {
    const { editedData } = get();
    const customSections = editedData.customSections || [];

    set({
      editedData: {
        ...editedData,
        customSections: [...customSections, sectionData]
      }
    });
  },

  removeSection: (sectionIndex) => {
    const { editedData } = get();
    const newSections = editedData.customSections.filter((_, i) => i !== sectionIndex);

    set({
      editedData: {
        ...editedData,
        customSections: newSections
      }
    });
  },

  resetChanges: () => {
    const { cvData } = get();
    set({ editedData: cvData });
  },

  clearError: () => set({ error: null })
}));