export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  let visits = null;
  let vercelConfigured = !!(token && projectId);
  let vercelError = null;

  if (vercelConfigured) {
    try {
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date().toISOString().split('T')[0];
      const url = `https://api.vercel.com/v6/analytics?projectId=${encodeURIComponent(projectId)}&from=${from}&to=${to}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        visits = data?.data?.[0]?.pageviews ?? data?.pageviews ?? data?.total ?? null;
      } else {
        const text = await res.text().catch(() => '');
        vercelError = `HTTP ${res.status}`;
        console.error('vercel_analytics_error', res.status, text.slice(0, 200));
      }
    } catch (err) {
      vercelError = 'network';
      console.error('vercel_analytics_exception', err);
    }
  }

  return new Response(
    JSON.stringify({
      visits,
      vercelConfigured,
      vercelError,
      leads: 0,
      leadsNote: 'À venir — connectez un backend de formulaire',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
