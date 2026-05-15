export const config = { runtime: 'edge' };

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const res = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`redis_get ${res.status}`);
  const data = await res.json();
  return data.result;
}

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let visits = 0;
  let leads = 0;

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const raw = await redisGet('visits');
      visits = parseInt(raw, 10) || 0;
    } catch (err) {
      console.error('stats_read_failed', err);
    }
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
