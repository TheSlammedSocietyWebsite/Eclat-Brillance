import { verifyPassword } from './_lib/crypto';
import { signSession, buildCookie } from './_lib/session';
import { isRateLimited, recordFailure, recordSuccess, getClientIp } from './_lib/ratelimit';
import { redisGet, redisSet, isConfigured } from './_lib/redis';

export const config = { runtime: 'edge' };

const MAX_BODY_BYTES = 4096;
const MAX_PASSWORD_BYTES = 256;

function json(body, status, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...(extraHeaders ?? {}) },
  });
}

async function getAdminPasswordHash() {
  if (isConfigured()) {
    try {
      const hash = await redisGet('admin:password_hash');
      if (hash) return hash;
    } catch {
      // Redis indisponible, fallback sur env var
    }
  }

  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (!envHash) return null;

  // Migration automatique vers Redis si disponible
  if (isConfigured()) {
    try {
      await redisSet('admin:password_hash', envHash);
    } catch {
      // Ignorer si Redis non disponible
    }
  }

  return envHash;
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

    const hash = await getAdminPasswordHash();
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
