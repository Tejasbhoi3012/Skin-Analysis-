const STORAGE_KEY = 'dermascan.session';

const jsonOrNull = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export function readSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token && session?.user ? session : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* storage may be unavailable in private browsing */
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getToken() {
  return readSession()?.token || null;
}

export function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export async function authFetch(url, options = {}) {
  const headers = authHeaders(options.headers || {});
  return fetch(url, { ...options, headers });
}

async function submitAuth(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running.');
  }

  const data = await jsonOrNull(res);
  if (!res.ok || !data?.success) {
    const error = new Error(data?.error || 'Something went wrong. Please try again.');
    error.fieldErrors = data?.errors || null;
    error.status = res.status;
    throw error;
  }
  return data;
}

function persist(data) {
  const session = { token: data.token, user: data.user };
  writeSession(session);
  return session;
}

export async function registerAccount({ name, email, password }) {
  return persist(await submitAuth('/api/auth/register', { name, email, password }));
}

export async function loginAccount({ email, password }) {
  return persist(await submitAuth('/api/auth/login', { email, password }));
}

export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await authFetch('/api/auth/me');
    if (res.status === 401) {
      clearSession();
      return null;
    }
    const data = await jsonOrNull(res);
    if (!res.ok || !data?.success) return null;
    const session = { token, user: data.user };
    writeSession(session);
    return session;
  } catch {
    return null;
  }
}

export function signOut() {
  clearSession();
}
