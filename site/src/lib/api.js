const FETCH_TIMEOUT_MS = 10_000;

async function safeFetch(input, init = {}) {
  try {
    return await fetch(input, {
      ...init,
      credentials: 'include',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

export async function login(password) {
  const res = await safeFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res) return { ok: false, error: 'network' };
  if (res.ok) return { ok: true };
  const j = await res.json().catch(() => ({}));
  return { ok: false, error: j.error ?? 'unknown' };
}

export async function logout() {
  await safeFetch('/api/logout', { method: 'POST' });
}

export async function me() {
  const res = await safeFetch('/api/me');
  return res?.ok ?? false;
}

export async function save(content) {
  const res = await safeFetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res) return { ok: false, error: 'network' };
  const j = await res.json().catch(() => ({}));
  if (res.ok && j.commitSha) return { ok: true, commitSha: j.commitSha };
  return { ok: false, error: j.error ?? 'unknown' };
}

export async function fetchContent() {
  const res = await safeFetch(`/content.json?t=${Date.now()}`, { credentials: 'omit' });
  if (!res || !res.ok) return null;
  return await res.json().catch(() => null);
}

export async function uploadMedia(filename, content, contentType) {
  const res = await safeFetch('/api/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content, contentType }),
  });
  if (!res) return { ok: false, error: 'network' };
  const j = await res.json().catch(() => ({}));
  if (res.ok && j.url) return { ok: true, url: j.url };
  return { ok: false, error: j.error ?? 'unknown' };
}

export async function rollback() {
  const res = await safeFetch('/api/rollback', { method: 'POST' });
  if (!res) return { ok: false, error: 'network' };
  const j = await res.json().catch(() => ({}));
  if (res.ok && j.commitSha) return { ok: true, commitSha: j.commitSha };
  return { ok: false, error: j.error ?? 'unknown' };
}
