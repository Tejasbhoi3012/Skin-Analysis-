const SEVERITY_LABEL = {
  low: 'Low severity',
  medium: 'Medium severity',
  high: 'High severity',
};

const titleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

function confidenceValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
}

export default function ResultCard({ result, warning, onSave, saving, saved }) {
  const severity = String(result.severity || '').toLowerCase();
  const confidence = confidenceValue(result.confidence);
  const differential = Array.isArray(result.differential) ? result.differential : [];
  const recommendations = Array.isArray(result.treatment_recommendations)
    ? result.treatment_recommendations
    : [];

  if (result.rawText) {
    return (
      <div className="card result-card">
        {warning && <div className="alert alert-warning">{warning}</div>}
        <h2>Analysis result</h2>
        <pre className="raw-result">{result.rawText}</pre>
        <p className="fine-print">{result.disclaimer || 'Not a medical diagnosis; consult a dermatologist.'}</p>
      </div>
    );
  }

  return (
    <div className="card result-card">
      {warning && <div className="alert alert-warning">{warning}</div>}

      <div className="result-header">
        <div>
          <span className="eyebrow">Likely finding</span>
          <h2>{titleCase(result.diagnosis) || 'Unclear'}</h2>
        </div>
        {severity && (
          <span className={`badge severity-${SEVERITY_LABEL[severity] ? severity : 'unknown'}`}>
            {SEVERITY_LABEL[severity] || titleCase(severity)}
          </span>
        )}
      </div>

      {confidence !== null && (
        <div className="confidence">
          <div className="confidence-label">
            <span>Model confidence</span>
            <strong>{confidence}%</strong>
          </div>
          <div className="confidence-track">
            <div className="confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
        </div>
      )}

      {result.refer_to_dermatologist && (
        <div className="alert alert-warning">
          A dermatologist visit is recommended based on this assessment.
        </div>
      )}

      {differential.length > 0 && (
        <div className="result-section">
          <h3>Other possibilities</h3>
          <div className="chips">
            {differential.map((item) => (
              <span key={item} className="chip">
                {titleCase(item)}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="result-section">
          <h3>General care suggestions</h3>
          <ul className="recommendations">
            {recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.notes && (
        <div className="result-section">
          <h3>Notes</h3>
          <p className="muted">{result.notes}</p>
        </div>
      )}

      <p className="disclaimer">
        {result.disclaimer || 'Not a medical diagnosis; consult a dermatologist.'}
      </p>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving || saved}>
          {saved ? 'Saved to history' : saving ? 'Saving…' : 'Save to history'}
        </button>
      </div>
    </div>
  );
}
