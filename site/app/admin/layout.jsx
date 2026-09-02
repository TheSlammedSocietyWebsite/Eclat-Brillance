import AuthGuard from '../../src/lib/auth-guard.jsx';

export const metadata = {
  title: { absolute: 'Administration — Éclat Brillance' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
