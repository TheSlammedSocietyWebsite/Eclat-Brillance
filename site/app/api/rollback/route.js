import { verifySession, parseCookie, SESSION_COOKIE } from '../_lib/session';
import { getFileSha, putFile, encodePath } from '../_lib/github';

export const runtime = 'nodejs';

const FETCH_TIMEOUT_MS = 10_000;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

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

// atob() decodes to Latin1, not UTF-8. This helper properly decodes base64 → UTF-8.
function base64ToUtf8(s) {
  const binary = atob(s);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export async function POST(req) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = parseCookie(req.headers.get('cookie'), SESSION_COOKIE);
  if (!token || !(await verifySession(token))) return json({ error: 'unauthorized' }, 401);

  const branch = process.env.GITHUB_BRANCH || 'master';
  const path = process.env.CONTENT_PATH || 'site/public/content.json';

  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO_OWNER || !process.env.GITHUB_REPO_NAME) {
    return json({ error: 'server_misconfig' }, 500);
  }

  try {
    // 1. Get last 2 commits for the file
    const commitsRes = await fetch(
      `${repoBase()}/commits?path=${encodePath(path)}&sha=${encodeURIComponent(branch)}&per_page=2`,
      {
        headers: ghHeaders(),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      },
    );
    if (!commitsRes.ok) {
      return json({ error: 'github_unavailable' }, 502);
    }
    const commits = await commitsRes.json();
    if (commits.length < 2) {
      return json({ error: 'no_history' }, 400);
    }

    const previousCommitSha = commits[1].sha;

    // 2. Get file content at previous commit
    const contentRes = await fetch(
      `${repoBase()}/contents/${encodePath(path)}?ref=${encodeURIComponent(previousCommitSha)}`,
      {
        headers: ghHeaders(),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      },
    );
    if (!contentRes.ok) {
      return json({ error: 'github_unavailable' }, 502);
    }
    const contentJson = await contentRes.json();
    if (!contentJson.content || contentJson.encoding !== 'base64') {
      return json({ error: 'github_error' }, 502);
    }
    const previousContent = base64ToUtf8(contentJson.content.replace(/\n/g, ''));

    // 3. Get current file sha for the branch
    const currentSha = await getFileSha(path, branch);

    // 4. Commit the revert
    const result = await putFile(
      path,
      branch,
      previousContent,
      currentSha,
      'NovaCMS: rollback to previous version',
    );

    if (!result.ok) {
      if (result.status >= 500 || result.status === 408) {
        return json({ error: 'github_unavailable' }, 502);
      }
      return json({ error: 'github_error' }, 502);
    }

    return json({ ok: true, commitSha: result.commitSha }, 200);
  } catch (err) {
    console.error('rollback_failed', err);
    return json({ error: 'github_unavailable' }, 502);
  }
}
