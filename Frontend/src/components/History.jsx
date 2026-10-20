import { useEffect, useState } from 'react';
import { deleteAnalysis, listAnalyses } from '../api';

const titleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

function summaryOf(item) {
  const result = item?.result;
  if (!result || typeof result !== 'object') return { diagnosis: 'Saved analysis', severity: '' };
  return {
    diagnosis: titleCase(result.diagnosis) || 'Saved analysis',
    severity: String(result.severity || '').toLowerCase(),
    confidence: Number(result.confidence),
    differential: Array.isArray(result.differential) ? result.differential : [],
    recommendations: Array.isArray(result.treatment_recommendations)
      ? result.treatment_recommendations
      : [],
    notes: result.notes,
    disclaimer: result.disclaimer,
    refer: Boolean(result.refer_to_dermatologist),
  };
}

export default function History() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setItems(await listAnalyses());
    } catch (err) {
      setError(err.message);
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this analysis from your history?')) return;
    setDeleting(id);
    setError(null);
    try {
      await deleteAnalysis(id);
      setItems((current) => current.filter((item) => item._id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (items === null) {
    return (
      <div className="card loading-card">
        <span className="spinner spinner-large" aria-hidden="true" />
        <h3>Loading history…</h3>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="section-heading">
        <div>
          <h2>Analysis history</h2>
          <p>Your saved assessments, newest first.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {items.length === 0 && !error && (
        <div className="card empty-state">
          <h3>No saved analyses yet</h3>
          <p>Analyze a photo and choose “Save to history” to keep the result here.</p>
        </div>
      )}

      <div className="history-list">
        {items.map((item) => {
          const summary = summaryOf(item);
          const isOpen = expanded === item._id;
          return (
            <article className="card history-item" key={item._id}>
              <button
                type="button"
                className="history-summary"
                onClick={() => setExpanded(isOpen ? null : item._id)}
                aria-expanded={isOpen}
              >
                <div>
                  <strong>{summary.diagnosis}</strong>
                  <span className="history-meta">
                    {new Date(item.createdAt).toLocaleString()}
                    {item.imageName ? ` · ${item.imageName}` : ''}
                  </span>
                </div>
                <div className="history-side">
                  {summary.severity && (
                    <span className={`badge severity-${summary.severity}`}>
                      {titleCase(summary.severity)}
                    </span>
                  )}
                  <span className={`chevron${isOpen ? ' open' : ''}`} aria-hidden="true">
                    ▾
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="history-details">
                  {Number.isFinite(summary.confidence) && (
                    <p className="muted">Confidence: {Math.round(summary.confidence)}%</p>
                  )}
                  {summary.refer && (
                    <div className="alert alert-warning">A dermatologist visit was recommended.</div>
                  )}
                  {summary.differential.length > 0 && (
                    <div className="result-section">
                      <h3>Other possibilities</h3>
                      <div className="chips">
                        {summary.differential.map((entry) => (
                          <span className="chip" key={entry}>
                            {titleCase(entry)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {summary.recommendations.length > 0 && (
                    <div className="result-section">
                      <h3>Care suggestions</h3>
                      <ul className="recommendations">
                        {summary.recommendations.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {summary.notes && (
                    <div className="result-section">
                      <h3>Notes</h3>
                      <p className="muted">{summary.notes}</p>
                    </div>
                  )}
                  {item.notes && item.notes !== summary.notes && (
                    <div className="result-section">
                      <h3>Saved notes</h3>
                      <p className="muted">{item.notes}</p>
                    </div>
                  )}
                  <p className="disclaimer">
                    {summary.disclaimer || 'Not a medical diagnosis; consult a dermatologist.'}
                  </p>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onDelete(item._id)}
                    disabled={deleting === item._id}
                  >
                    {deleting === item._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
