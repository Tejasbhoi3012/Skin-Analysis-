import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Crop,
  ImagePlus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Video,
  Zap,
} from 'lucide-react';
import { analyzeImage } from '../api';
import { HERO_IMAGE } from '../data';
import { EngineChip, PageHeader, Tabs } from './Ui';

const MAX_SIZE = 10 * 1024 * 1024;

const STEPS = [
  {
    title: 'Capture or Upload',
    copy: 'Provide an uncompressed, close-up photograph of the region under clear natural illumination.',
  },
  {
    title: 'Neural Feature Extraction',
    copy: 'Computer vision maps asymmetrical borders, pigment distributions, and structural deviations.',
  },
  {
    title: 'Triage & Clinical Summary',
    copy: 'Receive structured differential possibilities, self-care monitoring tips, or local dermatologist referral.',
  },
];

const TIPS = [
  {
    title: 'Natural soft daylight',
    copy: 'Avoid harsh camera flash, overhead fluorescent glare, or cast shadows.',
  },
  {
    title: 'Clean skin surface',
    copy: 'Free from cosmetics, mineral foundation, heavy creams, or camera filters.',
  },
  {
    title: 'Close-up macro focus (3–6 inches)',
    copy: 'Center the lesion; tap screen to ensure pin-sharp optical clarity.',
  },
  {
    title: 'Keep lens parallel to skin plane',
    copy: 'Avoid extreme tilted angles to preserve dimensional aspect ratio.',
  },
];

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileCard({ file, preview, onUseSample, onReplace, onReset }) {
  return (
    <div className={`sample-file-card${file ? ' loaded' : ''}`}>
      <span className="sample-thumb">
        <img src={preview || HERO_IMAGE} alt={file ? 'Selected skin concern' : 'Sample skin concern'} />
        <span className="sample-raw">RAW</span>
      </span>
      <div className="file-card-copy">
        <div className="file-card-title">
          <strong title={file?.name}>{file?.name || 'cheek_concern_nov24.jpg'}</strong>
          <span className={`file-ready${file ? '' : ' sample'}`}>{file ? 'Ready' : 'Sample'}</span>
        </div>
        <small>{file ? formatSize(file.size) : '2.4 MB'} · Macro RGB · Exif Verified</small>
        <span className="file-valid">
          <ShieldCheck size={12} />
          {file ? 'Valid medical telemetry detected' : 'Valid medical telemetry profile'}
        </span>
      </div>
      {file ? (
        <div className="file-card-actions">
          <button type="button" aria-label="Replace photo" onClick={onReplace}>
            <RefreshCw size={14} />
          </button>
          <button type="button" aria-label="Remove photo" onClick={onReset}>
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <button type="button" className="use-sample" onClick={onUseSample}>
          <Upload size={13} />
          Use sample
        </button>
      )}
    </div>
  );
}

export default function AnalyzePage({ onComplete, onSampleReport }) {
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [meta, setMeta] = useState({ width: 2048, height: 1536 });
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(68);
  const [error, setError] = useState(null);
  const [cameraState, setCameraState] = useState('idle');
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (!analyzing) return undefined;
    const id = setInterval(() => {
      setProgress((value) => Math.min(96, value + Math.ceil(Math.random() * 3)));
    }, 700);
    return () => clearInterval(id);
  }, [analyzing]);

  useEffect(() => {
    if (mode !== 'camera') {
      stopCamera();
      return undefined;
    }
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => () => stopCamera(), []);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraState('idle');
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      return;
    }
    setCameraState('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraState('live');
    } catch {
      setCameraState('denied');
    }
  }

  function applyFile(next, { sample = false } = {}) {
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
    const url = URL.createObjectURL(next);
    objectUrlRef.current = url;
    setFile(next);
    setPreview(url);
    setSampleLoaded(sample);
    setProgress(68);
    setError(null);

    const image = new Image();
    image.onload = () => setMeta({ width: image.naturalWidth, height: image.naturalHeight });
    image.src = url;
  }

  async function loadSample() {
    setError(null);
    try {
      const response = await fetch(HERO_IMAGE);
      const blob = await response.blob();
      const sample = new File([blob], 'cheek_concern_nov24.jpg', {
        type: blob.type || 'image/jpeg',
      });
      applyFile(sample, { sample: true });
    } catch {
      setError('The sample image could not be loaded. Please choose a photo from your device.');
    }
  }

  function reset() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setFile(null);
    setPreview(null);
    setSampleLoaded(false);
    setProgress(68);
    setError(null);
    setAnalyzing(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    applyFile(event.dataTransfer.files?.[0]);
  }

  async function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) {
      setError('The camera frame could not be captured. Please try again.');
      return;
    }
    const captured = new File([blob], `camera_capture_${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    applyFile(captured);
    setMode('upload');
  }

  async function onAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setProgress(68);
    try {
      const data = await analyzeImage(file);
      onComplete({
        result: data.result,
        warning: data.warning,
        previewUrl: preview,
        imageName: file.name,
      });
    } catch (err) {
      setError(err.message);
      setAnalyzing(false);
    }
  }

  const hasFile = Boolean(file);
  const stagingSteps = [
    {
      icon: CheckCircle2,
      text: 'Checking image quality & sensor blur',
      state: hasFile ? ' done' : '',
      status: hasFile ? 'Passed' : 'Queued',
    },
    {
      icon: RefreshCw,
      text: 'Analyzing visual patterns & ABCDE margins',
      state: hasFile ? ' current' : '',
      status: hasFile ? `${analyzing ? progress : 68}%` : 'Queued',
    },
    {
      icon: Circle,
      text: 'Compiling clinical guidance & triaging notes',
      state: '',
      status: 'Queued',
    },
  ];

  return (
    <div className="analyze-page">
      <PageHeader
        eyebrow={
          <span className="page-badge">
            <span className="page-badge-dot" />
            <span>Assisted Triage V2.4</span>
            <i />
            <span className="page-badge-muted">Clinical Vision Pipeline Ready</span>
          </span>
        }
        title="New Analysis"
        description="Upload a clear photo of your skin concern for a calm, AI-assisted evaluation. All images are processed through encrypted medical-grade inference."
        action={<EngineChip icon={Activity} title="Gemini 1.5 Pro Med" detail="Calibrated Dec 2024" />}
      />

      <div className="analyze-grid">
        <div className="analyze-main">
          <Tabs
            className="segmented analyze-tabs"
            value={mode}
            onChange={setMode}
            items={[
              { id: 'upload', label: 'Photo Upload', icon: ImagePlus },
              {
                id: 'camera',
                label: 'Live Camera',
                icon: Camera,
                trailing: <span className="live-badge">Live</span>,
              },
            ]}
          />

          <section className="upload-panel">
            {mode === 'upload' ? (
              <>
                <div
                  className={`dropzone-v2${dragging ? ' dragging' : ''}`}
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
                  <span className="dropzone-deco one" />
                  <span className="dropzone-deco two" />
                  <span className="dropzone-icon">
                    <Crop size={26} />
                  </span>
                  <strong>
                    Drop your photo here, or <em>browse files</em>
                  </strong>
                  <small>Supports high-resolution JPG, PNG, WebP up to 10 MB</small>
                  <div className="dropzone-chips">
                    <span>Macro Skin Focus</span>
                    <span>Lossless Readout</span>
                    <span>Derm-Calibrated</span>
                  </div>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="visually-hidden"
                  onChange={(event) => applyFile(event.target.files?.[0])}
                />

                <FileCard
                  file={file}
                  preview={preview}
                  onUseSample={loadSample}
                  onReplace={() => inputRef.current?.click()}
                  onReset={reset}
                />

                {hasFile && (
                  <div className="file-meta-grid">
                    <span>
                      <em>Res</em> {meta.width} × {meta.height} px
                    </span>
                    <span>
                      <em>Lighting</em> Uniform &amp; Soft
                    </span>
                    <span>
                      <em>Sharpness</em> Optimal
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="camera-panel">
                <video ref={videoRef} muted playsInline aria-label="Live camera preview" />
                {cameraState !== 'live' && (
                  <div className="camera-fallback">
                    <Video size={30} />
                    <strong>
                      {cameraState === 'denied'
                        ? 'Camera permission is blocked'
                        : cameraState === 'unsupported'
                          ? 'Camera is not available in this browser'
                          : 'Starting secure camera…'}
                    </strong>
                    <small>
                      You can still upload a high-resolution photo from your device.
                    </small>
                  </div>
                )}
                <div className="camera-controls">
                  <span className="camera-live">
                    <span /> Live
                  </span>
                  <button type="button" className="shutter" onClick={capturePhoto} disabled={cameraState !== 'live'}>
                    <span />
                  </button>
                  <button type="button" className="camera-switch" onClick={() => setMode('upload')}>
                    <ImagePlus size={15} />
                    Upload instead
                  </button>
                </div>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <div className="staging-card">
              <div className="staging-head">
                <strong>
                  <span className={hasFile ? 'staging-dot active' : 'staging-dot'} />
                  AI Diagnostic Staging
                </strong>
                <span>Stage 2 of 3</span>
              </div>
              <div className="staging-steps">
                {stagingSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div className={`staging-step${step.state}`} key={step.text}>
                      <Icon size={step.icon === CheckCircle2 ? 16 : 15} />
                      <span>{step.text}</span>
                      <em>{step.status}</em>
                    </div>
                  );
                })}
              </div>
              <div className="staging-track">
                <span style={{ width: `${hasFile ? (analyzing ? progress : 68) : 0}%` }} />
              </div>
            </div>
          </section>

          <div className="analyze-actions">
            <button type="button" className="text-button" onClick={reset} disabled={!hasFile || analyzing}>
              Clear &amp; Start Over
            </button>
            <div>
              <button type="button" className="text-button preview-link" onClick={onSampleReport}>
                Preview sample report
              </button>
              <button
                type="button"
                className="btn btn-primary analyze-submit"
                onClick={onAnalyze}
                disabled={!hasFile || analyzing}
              >
                {analyzing ? (
                  <>
                    <span className="spinner" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze Photo Now
                  </>
                )}
              </button>
            </div>
          </div>

          <section className="how-card">
            <div className="how-head">
              <strong>
                <Activity size={18} />
                How it works
              </strong>
              <span className="time-pill">3 min</span>
            </div>
            <ol className="how-steps">
              {STEPS.map((step, index) => (
                <li key={step.title} className={index === 0 ? 'done' : index === 1 ? 'current' : ''}>
                  <span className="how-marker">
                    {index === 0 ? <Check size={14} /> : index + 1}
                  </span>
                  <div>
                    <strong>
                      {index + 1}. {step.title}
                    </strong>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="best-card">
            <div className="best-head">
              <Target size={19} />
              <div>
                <h2>For the Best Result</h2>
                <p>Follow standard dermatologic clinical photography principles:</p>
              </div>
            </div>
            <div className="best-list">
              {TIPS.map((tip) => (
                <div key={tip.title}>
                  <CheckCircle2 size={16} />
                  <div>
                    <strong>{tip.title}</strong>
                    <small>{tip.copy}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="telemetry-card">
            <span className="telemetry-icon">
              <ShieldCheck size={20} />
            </span>
            <div>
              <strong>Encrypted Health Telemetry</strong>
              <p>
                Your photo is analyzed securely via Gemini Vision and is strictly private.
                It is not indexed, published, or sold to third-party data repositories.
              </p>
            </div>
          </section>

          <section className="consent-card">
            <span className="consent-icon">
              <Check size={14} />
            </span>
            <div>
              <strong>Clinical Informational Consent</strong>
              <p>
                I understand this is an informational AI assessment and does not constitute
                a formal medical diagnosis or replace consultation with a board-certified
                dermatologist.
              </p>
            </div>
          </section>
        </div>

        <aside className="analyze-rail">
          <div className="rail-visual">
            <span>
              <Sparkles size={20} />
            </span>
          </div>
          <div className="rail-card">
            <h2>
              Trained on 45,000+ Verified Dermatoscope Cases
            </h2>
            <p>
              DermaScan AI benchmarks against standard Fitzpatrick phototype
              classification matrices.
            </p>
            <div className="rail-stat">
              <Zap size={14} />
              <span>
                <strong>94.6%</strong>
                top-3 concordance
              </span>
            </div>
            <button type="button" className="text-button" onClick={onSampleReport}>
              View a sample report
              <ChevronRight size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
