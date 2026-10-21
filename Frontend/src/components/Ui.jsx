export function PageHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <header className={`page-head${className ? ` ${className}` : ''}`}>
      <div>
        {typeof eyebrow === 'string' ? <span className="page-eyebrow">{eyebrow}</span> : eyebrow}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function EngineChip({ icon: Icon, title, detail }) {
  return (
    <div className="engine-chip">
      <span>
        <Icon size={17} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

export function Tabs({ items, value, onChange, className = '', iconSize = 15 }) {
  return (
    <div className={className}>
      {items.map(({ id, label, icon: Icon, trailing }) => (
        <button
          type="button"
          key={id}
          className={value === id ? 'active' : ''}
          onClick={() => onChange(id)}
        >
          {Icon && <Icon size={iconSize} />}
          {label}
          {trailing}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="empty-history">
      <p>{children}</p>
    </div>
  );
}
