'use client';

export default function ColorEditor({ label, value, onChange }) {
  return (
    <label className="color-editor">
      <span>{label}</span>
      <div className="color-input-row">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          pattern="^#[0-9A-Fa-f]{6}$"
          maxLength={7}
          placeholder="#1a2b4a"
        />
      </div>
    </label>
  );
}
