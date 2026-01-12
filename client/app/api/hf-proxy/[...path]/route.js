// Catch-all proxy route for HuggingFace model files
// Proxies requests like /api/hf-proxy/Xenova/model/resolve/main/file.json
// to https://huggingface.co/Xenova/model/resolve/main/file.json

export async function GET(request, context) {
  const { path: pathSegments } = await context.params;
  const path = pathSegments.join('/');
  const targetUrl = `https://huggingface.co/${path}`;

  console.log('[HF Proxy] Fetching:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; XavantApp/1.0)',
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `HuggingFace returned ${response.status}` }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.arrayBuffer();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[HF Proxy] Error fetching:', targetUrl, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
