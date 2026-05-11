import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { me } from './api';

export default function AuthGuard({ children }) {
  const [state, setState] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    me()
      .then((ok) => {
        if (!cancelled) setState(ok ? 'ok' : 'unauth');
      })
      .catch(() => {
        if (!cancelled) setState('unauth');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'checking') return <main><p>Vérification de la session…</p></main>;
  if (state === 'unauth') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
