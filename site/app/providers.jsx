'use client';

import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '../src/hooks/useAuth.jsx';
import { ContentProvider } from '../src/hooks/useContent.jsx';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ContentProvider>
        {children}
        <Analytics />
      </ContentProvider>
    </AuthProvider>
  );
}
