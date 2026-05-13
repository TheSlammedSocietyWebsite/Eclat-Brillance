export const config = { runtime: 'edge' };

const STATS_PATH = 'site/public/stats.json';

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const branch = process.env.GITHUB_BRANCH || 'main';
  let visits = 0;
  let leads = 0;

  try {
    const rawUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/${branch}/${STATS_PATH}?t=${Date.now()}`;
    const res = await fetch(rawUrl, {
      credentials: 'omit',
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({ visits: 0 }));
      visits = data.visits || 0;
      leads = data.leads || 0;
    }
  } catch (err) {
    console.error('stats_read_failed', err);
  }

  return new Response(
    JSON.stringify({
      visits,
      leads,
      leadsNote: leads === 0 ? 'À venir — connectez un backend de formulaire' : undefined,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
