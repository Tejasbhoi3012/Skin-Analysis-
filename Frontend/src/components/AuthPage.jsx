import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Logo, Wordmark } from './Brand';
import { loginAccount, registerAccount } from '../auth';

const HIGHLIGHTS = [
  'Private, account-scoped scan history',
  'Confidence-scored AI assessments',
  'Verified dermatologist referrals',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage({ initialMode = 'signin', onAuthenticated, onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  function switchMode(next) {
    if (submitting) return;
    setMode(next);
    setErrors({});
    setFormError(null);
    setValues((current) => ({ ...current, password: '', confirm: '' }));
  }

  function validate() {
    const next = {};
    const email = values.email.trim();

    if (isSignup && values.name.trim().length < 2) {
      next.name = 'Enter your full name.';
    }
    if (!email) next.email = 'Enter your email address.';
    else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.';

    if (!values.password) next.password = 'Enter your password.';
    else if (isSignup && values.password.length < 8) next.password = 'Use at least 8 characters.';

    if (isSignup) {
      if (values.confirm !== values.password) next.confirm = 'Passwords do not match.';
      if (!accepted) next.terms = 'Please accept the privacy terms to continue.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const email = values.email.trim().toLowerCase();
      const session = isSignup
        ? await registerAccount({ name: values.name.trim(), email, password: values.password })
        : await loginAccount({ email, password: values.password });
      onAuthenticated(session);
    } catch (err) {
      setFormError(err.message);
      if (err.fieldErrors) setErrors((current) => ({ ...current, ...err.fieldErrors }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-orb auth-visual-orb-one" aria-hidden="true" />
        <div className="auth-visual-orb auth-visual-orb-two" aria-hidden="true" />

        <div className="auth-visual-inner">
          <button type="button" className="auth-brand" onClick={onBack} aria-label="DermaScan AI home">
            <Logo size={42} />
            <span>
              <Wordmark />
              <small>Clinical Vision</small>
            </span>
          </button>

          <div className="auth-visual-copy">
            <span className="auth-pill">
              <Sparkles size={14} />
              Private by design
            </span>
            <h1>
              Your skin story,
              <br />
              <em>securely kept.</em>
            </h1>
            <p>
              One account connects your assessments, progression history, and care
              referrals — encrypted in transit and visible only to you.
            </p>

            <ul className="auth-benefits">
              {HIGHLIGHTS.map((item) => (
                <li key={item}>
                  <span>
                    <Check size={13} strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-visual-foot">
            <div className="auth-visual-stats">
              <div>
                <strong>256-bit</strong>
                <small>TLS encryption</small>
              </div>
              <div>
                <strong>7 days</strong>
                <small>Secure sessions</small>
              </div>
            </div>
            <p>
              <ShieldCheck size={15} />
              Health data stays tied to your account and is never sold or shared.
            </p>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <button type="button" className="auth-back" onClick={onBack}>
            <ArrowLeft size={15} />
            Back to overview
          </button>

          <div className="auth-mobile-brand">
            <Logo size={36} />
            <Wordmark />
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              className={!isSignup ? 'active' : ''}
              onClick={() => switchMode('signin')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className={isSignup ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              Create account
            </button>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">{isSignup ? 'New to DermaScan' : 'Welcome back'}</span>
            <h2>{isSignup ? 'Create your clinical workspace' : 'Sign in to your workspace'}</h2>
            <p>
              {isSignup
                ? 'Start with a private account. Your first assessment takes under a minute.'
                : 'Access your saved assessments, history, and care network.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {formError && (
              <div className="auth-alert" role="alert">
                <span aria-hidden="true">!</span>
                {formError}
              </div>
            )}

            {isSignup && (
              <label className={`auth-field${errors.name ? ' invalid' : ''}`}>
                <span>Full name</span>
                <div className="auth-input">
                  <UserRound size={17} />
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                    placeholder="Ananya Rao"
                    autoComplete="name"
                    autoFocus
                    aria-invalid={Boolean(errors.name)}
                  />
                </div>
                {errors.name && <small className="auth-error">{errors.name}</small>}
              </label>
            )}

            <label className={`auth-field${errors.email ? ' invalid' : ''}`}>
              <span>Email address</span>
              <div className="auth-input">
                <Mail size={17} />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus={!isSignup}
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
              {errors.email && <small className="auth-error">{errors.email}</small>}
            </label>

            <label className={`auth-field${errors.password ? ' invalid' : ''}`}>
              <span>Password</span>
              <div className="auth-input">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={(event) => update('password', event.target.value)}
                  placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <small className="auth-error">{errors.password}</small>}
            </label>

            {isSignup && (
              <label className={`auth-field${errors.confirm ? ' invalid' : ''}`}>
                <span>Confirm password</span>
                <div className="auth-input">
                  <LockKeyhole size={17} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirm"
                    value={values.confirm}
                    onChange={(event) => update('confirm', event.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirm)}
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowConfirm((value) => !value)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirm && <small className="auth-error">{errors.confirm}</small>}
              </label>
            )}

            {isSignup ? (
              <label className={`auth-terms${errors.terms ? ' invalid' : ''}`}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => {
                    setAccepted(event.target.checked);
                    setErrors((current) => ({ ...current, terms: undefined }));
                  }}
                />
                <span>
                  I understand DermaScan AI offers informational insights, not a medical
                  diagnosis, and I agree to the privacy terms.
                </span>
              </label>
            ) : (
              <div className="auth-session-note">
                <ShieldCheck size={15} />
                Secure session · signed in for 7 days on this device
              </div>
            )}

            {errors.terms && <small className="auth-error terms-error">{errors.terms}</small>}

            <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="auth-spinner" />
                  {isSignup ? 'Creating account…' : 'Signing in…'}
                </>
              ) : (
                <>
                  {isSignup ? 'Create my account' : 'Sign in'}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New to DermaScan AI?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
              disabled={submitting}
            >
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
          </p>

          <p className="auth-legal">
            Protected by encrypted authentication. We never store your photo after an
            assessment unless you choose to save the result.
          </p>
        </div>
      </section>
    </div>
  );
}
