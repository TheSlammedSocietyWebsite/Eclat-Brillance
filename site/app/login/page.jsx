import Login from '../../src/views/Login.jsx';

export const metadata = {
  title: { absolute: 'Connexion — Éclat Brillance' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginPage() {
  return <Login />;
}
