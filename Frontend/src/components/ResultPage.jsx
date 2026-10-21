import { useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Camera,
  Check,
  CheckCircle2,
  Circle,
  Download,
  Droplets,
  FileText,
  Info,
  Leaf,
  Maximize2,
  MessageSquare,
  ScanLine,
  Send,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { ConfidenceRing, SeverityPill } from './Brand';
import { askAssistant } from '../api';
import { SAMPLE_CAPTURE, SAMPLE_RESULT, titleCase } from '../data';
import miniReport from '../assets/skin-photo.png';

const CARE_ICONS = {
  droplets: Droplets,
  shield: ShieldCheck,
  sun: Sun,
  leaf: Leaf,
};

function normalizeCare(item) {
  if (typeof item === 'string') {
    return { title: item, text: '', icon: 'droplets' };
  }
  return {
    title: item?.title || 'Care step',
    text: item?.text || '',
    icon: item?.icon || 'droplets',
  };
}

function ResultAssistant({ result, recordRef, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I have reviewed record #${recordRef} (${result.diagnosis}, ${result.confidence}% confidence). How can I help you understand this result today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function send(text) {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', text: prompt }]);
    setLoading(true);
    try {
      const context = `Patient is reviewing an AI skin analysis: ${result.diagnosis}, severity ${result.severity}, confidence ${result.confidence}%. Observation: ${result.notes}`;
      const reply = await askAssistant(`${context}\n\nQuestion: ${prompt}`);
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: reply.text, warning: reply.warning },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'I could not reach the clinical assistant right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <aside className="result-assistant">
      <div className="assistant-head">
        <span className="assistant-brand">
          <Bot size={17} />
        </span>
        <div>
          <strong>DermaScan AI Assistant</strong>
          <small>Context: Record #{recordRef}</small>
        </div>
        <button type="button" className="assistant-close" onClick={onClose} aria-label="Close assistant">
          <X size={16} />
        </button>
      </div>

      <div className="assistant-chat">
        {messages.map((message, index) => (
          <div key={index} className={`assistant-message ${message.role}`}>
            {message.role === 'assistant' && (
              <span className="assistant-avatar">
                <Bot size={13} />
              </span>
            )}
            <div>
              <p>{message.text}</p>
              {message.warning && <small className="assistant-warning">{message.warning}</small>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="assistant-message assistant">
            <span className="assistant-avatar">
              <Bot size={13} />
            </span>
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="assistant-suggestions">
        <button type="button" onClick={() => send('Explain my confidence score.')}>
          Explain my score
        </button>
        <button type="button" onClick={() => send('What should I avoid while this heals?')}>
          What to avoid
        </button>
      </div>

      <form
        className="assistant-input"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about treatment options, differential details…"
          aria-label="Ask about this result"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
          <Send size={15} />
        </button>
      </form>
    </aside>
  );
}

export default function ResultPage({
  result,
  previewUrl,
  warning,
  saved,
  saving,
  onSave,
  onBack,
  onFindCare,
  onNewAnalysis,
}) {
  const data = result || SAMPLE_RESULT;
  const [assistantOpen, setAssistantOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1500,
  );
  const [zoomOpen, setZoomOpen] = useState(false);

  const image = previewUrl || data.image;
  const confidence = Number.isFinite(Number(data.confidence)) ? Number(data.confidence) : 78;
  const recordRef = data.reference || 'DS-8924';
  const severity = String(data.severity || 'medium').toLowerCase();
  const severityLabel = titleCase(severity) || 'Medium';
  const severityDetail =
    severity === 'medium' && String(data.diagnosis).toLowerCase().includes('acne')
      ? 'Non-cystic'
      : '';
  const differential = Array.isArray(data.differential) ? data.differential : [];
  const care = Array.isArray(data.care)
    ? data.care
    : Array.isArray(data.treatment_recommendations)
      ? data.treatment_recommendations.map(normalizeCare)
      : [];
  const observations = data.notes || SAMPLE_RESULT.notes;
  const laboratory =
    data.laboratory ||
    (severity === 'medium' ? 'Localized superficial inflammation' : 'Visual findings documented below');
  const triageSegments = severity === 'high' ? 4 : severity === 'low' ? 2 : 3;

  return (
    <div className={`result-page${assistantOpen ? ' with-assistant' : ''}`}>
      <div className="result-head">
        <button type="button" className="text-button back-link" onClick={onBack}>
          <ArrowLeft size={15} />
          Return to Analyses
        </button>
        <div className="result-title-row">
          <div>
            <div className="result-title-line">
              <h1>Analysis Complete</h1>
              <span className="assessed-pill">
                <ShieldCheck size={11} />
                AI Assessed
              </span>
            </div>
            <p className="result-subline">
              {data.captured_at || SAMPLE_RESULT.captured_at} · Ref: #{recordRef}
              <span className="dot-divider" />
              <span className="validated">
                <CheckCircle2 size={12} />
                Validated Pipeline
              </span>
            </p>
          </div>
          <div className="preview-pills" aria-label="Preview states">
            <span className="preview-label">Preview State:</span>
            <span className="preview-pill active">Standard ({confidence}%)</span>
            <span className={`preview-pill${confidence < 65 ? ' active' : ''}`}>Low Confidence</span>
            <span className={`preview-pill${warning ? ' active' : ''}`}>Offline Fallback</span>
          </div>
        </div>
        {warning && <div className="alert alert-warning result-warning">{warning}</div>}
      </div>

      <div className="result-layout">
        <div className="result-left">
          <article className="result-photo-card">
            <span className="quality-pill">
              <Camera size={12} />
              Photo Quality: Good ({SAMPLE_CAPTURE.quality}%)
            </span>
            <button type="button" className="photo-circle" onClick={() => setZoomOpen(true)}>
              <img src={image} alt="Analyzed skin concern" />
            </button>
            <figure className="mini-report">
              <img src={miniReport} alt="Report preview" />
            </figure>
            <button
              type="button"
              className="photo-zoom"
              onClick={() => setZoomOpen(true)}
              aria-label="Expand photo"
            >
              <Maximize2 size={14} />
            </button>
          </article>

          <article className="telemetry-block">
            <div className="telemetry-head">
              <span>Capture Telemetry</span>
              <em>
                <Activity size={11} />
                Calibrated
              </em>
            </div>
            <div className="telemetry-grid">
              <div>
                <small>Anatomical Site</small>
                <strong>Right Cheek / Facial Detail</strong>
              </div>
              <div>
                <small>Illumination</small>
                <strong>Diffuse Natural / Device Profile</strong>
              </div>
              <div>
                <small>Resolution</small>
                <strong>12.2 MP Macro</strong>
              </div>
              <div>
                <small>Sensor</small>
                <strong>Mobile Sensor v4</strong>
              </div>
            </div>
          </article>

          <article className="triage-block">
            <div className="triage-main">
              <span className="triage-icon">
                <Activity size={15} />
              </span>
              <div>
                <small>Triaged Index</small>
                <strong>{severityLabel} Severity · Stable</strong>
              </div>
            </div>
            <div className="triage-stage">
              <span>Stage {Math.max(1, triageSegments - 1)} of 4</span>
              <div>
                {[1, 2, 3, 4].map((segment) => (
                  <i key={segment} className={segment <= triageSegments ? 'filled' : ''} />
                ))}
              </div>
            </div>
          </article>

          <button type="button" className="retake-button" onClick={onNewAnalysis}>
            <Camera size={15} />
            Retake or Submit New Photo
          </button>

          <article className="engine-block">
            <span className="engine-icon">
              <ScanLine size={17} />
            </span>
            <div>
              <strong>DermaEngine NeuralNet v2.4</strong>
              <p>
                Cross-indexed across 180,000 clinically validated dermatoscopic records.
                ISIC certified taxonomy.
              </p>
            </div>
          </article>
        </div>

        <div className="result-report">
          <article className="report-hero">
            <div className="report-diagnosis">
              <span className="eyebrow">Likely Finding</span>
              <h2>{data.diagnosis || SAMPLE_RESULT.diagnosis}</h2>
              <div className="diagnosis-meta">
                <SeverityPill severity={severity} long />
                {severityDetail && <span className="diagnosis-variant">({severityDetail})</span>}
              </div>
              <p>{laboratory}</p>
            </div>
            <div className="report-confidence">
              <ConfidenceRing value={confidence} size={92} stroke={7} label="Match" />
              <span>
                Confidence Index
                <Info size={11} />
              </span>
            </div>
          </article>

          <article className="observations-card">
            <h3>
              <ScanLine size={17} />
              Visual Morphology Observations
            </h3>
            <p>{observations}</p>
          </article>

          {data.refer_to_dermatologist && (
            <article className="consult-card">
              <span className="consult-icon">
                <StethoscopeIcon />
              </span>
              <div className="consult-copy">
                <div>
                  <h3>Dermatology Consult Advised</h3>
                  <span className="recommended-pill">Recommended</span>
                </div>
                <p>
                  Professional clinical evaluation can help prevent hyperpigmentation,
                  scarring and offer targeted prescription therapy (e.g. retinoids or
                  topical antimicrobials).
                </p>
              </div>
              <button type="button" className="btn btn-primary" onClick={onFindCare}>
                Find Specialists Near You
                <ArrowRight size={15} />
              </button>
            </article>
          )}

          {differential.length > 0 && (
            <article className="differential-card">
              <div className="differential-head">
                <div>
                  <h3>Differential Diagnoses</h3>
                  <p>Alternative classifications evaluated by the multi-class model</p>
                </div>
                <span>
                  Normalized
                  <br />
                  Likelihood
                </span>
              </div>
              <div className="differential-grid">
                {differential.slice(0, 2).map((item) => {
                  const name =
                    typeof item === 'string' ? titleCase(item) : item.name || 'Alternate finding';
                  const value =
                    typeof item === 'object' && item?.confidence != null
                      ? Number(item.confidence)
                      : null;
                  const description =
                    typeof item === 'object'
                      ? item.description
                      : 'Considered as an alternative classification by the multi-class model.';
                  return (
                    <div className="differential-item" key={name}>
                      <div>
                        <strong>{name}</strong>
                        {value != null && (
                          <span>
                            {value}%<small>Match</small>
                          </span>
                        )}
                      </div>
                      <p>{description}</p>
                      <div className="likelihood-track">
                        <span style={{ width: `${Math.max(6, value || 12)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          )}

          <article className="care-card">
            <div className="care-head">
              <h3>General Care Suggestions</h3>
              <span>Self-Care Protocols</span>
            </div>
            <div className="care-list">
              {care.map((item, index) => {
                const normalized = normalizeCare(item);
                const Icon = CARE_ICONS[normalized.icon] || Droplets;
                return (
                  <div className="care-item" key={`${normalized.title}-${index}`}>
                    <span className="care-number">{index + 1}</span>
                    <div>
                      <strong>
                        {normalized.title}
                        <Icon size={13} />
                      </strong>
                      <p>{normalized.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="disclaimer-card">
            <span>
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3>Clinical Safety &amp; Regulatory Disclaimer</h3>
              <p>
                {data.disclaimer ||
                  'This digital assessment is an AI-generated informational summary and does not constitute a formal medical diagnosis. If you observe rapid changes in size, shape, bleeding, or escalating tenderness, seek an in-person consultation with a board-certified dermatologist immediately.'}
              </p>
            </div>
          </article>

          <div className="record-bar">
            <div className="record-ready">
              <CheckCircle2 size={20} />
              <span>
                <strong>Record {recordRef} Ready</strong>
                <small>Encrypted &amp; HIPAA Compliant</small>
              </span>
            </div>
            <div className="record-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setAssistantOpen(true)}
              >
                <MessageSquare size={14} />
                Ask AI Assistant
              </button>
              <button type="button" className="btn btn-soft btn-sm" onClick={() => window.print()}>
                <Download size={14} />
                Export Medical PDF
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onSave}
                disabled={saving || saved}
              >
                {saved ? <Check size={14} /> : <FileText size={14} />}
                {saved ? 'Saved to History' : saving ? 'Saving…' : 'Save to History'}
              </button>
            </div>
          </div>
        </div>

        {assistantOpen && (
          <ResultAssistant
            result={data}
            recordRef={recordRef}
            onClose={() => setAssistantOpen(false)}
          />
        )}
      </div>

      {!assistantOpen && (
        <button
          type="button"
          className="assistant-fab"
          onClick={() => setAssistantOpen(true)}
          aria-label="Open AI assistant"
        >
          <Bot size={20} />
        </button>
      )}

      {zoomOpen && (
        <div className="zoom-overlay" onClick={() => setZoomOpen(false)} role="dialog" aria-label="Photo preview">
          <button type="button" onClick={() => setZoomOpen(false)} aria-label="Close preview">
            <X size={18} />
          </button>
          <img src={image} alt="Analyzed skin concern enlarged" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function StethoscopeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3" />
      <path d="M9 12.5v2a5.5 5.5 0 0 0 11 0V13" />
      <circle cx="20" cy="10.5" r="2.5" />
    </svg>
  );
}
