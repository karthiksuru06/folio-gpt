export const config = { runtime: 'edge' }

export default function handler() {
  return new Response(
    JSON.stringify({
      ok: true,
      chat: Boolean(process.env.OPENROUTER_API_KEY),
      rag: Boolean(process.env.HUGGINGFACE_API_KEY && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      botCheck: Boolean(process.env.TURNSTILE_SECRET),
      sharedRateLimit: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    }),
    { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
  )
}
