import { verifyPassword } from './_lib/crypto';
import { signSession, buildCookie } from './_lib/session';
import { isRateLimited, recordFailure, recordSuccess, getClientIp } from './_lib/ratelimit';

export const config = { runtime: 'edge' };

const MAX_BODY_BYTES = 4096;
const MAX_PASSWORD_BYTES = 256;

function json(body, status, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...(extraHeaders ?? {}) },
  });
}

export default async function handler(req) {
  try {
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const lenHeader = req.headers.get('content-length');
    if (lenHeader && Number(lenHeader) > MAX_BODY_BYTES) {
      return json({ error: 'too_large' }, 413);
    }

    const ip = getClientIp(req);
    const limit = isRateLimited(ip);
    if (limit.limited) {
      return json({ error: 'rate_limited', retryAfter: limit.retryAfterSec }, 429, {
        'Retry-After': String(limit.retryAfterSec),
      });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) return json({ error: 'server_misconfig' }, 500);

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'bad_request' }, 400);
    }
    const pw = body.password;
    if (typeof pw !== 'string' || pw.length === 0) return json({ error: 'bad_request' }, 400);
    if (new TextEncoder().encode(pw).length > MAX_PASSWORD_BYTES) {
      return json({ error: 'bad_request' }, 400);
    }

    let ok;
    try {
      ok = await verifyPassword(pw, hash);
    } catch {
      return json({ error: 'server_misconfig' }, 500);
    }
    if (!ok) {
      recordFailure(ip);
      return json({ error: 'invalid_credentials' }, 401);
    }

    recordSuccess(ip);
    const token = await signSession();
    return json({ ok: true }, 200, { 'Set-Cookie': buildCookie(token) });
  } catch (err) {
    console.error('login_error', err);
    return json({ error: 'internal_error' }, 500);
  }
}
