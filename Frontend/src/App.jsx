import { useEffect, useState } from 'react';
import { saveAnalysis } from './api';
import { fetchCurrentUser, readSession, signOut } from './auth';
import { SAMPLE_RESULT, normalizeResult } from './data';
import { Logo, Wordmark } from './components/Brand';
import AppShell from './components/AppShell';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import AnalyzePage from './components/AnalyzePage';
import ResultPage from './components/ResultPage';
import FinderPage from './components/FinderPage';
import Assistant from './components/Assistant';
import Conditions from './components/Conditions';

export default function App() {
  const [cachedSession] = useState(readSession);
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(cachedSession?.user || null);
  const [booting, setBooting] = useState(Boolean(cachedSession));
  const [authMode, setAuthMode] = useState('signin');
  const [finderTab, setFinderTab] = useState('finder');
  const [analysis, setAnalysis] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!cachedSession) return undefined;
    let alive = true;
    fetchCurrentUser()
      .then((session) => {
        if (alive) setUser(session?.user || null);
      })
      .finally(() => {
        if (alive) setBooting(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  function requireAccount(nextView) {
    if (user) {
      setView(nextView);
      return;
    }
    setAuthMode('signin');
    setView('auth');
  }

  function openAuth(mode = 'signin') {
    setAuthMode(mode);
    setView('auth');
  }

  function handleAuthenticated(session) {
    setUser(session.user);
    setView('analyze');
    setToast(`Welcome, ${session.user.name.split(' ')[0]}. Your workspace is ready.`);
  }

  function handleSignOut() {
    signOut();
    setUser(null);
    setAnalysis(null);
    setSaved(false);
    setView('landing');
  }

  function openFinder(tab = 'finder') {
    setFinderTab(tab);
    requireAccount('finder');
  }

  function openSampleReport() {
    setAnalysis({
      result: normalizeResult(SAMPLE_RESULT),
      previewUrl: null,
      imageName: 'cheek_concern_nov24.jpg',
      warning: null,
    });
    setSaved(false);
    setView('result');
  }

  function handleAnalyzed(payload) {
    setAnalysis({
      ...payload,
      result: normalizeResult(payload.result, payload.previewUrl),
    });
    setSaved(false);
    setView('result');
  }

  async function handleSave() {
    if (!analysis || saving || saved) return;
    setSaving(true);
    try {
      await saveAnalysis({
        imageName: analysis.imageName || 'uploaded-image',
        result: analysis.result,
        notes: analysis.result.notes || '',
        referToDerm: Boolean(analysis.result.refer_to_dermatologist),
      });
      setSaved(true);
      setToast('Analysis saved to your clinical history.');
    } catch (err) {
      setToast(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleViewReport(entry) {
    let result;
    let previewUrl = null;

    if (entry.result) {
      result = normalizeResult(entry.result, entry.image);
    } else if (entry.diagnosis && entry.diagnosis !== SAMPLE_RESULT.diagnosis) {
      const variant = {
        ...SAMPLE_RESULT,
        diagnosis: entry.diagnosis,
        severity: entry.severity,
        confidence: entry.confidence,
        differential:
          entry.severity === 'high'
            ? [
                {
                  name: 'Atypical Melanocytic Lesion',
                  confidence: 22,
                  description:
                    'Irregular borders and color variation warrant in-person dermoscopic review.',
                },
              ]
            : [],
        care:
          entry.severity === 'high'
            ? [
                {
                  title: 'Arrange Prompt Clinical Review',
                  icon: 'shield',
                  text: 'Book an in-person dermatology assessment for dermoscopy and, if advised, biopsy.',
                },
                {
                  title: 'Avoid Trauma & Sun Exposure',
                  icon: 'sun',
                  text: 'Do not scratch or pick the lesion. Protect the area with broad-spectrum SPF.',
                },
              ]
            : SAMPLE_RESULT.care,
        refer_to_dermatologist: entry.severity !== 'low',
        reference: `DS-${entry.code}`,
        captured_at: `${entry.date} · ${entry.time}`,
      };
      result = normalizeResult(variant, entry.image);
      previewUrl = entry.image;
    } else {
      result = normalizeResult(SAMPLE_RESULT, entry.image);
      previewUrl = entry.image;
    }

    setAnalysis({
      result,
      previewUrl,
      imageName: entry.area || 'saved-analysis',
      warning: null,
    });
    setSaved(Boolean(entry.result));
    setView('result');
  }

  if (booting) {
    return (
      <div className="app-boot">
        <span className="app-boot-brand">
          <Logo size={44} />
          <Wordmark />
        </span>
        <span className="spinner" aria-label="Restoring your session" />
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <LandingPage
        user={user}
        onStart={() => requireAccount('analyze')}
        onSignIn={() => (user ? setView('analyze') : openAuth('signin'))}
        onSignUp={() => (user ? setView('analyze') : openAuth('signup'))}
        onFindCare={() => openFinder('finder')}
        onBrowseConditions={() => requireAccount('conditions')}
        onAssistant={() => requireAccount('assistant')}
      />
    );
  }

  if (view === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onAuthenticated={handleAuthenticated}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <AppShell
      view={view}
      user={user}
      activeNav={view === 'finder' ? finderTab : undefined}
      onNavigate={requireAccount}
      onNewAnalysis={() => requireAccount('analyze')}
      onOpenFinder={openFinder}
      onHome={() => setView('landing')}
      onSignOut={handleSignOut}
      toast={toast}
    >
      {view === 'analyze' && (
        <AnalyzePage
          onComplete={handleAnalyzed}
          onSampleReport={openSampleReport}
        />
      )}

      {view === 'result' && (
        <ResultPage
          result={analysis?.result}
          previewUrl={analysis?.previewUrl}
          warning={analysis?.warning}
          saved={saved}
          saving={saving}
          onSave={handleSave}
          onBack={() => setView('analyze')}
          onFindCare={() => openFinder('finder')}
          onNewAnalysis={() => setView('analyze')}
        />
      )}

      {view === 'finder' && (
        <FinderPage
          initialTab={finderTab}
          onViewReport={handleViewReport}
          onNotify={setToast}
        />
      )}

      {view === 'assistant' && <Assistant />}

      {view === 'conditions' && (
        <Conditions onStart={() => setView('analyze')} />
      )}
    </AppShell>
  );
}
