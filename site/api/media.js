import { verifySession, parseCookie, SESSION_COOKIE } from './_lib/session';
import { getFileSha, putFile } from './_lib/github';

export const config = { runtime: 'edge' };

const MAX_MEDIA_BYTES = 2_000_000; // ~2MB base64 max
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidFilename(name) {
  return /^[a-zA-Z0-9_-]+\.(jpe?g|png|webp|gif)$/.test(name);
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

  const filename = body.filename;
  const content = body.content;
  const contentType = body.contentType;

  if (
    typeof filename !== 'string' ||
    typeof content !== 'string' ||
    typeof contentType !== 'string' ||
    !isValidFilename(filename) ||
    !ALLOWED_TYPES.includes(contentType)
  ) {
    return json({ error: 'bad_request' }, 400);
  }

  const decoded = atob(content);
  if (decoded.length > MAX_MEDIA_BYTES) {
    return json({ error: 'too_large' }, 413);
  }

  const branch = process.env.GITHUB_BRANCH || 'main';
  const mediaPath = `public/media/${filename}`;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  try {
    const sha = await getFileSha(mediaPath, branch);
    const result = await putFile(mediaPath, branch, content, sha, `NovaCMS: upload media ${filename}`);

    if (!result.ok) {
      if (result.status >= 500 || result.status === 408) {
        return json({ error: 'github_unavailable' }, 502);
      }
      return json({ error: 'github_error' }, 502);
    }

    const url = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${mediaPath}`;
    return json({ ok: true, url }, 200);
  } catch (err) {
    console.error('media_upload_failed', err);
    return json({ error: 'github_unavailable' }, 502);
  }
}
