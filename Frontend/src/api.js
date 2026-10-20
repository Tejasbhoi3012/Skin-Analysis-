const jsonOrNull = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}

export async function analyzeImage(file) {
  const form = new FormData();
  form.append('image', file);

  const res = await fetch('/api/analyze-image', { method: 'POST', body: form });
  const data = await jsonOrNull(res);

  if (!data) throw new Error('The server returned an invalid response.');
  if (!data.result) throw new Error(data.error || 'Analysis failed.');

  return {
    result: data.result,
    warning: data.success ? null : data.error || 'The AI model is unavailable. Showing fallback guidance.',
  };
}

export async function saveAnalysis({ imageName, result, notes, referToDerm }) {
  const res = await fetch('/api/analyses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageName, result, notes, referToDerm }),
  });
  const data = await jsonOrNull(res);
  if (!res.ok || !data?.success) throw new Error(data?.error || 'Could not save the analysis.');
  return data.analysis;
}

export async function listAnalyses() {
  const res = await fetch('/api/analyses');
  const data = await jsonOrNull(res);
  if (!res.ok || !data?.success) throw new Error(data?.error || 'Could not load history.');
  return data.analyses;
}

export async function deleteAnalysis(id) {
  const res = await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
  const data = await jsonOrNull(res);
  if (!res.ok || !data?.success) throw new Error(data?.error || 'Could not delete the analysis.');
  return true;
}

export async function askAssistant(prompt) {
  const res = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await jsonOrNull(res);
  if (!data?.text) throw new Error(data?.error || 'The assistant did not return a reply.');
  return {
    text: data.text,
    warning: data.success ? null : data.error || 'The AI model is unavailable. Showing fallback guidance.',
  };
}

export async function getConditions() {
  const res = await fetch('/common-conditions');
  const data = await jsonOrNull(res);
  if (!res.ok || !data?.success) throw new Error(data?.error || 'Could not load conditions.');
  return data.conditions;
}
