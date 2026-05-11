import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotFound from '../pages/NotFound';

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      nav('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, nav]);

  if (isLoading) return <main><p>Vérification de la session…</p></main>;
  if (!isAuthenticated) return <NotFound />;
  return <>{children}</>;
}
