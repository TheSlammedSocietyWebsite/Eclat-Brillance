'use client';

import { createContext, useContext } from 'react';

const EditModeContext = createContext(false);

export function EditModeProvider({ children, value = false }) {
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
