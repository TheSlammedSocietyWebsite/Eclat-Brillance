'use client';

import { useState, useRef, useCallback } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import TextEditor from '../TextEditor';
import EditPopover from './EditPopover';

export function getDeep(obj, path) {
  const value = path.split('.').reduce((acc, key) => {
    if (acc != null && typeof acc === 'object') {
      if (Array.isArray(acc)) {
        const idx = Number(key);
        return !Number.isNaN(idx) ? acc[idx] : undefined;
      }
      return key in acc ? acc[key] : undefined;
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : (value != null ? String(value) : '');
}

export function setDeep(obj, path, value) {
  const keys = path.split('.');
  const result = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = result;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    const idx = Number(k);
    if (!Number.isNaN(idx) && Array.isArray(cur)) {
      const child = cur[idx];
      const next = child && typeof child === 'object' && !Array.isArray(child)
        ? { ...child }
        : {};
      cur[idx] = next;
      cur = next;
    } else {
      const child = cur[k];
      const next = child && typeof child === 'object' && !Array.isArray(child)
        ? { ...child }
        : Array.isArray(child) ? [...child] : {};
      cur[k] = next;
      cur = next;
    }
  }
  const lastKey = keys[keys.length - 1];
  const lastIdx = Number(lastKey);
  if (!Number.isNaN(lastIdx) && Array.isArray(cur)) {
    cur[lastIdx] = value;
  } else {
    cur[lastKey] = value;
  }
  return result;
}

export default function EditableText({ path, multiline, maxLength = 50000, showCount, rows = 4, children, tag: Tag = 'span' }) {
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
      <Tag
        ref={triggerRef}
        className="editable-text"
        data-path={path}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        style={{ cursor: 'pointer' }}
        title="Cliquer pour modifier ce texte"
      >
        {children}
      </Tag>
      {isOpen && (
        <EditPopover targetRef={triggerRef} onClose={() => setIsOpen(false)} title={path}>
          <TextEditor
            label={path}
            value={value}
            onChange={handleChange}
            multiline={multiline}
            maxLength={maxLength}
            showCount={showCount}
            rows={rows}
          />
        </EditPopover>
      )}
    </>
  );
}
