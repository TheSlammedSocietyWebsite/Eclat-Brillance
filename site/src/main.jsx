import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ContentProvider } from './hooks/useContent.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <App />
          <Analytics />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
