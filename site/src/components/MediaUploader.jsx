import { useState, useRef, useCallback } from 'react';

const MAX_FILE_BYTES = 1_500_000; // ~1.5MB raw
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function MediaUploader({ onUpload }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      setState('reading');
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Format non supporté (JPEG, PNG, WebP, GIF uniquement).');
        setState('error');
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError('Fichier trop volumineux (max 1.5 Mo).');
        setState('error');
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result;
        const base64 = result.split(',')[1];
        if (!base64) {
          setError('Erreur de lecture du fichier.');
          setState('error');
          return;
        }

        setState('uploading');
        try {
          const res = await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              filename: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
              content: base64,
              contentType: file.type,
            }),
          });
          const j = await res.json().catch(() => ({}));
          if (res.ok && j.url) {
            onUpload(j.url);
            setState('idle');
          } else {
            setError(j.error === 'too_large' ? 'Fichier trop volumineux.' : "Échec de l'upload.");
            setState('error');
          }
        } catch {
          setError('Connexion réseau perdue.');
          setState('error');
        }
      };
      reader.onerror = () => {
        setError('Erreur de lecture du fichier.');
        setState('error');
      };
      reader.readAsDataURL(file);
    },
    [onUpload],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile],
  );

  return (
    <div
      className={`media-uploader ${state === 'uploading' || state === 'reading' ? 'busy' : ''}`}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
      {state === 'idle' && (
        <>
          <span className="mu-icon">+</span>
          <span className="mu-label">Glissez une image ici ou cliquez pour choisir</span>
          <span className="mu-hint">JPEG, PNG, WebP, GIF — max 1.5 Mo</span>
        </>
      )}
      {state === 'reading' && <span className="mu-label">Lecture…</span>}
      {state === 'uploading' && <span className="mu-label">Upload…</span>}
      {state === 'error' && (
        <>
          <span className="mu-label mu-error">{error}</span>
          <span className="mu-hint">Cliquez pour réessayer</span>
        </>
      )}
    </div>
  );
}
