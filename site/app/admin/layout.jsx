import '../../src/admin.css';
import AuthGuard from '../../src/lib/auth-guard.jsx';
import { AuthProvider } from '../../src/hooks/useAuth.jsx';

export const metadata = {
  title: { absolute: 'Administration — Éclat Brillance' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
