import { useState, useRef, useCallback } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import TextEditor from '../TextEditor';
import EditPopover from './EditPopover';

export default function EditableArrayItem({ path, fields, children, index, arrayItems, itemLabel = 'Élément', onOpen, onClose, isOpen, minItems = 0 }) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef(null);

  const getItem = () => {
    const val = path.split('.').reduce((acc, key) => {
      if (acc == null) return null;
      const idx = Number(key);
      return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[key];
    }, content);
    return val || {};
  };

  const item = getItem();

  const handleUpdate = useCallback((fieldPath, value) => {
    if (!updateDraft) return;
    const keys = path.split('.');
    const result = { ...content };
    let cur = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      const idx = Number(k);
      if (!Number.isNaN(idx) && Array.isArray(cur)) {
        cur[idx] = { ...cur[idx] };
        cur = cur[idx];
      } else {
        cur[k] = { ...cur[k] };
        cur = cur[k];
      }
    }
    const lastKey = keys[keys.length - 1];
    const lastIdx = Number(lastKey);
    if (!Number.isNaN(lastIdx) && Array.isArray(cur)) {
      cur[lastIdx] = { ...cur[lastIdx], [fieldPath]: value };
    } else {
      cur[lastKey] = { ...cur[lastKey], [fieldPath]: value };
    }
    updateDraft(path.split('.').slice(0, -1).join('.'), result[keys[0]][keys[1]]);
  }, [updateDraft, content, path]);

  // Actually, let's use a simpler approach: update the entire array item
  const handleFieldChange = useCallback((fieldPath, value) => {
    if (!updateDraft) return;
    const parentPath = path.split('.').slice(0, -1).join('.');
    const parentKeys = parentPath.split('.');
    const result = { ...content };
    let cur = result;
    for (let i = 0; i < parentKeys.length; i++) {
      const k = parentKeys[i];
      const idx = Number(k);
      if (!Number.isNaN(idx) && Array.isArray(cur)) {
        cur[idx] = Array.isArray(cur[idx]) ? [...cur[idx]] : { ...cur[idx] };
        cur = cur[idx];
      } else {
        cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
        cur = cur[k];
      }
    }
    const itemIndex = Number(path.split('.').pop());
    cur[itemIndex] = { ...cur[itemIndex], [fieldPath]: value };
    updateDraft(parentPath, cur);
  }, [updateDraft, content, path]);

  if (!isEditMode) {
    return children;
  }

  return (
    <div
      ref={triggerRef}
      className="editable-array-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <div
        className="editable-array-item-content"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen(index);
        }}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
      {isHovered && (
        <div className="editable-array-item-toolbar">
          <span className="editable-array-item-label">
            {itemLabel} {index + 1}
          </span>
          <div className="editable-array-actions">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); arrayItems.onMove?.(index, -1); }}
              disabled={index === 0}
              title="Monter"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); arrayItems.onMove?.(index, 1); }}
              disabled={index === arrayItems.length - 1}
              title="Descendre"
            >
              ↓
            </button>
            <button
              type="button"
              className="btn-remove-array"
              onClick={(e) => { e.stopPropagation(); arrayItems.onRemove?.(index); }}
              disabled={arrayItems.length <= minItems}
              title="Supprimer"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {isOpen && (
        <EditPopover targetRef={triggerRef} onClose={onClose}>
          <div style={{ minWidth: '320px' }}>
            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              {itemLabel} {index + 1}
            </h4>
            {fields.map((f) => (
              <TextEditor
                key={f.path}
                label={f.label}
                value={item[f.path] ?? ''}
                onChange={(v) => handleFieldChange(f.path, v)}
                multiline={f.multiline}
                rows={f.rows}
              />
            ))}
          </div>
        </EditPopover>
      )}
    </div>
  );
}
