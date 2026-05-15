import { redisGet, isConfigured } from './_lib/redis';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let visits = 0;
  let leads = 0;

  if (isConfigured()) {
    try {
      const rawVisits = await redisGet('visits');
      visits = parseInt(rawVisits, 10) || 0;
    } catch (err) {
      console.error('stats_read_failed', err);
    }
    try {
      const rawLeads = await redisGet('leads');
      leads = parseInt(rawLeads, 10) || 0;
    } catch (err) {
      console.error('stats_read_failed', err);
    }
  }

  return new Response(
    JSON.stringify({
      visits,
      leads,
      leadsNote: !isConfigured() ? 'À venir — configurez Redis' : undefined,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
