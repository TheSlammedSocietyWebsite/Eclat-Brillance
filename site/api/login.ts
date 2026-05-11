import bcrypt from 'bcryptjs';
import { signSession, buildCookie } from './_lib/session';

export const config = { runtime: 'edge' };

const MAX_BODY_BYTES = 4096;
const BCRYPT_MAX_PASSWORD_BYTES = 72;

function json(body, status, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...(extraHeaders ?? {}) },
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const lenHeader = req.headers.get('content-length');
  if (lenHeader && Number(lenHeader) > MAX_BODY_BYTES) {
    return json({ error: 'too_large' }, 413);
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
  if (new TextEncoder().encode(pw).length > BCRYPT_MAX_PASSWORD_BYTES) {
    return json({ error: 'bad_request' }, 400);
  }

  let ok;
  try {
    ok = bcrypt.compareSync(pw, hash);
  } catch {
    return json({ error: 'server_misconfig' }, 500);
  }
  if (!ok) return json({ error: 'invalid_credentials' }, 401);

  const token = await signSession();
  return json({ ok: true }, 200, { 'Set-Cookie': buildCookie(token) });
}
