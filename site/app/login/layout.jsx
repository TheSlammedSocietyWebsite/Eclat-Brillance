import '../../src/admin.css';
import { AuthProvider } from '../../src/hooks/useAuth.jsx';

export default function LoginLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
