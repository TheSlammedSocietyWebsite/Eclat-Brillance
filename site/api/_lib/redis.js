const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function isConfigured() {
  return !!REDIS_URL && !!REDIS_TOKEN;
}

async function redisFetch(path) {
  const res = await fetch(`${REDIS_URL}${path}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`redis_${res.status}`);
  return await res.json();
}

export async function redisGet(key) {
  const data = await redisFetch(`/get/${encodeURIComponent(key)}`);
  return data.result;
}

export async function redisSet(key, value) {
  const data = await redisFetch(`/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`);
  return data.result;
}

export async function redisIncr(key) {
  const data = await redisFetch(`/incr/${encodeURIComponent(key)}`);
  return data.result;
}

export { isConfigured };
