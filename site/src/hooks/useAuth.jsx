import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { me, logout } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  const checkAuth = useCallback(async () => {
    const ok = await me();
    setIsAuthenticated(ok);
    return ok;
  }, []);

  const logoutAndRedirect = useCallback(async () => {
    await logout();
    setIsAuthenticated(false);
    nav('/admin/login', { replace: true });
  }, [nav]);

  useEffect(() => {
    let cancelled = false;
    checkAuth().then(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth, logoutAndRedirect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
