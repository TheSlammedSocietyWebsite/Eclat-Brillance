import { verifySession, parseCookie, SESSION_COOKIE } from './_lib/session';
import { getFileSha, putFile } from './_lib/github';

export const config = { runtime: 'edge' };

const MAX_CONTENT_BYTES = 900_000;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = parseCookie(req.headers.get('cookie'), SESSION_COOKIE);
  if (!token || !(await verifySession(token))) return json({ error: 'unauthorized' }, 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  const content = body.content;
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return json({ error: 'bad_request' }, 400);
  }
  if (Object.keys(content).length === 0) {
    return json({ error: 'empty_content' }, 400);
  }

  let serialized;
  try {
    serialized = `${JSON.stringify(content, null, 2)}\n`;
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (new TextEncoder().encode(serialized).length > MAX_CONTENT_BYTES) {
    return json({ error: 'too_large' }, 413);
  }

  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = process.env.CONTENT_PATH || 'public/content.json';

  try {
    let sha = await getFileSha(path, branch);
    let result = await putFile(path, branch, serialized, sha, 'NovaCMS: update content');

    if (!result.ok && result.status === 409) {
      sha = await getFileSha(path, branch);
      result = await putFile(path, branch, serialized, sha, 'NovaCMS: update content (retry)');
    }

    if (!result.ok) {
      if (result.status === 409) return json({ error: 'github_error' }, 409);
      if (result.status >= 500 || result.status === 408) {
        return json({ error: 'github_unavailable' }, 502);
      }
      return json({ error: 'github_error' }, 502);
    }

    return json({ ok: true, commitSha: result.commitSha }, 200);
  } catch (err) {
    console.error('save_failed', err);
    return json({ error: 'github_unavailable' }, 502);
  }
}
