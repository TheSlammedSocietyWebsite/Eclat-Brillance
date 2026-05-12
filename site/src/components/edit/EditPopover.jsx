import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditPopover({ children, targetRef, onClose }) {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!targetRef?.current || !popoverRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const padding = 8;

    let top = rect.bottom + padding + window.scrollY;
    let left = rect.left + window.scrollX;

    // Adjust if goes off-screen
    if (left + popoverRect.width > window.innerWidth - padding) {
      left = window.innerWidth - popoverRect.width - padding;
    }
    if (left < padding) {
      left = padding;
    }
    if (top + popoverRect.height > window.innerHeight + window.scrollY - padding) {
      top = rect.top + window.scrollY - popoverRect.height - padding;
    }

    setPosition({ top, left });
  }, [targetRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 9999,
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        padding: '1rem',
        minWidth: '280px',
        maxWidth: '90vw',
      }}
    >
      {children}
    </div>,
    document.body
  );
}
