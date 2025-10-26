import { useQuery } from '@tanstack/react-query';
import { cvService } from '../api/services/scService';

export const useCVData = (studentId, options = {}) => {
  return useQuery({
    queryKey: ['cv-data', studentId],
    queryFn: () => cvService.getCVData(studentId),
    enabled: !!studentId, // Solo se ejecuta si hay studentId
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options
  });
};

// Hook para mutaciones (guardar CV)
export const useSaveCV = () => {
  return useMutation({
    mutationFn: (cvData) => cvService.saveCV(cvData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['cv-data'] });
    }
  });
};