import { useState } from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  Clock3,
  HelpCircle,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  Stethoscope,
  X,
} from 'lucide-react';
import { BrandLockup } from './Brand';
import { DOCTOR } from '../data';

const NAV = [
  { id: 'analyze', label: 'Analyze', icon: Activity, badge: 'AI Ready' },
  { id: 'finder', label: 'History', icon: Clock3, count: '12', target: 'history' },
  { id: 'assistant', label: 'Assistant', icon: Bot },
  { id: 'conditions', label: 'Conditions', icon: BookOpen },
  { id: 'finder', label: 'Find a Dermatologist', icon: Stethoscope, target: 'finder' },
];

export default function AppShell({
  view,
  activeNav,
  onNavigate,
  onNewAnalysis,
  onOpenFinder,
  onHome,
  children,
  toast,
}) {
  const [open, setOpen] = useState(false);

  const go = (item) => {
    setOpen(false);
    if (item.target === 'history') onOpenFinder('history');
    else if (item.target === 'finder') onOpenFinder('finder');
    else onNavigate(item.id);
  };

  const active = activeNav || (view === 'result' ? 'analyze' : view);
  const breadcrumb =
    {
      analyze: 'Clinical Assessment',
      result: 'Analysis Record',
      finder: 'Care Network',
      assistant: 'Clinical Assistant',
      conditions: 'Conditions Library',
    }[view] || 'Clinical Assessment';

  return (
    <div className="app-shell">
      <div
        className={`shell-scrim${open ? ' visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <button type="button" className="sidebar-brand-button" onClick={onHome} aria-label="DermaScan AI home">
            <BrandLockup />
          </button>
        </div>

        <div className="sidebar-body">
          <p className="sidebar-label">Workspace</p>
          <nav className="side-nav" aria-label="Workspace">
            {NAV.map((item) => {
              const Icon = item.icon;
              const reallyActive =
                item.target === undefined ? active === item.id : active === item.target;
              return (
                <button
                  key={`${item.label}-${item.target || ''}`}
                  type="button"
                  className={`side-nav-item${reallyActive ? ' active' : ''}`}
                  onClick={() => go(item)}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.badge && <em className="nav-badge">{item.badge}</em>}
                  {item.count && <em className="nav-count">{item.count}</em>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-doctor">
          <img src={DOCTOR.avatar} alt="" />
          <span className="sidebar-doctor-copy">
            <strong>{DOCTOR.name}</strong>
            <small>
              <span className="status-dot" /> {DOCTOR.role}
            </small>
          </span>
          <button type="button" className="icon-button subtle" aria-label="Doctor settings">
            <Settings size={17} strokeWidth={1.8} />
          </button>
        </div>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-button mobile-menu"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button type="button" className="breadcrumb" onClick={() => go({ id: 'analyze' })}>
              <Home size={17} strokeWidth={1.8} />
              <ChevronRight size={14} strokeWidth={1.8} />
              <span>{breadcrumb}</span>
            </button>
            <label className="global-search">
              <Search size={17} strokeWidth={1.8} />
              <input type="search" placeholder="Search records, derm codes..." aria-label="Search" />
            </label>
          </div>

          <div className="topbar-right">
            <button type="button" className="topbar-link" onClick={() => go({ id: 'conditions' })}>
              <HelpCircle size={17} strokeWidth={1.8} />
              <span>Help &amp; Clinical Safety</span>
            </button>
            <button type="button" className="icon-button notification" aria-label="Notifications">
              <Bell size={19} strokeWidth={1.8} />
              <i />
            </button>
            <button type="button" className="btn btn-primary topbar-cta" onClick={onNewAnalysis}>
              <Plus size={17} strokeWidth={2.2} />
              New Analysis
            </button>
            <img className="topbar-avatar" src={DOCTOR.avatar} alt="Dr. Ananya Rao" />
          </div>
        </header>

        <main className="shell-content">{children}</main>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
