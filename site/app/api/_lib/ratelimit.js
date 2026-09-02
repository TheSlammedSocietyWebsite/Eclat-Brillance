const store = new Map();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function nowMs() {
  return Date.now();
}

function cleanup() {
  const t = nowMs();
  const toDelete = [];
  store.forEach((entry, ip) => {
    if (entry.lockedUntil < t && entry.firstAttempt + WINDOW_MS < t) {
      toDelete.push(ip);
    }
  });
  for (const ip of toDelete) {
    store.delete(ip);
  }
}

let lastCleanup = 0;
function maybeCleanup() {
  const t = nowMs();
  if (t - lastCleanup > 60_000) {
    lastCleanup = t;
    cleanup();
  }
}

export function isRateLimited(ip) {
  maybeCleanup();
  const entry = store.get(ip);
  if (!entry) return { limited: false, retryAfterSec: 0 };

  const t = nowMs();
  if (entry.lockedUntil > t) {
    return { limited: true, retryAfterSec: Math.ceil((entry.lockedUntil - t) / 1000) };
  }

  if (entry.firstAttempt + WINDOW_MS < t) {
    store.delete(ip);
    return { limited: false, retryAfterSec: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = t + LOCKOUT_MS;
    return { limited: true, retryAfterSec: Math.ceil(LOCKOUT_MS / 1000) };
  }

  return { limited: false, retryAfterSec: 0 };
}

export function recordFailure(ip) {
  maybeCleanup();
  const t = nowMs();
  const entry = store.get(ip);
  if (!entry) {
    store.set(ip, { count: 1, firstAttempt: t, lockedUntil: 0 });
    return;
  }
  if (entry.firstAttempt + WINDOW_MS < t) {
    store.set(ip, { count: 1, firstAttempt: t, lockedUntil: 0 });
    return;
  }
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = t + LOCKOUT_MS;
  }
}

export function recordSuccess(ip) {
  store.delete(ip);
}

export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}
