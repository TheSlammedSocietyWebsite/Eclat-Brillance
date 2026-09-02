'use client';

import { useEffect } from 'react';

export default function TrackVisit() {
  useEffect(() => {
    if (sessionStorage.getItem('tracked')) return;

    fetch('/api/track', { method: 'POST', credentials: 'include' }).catch(() => {});
    sessionStorage.setItem('tracked', '1');
  }, []);

  return null;
}
