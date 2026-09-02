'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import bundledContent from '../../public/content.json';

const ContentContext = createContext(bundledContent);

const THEME_VARS = {
  bg: '--c-bg',
  bgAlt: '--c-bg-alt',
  ink: '--c-ink',
  inkSoft: '--c-ink-soft',
  text: '--c-text',
  muted: '--c-muted',
  line: '--c-line',
  accent: '--c-accent',
  accentSoft: '--c-accent-soft',
  gold: '--c-gold',
};

export function applyTheme(theme, targetElement = null) {
  if (!theme) return;
  const root = targetElement || document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    const cssVar = THEME_VARS[key];
    if (cssVar && typeof value === 'string') {
      root.style.setProperty(cssVar, value);
    }
  });
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(bundledContent);

  useEffect(() => {
    applyTheme(bundledContent.theme);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content.json?t=${Date.now()}`, { credentials: 'omit' })
      .then((res) => (res.ok ? res.json() : null))
      .then((latest) => {
        if (!cancelled && latest) {
          setContent(latest);
          applyTheme(latest.theme);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function DraftContentProvider({ children, content, targetElement }) {
  useEffect(() => {
    if (targetElement) {
      applyTheme(content.theme, targetElement);
    }
  }, [content.theme, targetElement]);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
