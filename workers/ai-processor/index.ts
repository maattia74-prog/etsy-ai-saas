interface Env {
  PUBLIC_BUCKET: R2Bucket;
  PRIVATE_BUCKET: R2Bucket;
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle AI processing requests
    if (url.pathname === '/process') {
      const body = await request.json();
      
      // Example: Run AI model
      const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct', {
        messages: body.messages,
      });

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
