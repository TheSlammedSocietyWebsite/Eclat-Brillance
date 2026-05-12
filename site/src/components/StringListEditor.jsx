export default function StringListEditor({
  label,
  items,
  onChange,
  itemLabel = '\u00c9l\u00e9ment',
  maxItems,
  minItems = 0,
}) {
  const handleChange = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const handleAdd = () => {
    if (maxItems && items.length >= maxItems) return;
    onChange([...items, '']);
  };

  const handleRemove = (index) => {
    if (items.length <= minItems) return;
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleMove = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === items.length - 1) return;
    const next = [...items];
    const tmp = next[index];
    next[index] = next[index + direction];
    next[index + direction] = tmp;
    onChange(next);
  };

  return (
    <div className="string-list-editor">
      <div className="array-editor-header">
        <span className="array-editor-label">{label}</span>
        {(!maxItems || items.length < maxItems) && (
          <button type="button" className="btn-add" onClick={handleAdd}>
            + Ajouter {itemLabel.toLowerCase()}
          </button>
        )}
      </div>
      {items.length === 0 && (
        <p className="array-empty">
          Aucun {itemLabel.toLowerCase()}
        </p>
      )}
      <div className="string-list-items">
        {items.map((item, index) => (
          <div key={index} className="string-list-item">
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`${itemLabel} ${index + 1}`}
            />
            <div className="string-list-actions">
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                title="Monter"
              >
                \u2191
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                disabled={index === items.length - 1}
                title="Descendre"
              >
                \u2193
              </button>
              <button
                type="button"
                className="btn-remove-array"
                onClick={() => handleRemove(index)}
                disabled={items.length <= minItems}
                title="Supprimer"
              >
                \u00d7
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
