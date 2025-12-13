import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cvSharingService } from '../services/cvSharingService';

export const CVViewPage = () => {
  const { storageKey } = useParams();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCV = async () => {
      if (storageKey) {
        const data = await cvSharingService.getCVFromStorage(storageKey);
        if (data) {
          setCvData(data);
        } else {
          setError('CV no encontrado o expirado');
        }
        setLoading(false);
      }
    };
    loadCV();
  }, [storageKey]);

  if (loading) return <div className="p-8 text-center">Cargando CV...</div>;
  
  if (error) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
      <p>{error}</p>
    </div>
  );

  if (!cvData) return <div className="p-8 text-center">CV no disponible</div>;

  // Mostrar el PDF en un iframe
  return (
    <div className="w-full h-screen">
      <iframe
        src={cvData.data}
        title={`CV de ${cvData.studentName}`}
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
};
