export function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="brand-mark"
    >
      <rect width="40" height="40" rx="11" fill="url(#derma-logo-gradient)" />
      <path
        d="M20 9.4c3.7 4.4 7.4 8.8 7.4 13.4a7.4 7.4 0 0 1-14.8 0c0-4.6 3.7-9 7.4-13.4Z"
        stroke="white"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M16.2 23.2c2.6 1.7 5.1 1.7 7.7 0"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="28.7" cy="10.8" r="1.7" fill="white" />
      <defs>
        <linearGradient id="derma-logo-gradient" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#12857c" />
          <stop offset="1" stopColor="#0b5f58" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Wordmark({ compact = false }) {
  return (
    <span className={`wordmark${compact ? ' compact' : ''}`}>
      <span>DermaScan</span>
      <strong>AI</strong>
    </span>
  );
}

export function BrandLockup({ compact = false, subtitle = 'Clinical v2.4' }) {
  return (
    <span className="brand-lockup">
      <Logo size={compact ? 36 : 40} />
      <span className="brand-copy">
        <Wordmark compact={compact} />
        {subtitle && <small>{subtitle}</small>}
      </span>
    </span>
  );
}

export function ConfidenceRing({
  value = 78,
  size = 92,
  stroke = 7,
  label = 'Match',
  className = '',
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <span className={`confidence-ring ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(15, 118, 110, 0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--teal)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="confidence-ring-copy">
        <strong>{value}%</strong>
        {label && <small>{label}</small>}
      </span>
    </span>
  );
}

export const SEVERITY_META = {
  low: { label: 'Low', long: 'Low Severity', tone: 'low' },
  medium: { label: 'Medium', long: 'Medium Severity', tone: 'medium' },
  high: { label: 'High', long: 'High Severity', tone: 'high' },
  unknown: { label: 'Unknown', long: 'Severity pending', tone: 'unknown' },
};

export function SeverityPill({ severity = 'unknown', long = false }) {
  const meta = SEVERITY_META[String(severity).toLowerCase()] || SEVERITY_META.unknown;
  return (
    <span className={`severity-pill severity-${meta.tone}`}>
      <span className="severity-dot" />
      {long ? meta.long : meta.label}
    </span>
  );
}
