const FETCH_TIMEOUT_MS = 8000;

function ghHeaders() {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error('GITHUB_TOKEN not set');
  return {
    Authorization: `Bearer ${t}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'NovaCMS',
  };
}

function repoBase() {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) throw new Error('GITHUB_REPO_OWNER / GITHUB_REPO_NAME not set');
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

function utf8ToBase64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

async function readErrorBody(res) {
  try {
    const text = await res.text();
    return text.length > 500 ? `${text.slice(0, 500)}…` : text;
  } catch {
    return '';
  }
}

export async function getFileSha(path, branch) {
  const url = `${repoBase()}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: ghHeaders(),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await readErrorBody(res);
    throw new Error(`getFileSha ${res.status}: ${detail}`);
  }
  const j = await res.json();
  if (Array.isArray(j)) throw new Error('getFileSha: path is a directory');
  if (j && typeof j === 'object' && 'sha' in j && typeof j.sha === 'string') {
    return j.sha;
  }
  return null;
}

export async function putFile(path, branch, content, sha, message) {
  const url = `${repoBase()}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    content: utf8ToBase64(content),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    const detail = await readErrorBody(res);
    console.error(`putFile ${res.status}: ${detail}`);
    return { ok: false, status: res.status };
  }
  const j = await res.json();
  if (!j.commit?.sha) return { ok: false, status: 502 };
  return { ok: true, commitSha: j.commit.sha };
}
