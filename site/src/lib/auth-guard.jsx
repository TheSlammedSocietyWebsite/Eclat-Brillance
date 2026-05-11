import { useEffect, useState } from 'react';
import { me } from './api';
import NotFound from '../pages/NotFound';

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
  if (state === 'unauth') return <NotFound />;
  return <>{children}</>;
}
