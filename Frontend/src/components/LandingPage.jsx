import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  History,
  KeyRound,
  Lock,
  MapPin,
  MessageSquare,
  ScanLine,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
} from 'lucide-react';
import { Logo, Wordmark, ConfidenceRing } from './Brand';
import { CONDITION_CARDS, DOCTOR, HERO_IMAGE, LANDING_FAQS } from '../data';

const NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Platform', href: '#platform' },
  { label: 'Conditions Library', href: '#conditions' },
  { label: 'Clinical Safety', href: '#safety' },
];

const STEPS = [
  {
    num: '01',
    title: 'Upload a well-lit photo',
    copy: 'Capture or upload an image in natural daylight. Our optical pre-flight checker validates exposure, focus, and framing before processing.',
    foot: 'Natural sunlight recommended',
    icon: Camera,
  },
  {
    num: '02',
    title: 'Gemini Vision 1.5 evaluation',
    copy: 'The multimodal clinical engine maps lesion morphology, color variations, erythema borders, and cross-references skin health registries.',
    foot: 'Multi-spectral lesion mapping',
    icon: BrainCircuit,
  },
  {
    num: '03',
    title: 'Review & direct care path',
    copy: 'Receive simple, plain-language insights with categorized next steps. If needed, seamlessly export findings to board-certified dermatologists.',
    foot: 'Instant PDF clinical referral',
    icon: FileCheck2,
  },
];

const FEATURES = [
  {
    title: 'Clear, Non-Alarm Insights',
    copy: 'Traditional web searches amplify worst-case scenarios. DermaScan categorizes findings by measured severity levels, presents likely differentials, and clearly notes benign commonalities.',
    icon: Smile,
    visual: 'severity',
  },
  {
    title: 'Longitudinal History',
    copy: 'Monitor lesion shifts, pigmentation evolution, and healing progress over weeks with automated side-by-side metric alignment.',
    icon: History,
    visual: 'timeline',
  },
  {
    title: 'Dermatologist Finder',
    copy: 'When professional intervention is beneficial, discover board-certified MD dermatologists in your city with verified hospital affiliations and consult ratings.',
    icon: MapPin,
    visual: 'finder',
  },
  {
    title: 'AI Clinical Assistant',
    copy: 'Ask follow-up inquiries anytime. Review skincare ingredient contraindications (e.g., Retinol vs AHA), routine adjustments, and specific warning signs that warrant immediate clinical attention.',
    icon: MessageSquare,
    visual: 'assistant',
  },
];

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      'Visual Skin Scanner',
      'Timeline Tracking',
      'Dermatologist Directory',
      'Ingredient Safety Check',
      'API for Telehealth',
    ],
  },
  {
    title: 'Clinical Care',
    links: [
      'Conditions Library',
      'Skin of Color Initiative',
      'Clinical Research Papers',
      'Medical Advisory Board',
      'Provider Portal Login',
    ],
  },
  {
    title: 'Compliance & Trust',
    links: [
      'Privacy Statement',
      'Terms of Service',
      'HIPAA Compliance',
      'DISHA Compliance (India)',
      'Vulnerability Disclosure',
    ],
  },
];

export default function LandingPage({
  user = null,
  onStart = () => {},
  onSignIn = () => {},
  onSignUp = () => {},
  onFindCare = () => {},
  onBrowseConditions = () => {},
  onAssistant = () => {},
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="landing">
      <header className="lp-header">
        <div className="lp-header-inner">
          <button type="button" className="lp-brand" onClick={onStart} aria-label="DermaScan AI home">
            <Logo size={42} />
            <span className="lp-brand-copy">
              <Wordmark />
              <small>Clinical Vision</small>
            </span>
          </button>

          <nav className="lp-nav" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <button type="button" className="lp-nav-md" onClick={onFindCare}>
              For Dermatologists
              <span>MD Hub</span>
            </button>
          </nav>

          <div className="lp-header-actions">
            <button type="button" className="lp-signin" onClick={onSignIn}>
              {user ? `Hi, ${firstName}` : 'Sign in'}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={user ? onStart : onSignUp}
            >
              {user ? 'Open Workspace' : 'Start Free Analysis'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-hero-grid">
            <div className="lp-hero-copy">
              <span className="lp-eyebrow-pill">
                <Sparkles size={14} />
                AI-assisted skin insights
                <span className="lp-eyebrow-divider" />
                Gemini Vision 1.5 Clinical
              </span>
              <h1>
                Know your skin.
                <br />
                <em>Know your next step.</em>
              </h1>
              <p className="lp-hero-lede">
                DermaScan AI helps you understand visible skin concerns in seconds.
                Upload a photo, receive a confidence-scored assessment, and connect
                with board-certified dermatologists — without the guesswork or alarm.
              </p>
              <div className="lp-hero-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={user ? onStart : onSignUp}
                >
                  Analyze my skin (Free)
                  <ArrowRight size={18} />
                </button>
                <a className="btn btn-ghost btn-lg" href="#how-it-works">
                  See how it works
                  <ChevronRight size={17} />
                </a>
              </div>
              <ul className="lp-trust">
                <li>
                  <ShieldCheck size={16} />
                  Privacy by design
                </li>
                <li>
                  <Sparkles size={16} />
                  Powered by Gemini
                </li>
                <li>
                  <FileCheck2 size={16} />
                  Not a medical diagnosis
                </li>
                <li>
                  <Lock size={16} />
                  Encrypted in transit
                </li>
              </ul>
            </div>

            <aside className="lp-scan-card" aria-label="Sample lesion scan">
              <div className="lp-scan-head">
                <div className="lp-scan-title">
                  <span className="lp-scan-badge">
                    <ScanLine size={18} />
                  </span>
                  <span>
                    <strong>Lesion Scan #4829</strong>
                    <small>Cheek &amp; Jawline Area · Today</small>
                  </span>
                </div>
                <span className="lp-concern">
                  <span />
                  Medium Concern
                </span>
              </div>

              <div className="lp-scan-visual">
                <figure className="lp-scan-photo">
                  <img src={HERO_IMAGE} alt="Close-up of inflamed skin on a cheek" />
                  <figcaption>Visualised</figcaption>
                </figure>
                <div className="lp-scan-score">
                  <ConfidenceRing value={78} size={104} stroke={8} label="Confidence" />
                  <p>
                    <ShieldCheck size={14} />
                    High feature match with training patterns
                  </p>
                </div>
              </div>

              <div className="lp-finding">
                <span className="lp-eyebrow">Likely primary finding</span>
                <div className="lp-finding-head">
                  <h2>Acne Vulgaris (Papular)</h2>
                  <span>Differential (2)</span>
                </div>
                <p className="lp-finding-copy">
                  Non-cystic inflammatory presentation. Follicular hyperkeratinization
                  noted around the lower cheek boundary.
                </p>
                <span className="lp-eyebrow">Clinical care suggestions</span>
                <div className="lp-chips">
                  <span>Topical Salicylic Acid</span>
                  <span>Gentle Barrier Wash</span>
                  <span>SPF 50 Non-comedogenic</span>
                </div>
                <div className="lp-scan-doctor">
                  <img src={DOCTOR.avatar} alt="" />
                  <div>
                    <strong>Dr. Ananya Rao, MD</strong>
                    <small>Consultant Dermatologist</small>
                  </div>
                  <span className="lp-scan-rating">
                    <Star size={13} fill="currentColor" />
                    4.8
                  </span>
                  <button type="button" onClick={onFindCare}>
                    View Map
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="lp-steps" id="how-it-works">
          <div className="lp-container">
            <div className="lp-section-head">
              <span className="lp-eyebrow">Triage Architecture</span>
              <h2>Three thoughtful steps to clinical clarity</h2>
              <p>
                Designed with leading dermatologists to ensure structured, stress-free
                triage without alarming self-diagnoses.
              </p>
            </div>
            <div className="lp-steps-grid">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <article className="lp-step-card" key={step.num}>
                    <span className="lp-step-num">{step.num}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                    <span className="lp-step-foot">
                      <Icon size={16} />
                      {step.foot}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-platform" id="platform">
          <div className="lp-container">
            <div className="lp-platform-head">
              <div>
                <span className="lp-eyebrow">Engineered for Reassurance</span>
                <h2>Clinical rigor without panic</h2>
              </div>
              <p>
                Medical tools shouldn't trigger anxiety. DermaScan AI translates complex
                dermatological diagnostic vectors into calm, rational guidance.
              </p>
            </div>

            <div className="lp-feature-grid">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article className="lp-feature-card" key={feature.title}>
                    <span className="lp-feature-icon">
                      <Icon size={20} />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.copy}</p>

                    {feature.visual === 'severity' && (
                      <div className="lp-widget lp-widget-severity">
                        <div className="lp-widget-row">
                          <strong>Severity Scale</strong>
                          <span className="lp-status">Routine Observation</span>
                        </div>
                        <div className="lp-scale">
                          <span />
                        </div>
                        <small>Presents no urgent clinical indicators. Safe for home monitoring.</small>
                      </div>
                    )}

                    {feature.visual === 'timeline' && (
                      <div className="lp-widget lp-widget-timeline">
                        <div className="lp-timeline-week">
                          <span>Week 1 (Baseline)</span>
                          <div className="lp-timeline-thumb">
                            <span className="lp-timeline-dot" />
                            <span className="lp-timeline-dot" />
                          </div>
                        </div>
                        <div className="lp-timeline-week">
                          <span>Week 4 (Post-Care)</span>
                          <div className="lp-timeline-thumb">
                            <Check size={22} />
                          </div>
                        </div>
                      </div>
                    )}

                    {feature.visual === 'finder' && (
                      <div className="lp-widget lp-widget-finder">
                        <span className="lp-md-badge">MD</span>
                        <div>
                          <strong>500+ Specialists</strong>
                          <small>Bengaluru, Delhi, Mumbai, Hyderabad</small>
                        </div>
                        <span className="lp-pin-button">
                          <MapPin size={16} />
                        </span>
                      </div>
                    )}

                    {feature.visual === 'assistant' && (
                      <div className="lp-widget lp-widget-chat">
                        <span className="lp-chat-icon">
                          <MessageSquare size={15} />
                        </span>
                        <div>
                          <strong>User: "Can I combine Niacinamide with this breakout?"</strong>
                          <p>
                            "Yes, Niacinamide at 2–5% concentration is gentle and
                            anti-inflammatory. However, avoid pairing it directly with
                            high-strength L-Ascorbic Acid in the same application."
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-conditions" id="conditions">
          <div className="lp-container">
            <div className="lp-conditions-head">
              <div>
                <span className="lp-eyebrow">Reference Database</span>
                <h2>
                  Trained on common dermatological
                  <br />
                  conditions
                </h2>
                <p>
                  Validated against diverse clinical datasets encompassing varied
                  Fitzpatrick skin phototypes.
                </p>
              </div>
              <button type="button" className="lp-text-link" onClick={onBrowseConditions}>
                Browse full clinical library (10+ conditions)
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="lp-condition-grid">
              {CONDITION_CARDS.map((condition) => (
                <button
                  type="button"
                  className="lp-condition-card"
                  key={condition.name}
                  onClick={onBrowseConditions}
                >
                  <div className="lp-condition-media">
                    <img src={condition.image} alt={condition.name} />
                  </div>
                  <div className="lp-condition-body">
                    <h3>{condition.name}</h3>
                    <p>{condition.short}</p>
                    <div className="lp-condition-foot">
                      <span>{condition.accuracy}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-safety" id="safety">
          <div className="lp-container">
            <div className="lp-privacy">
              <div className="lp-privacy-main">
                <span className="lp-privacy-pill">
                  <ShieldCheck size={15} />
                  Data Ethics Guarantee
                </span>
                <h2>Privacy and clinical safety in plain language</h2>
                <p>
                  Your photo is evaluated transiently in secure memory and never stored
                  or sold without explicit affirmative consent.
                </p>
                <div className="lp-privacy-cards">
                  <div>
                    <span className="lp-privacy-icon">
                      <ShieldCheck size={18} />
                    </span>
                    <strong>Zero Permanent Cache</strong>
                    <small>Photos are purged after the clinical inference pipeline completes.</small>
                  </div>
                  <div>
                    <span className="lp-privacy-icon">
                      <KeyRound size={18} />
                    </span>
                    <strong>End-to-End TLS 1.3</strong>
                    <small>High-grade encryption for all teleconsult queries and data streams.</small>
                  </div>
                  <div>
                    <span className="lp-privacy-icon">
                      <FileCheck2 size={18} />
                    </span>
                    <strong>HIPAA/DISHA Ready</strong>
                    <small>Structured strictly according to global and Indian health data guidelines.</small>
                  </div>
                </div>
              </div>

              <div className="lp-privacy-side">
                <span className="lp-privacy-lock">
                  <Lock size={30} />
                </span>
                <h3>Complete Patient Agency</h3>
                <p>
                  You maintain complete control. Delete analysis history with a single
                  tap at any moment.
                </p>
                <button type="button" className="btn btn-light">
                  Read Security Whitepaper
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-faq">
          <div className="lp-container">
            <div className="lp-faq-head">
              <span className="lp-eyebrow">Transparency First</span>
              <h2>Frequently asked questions</h2>
              <p>Everything you need to know about how DermaScan AI handles clinical support.</p>
            </div>

            <div className="lp-faq-list">
              {LANDING_FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`lp-faq-item${isOpen ? ' is-open' : ''}`} key={faq.q}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={18} />
                    </button>
                    {isOpen && <p>{faq.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-cta-wrap">
          <div className="lp-container">
            <div className="lp-cta">
              <span className="lp-cta-icon">
                <Stethoscope size={28} />
              </span>
              <h2>Begin your assessment in under 60 seconds</h2>
              <p>
                Free to start. A private account keeps your assessments, progression
                history, and care referrals in one secure place.
              </p>
              <div className="lp-cta-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={user ? onStart : onSignUp}
                >
                  Start Free Skin Analysis
                </button>
                <button type="button" className="btn btn-light btn-lg" onClick={onFindCare}>
                  Find Doctors Nearby
                </button>
              </div>
              <small>Free basic triage · Confidential &amp; HIPAA/DISHA aligned</small>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <span className="lp-brand">
                <Logo size={38} />
                <span className="lp-brand-copy">
                  <Wordmark />
                </span>
              </span>
              <p>
                Accessible, AI-powered dermatological triage designed with calm clinical
                precision. Empowering individuals to seek timely care with board-certified
                practitioners.
              </p>
              <small>ISO 27001 Certified Architecture</small>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div className="lp-footer-col" key={column.title}>
                <h4>{column.title}</h4>
                {column.links.map((link) => (
                  <button type="button" key={link}>
                    {link}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="lp-disclaimer">
            <span>
              <FileCheck2 size={17} />
            </span>
            <div>
              <strong>Clinical Disclaimer &amp; Intended Use</strong>
              <p>
                DermaScan AI is a software application designed for informational,
                pre-consultation, and educational guidance only. It is not an FDA-cleared
                or CE-marked medical device and cannot replace diagnostic evaluations,
                histology, or medical consultations conducted by a licensed healthcare
                professional. Always consult a certified dermatologist or physician if you
                notice changes in size, shape, bleeding, or color of any skin lesion.
              </p>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <span>© 2025 DermaScan AI Health Technologies Inc. All rights reserved.</span>
            <div>
              <span className="lp-status">
                <span />
                System Status: Operational
              </span>
              <button type="button">Security</button>
            </div>
          </div>
        </div>
      </footer>

      <button type="button" className="lp-chat-fab" onClick={onAssistant} aria-label="Open AI assistant">
        <MessageSquare size={21} />
        <span />
      </button>
    </div>
  );
}
