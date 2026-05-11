import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'nova_session';
const ALG = 'HS256';
const EXP_SEC = 8 * 60 * 60;

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET not set');
  return new TextEncoder().encode(s);
}

function isProduction() {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}

export async function signSession() {
  return new SignJWT({})
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${EXP_SEC}s`)
    .sign(getSecret());
}

export async function verifySession(token) {
  try {
    await jwtVerify(token, getSecret(), { algorithms: [ALG], clockTolerance: '30s' });
    return true;
  } catch {
    return false;
  }
}

export function parseCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const k = part.slice(0, eq).trim();
    if (k === name) return part.slice(eq + 1).trim().replace(/^"|"$/g, '');
  }
  return null;
}

function cookieAttrs(maxAgeSec) {
  const secure = isProduction() ? '; Secure' : '';
  return `HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAgeSec}`;
}

export function buildCookie(token, maxAgeSec = EXP_SEC) {
  return `${SESSION_COOKIE}=${token}; ${cookieAttrs(maxAgeSec)}`;
}

export function clearCookie() {
  return `${SESSION_COOKIE}=; ${cookieAttrs(0)}`;
}
