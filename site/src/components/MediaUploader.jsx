import { useState, useRef, useCallback } from 'react';

const MAX_FILE_BYTES = 1_500_000; // ~1.5MB raw
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function MediaUploader({ onUpload, previewUrl, asButton = false, buttonLabel = 'Choisir un fichier' }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      setState('reading');
      setError(null);
      setFilePreview(null);

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
        setFilePreview(result);
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
            setFilePreview(null);
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

  if (asButton) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onInputChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className={`media-uploader-btn ${state === 'uploading' || state === 'reading' ? 'busy' : ''}`}
          onClick={() => inputRef.current?.click()}
          disabled={state === 'uploading' || state === 'reading'}
        >
          {state === 'uploading' || state === 'reading' ? 'Upload…' : buttonLabel}
        </button>
        {filePreview && (
          <img src={filePreview} alt="" className="mu-file-preview" />
        )}
        {state === 'error' && <span className="mu-error">{error}</span>}
      </>
    );
  }

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
        previewUrl ? (
          <div className="mu-preview">
            <img src={previewUrl} alt="" />
            <div className="mu-preview-overlay">
              <span className="mu-label">Cliquez ou glissez une image pour remplacer</span>
              <span className="mu-hint">JPEG, PNG, WebP, GIF — max 1.5 Mo</span>
            </div>
          </div>
        ) : (
          <>
            <span className="mu-icon">+</span>
            <span className="mu-label">Glissez une image ici ou cliquez pour choisir</span>
            <span className="mu-hint">JPEG, PNG, WebP, GIF — max 1.5 Mo</span>
          </>
        )
      )}
      {(state === 'reading' || state === 'uploading') && filePreview && (
        <div className="mu-preview">
          <img src={filePreview} alt="" />
          <span className="mu-label">{state === 'reading' ? 'Lecture…' : 'Upload…'}</span>
        </div>
      )}
      {(state === 'reading' || state === 'uploading') && !filePreview && (
        <span className="mu-label">{state === 'reading' ? 'Lecture…' : 'Upload…'}</span>
      )}
      {state === 'error' && (
        <>
          <span className="mu-label mu-error">{error}</span>
          <span className="mu-hint">Cliquez pour réessayer</span>
        </>
      )}
    </div>
  );
}
