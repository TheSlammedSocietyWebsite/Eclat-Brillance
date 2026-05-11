import { Routes, Route } from 'react-router-dom';
import Site from './pages/Site.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';
import AuthGuard from './lib/auth-guard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
