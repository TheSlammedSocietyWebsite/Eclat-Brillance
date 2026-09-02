import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function EditPopover({ children, targetRef, onClose, title }) {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const updatePosition = useCallback(() => {
    if (!targetRef?.current || !popoverRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const padding = 12;

    let top = rect.bottom + padding;
    let left = rect.left;

    // Flip above if not enough space below
    if (top + popoverRect.height > window.innerHeight - padding) {
      const topAbove = rect.top - popoverRect.height - padding;
      if (topAbove >= padding) {
        top = topAbove;
      } else {
        top = Math.max(padding, window.innerHeight - popoverRect.height - padding);
      }
    }

    // Keep within horizontal window bounds
    if (left + popoverRect.width > window.innerWidth - padding) {
      left = window.innerWidth - popoverRect.width - padding;
    }
    if (left < padding) {
      left = padding;
    }

    setPosition({ top, left });
    setIsPositioned(true);
  }, [targetRef]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        targetRef?.current &&
        !targetRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, targetRef, updatePosition]);

  return createPortal(
    <div
      ref={popoverRef}
      className="edit-popover-portal edit-popover-form"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 99999,
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.06)',
        padding: '1.25rem',
        minWidth: '320px',
        maxWidth: 'min(90vw, 480px)',
        opacity: isPositioned ? 1 : 0,
        pointerEvents: isPositioned ? 'auto' : 'none',
        transition: 'opacity 0.12s ease',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#1a2b4a',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title || 'Édition'}
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            lineHeight: 1,
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
          }}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <div style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
        {children}
      </div>

      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
        }}
      >
        <button
          type="button"
          className="btn-primary btn-sm"
          onClick={onClose}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          Valider
        </button>
      </div>
    </div>,
    document.body
  );
}
