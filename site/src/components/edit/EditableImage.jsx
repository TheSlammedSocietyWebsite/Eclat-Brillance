import { useState, useRef, useCallback, Children, cloneElement } from 'react';
import { useEditMode } from '../../hooks/useEditMode.jsx';
import { useDraftActions } from '../../hooks/useDraftActions.jsx';
import { useContent } from '../../hooks/useContent.jsx';
import { getDeep } from './EditableText.jsx';
import MediaUploader from '../MediaUploader';
import EditPopover from './EditPopover';

export default function EditableImage({ path, children }) {
  const isEditMode = useEditMode();
  const updateDraft = useDraftActions();
  const content = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef(null);

  const value = getDeep(content, path);

  const handleUpload = useCallback((url) => {
    if (updateDraft) {
      updateDraft(path, url);
    }
    setIsOpen(false);
  }, [updateDraft, path]);

  if (!isEditMode) {
    return children;
  }

  const child = Children.only(children);

  return (
    <>
      {cloneElement(child, {
        ref: triggerRef,
        className: [child.props.className, 'editable-image'].filter(Boolean).join(' '),
        'data-path': path,
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
          child.props.onClick?.(e);
        },
        onMouseEnter: (e) => {
          setIsHovered(true);
          child.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
          setIsHovered(false);
          child.props.onMouseLeave?.(e);
        },
        style: { ...child.props.style, cursor: 'pointer' },
        children: (
          <>
            {child.props.children}
            {isHovered && (
              <div className="editable-image-overlay">
                <span className="editable-image-label">Modifier l'image</span>
              </div>
            )}
          </>
        ),
      })}
      {isOpen && (
        <EditPopover targetRef={triggerRef} onClose={() => setIsOpen(false)}>
          <div style={{ minWidth: '320px' }}>
            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              Modifier l'image
            </h4>
            {value && (
              <img
                src={value}
                alt=""
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }}
              />
            )}
            <MediaUploader
              onUpload={handleUpload}
              previewUrl={value || undefined}
              asButton
              buttonLabel="Choisir un fichier"
            />
            {value && (
              <button
                type="button"
                className="btn-remove"
                style={{ marginTop: '0.5rem' }}
                onClick={() => {
                  if (updateDraft) updateDraft(path, '');
                  setIsOpen(false);
                }}
              >
                Supprimer l'image
              </button>
            )}
          </div>
        </EditPopover>
      )}
    </>
  );
}
