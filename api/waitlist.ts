/**
 * Forwards waitlist submissions to the configured webhook server-side.
 *
 * Two reasons this exists rather than POSTing from the browser:
 *  1. GoHighLevel inbound webhooks commonly fail CORS preflight.
 *  2. A VITE_-prefixed URL is baked into the public bundle, so anyone could
 *     read it and spam the CRM. WAITLIST_WEBHOOK_URL (no VITE_ prefix) stays
 *     server-side.
 *
 * Set WAITLIST_WEBHOOK_URL in the Vercel project's environment variables.
 */

interface RequestLike {
  method?: string;
  body?: unknown;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const endpoint = process.env.WAITLIST_WEBHOOK_URL;
  if (!endpoint) {
    console.error('[waitlist] WAITLIST_WEBHOOK_URL is not set');
    res.status(500).json({ error: 'Waitlist destination is not configured' });
    return;
  }

  // Vercel parses JSON bodies for us, but be tolerant of a raw string.
  let payload: unknown = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  }

  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ error: 'Missing body' });
    return;
  }

  const email = (payload as Record<string, unknown>).email;
  if (typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email is required' });
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      // Log the upstream detail, return something generic. The visitor can't
      // act on a GHL status code.
      console.error('[waitlist] upstream rejected', upstream.status, await upstream.text());
      res.status(502).json({ error: 'Could not reach the waitlist service' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[waitlist] forward failed', error);
    res.status(502).json({ error: 'Could not reach the waitlist service' });
  } finally {
    clearTimeout(timer);
  }
}
