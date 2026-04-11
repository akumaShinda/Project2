// Cloudflare Worker for provider extraction and caching
// Deploy with: wrangler publish

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
}

async function handleCors(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  return new Response('Not Found', { status: 404 });
}

async function handleSearch(
  request: Request,
  env: Env
): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return new Response(
      JSON.stringify({ error: 'Query parameter required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check cache
  const cacheKey = `search:${query}`;
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Search and cache
  const results = JSON.stringify({
    query,
    results: [],
    timestamp: Date.now(),
  });

  await env.CACHE.put(cacheKey, results, { expirationTtl: 3600 });

  return new Response(results, {
    headers: {
      'Content-Type': 'application/json',
      'X-Cache': 'MISS',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handleSync(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.json() as Record<string, any>;
  const { userId, data } = body;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'userId required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Save to D1
  try {
    await env.DB.prepare(
      `INSERT INTO user_sync (user_id, data, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET data = ?, updated_at = datetime('now')`
    ).bind(userId, JSON.stringify(data), JSON.stringify(data)).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Sync saved' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: 'Sync failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // Routes
    if (path === '/search') {
      return handleSearch(request, env);
    }

    if (path === '/sync') {
      return handleSync(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};
