import { useState, useRef } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import TextEditor from '../TextEditor';
import IconPicker from '../IconPicker.jsx';
import EditPopover from './EditPopover';

export default function EditableArrayControls({
  path,
  index,
  items,
  itemLabel = 'Élément',
  minItems = 0,
  maxItems,
  onAdd,
  onRemove,
  onMove,
  fields,
}) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();

  const [isAdding, setIsAdding] = useState(false);
  const addButtonRef = useRef(null);
  const [newItemValues, setNewItemValues] = useState({});

  if (!isEditMode) return null;

  const arrayItems =
    items ||
    path.split('.').reduce((acc, key) => {
      if (acc == null) return [];
      const idx = Number(key);
      return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[key];
    }, content);

  const handleAddClick = () => {
    if (fields) {
      const initial = {};
      fields.forEach((f) => {
        initial[f.path] = f.type === 'checkbox' ? false : '';
      });
      setNewItemValues(initial);
    } else {
      setNewItemValues({ __value: '' });
    }
    setIsAdding(true);
  };

  const handleConfirmAdd = () => {
    if (!updateDraft && !onAdd) return;
    if (maxItems && arrayItems.length >= maxItems) return;

    if (fields) {
      const newItem = { ...newItemValues };
      if (onAdd) {
        onAdd(newItem);
      } else {
        updateDraft(path, [...arrayItems, newItem]);
      }
    } else {
      const value = newItemValues.__value || '';
      if (onAdd) {
        onAdd(value);
      } else {
        updateDraft(path, [...arrayItems, value]);
      }
    }
    setIsAdding(false);
    setNewItemValues({});
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewItemValues({});
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

  // Add button (no index) — opens popup
  if (index === undefined) {
    if (maxItems && arrayItems.length >= maxItems) return null;
    return (
      <>
        <button
          type="button"
          ref={addButtonRef}
          className="editable-array-add"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddClick();
          }}
        >
          + Ajouter {itemLabel.toLowerCase()}
        </button>
        {isAdding && addButtonRef.current && (
          <EditPopover targetRef={addButtonRef} onClose={handleCancelAdd}>
            <div className="edit-popover-form" style={{ minWidth: '280px' }}>
              <h4
                style={{
                  margin: '0 0 0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1a2b4a',
                }}
              >
                Ajouter {itemLabel.toLowerCase()}
              </h4>
              {fields ? (
                fields.map((f) => {
                  if (f.type === 'checkbox') {
                    return (
                      <label
                        key={f.path}
                        className="checkbox-editor"
                        style={{
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                          color: '#2c2c2c',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!newItemValues[f.path]}
                          onChange={(e) =>
                            setNewItemValues((v) => ({
                              ...v,
                              [f.path]: e.target.checked,
                            }))
                          }
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#1a2b4a',
                            cursor: 'pointer',
                          }}
                        />
                        <span>{f.label}</span>
                      </label>
                    );
                  }
                  if (f.type === 'icon') {
                    return (
                      <IconPicker
                        key={f.path}
                        label={f.label}
                        value={newItemValues[f.path] ?? ''}
                        onChange={(v) =>
                          setNewItemValues((val) => ({ ...val, [f.path]: v }))
                        }
                      />
                    );
                  }
                  return (
                    <TextEditor
                      key={f.path}
                      label={f.label}
                      value={newItemValues[f.path] ?? ''}
                      onChange={(v) =>
                        setNewItemValues((val) => ({ ...val, [f.path]: v }))
                      }
                      multiline={f.multiline}
                      rows={f.rows}
                    />
                  );
                })
              ) : (
                <TextEditor
                  label={`Nouveau ${itemLabel.toLowerCase()}`}
                  value={newItemValues.__value ?? ''}
                  onChange={(v) =>
                    setNewItemValues((val) => ({ ...val, __value: v }))
                  }
                />
              )}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmAdd();
                  }}
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelAdd();
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </EditPopover>
        )}
      </>
    );
  }

  // Existing item controls (always visible)
  return (
    <span
      className="editable-array-controls"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginTop: '0.5rem',
      }}
    >
      <button
        type="button"
        className="editable-array-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleMove(-1);
        }}
        disabled={index === 0}
        title="Monter"
      >
        ↑
      </button>
      <button
        type="button"
        className="editable-array-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleMove(1);
        }}
        disabled={index === arrayItems.length - 1}
        title="Descendre"
      >
        ↓
      </button>
      <button
        type="button"
        className="editable-array-btn btn-remove-array"
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        disabled={arrayItems.length <= minItems}
        title="Supprimer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </span>
  );
}
