'use client';

import { useState, useRef, useEffect } from 'react';
import { ICON_LIBRARY, getIconByPaths } from '../lib/iconLibrary.js';

function IconPreview({ paths, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

export default function IconPicker({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedIcon = getIconByPaths(value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="icon-picker" ref={containerRef}>
      <span className="text-editor-label">{label}</span>
      <button
        type="button"
        className="icon-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIcon ? (
          <span className="icon-picker-selected">
            <IconPreview paths={selectedIcon.paths} size={20} />
            <span>{selectedIcon.name}</span>
          </span>
        ) : (
          <span className="icon-picker-placeholder">Choisir une icône…</span>
        )}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-picker-chevron ${isOpen ? 'open' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="icon-picker-dropdown">
          {ICON_LIBRARY.map((icon) => (
            <button
              key={icon.id}
              type="button"
              className={`icon-picker-option ${selectedIcon?.id === icon.id ? 'selected' : ''}`}
              onClick={() => {
                onChange(icon.paths);
                setIsOpen(false);
              }}
            >
              <span className="icon-picker-option-preview">
                <IconPreview paths={icon.paths} size={24} />
              </span>
              <span className="icon-picker-option-name">{icon.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
