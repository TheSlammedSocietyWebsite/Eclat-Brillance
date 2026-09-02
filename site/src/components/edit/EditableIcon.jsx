'use client';

import { useState, useRef, useCallback } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import IconPicker from '../IconPicker.jsx';
import EditPopover from './EditPopover';
import { getDeep } from './EditableText.jsx';

export default function EditableIcon({ path, children }) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const value = getDeep(content, path);

  const handleChange = useCallback((newValue) => {
    if (updateDraft) {
      updateDraft(path, newValue);
    }
  }, [updateDraft, path]);

  if (!isEditMode) {
    return children;
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="editable-icon"
        data-path={path}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        title="Cliquez pour changer l'icône"
      >
        {children}
        <span className="editable-icon-overlay" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </span>
      </span>
      {isOpen && triggerRef.current && (
        <EditPopover targetRef={triggerRef} onClose={() => setIsOpen(false)} title="Changer l'icône">
          <div style={{ minWidth: '280px' }}>
            <IconPicker
              label="Icône"
              value={value}
              onChange={(v) => {
                handleChange(v);
                setIsOpen(false);
              }}
            />
          </div>
        </EditPopover>
      )}
    </>
  );
}
