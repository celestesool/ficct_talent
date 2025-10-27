// src/pages/ConfirmEmailPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export const ConfirmEmailPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando tu correo, por favor espera...');

  useEffect(() => {
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');

    // Supabase envía type=signup cuando se confirma un registro
    if (access_token && refresh_token && type === 'signup') {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (error) {
            setStatus('Hubo un error al confirmar tu correo. Intenta nuevamente.');
          } else {
            setStatus('Correo confirmado correctamente. Redirigiendo al inicio de sesión...');
            setTimeout(() => navigate('/login'), 2500);
          }
        });
    } else {
      setStatus('Enlace inválido o expirado.');
    }
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <p className="text-xl font-medium text-slate-700 dark:text-slate-200">{status}</p>
      </div>
    </div>
  );
};
