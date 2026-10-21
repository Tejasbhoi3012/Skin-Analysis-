import { useEffect, useState } from 'react';
import { saveAnalysis } from './api';
import { SAMPLE_RESULT, normalizeResult } from './data';
import AppShell from './components/AppShell';
import LandingPage from './components/LandingPage';
import AnalyzePage from './components/AnalyzePage';
import ResultPage from './components/ResultPage';
import FinderPage from './components/FinderPage';
import Assistant from './components/Assistant';
import Conditions from './components/Conditions';

export default function App() {
  const [view, setView] = useState('landing');
  const [finderTab, setFinderTab] = useState('finder');
  const [analysis, setAnalysis] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  function openFinder(tab = 'finder') {
    setFinderTab(tab);
    setView('finder');
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

  if (view === 'landing') {
    return (
      <LandingPage
        onStart={() => setView('analyze')}
        onFindCare={() => openFinder('finder')}
        onBrowseConditions={() => setView('conditions')}
        onAssistant={() => setView('assistant')}
      />
    );
  }

  return (
    <AppShell
      view={view}
      activeNav={view === 'finder' ? finderTab : undefined}
      onNavigate={setView}
      onNewAnalysis={() => setView('analyze')}
      onOpenFinder={openFinder}
      onHome={() => setView('landing')}
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
