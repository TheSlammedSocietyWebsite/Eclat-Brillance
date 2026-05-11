export default function TextEditor({ label, value, onChange, multiline, maxLength = 50000 }) {
  return (
    <label className="text-editor">
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={4}
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
