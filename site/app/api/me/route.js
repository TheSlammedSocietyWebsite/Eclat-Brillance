import { verifySession, parseCookie, SESSION_COOKIE } from '../_lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(req) {
  if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
  const token = parseCookie(req.headers.get('cookie'), SESSION_COOKIE);
  if (!token) return json({ error: 'unauthorized' }, 401);
  const ok = await verifySession(token);
  if (!ok) return json({ error: 'unauthorized' }, 401);
  return json({ ok: true }, 200);
}
