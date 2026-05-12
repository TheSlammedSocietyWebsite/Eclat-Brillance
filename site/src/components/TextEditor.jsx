export default function TextEditor({ label, value, onChange, multiline, maxLength = 50000, showCount, rows = 4 }) {
  const length = (value ?? '').length;
  return (
    <label className="text-editor">
      <span className="text-editor-label">
        {label}
        {showCount && (
          <span className="char-count">
            {length}
            {maxLength < 50000 && ` / ${maxLength}`}
          </span>
        )}
      </span>
      {multiline ? (
        <textarea
          rows={rows}
          maxLength={maxLength}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          maxLength={maxLength}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
