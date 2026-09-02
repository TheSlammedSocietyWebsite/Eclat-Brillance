import { hashPassword, verifyPassword } from '../_lib/crypto';
import { verifySession, parseCookie, SESSION_COOKIE } from '../_lib/session';
import { redisGet, redisSet, isConfigured } from '../_lib/redis';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 4096;
const MAX_PASSWORD_BYTES = 256;
const MIN_PASSWORD_LENGTH = 8;

function json(body, status, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...(extraHeaders ?? {}) },
  });
}

export async function POST(req) {
  try {
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const lenHeader = req.headers.get('content-length');
    if (lenHeader && Number(lenHeader) > MAX_BODY_BYTES) {
      return json({ error: 'too_large' }, 413);
    }

    // Auth check
    const cookieHeader = req.headers.get('cookie') || '';
    const token = parseCookie(cookieHeader, SESSION_COOKIE);
    if (!token || !(await verifySession(token))) {
      return json({ error: 'unauthorized' }, 401);
    }

    if (!isConfigured()) {
      return json({ error: 'redis_unavailable' }, 503);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'bad_request' }, 400);
    }

    const { currentPassword, newPassword } = body;
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      currentPassword.length === 0 ||
      newPassword.length === 0
    ) {
      return json({ error: 'bad_request' }, 400);
    }

    if (new TextEncoder().encode(currentPassword).length > MAX_PASSWORD_BYTES ||
        new TextEncoder().encode(newPassword).length > MAX_PASSWORD_BYTES) {
      return json({ error: 'bad_request' }, 400);
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return json({ error: 'password_too_short', min: MIN_PASSWORD_LENGTH }, 400);
    }

    // Retrieve current hash
    let storedHash;
    try {
      storedHash = await redisGet('admin:password_hash');
    } catch {
      return json({ error: 'redis_unavailable' }, 503);
    }

    if (!storedHash) {
      // Fallback to env var (should not happen after migration)
      const envHash = process.env.ADMIN_PASSWORD_HASH;
      if (!envHash) return json({ error: 'server_misconfig' }, 500);
      // Verify against env hash and migrate if correct
      const ok = await verifyPassword(currentPassword, envHash);
      if (!ok) return json({ error: 'invalid_credentials' }, 401);
      const newHash = await hashPassword(newPassword);
      try {
        await redisSet('admin:password_hash', newHash);
      } catch {
        return json({ error: 'redis_unavailable' }, 503);
      }
      return json({ ok: true }, 200);
    }

    // Verify current password
    const ok = await verifyPassword(currentPassword, storedHash);
    if (!ok) {
      return json({ error: 'invalid_credentials' }, 401);
    }

    // Hash and store new password
    const newHash = await hashPassword(newPassword);
    try {
      await redisSet('admin:password_hash', newHash);
    } catch {
      return json({ error: 'redis_unavailable' }, 503);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('change_password_error', err);
    return json({ error: 'internal_error' }, 500);
  }
}
