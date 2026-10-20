import { useEffect, useRef, useState } from 'react';
import { analyzeImage, checkHealth, saveAnalysis } from './api';
import ResultCard from './components/ResultCard';
import History from './components/History';
import Assistant from './components/Assistant';
import Conditions from './components/Conditions';

const TABS = [
  { id: 'analyze', label: 'Analyze' },
  { id: 'history', label: 'History' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'conditions', label: 'Conditions' },
];

const MAX_SIZE = 10 * 1024 * 1024;

function Logo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
      <rect width="38" height="38" rx="12" fill="url(#logo-gradient)" />
      <circle cx="19" cy="19" r="10" stroke="white" strokeWidth="2" />
      <circle cx="19" cy="19" r="4" fill="white" />
      <path d="M19 9v3M19 26v3M9 19h3M26 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="38" y2="38">
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AnalyzePanel() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const selectFile = (next) => {
    if (!next) return;
    if (!next.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, or WebP).');
      return;
    }
    if (next.size > MAX_SIZE) {
      setError('The image is larger than 10 MB. Please choose a smaller file.');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(next);
    setFile(next);
    setPreview(objectUrlRef.current);
    setResult(null);
    setWarning(null);
    setError(null);
    setSaved(false);
  };

  const reset = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setFile(null);
    setPreview(null);
    setResult(null);
    setWarning(null);
    setError(null);
    setSaved(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const onAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setWarning(null);
    setResult(null);
    setSaved(false);
    try {
      const data = await analyzeImage(file);
      setResult(data.result);
      setWarning(data.warning);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const onSave = async () => {
    if (!result) return;
    setSaving(true);
    setError(null);
    try {
      await saveAnalysis({
        imageName: file?.name || 'uploaded-image',
        result,
        notes: result.notes || '',
        referToDerm: Boolean(result.refer_to_dermatologist),
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="analyze-layout">
      <section className="card upload-card">
        <div className="card-heading">
          <h2>Skin photo</h2>
          <p>Upload a clear, well-lit close-up of the affected area.</p>
        </div>

        <div
          className={`dropzone${dragging ? ' dragging' : ''}${preview ? ' has-preview' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
        >
          {preview ? (
            <img src={preview} alt="Selected skin photo preview" className="preview" />
          ) : (
            <div className="dropzone-empty">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 16V4m0 0L8 8m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <strong>Drop an image here</strong>
              <span>or click to browse · JPG, PNG, WebP up to 10 MB</span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="visually-hidden"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        {file && (
          <div className="file-meta">
            <span className="file-name" title={file.name}>
              {file.name}
            </span>
            <span>{formatSize(file.size)}</span>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <div className="upload-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAnalyze}
            disabled={!file || analyzing}
          >
            {analyzing ? (
              <>
                <span className="spinner" aria-hidden="true" /> Analyzing…
              </>
            ) : (
              'Analyze skin'
            )}
          </button>
          <button type="button" className="btn btn-ghost" onClick={reset} disabled={!file || analyzing}>
            Clear
          </button>
        </div>

        <p className="fine-print">
          Photos are sent to Google Gemini for analysis and are not stored by this app. Results are
          informational only.
        </p>
      </section>

      <section className="result-panel">
        {analyzing && (
          <div className="card loading-card">
            <span className="spinner spinner-large" aria-hidden="true" />
            <h3>Analyzing your photo…</h3>
            <p>Checking visual features across common skin conditions.</p>
          </div>
        )}

        {!analyzing && result && (
          <ResultCard
            result={result}
            warning={warning}
            onSave={onSave}
            saving={saving}
            saved={saved}
          />
        )}

        {!analyzing && !result && (
          <div className="card info-card">
            <h2>How it works</h2>
            <ol className="steps">
              <li>
                <span className="step-number">1</span>
                <div>
                  <strong>Upload a photo</strong>
                  <p>Use natural light and avoid makeup, filters, or blur.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div>
                  <strong>Get an AI assessment</strong>
                  <p>Review a likely diagnosis, alternatives, and confidence level.</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div>
                  <strong>Save and track</strong>
                  <p>Keep results in your history to discuss with a dermatologist.</p>
                </div>
              </li>
            </ol>
            <div className="alert alert-note">
              This tool is not a medical diagnosis. For persistent, painful, or worsening skin
              concerns, consult a dermatologist.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function App() {
  const [tab, setTab] = useState('analyze');
  const [online, setOnline] = useState(null);

  useEffect(() => {
    let alive = true;
    const ping = async () => {
      const ok = await checkHealth();
      if (alive) setOnline(ok);
    };
    ping();
    const id = setInterval(ping, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <Logo />
          <div>
            <h1>DermaScan AI</h1>
            <p>AI-assisted skin condition analysis</p>
          </div>
        </div>
        <span className={`status ${online === false ? 'offline' : online ? 'online' : 'checking'}`}>
          <span className="status-dot" />
          {online === null ? 'Checking API' : online ? 'API online' : 'API offline'}
        </span>
      </header>

      <nav className="tabs" aria-label="Sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tab${tab === item.id ? ' active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'analyze' && <AnalyzePanel />}
        {tab === 'history' && <History />}
        {tab === 'assistant' && <Assistant />}
        {tab === 'conditions' && <Conditions />}
      </main>

      <footer className="app-footer">
        <p>
          DermaScan AI provides general information only and does not replace professional medical
          advice, diagnosis, or treatment.
        </p>
      </footer>
    </div>
  );
}
