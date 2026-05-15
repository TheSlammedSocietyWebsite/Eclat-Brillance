export const config = { runtime: 'edge' };

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function redisIncr(key) {
  const res = await fetch(`${REDIS_URL}/incr/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`redis_incr ${res.status}`);
  const data = await res.json();
  return data.result;
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  if (!REDIS_URL || !REDIS_TOKEN) {
    return json({ error: 'redis_not_configured', count: 0 }, 503);
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'visits';
    const key = type === 'lead' ? 'leads' : 'visits';
    const count = await redisIncr(key);
    return json({ ok: true, count, type: key }, 200);
  } catch (err) {
    console.error('track_failed', err);
    return json({ error: 'failed' }, 500);
  }
}
