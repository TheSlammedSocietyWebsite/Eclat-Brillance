import { useState } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';

export default function EditableArrayControls({ path, index, items, itemLabel = 'Élément', minItems = 0, maxItems, onAdd, onRemove, onMove }) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();
  const [isHovered, setIsHovered] = useState(false);

  if (!isEditMode) return null;

  const arrayItems = items || path.split('.').reduce((acc, key) => {
    if (acc == null) return [];
    const idx = Number(key);
    return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[key];
  }, content);

  const handleAdd = () => {
    if (!updateDraft && !onAdd) return;
    if (maxItems && arrayItems.length >= maxItems) return;
    if (onAdd) {
      onAdd();
    } else {
      updateDraft(path, [...arrayItems, '']);
    }
  };

  const handleRemove = () => {
    if (!updateDraft && !onRemove) return;
    if (arrayItems.length <= minItems) return;
    if (onRemove) {
      onRemove(index);
    } else {
      const next = arrayItems.filter((_, i) => i !== index);
      updateDraft(path, next);
    }
  };

  const handleMove = (direction) => {
    if (!updateDraft && !onMove) return;
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === arrayItems.length - 1) return;
    if (onMove) {
      onMove(index, direction);
    } else {
      const next = [...arrayItems];
      const tmp = next[index];
      next[index] = next[index + direction];
      next[index + direction] = tmp;
      updateDraft(path, next);
    }
  };

  // If index is undefined, render the "Add" button only
  if (index === undefined) {
    if (maxItems && arrayItems.length >= maxItems) return null;
    return (
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
    );
  }

  return (
    <span
      className="editable-array-controls"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.25rem' }}
    >
      {isHovered && (
        <>
          <button
            type="button"
            className="editable-array-btn"
            onClick={(e) => { e.stopPropagation(); handleMove(-1); }}
            disabled={index === 0}
            title="Monter"
          >
            ↑
          </button>
          <button
            type="button"
            className="editable-array-btn"
            onClick={(e) => { e.stopPropagation(); handleMove(1); }}
            disabled={index === arrayItems.length - 1}
            title="Descendre"
          >
            ↓
          </button>
          <button
            type="button"
            className="editable-array-btn btn-remove-array"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            disabled={arrayItems.length <= minItems}
            title="Supprimer"
          >
            ×
          </button>
        </>
      )}
    </span>
  );
}
