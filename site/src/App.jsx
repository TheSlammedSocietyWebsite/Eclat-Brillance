import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Site from './pages/Site.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import NotFound from './pages/NotFound.jsx';
import AuthGuard from './lib/auth-guard.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const AdminEdit = lazy(() => import('./pages/AdminEdit.jsx'));

function TrackVisit() {
  useEffect(() => {
    if (sessionStorage.getItem('tracked')) return;
    fetch('/api/track', { method: 'POST', credentials: 'include' }).catch(() => {});
    sessionStorage.setItem('tracked', '1');
  }, []);
  return null;
}

function NoIndex({ children }) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) {
      meta.setAttribute('content', 'noindex, nofollow');
    }
    return () => {
      if (meta) {
        meta.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  return children;
}

const AdminFallback = () => <div style={{ minHeight: '100vh' }} />;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><TrackVisit /><Site /></>} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/mentions" element={<MentionsLegales />} />
      <Route path="/login" element={
        <NoIndex>
          <Suspense fallback={<AdminFallback />}>
            <Login />
          </Suspense>
        </NoIndex>
      } />
      <Route
        path="/admin"
        element={
          <NoIndex>
            <Suspense fallback={<AdminFallback />}>
              <AuthGuard>
                <Admin />
              </AuthGuard>
            </Suspense>
          </NoIndex>
        }
      />
      <Route
        path="/admin/edit"
        element={
          <NoIndex>
            <Suspense fallback={<AdminFallback />}>
              <AuthGuard>
                <AdminEdit />
              </AuthGuard>
            </Suspense>
          </NoIndex>
        }
      />
      <Route path="*" element={<NoIndex><NotFound /></NoIndex>} />
    </Routes>
  );
}
