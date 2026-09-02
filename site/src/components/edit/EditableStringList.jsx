import { useState, useRef, useCallback } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import { getDeep, setDeep } from './EditableText.jsx';
import TextEditor from '../TextEditor';
import EditPopover from './EditPopover';

export default function EditableStringList({ path, children, itemLabel = 'Élément', maxItems, minItems = 0 }) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();
  const [activeIndex, setActiveIndex] = useState(null);
  const triggerRefs = useRef([]);

  const items = getDeep(content, path).split('\n').filter(Boolean);
  // Actually getDeep returns a string for string paths. For arrays, we need to handle differently.
  // The path points to an array in content.json.
  
  const getItems = () => {
    const val = path.split('.').reduce((acc, key) => {
      if (acc == null) return [];
      const idx = Number(key);
      return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[key];
    }, content);
    return Array.isArray(val) ? val : [];
  };

  const arrayItems = getItems();

  const handleChange = useCallback((index, value) => {
    if (!updateDraft) return;
    const next = [...arrayItems];
    next[index] = value;
    updateDraft(path, next);
  }, [updateDraft, path, arrayItems]);

  const handleAdd = useCallback(() => {
    if (!updateDraft) return;
    if (maxItems && arrayItems.length >= maxItems) return;
    updateDraft(path, [...arrayItems, '']);
  }, [updateDraft, path, arrayItems, maxItems]);

  const handleRemove = useCallback((index) => {
    if (!updateDraft) return;
    if (arrayItems.length <= minItems) return;
    const next = arrayItems.filter((_, i) => i !== index);
    updateDraft(path, next);
  }, [updateDraft, path, arrayItems, minItems]);

  const handleMove = useCallback((index, direction) => {
    if (!updateDraft) return;
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === arrayItems.length - 1) return;
    const next = [...arrayItems];
    const tmp = next[index];
    next[index] = next[index + direction];
    next[index + direction] = tmp;
    updateDraft(path, next);
  }, [updateDraft, path, arrayItems]);

  if (!isEditMode) {
    return children;
  }

  return (
    <span className="editable-string-list">
      {arrayItems.map((item, index) => (
        <EditableStringListItem
          key={index}
          index={index}
          value={item}
          arrayItems={arrayItems}
          onChange={handleChange}
          onRemove={handleRemove}
          onMove={handleMove}
          onOpen={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          isOpen={activeIndex === index}
          itemLabel={itemLabel}
          minItems={minItems}
        />
      ))}
      {(!maxItems || arrayItems.length < maxItems) && (
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

function EditableStringListItem({ index, value, arrayItems, onChange, onRemove, onMove, onOpen, onClose, isOpen, itemLabel, minItems }) {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef(null);

  return (
    <span
      ref={triggerRef}
      className="editable-string-list-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      <span
        className="editable-string-list-value"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen(index);
        }}
        style={{ cursor: 'pointer' }}
      >
        {value}
      </span>
      {isHovered && (
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
            disabled={index === arrayItems.length - 1}
            title="Descendre"
          >
            ↓
          </button>
          <button
            type="button"
            className="btn-remove-array"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            disabled={arrayItems.length <= minItems}
            title="Supprimer"
          >
            ×
          </button>
        </span>
      )}
      {isOpen && (
        <EditPopover targetRef={triggerRef} onClose={onClose} title={`${itemLabel} ${index + 1}`}>
          <TextEditor
            label={`${itemLabel} ${index + 1}`}
            value={value}
            onChange={(v) => onChange(index, v)}
          />
        </EditPopover>
      )}
    </span>
  );
}
