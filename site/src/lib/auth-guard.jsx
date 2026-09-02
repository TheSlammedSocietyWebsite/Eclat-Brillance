'use client';

import { useAuth } from '../hooks/useAuth';
import NotFound from '../views/NotFound';

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <main><p>Vérification de la session…</p></main>;
  if (!isAuthenticated) return <NotFound />;
  return <>{children}</>;
}
