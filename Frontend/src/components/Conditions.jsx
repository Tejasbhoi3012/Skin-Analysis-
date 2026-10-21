import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Search, ShieldCheck } from 'lucide-react';
import { getConditions } from '../api';
import { SAMPLE_CONDITIONS, titleCase } from '../data';
import { ConditionCard } from './Cards';
import { EmptyState, PageHeader } from './Ui';
import acneImage from '../assets/condition-acne.jpg';
import eczemaImage from '../assets/condition-eczema.jpg';
import rosaceaImage from '../assets/condition-rosacea.jpg';
import pigmentImage from '../assets/condition-pigment.jpg';

const IMAGE_MAP = {
  acne: acneImage,
  eczema: eczemaImage,
  rosacea: rosaceaImage,
  melasma: pigmentImage,
  hyperpigmentation: pigmentImage,
  sun_damage: pigmentImage,
  psoriasis: eczemaImage,
  contact_dermatitis: eczemaImage,
  perioral_dermatitis: rosaceaImage,
  fungal_infection: eczemaImage,
};

export default function Conditions({ onStart = () => {} }) {
  const [conditions, setConditions] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;
    getConditions()
      .then((data) => {
        if (alive) setConditions(data);
      })
      .catch((err) => {
        if (alive) {
          setError(err.message);
          setConditions(
            SAMPLE_CONDITIONS.map((item) => ({
              ...item,
              symptoms: item.symptoms,
            }))
          );
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    if (!conditions) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return conditions;
    return conditions.filter((condition) => {
      const haystack = `${condition.name} ${condition.short} ${(condition.symptoms || []).join(' ')}`;
      return haystack.toLowerCase().includes(needle);
    });
  }, [conditions, query]);

  return (
    <div className="conditions-page">
      <PageHeader
        eyebrow="Reference Database"
        title="Conditions Library"
        description="A plain-language reference for common dermatological findings, symptoms, and when to seek care."
        action={
          <button type="button" className="btn btn-primary" onClick={onStart}>
            Start New Analysis
            <ArrowRight size={15} />
          </button>
        }
      />

      <div className="library-toolbar">
        <label className="library-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conditions or symptoms…"
            aria-label="Search conditions"
          />
        </label>
        <span>
          <BookOpen size={14} />
          {conditions ? `${conditions.length} curated entries` : 'Loading library…'}
        </span>
      </div>

      {error && (
        <div className="alert alert-note">
          Live library unavailable — showing the local clinical reference.
        </div>
      )}

      {conditions === null && (
        <div className="library-loading">
          <span className="spinner spinner-large" aria-hidden="true" />
          <p>Loading conditions…</p>
        </div>
      )}

      <div className="library-grid">
        {list.map((condition) => (
          <ConditionCard
            key={condition.id}
            condition={{
              ...condition,
              shortSymptom: titleCase(condition.symptoms?.[0] || 'Skin finding'),
            }}
            image={IMAGE_MAP[condition.id] || acneImage}
          />
        ))}
      </div>

      {conditions && list.length === 0 && (
        <EmptyState>No conditions match “{query}”. Try a broader term.</EmptyState>
      )}

      <div className="library-note">
        <ShieldCheck size={17} />
        <p>
          This reference is educational only. A clinical examination is required to confirm
          any diagnosis and rule out less common conditions.
        </p>
      </div>
    </div>
  );
}
