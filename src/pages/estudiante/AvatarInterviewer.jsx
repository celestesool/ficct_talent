// AvatarInterviewer.jsx
import { useRef, useState } from 'react';

const AvatarInterviewer = () => {
  const [texto, setTexto] = useState('');
  const [status, setStatus] = useState('Listo para generar...');
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // === CONFIGURA AQUÍ ===
  const D_ID_API_KEY = ''; // ← Tu key de D-ID
  const PRESENTER_ID = ''; // ← Tu avatar
  const ELEVENLABS_KEY = ''; // ← Tu key de ElevenLabs
  const VOICE_ID = ''; // ← Bella (español neutro)
  // =======================

  const generarEntrevista = async () => {
    if (!texto.trim()) {
      setStatus('Error: Escribe un texto');
      return;
    }

    setLoading(true);
    setStatus('Generando audio y video...');

    try {
      // 1. Generar AUDIO con ElevenLabs
      setStatus('Generando voz realista...');
      const audioUrl = await generarAudioElevenLabs(texto);

      // 2. Generar VIDEO SIN AUDIO con D-ID
      setStatus('Generando lip-sync...');
      const videoUrl = await generarVideoDID(texto);

      // 3. Sincronizar y reproducir
      setStatus('Sincronizando...');
      await sincronizarAudioVideo(audioUrl, videoUrl);

      setStatus('¡Entrevista lista! Habla el avatar...');
    } catch (err) {
      setStatus(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- ElevenLabs TTS ---
  const generarAudioElevenLabs = async (texto) => {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texto,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.7, similarity_boost: 0.8 }
      })
    });

    if (!res.ok) throw new Error('Error en ElevenLabs');
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  // --- D-ID Video SIN AUDIO ---
  const generarVideoDID = async (texto) => {
    const createRes = await fetch('https://api.d-id.com/clips', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(D_ID_API_KEY + ':'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: texto,
          provider: { type: 'microsoft', voice_id: 'es-ES-ElviraNeural' },
          // IMPORTANTE: SILENCIAR AUDIO
          audio: false
        },
        presenter_id: PRESENTER_ID,
        // background: { color: 'ffffff' }
      }),
    });

    const data = await createRes.json();
    if (data.error) throw new Error(data.error.message);
    const clipId = data.id;

    // Polling
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://api.d-id.com/clips/${clipId}`, {
        headers: { 'Authorization': 'Basic ' + btoa(D_ID_API_KEY + ':') }
      });
      const statusData = await statusRes.json();
      if (statusData.status === 'done') {
        return statusData.result_url;
      }
      if (statusData.status === 'error') throw new Error('D-ID falló');
    }
    throw new Error('Timeout D-ID');
  };

  // --- Sincronizar Audio + Video ---
  const sincronizarAudioVideo = async (audioUrl, videoUrl) => {
    // Cargar video
    videoRef.current.src = videoUrl;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;

    // Cargar audio
    audioRef.current.src = audioUrl;

    // Sincronizar
    await videoRef.current.play();
    audioRef.current.currentTime = videoRef.current.currentTime;
    await audioRef.current.play();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Entrevistador Virtual IA</h1>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Pega el texto de Gemini..."
        style={styles.textarea}
      />

      <button onClick={generarEntrevista} disabled={loading} style={styles.button}>
        {loading ? 'Procesando...' : 'Iniciar Entrevista'}
      </button>

      <p style={styles.status}>{status}</p>

      <div style={styles.mediaContainer}>
        <video
          ref={videoRef}
          style={styles.video}
          playsInline
        />
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    background: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: { color: '#333', marginBottom: '20px' },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  status: { margin: '10px 0', color: '#555', fontStyle: 'italic' },
  mediaContainer: { position: 'relative' },
  video: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
};

export default AvatarInterviewer;