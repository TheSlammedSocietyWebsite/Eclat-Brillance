'use client';

import { createContext, useContext, useCallback } from 'react';

const DraftActionsContext = createContext(null);

export function DraftActionsProvider({ children, onChange }) {
  const updateDraft = useCallback(
    (path, value) => {
      onChange(path, value);
    },
    [onChange]
  );

  return (
    <DraftActionsContext.Provider value={updateDraft}>
      {children}
    </DraftActionsContext.Provider>
  );
}

export function useDraftActions() {
  return useContext(DraftActionsContext);
}
