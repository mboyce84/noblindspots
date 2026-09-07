/**
 * Waitlist submission.
 *
 * The destination is pluggable on purpose: pick an adapter with
 * VITE_WAITLIST_MODE and nothing in the UI has to change. Adding a
 * Supabase adapter later means adding a function here, not touching a
 * component.
 */

/** The DM funnel's qualifier, verbatim. The wording is the pitch — don't paraphrase. */
export type NumbersLocation = 'crm' | 'spreadsheet' | 'both-mismatched' | 'nowhere';
export type RevenueBand = 'under-100k' | '100k-250k' | '250k-1m' | 'over-1m';

export interface WaitlistInput {
  email: string;
  numbersLocation: NumbersLocation | '';
  revenueBand: RevenueBand | '';
  firstName: string;
  /** Honeypot. Must stay empty — bots fill it, humans never see it. */
  company: string;
}

/**
 * Flat and snake_case on purpose: GHL inbound webhooks map top-level JSON
 * keys onto contact fields and handle nested objects badly. Zapier, Make and
 * Formspree are all happy with the same shape.
 */
export interface WaitlistPayload {
  email: string;
  first_name: string;
  numbers_location: string;
  /** Human-readable label so the CRM record is legible without a decoder ring. */
  numbers_location_label: string;
  revenue_band: string;
  source: string;
  form_name: string;
  submitted_at: string;
  page_url: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  /** Meta click id — this page is the destination for IG/FB DM traffic. */
  fbclid: string;
}

export type WaitlistResult = { ok: true } | { ok: false; message: string };

export const NUMBERS_LOCATION_OPTIONS: { value: NumbersLocation; label: string }[] = [
  { value: 'crm', label: 'In my CRM (GoHighLevel or similar)' },
  { value: 'spreadsheet', label: 'In a spreadsheet' },
  { value: 'both-mismatched', label: "Both — and they don't match" },
  { value: 'nowhere', label: 'Honestly? Nowhere' },
];

export const REVENUE_BAND_OPTIONS: { value: RevenueBand; label: string }[] = [
  { value: 'under-100k', label: 'Under $100K/yr' },
  { value: '100k-250k', label: '$100K – $250K/yr' },
  { value: '250k-1m', label: '$250K – $1M/yr' },
  { value: 'over-1m', label: 'Over $1M/yr' },
];

// ---------------------------------------------------------------- validation

export type WaitlistErrors = Partial<Record<'email' | 'numbersLocation', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateWaitlist(input: WaitlistInput): WaitlistErrors {
  const errors: WaitlistErrors = {};

  if (!input.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = 'That email looks off.';
  }

  if (!input.numbersLocation) {
    errors.numbersLocation = 'Pick the closest one.';
  }

  return errors;
}

export function createEmptyInput(): WaitlistInput {
  return { email: '', numbersLocation: '', revenueBand: '', firstName: '', company: '' };
}

// ------------------------------------------------------------------ payload

function buildPayload(input: WaitlistInput): WaitlistPayload {
  const params = new URLSearchParams(window.location.search);
  const option = NUMBERS_LOCATION_OPTIONS.find((o) => o.value === input.numbersLocation);

  return {
    email: input.email.trim().toLowerCase(),
    first_name: input.firstName.trim(),
    numbers_location: input.numbersLocation,
    numbers_location_label: option?.label ?? '',
    revenue_band: input.revenueBand,
    source: 'noblindspots-landing',
    form_name: 'founding-waitlist',
    submitted_at: new Date().toISOString(),
    page_url: window.location.href,
    referrer: document.referrer || '',
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_content: params.get('utm_content') ?? '',
    utm_term: params.get('utm_term') ?? '',
    fbclid: params.get('fbclid') ?? '',
  };
}

// ----------------------------------------------------------------- adapters

type Adapter = (payload: WaitlistPayload) => Promise<WaitlistResult>;

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;

/**
 * Production defaults to `proxy` rather than `console`. A console-mode form in
 * production would show a success state while silently dropping real signups,
 * which is the worst possible failure for a page you are buying traffic to.
 * With `proxy`, an unconfigured deployment returns an honest error until
 * WAITLIST_WEBHOOK_URL is set on the server.
 */
const MODE =
  (import.meta.env.VITE_WAITLIST_MODE as string | undefined) ??
  (ENDPOINT ? 'webhook' : 'proxy');

const GENERIC_ERROR =
  "That didn't go through. Please try again in a moment.";

async function postJson(url: string, payload: WaitlistPayload): Promise<WaitlistResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    // Note: deliberately not using mode:'no-cors'. An opaque response can't be
    // distinguished from a failure, which would mean showing success states for
    // submissions that were silently dropped.
    return res.ok ? { ok: true } : { ok: false, message: GENERIC_ERROR };
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Dev only. Succeeds so the page is buildable before a destination exists.
 * Refuses in production: a fake success there loses real signups.
 */
const consoleAdapter: Adapter = async (payload) => {
  if (import.meta.env.PROD) {
    console.error('[waitlist] console mode in production — refusing to fake a success');
    return { ok: false, message: GENERIC_ERROR };
  }
  console.info('[waitlist] no endpoint configured — would have submitted:', payload);
  return { ok: true };
};

/** Direct browser POST: GHL inbound webhook, Zapier catch hook, Make, Formspree. */
const webhookAdapter: Adapter = (payload) =>
  ENDPOINT ? postJson(ENDPOINT, payload) : Promise.resolve({ ok: false, message: GENERIC_ERROR });

/**
 * Same-origin Vercel function that forwards server-side. Use this when the
 * destination blocks CORS, or to keep the webhook URL out of the public bundle
 * (VITE_ vars are readable by anyone who views source).
 */
const proxyAdapter: Adapter = (payload) => postJson('/api/waitlist', payload);

const ADAPTERS: Record<string, Adapter> = {
  console: consoleAdapter,
  webhook: webhookAdapter,
  proxy: proxyAdapter,
};

/**
 * The single seam. To change destinations, add an adapter above and flip
 * VITE_WAITLIST_MODE — no component changes.
 */
export async function submitWaitlist(input: WaitlistInput): Promise<WaitlistResult> {
  if (input.company.trim() !== '') {
    return { ok: true }; // honeypot tripped: silent success, nothing sent
  }
  const adapter = ADAPTERS[MODE] ?? consoleAdapter;
  return adapter(buildPayload(input));
}

