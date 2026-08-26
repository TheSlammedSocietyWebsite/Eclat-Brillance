import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Site from './pages/Site.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import AdminEdit from './pages/AdminEdit.jsx';
import NotFound from './pages/NotFound.jsx';
import AuthGuard from './lib/auth-guard.jsx';

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
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><TrackVisit /><Site /></>} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/mentions" element={<MentionsLegales />} />
      <Route path="/login" element={<NoIndex><Login /></NoIndex>} />
      <Route
        path="/admin"
        element={
          <NoIndex>
            <AuthGuard>
              <Admin />
            </AuthGuard>
          </NoIndex>
        }
      />
      <Route
        path="/admin/edit"
        element={
          <NoIndex>
            <AuthGuard>
              <AdminEdit />
            </AuthGuard>
          </NoIndex>
        }
      />
      <Route path="*" element={<NoIndex><NotFound /></NoIndex>} />
    </Routes>
  );
}
