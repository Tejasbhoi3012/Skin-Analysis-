import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Gauge,
  MapPin,
  MonitorPlay,
  ShieldCheck,
  Star,
  Video,
} from 'lucide-react';
import { SeverityPill } from './Brand';

function ConfidenceStat({ severity }) {
  if (severity === 'high') {
    return (
      <div className="history-confidence high">
        <strong>84%</strong>
        <span>biopsy advised</span>
        <AlertCircle size={34} />
      </div>
    );
  }
  if (severity === 'low') {
    return (
      <div className="history-confidence">
        <strong>92%</strong>
        <span>benign profile</span>
        <CheckCircle2 size={34} />
      </div>
    );
  }
  return (
    <div className="history-confidence">
      <strong>78%</strong>
      <span>high cert.</span>
      <Gauge size={34} />
    </div>
  );
}

export function HistoryRecordCard({ entry, onView, onNotify = () => {} }) {
  return (
    <article className="history-record">
      <div className="history-record-head">
        <div className="history-thumb">
          <img src={entry.image} alt="" />
          <span>{entry.code}</span>
        </div>
        <div className="history-record-title">
          <div>
            <h3>{entry.diagnosis}</h3>
            <SeverityPill severity={entry.severity} />
          </div>
          <p>
            {entry.date} · {entry.time}
          </p>
          <small>{entry.area}</small>
        </div>
      </div>

      <ConfidenceStat severity={entry.severity} />

      <div className="history-record-actions">
        <button type="button" onClick={() => onView(entry)}>
          View Full
          <br />
          Report
          <ArrowRight size={13} />
        </button>
        {entry.severity === 'high' ? (
          <button
            type="button"
            className="soft"
            onClick={() => onNotify(`Report ${entry.code} sent to Dr. Meera Nambiar.`)}
          >
            <ShieldCheck size={13} />
            Send to Dr.
            <br />
            Meera
          </button>
        ) : (
          <button
            type="button"
            className="soft"
            onClick={() => onNotify('Comparison will be available after your next saved scan.')}
          >
            <MonitorPlay size={13} />
            Compare with
            <br />
            Latest
          </button>
        )}
      </div>
    </article>
  );
}

export function SpecialistCard({ specialist, meta, onBook, onVideo }) {
  return (
    <article className="specialist-card">
      <div className="specialist-top">
        <img src={specialist.image} alt="" />
        <div>
          <h3>{specialist.name}</h3>
          <p>{specialist.lead}</p>
        </div>
        <span className="availability">
          <span />
          {specialist.availability}
        </span>
      </div>
      <div className="specialist-meta">
        <span className="rating">
          <Star size={13} fill="currentColor" />
          {specialist.rating}
        </span>
        <small>({specialist.reviews})</small>
        <span className="distance">
          {specialist.distance.replace(' away', '')}
          <small>away</small>
        </span>
      </div>
      <p className="specialist-address">
        <MapPin size={13} />
        {specialist.address}
      </p>
      <div className="specialist-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onBook(specialist.name)}>
          Book Appointment
        </button>
        <button type="button" className="btn btn-soft btn-sm" onClick={onVideo}>
          <Video size={14} />
          Video Call ({meta.price || '$25'})
        </button>
      </div>
    </article>
  );
}

export function ConditionCard({ condition, image }) {
  return (
    <article className="library-card">
      <div className="library-media">
        <img src={image} alt={condition.name} loading="lazy" />
        <span>{condition.shortSymptom}</span>
      </div>
      <div className="library-body">
        <h2>{condition.name}</h2>
        <p>{condition.short}</p>
        <div className="library-chips">
          {(condition.symptoms || []).slice(0, 4).map((symptom) => (
            <span key={symptom}>{symptom}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
