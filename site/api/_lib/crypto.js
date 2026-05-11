const enc = new TextEncoder();

async function pbkdf2(password, salt, iterations = 100_000, keyLen = 32) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations, hash: 'SHA-256' },
    keyMaterial,
    keyLen * 8
  );
  return btoa(String.fromCharCode(...new Uint8Array(derived)));
}

export async function hashPassword(password) {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = btoa(String.fromCharCode(...saltBytes));
  const hash = await pbkdf2(password, salt);
  return `pbkdf2:${salt}:${hash}`;
}

export async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;
  const [, salt, hash] = parts;
  const computed = await pbkdf2(password, salt);
  if (computed.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return diff === 0;
}
