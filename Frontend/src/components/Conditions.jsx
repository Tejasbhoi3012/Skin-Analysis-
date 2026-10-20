import { useEffect, useState } from 'react';
import { getConditions } from '../api';

export default function Conditions() {
  const [conditions, setConditions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getConditions()
      .then((data) => {
        if (alive) setConditions(data);
      })
      .catch((err) => {
        if (alive) {
          setError(err.message);
          setConditions([]);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  if (conditions === null) {
    return (
      <div className="card loading-card">
        <span className="spinner spinner-large" aria-hidden="true" />
        <h3>Loading conditions…</h3>
      </div>
    );
  }

  return (
    <div className="conditions">
      <div className="section-heading">
        <div>
          <h2>Common facial skin conditions</h2>
          <p>A quick reference for symptoms this tool can flag.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="condition-grid">
        {conditions.map((condition) => (
          <article className="card condition-card" key={condition.id}>
            <h3>{condition.name}</h3>
            <p>{condition.short}</p>
            <div className="chips">
              {condition.symptoms.map((symptom) => (
                <span className="chip" key={symptom}>
                  {symptom}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="alert alert-note">
        This reference is educational and does not replace an examination by a qualified
        dermatologist.
      </div>
    </div>
  );
}
