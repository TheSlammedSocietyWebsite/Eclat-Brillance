import { getFileSha, putFile } from './_lib/github.js';

export const config = { runtime: 'edge' };

const STATS_PATH = 'site/public/stats.json';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const branch = process.env.GITHUB_BRANCH || 'main';

  try {
    let sha = await getFileSha(STATS_PATH, branch);
    let stats = { visits: 0 };

    if (sha) {
      const rawUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/${branch}/${STATS_PATH}`;
      const res = await fetch(rawUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        stats = await res.json().catch(() => ({ visits: 0 }));
      }
    }

    stats.visits = (stats.visits || 0) + 1;
    const content = JSON.stringify(stats, null, 2);

    let result = await putFile(STATS_PATH, branch, content, sha, 'NovaCMS: track visit');
    if (!result.ok && result.status === 409) {
      sha = await getFileSha(STATS_PATH, branch);
      result = await putFile(STATS_PATH, branch, content, sha, 'NovaCMS: track visit (retry)');
    }

    if (!result.ok) return json({ error: 'github_error' }, 502);
    return json({ ok: true, visits: stats.visits }, 200);
  } catch (err) {
    console.error('track_failed', err);
    return json({ error: 'failed' }, 500);
  }
}
