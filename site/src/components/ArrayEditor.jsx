import TextEditor from './TextEditor';

export default function ArrayEditor({
  label,
  items,
  onChange,
  fields,
  itemLabel = 'Élément',
  maxItems,
  minItems = 0,
}) {
  const handleUpdate = (index, fieldPath, value) => {
    const next = items.map((item, i) => {
      if (i !== index) return item;
      if (fieldPath.includes('.')) {
        const keys = fieldPath.split('.');
        const updated = { ...item };
        let cur = updated;
        for (let j = 0; j < keys.length - 1; j++) {
          cur[keys[j]] = { ...cur[keys[j]] };
          cur = cur[keys[j]];
        }
        cur[keys[keys.length - 1]] = value;
        return updated;
      }
      return { ...item, [fieldPath]: value };
    });
    onChange(next);
  };

  const handleAdd = () => {
    if (maxItems && items.length >= maxItems) return;
    const newItem = fields.reduce((acc, f) => {
      acc[f.path] = f.type === 'checkbox' ? false : '';
      return acc;
    }, {});
    onChange([...items, newItem]);
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
    <div className="array-editor">
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
      <div className="array-items">
        {items.map((item, index) => (
          <div key={index} className="array-item">
            <div className="array-item-toolbar">
              <span className="array-item-num">
                {itemLabel} {index + 1}
              </span>
              <div className="array-item-actions">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === items.length - 1}
                  title="Descendre"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="btn-remove-array"
                  onClick={() => handleRemove(index)}
                  disabled={items.length <= minItems}
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="array-item-fields">
              {fields.map((f) => {
                if (f.type === 'checkbox') {
                  return (
                    <label key={f.path} className="checkbox-editor">
                      <input
                        type="checkbox"
                        checked={!!item[f.path]}
                        onChange={(e) =>
                          handleUpdate(index, f.path, e.target.checked)
                        }
                      />
                      <span>{f.label}</span>
                    </label>
                  );
                }
                return (
                  <TextEditor
                    key={f.path}
                    label={f.label}
                    value={item[f.path] ?? ''}
                    onChange={(v) => handleUpdate(index, f.path, v)}
                    multiline={f.multiline}
                    rows={f.rows}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
