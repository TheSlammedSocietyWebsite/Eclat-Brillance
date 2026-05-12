import { useState, useRef, useCallback } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import TextEditor from '../TextEditor';
import EditPopover from './EditPopover';

export default function EditableArray({ path, fields, children, itemLabel = 'Élément', maxItems, minItems = 0 }) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();
  const [activeIndex, setActiveIndex] = useState(null);

  const getItems = () => {
    const val = path.split('.').reduce((acc, key) => {
      if (acc == null) return [];
      const idx = Number(key);
      return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[key];
    }, content);
    return Array.isArray(val) ? val : [];
  };

  const items = getItems();

  const handleUpdate = useCallback((index, fieldPath, value) => {
    if (!updateDraft) return;
    const next = items.map((item, i) => {
      if (i !== index) return item;
      if (fieldPath.includes('.')) {
        const keys = fieldPath.split('.');
        const updated = { ...item };
        let cur = updated;
        for (let j = 0; j < keys.length - 1; j++) {
          cur[keys[j]] = { ...cur[keys[j]] };
          cur = cur[keys[j]];
        }
        cur[keys[keys.length - 1]] = value;
        return updated;
      }
      return { ...item, [fieldPath]: value };
    });
    updateDraft(path, next);
  }, [updateDraft, path, items]);

  const handleAdd = useCallback(() => {
    if (!updateDraft) return;
    if (maxItems && items.length >= maxItems) return;
    const newItem = fields.reduce((acc, f) => {
      acc[f.path] = f.type === 'checkbox' ? false : '';
      return acc;
    }, {});
    updateDraft(path, [...items, newItem]);
  }, [updateDraft, path, items, fields, maxItems]);

  const handleRemove = useCallback((index) => {
    if (!updateDraft) return;
    if (items.length <= minItems) return;
    const next = items.filter((_, i) => i !== index);
    updateDraft(path, next);
  }, [updateDraft, path, items, minItems]);

  const handleMove = useCallback((index, direction) => {
    if (!updateDraft) return;
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === items.length - 1) return;
    const next = [...items];
    const tmp = next[index];
    next[index] = next[index + direction];
    next[index + direction] = tmp;
    updateDraft(path, next);
  }, [updateDraft, path, items]);

  if (!isEditMode) {
    return (
      <>
        {items.map((item, index) => (
          <span key={index}>{children(item, index)}</span>
        ))}
      </>
    );
  }

  return (
    <span className="editable-array">
      {items.map((item, index) => (
        <ArrayItemWrapper
          key={index}
          index={index}
          item={item}
          fields={fields}
          items={items}
          itemLabel={itemLabel}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
          onMove={handleMove}
          isOpen={activeIndex === index}
          onOpen={() => setActiveIndex(index)}
          onClose={() => setActiveIndex(null)}
          minItems={minItems}
        >
          {children(item, index)}
        </ArrayItemWrapper>
      ))}
      {(!maxItems || items.length < maxItems) && (
        <button
          type="button"
          className="editable-array-add"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAdd();
          }}
        >
          + Ajouter {itemLabel.toLowerCase()}
        </button>
      )}
    </span>
  );
}

function ArrayItemWrapper({ index, item, fields, items, itemLabel, onUpdate, onRemove, onMove, isOpen, onOpen, onClose, minItems, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef(null);

  return (
    <span
      ref={triggerRef}
      className="editable-array-item-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <span
        className="editable-array-item-content"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {children}
      </span>
      {isHovered && (
        <span className="editable-array-item-toolbar">
          <span className="editable-array-item-label">
            {itemLabel} {index + 1}
          </span>
          <span className="editable-array-actions">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMove(index, -1); }}
              disabled={index === 0}
              title="Monter"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMove(index, 1); }}
              disabled={index === items.length - 1}
              title="Descendre"
            >
              ↓
            </button>
            <button
              type="button"
              className="btn-remove-array"
              onClick={(e) => { e.stopPropagation(); onRemove(index); }}
              disabled={items.length <= minItems}
              title="Supprimer"
            >
              ×
            </button>
          </span>
        </span>
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
                onChange={(v) => onUpdate(index, f.path, v)}
                multiline={f.multiline}
                rows={f.rows}
              />
            ))}
          </div>
        </EditPopover>
      )}
    </span>
  );
}
