'use client';

import { Analytics } from '@vercel/analytics/react';
import { ContentProvider } from '../src/hooks/useContent.jsx';

export default function Providers({ children }) {
  return (
    <ContentProvider>
      {children}
      <Analytics />
    </ContentProvider>
  );
}
