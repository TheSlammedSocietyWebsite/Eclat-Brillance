import { redisIncr, isConfigured } from '../_lib/redis';

export const runtime = 'nodejs';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  if (!isConfigured()) {
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
