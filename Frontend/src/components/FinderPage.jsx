import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Clock3,
  Navigation,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Stethoscope,
  Video,
} from 'lucide-react';
import { listAnalyses } from '../api';
import { SAMPLE_HISTORY, SPECIALISTS, titleCase } from '../data';
import { HistoryRecordCard, SpecialistCard } from './Cards';
import { EmptyState, PageHeader, Tabs } from './Ui';
import mapImage from '../assets/map-bengaluru.jpg';
import meeraAvatar from '../assets/specialist-meera.png';
import resultSkin from '../assets/result-skin.jpg';

const FILTERS = [
  { id: 'open', label: 'Open Now' },
  { id: 'rated', label: 'Top Rated (4.5+)' },
  { id: 'video', label: 'Video Consultation Available' },
  { id: 'insurance', label: 'Accepts Insurance' },
];

const HISTORY_COUNTS = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'low', label: 'Low', count: 4 },
  { id: 'medium', label: 'Medium', count: 6 },
  { id: 'high', label: 'High', count: 2 },
];

const SPECIALIST_META = {
  dermacare: { video: true, insurance: true, open: true, price: '$25' },
  skinworks: { video: true, insurance: false, open: true, price: '$30' },
};

export default function FinderPage({ onViewReport, onNotify = () => {}, initialTab = 'finder' }) {
  const [tab, setTab] = useState(initialTab);
  const [location, setLocation] = useState('Indiranagar, Bengaluru · Within 10 km');
  const [editingLocation, setEditingLocation] = useState(false);
  const [filters, setFilters] = useState(['open']);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    let alive = true;
    listAnalyses()
      .then((items) => {
        if (alive) setSaved(items);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const savedEntries = useMemo(
    () =>
      saved.map((item) => {
        const record = item.result || {};
        const created = item.createdAt ? new Date(item.createdAt) : null;
        return {
          id: item._id,
          image: resultSkin,
          diagnosis: titleCase(record.diagnosis) || 'Saved analysis',
          severity: String(record.severity || 'medium').toLowerCase(),
          date: created
            ? created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Saved record',
          time: created
            ? created.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '',
          area: item.imageName || 'Saved skin capture',
          code: 'DS',
          confidence: Number(record.confidence) || 78,
          confidenceLabel: 'saved report',
          state: 'saved',
          result: record,
        };
      }),
    [saved]
  );

  const historyEntries = useMemo(() => {
    const all = [...savedEntries, ...SAMPLE_HISTORY];
    const filtered =
      historyFilter === 'all' ? all : all.filter((entry) => entry.severity === historyFilter);
    if (sort === 'confidence') {
      return [...filtered].sort((a, b) => b.confidence - a.confidence);
    }
    if (sort === 'oldest') return [...filtered].reverse();
    return filtered;
  }, [savedEntries, historyFilter, sort]);

  const specialists = useMemo(() => {
    return SPECIALISTS.filter((specialist) => {
      const meta = SPECIALIST_META[specialist.id] || {};
      if (filters.includes('rated') && Number(specialist.rating) < 4.5) return false;
      if (filters.includes('video') && !meta.video) return false;
      if (filters.includes('insurance') && !meta.insurance) return false;
      if (filters.includes('open') && !meta.open) return false;
      return true;
    });
  }, [filters]);

  function toggleFilter(id) {
    setFilters((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  function saveLocation(event) {
    event.preventDefault();
    setEditingLocation(false);
  }

  async function shareRecord() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onNotify('Share link copied to clipboard.');
    } catch {
      onNotify('Sharing is not available in this browser.');
    }
  }

  function book(name) {
    onNotify(`Appointment request started for ${name}. The clinic will confirm availability.`);
  }

  return (
    <div className="finder-page">
      <PageHeader
        eyebrow="Verified Care Ecosystem"
        title="Find a Dermatologist & Care Network"
        className="finder-head"
      />

      <Tabs
        className="finder-tabs"
        iconSize={16}
        value={tab}
        onChange={setTab}
        items={[
          { id: 'finder', label: 'Find Doctors Nearby', icon: Stethoscope },
          {
            id: 'history',
            label: 'Saved Skin History',
            icon: Clock3,
            trailing: <span>12</span>,
          },
        ]}
      />

      {tab === 'finder' ? (
        <>
          <section className="location-card">
            <div className="location-row">
              <span className="location-pin">
                <Navigation size={15} />
              </span>
              {editingLocation ? (
                <form onSubmit={saveLocation} className="location-form">
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    autoFocus
                    aria-label="Search location"
                  />
                  <button type="submit">Apply</button>
                </form>
              ) : (
                <p>{location}</p>
              )}
              <button
                type="button"
                className="change-link"
                onClick={() => setEditingLocation((value) => !value)}
              >
                {editingLocation ? 'Cancel' : 'Change'}
              </button>
              <label className="location-search" aria-label="Search specialists">
                <Search size={14} />
                <input placeholder="Search clinics, doctors…" />
              </label>
            </div>

            <div className="filter-row">
              {FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  className={filters.includes(filter.id) ? 'active' : ''}
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.id === 'open' && <Clock3 size={13} />}
                  {filter.id === 'rated' && <Star size={13} />}
                  {filter.id === 'video' && <Video size={13} />}
                  {filter.id === 'insurance' && <ShieldCheck size={13} />}
                  {filter.label}
                </button>
              ))}
              <span className="active-specialists">
                <span />
                18 Clinical Derm Specialists active
              </span>
            </div>
          </section>

          <div className="finder-grid">
            <section className="map-card">
              <img src={mapImage} alt="Map of dermatology specialists around Indiranagar, Bengaluru" />
            </section>

            <aside className="recommended">
              <div className="recommended-head">
                <h2>Recommended Specialists</h2>
                <span>
                  Sorted by Distance &amp;
                  <br />
                  Rating
                </span>
              </div>

              <button
                type="button"
                className="compact-doctor"
                onClick={() => book('Dr. Meera Nambiar')}
              >
                <img src={meeraAvatar} alt="" />
                <div>
                  <strong>Dr. Meera Nambiar</strong>
                  <small>MD, DNB (Dermatology)</small>
                </div>
                <span className="availability open">
                  <span />
                  Open today until 7 PM
                </span>
              </button>

              <div className="specialist-list">
                {specialists.map((specialist) => (
                  <SpecialistCard
                    key={specialist.id}
                    specialist={specialist}
                    meta={SPECIALIST_META[specialist.id] || {}}
                    onBook={book}
                    onVideo={() =>
                      onNotify(`Starting a secure video call with ${specialist.name}.`)
                    }
                  />
                ))}
              </div>
            </aside>
          </div>
        </>
      ) : null}

      {tab === 'history' ? (
        <section className="history-section standalone">
          <div className="history-head">
            <div>
              <span className="page-eyebrow">Progression &amp; Diagnostic Records</span>
              <h2>Saved Skin History Log</h2>
            </div>
            <div className="history-controls">
              <div className="history-filters">
                {HISTORY_COUNTS.map((filter) => (
                  <button
                    type="button"
                    key={filter.id}
                    className={historyFilter === filter.id ? 'active' : ''}
                    onClick={() => setHistoryFilter(filter.id)}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
              <label className="sort-select">
                <SlidersHorizontal size={13} />
                <span>Sort by:</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="confidence">Highest confidence</option>
                </select>
                <ChevronDown size={13} />
              </label>
            </div>
          </div>

          {historyEntries.length === 0 ? (
            <EmptyState>No records match this filter yet.</EmptyState>
          ) : (
            <div className="history-cards">
              {historyEntries.map((entry) => (
                <HistoryRecordCard
                  key={entry.id}
                  entry={entry}
                  onView={onViewReport}
                  onNotify={onNotify}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === 'finder' ? (
        <section className="monitor-banner">
          <span className="monitor-icon">
            <Stethoscope size={20} />
          </span>
          <div>
            <strong>Lesion Evolution Monitoring Active</strong>
            <p>
              DermaScan AI has observed a 14% diameter stabilization across recurring
              checks over the last 90 days.
            </p>
          </div>
          <div className="monitor-actions">
            <button type="button" className="btn btn-light btn-sm" onClick={() => window.print()}>
              <Calendar size={14} />
              Download PDF History
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={shareRecord}>
              Share Record Link
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
