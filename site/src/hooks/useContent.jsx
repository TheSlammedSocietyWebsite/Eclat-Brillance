import { createContext, useContext, useEffect, useState } from 'react';
import bundledContent from '../../public/content.json';

const ContentContext = createContext(bundledContent);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(bundledContent);

  useEffect(() => {
    let cancelled = false;
    fetch(`/content.json?t=${Date.now()}`, { credentials: 'omit' })
      .then((res) => (res.ok ? res.json() : null))
      .then((latest) => {
        if (!cancelled && latest) setContent(latest);
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

export function useContent() {
  return useContext(ContentContext);
}
