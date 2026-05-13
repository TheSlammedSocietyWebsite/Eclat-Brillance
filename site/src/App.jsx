import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Site from './pages/Site.jsx';
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><TrackVisit /><Site /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <Admin />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/edit"
        element={
          <AuthGuard>
            <AdminEdit />
          </AuthGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
