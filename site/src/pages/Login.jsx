import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';
import '../admin.css';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(password);
    setLoading(false);
    if (res.ok) {
      nav('/admin', { replace: true });
      return;
    }
    setError(res.error === 'invalid_credentials' ? 'Mot de passe incorrect.' : 'Erreur de connexion.');
  }

  return (
    <main className="login admin-page">
      <h1>NovaCMS — Connexion</h1>
      <form onSubmit={onSubmit}>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={loading || !password}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}
