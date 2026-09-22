// src/lib/rezdy.ts
// Server-side Rezdy API integration & product mapping.
// Keeps REZDY_API_KEY and all Rezdy product codes strictly on the server.

const REZDY_BASE = 'https://api.rezdy.com/v1';

export interface RezdyProductDef {
  slug: string;
  name: string;
  envKey: 'REZDY_GENERAL_ENTRY_CODE' | 'REZDY_AVIATION_COMBO_CODE' | 'REZDY_CROC_HISTORY_CODE' | 'REZDY_CROC_HISTORY_EXPLORER_CODE';
  fallbackCode: string;
  fallbackCheckoutUrl: string;
  isAllDay?: boolean;
  defaultTiers: Array<{
    code: string;
    label: string;
    price: number;
    note?: string;
    max?: number;
  }>;
}

export const REZDY_PRODUCTS: Record<string, RezdyProductDef> = {
  'general-entry': {
    slug: 'general-entry',
    name: 'General Entry',
    envKey: 'REZDY_GENERAL_ENTRY_CODE',
    fallbackCode: 'PB1VKD',
    fallbackCheckoutUrl: 'https://rfdsdarwin1.rezdy.com/433258/rfds-darwin-tourist-facility-general-entry',
    isAllDay: false,
    defaultTiers: [
      { code: 'adult', label: 'Adult', price: 30, max: 20 },
      { code: 'child', label: 'Child', price: 18, note: 'Ages 5–15', max: 20 },
      { code: 'concession', label: 'Senior / Concession', price: 26, note: 'With proof', max: 20 },
      { code: 'family', label: 'Family', price: 90, note: '2 adults + 3 children', max: 10 },
    ],
  },
  'aviation-combo': {
    slug: 'aviation-combo',
    name: 'Aviation Combo',
    envKey: 'REZDY_AVIATION_COMBO_CODE',
    fallbackCode: 'PR6UUK',
    fallbackCheckoutUrl: 'https://rfdsdarwin1.rezdy.com/433269/aviation-attraction-combo-ticket',
    isAllDay: true,
    defaultTiers: [
      { code: 'adult', label: 'Adult', price: 47, max: 20 },
      { code: 'child', label: 'Child', price: 23, max: 20 },
      { code: 'senior', label: 'Senior / Student', price: 34, note: 'With proof', max: 20 },
      { code: 'family', label: 'Family of 5', price: 118, max: 10 },
    ],
  },
  'croc-n-history': {
    slug: 'croc-n-history',
    name: 'Croc N History',
    envKey: 'REZDY_CROC_HISTORY_CODE',
    fallbackCode: 'P2Q41Q',
    fallbackCheckoutUrl: 'https://rfdsdarwin1.rezdy.com/433980/croc-n-history-ticket',
    isAllDay: true,
    defaultTiers: [
      { code: 'adult', label: 'Adult', price: 70, max: 20 },
      { code: 'senior', label: 'Senior', price: 58, note: 'With proof', max: 20 },
      { code: 'child', label: 'Child', price: 44, max: 20 },
    ],
  },
  'croc-explorer': {
    slug: 'croc-explorer',
    name: 'Croc N History Explorer',
    envKey: 'REZDY_CROC_HISTORY_EXPLORER_CODE',
    fallbackCode: 'PWVVGE',
    fallbackCheckoutUrl: 'https://rfdsdarwin1.rezdy.com/435215/croc-n-history-explorer-ticket',
    isAllDay: true,
    defaultTiers: [
      { code: 'adult', label: 'Adult', price: 118, max: 20 },
      { code: 'senior', label: 'Senior', price: 100, note: 'With proof', max: 20 },
      { code: 'child', label: 'Child', price: 75, max: 20 },
    ],
  },
};

// Aliases for slug normalization
const SLUG_ALIASES: Record<string, string> = {
  'croc-n-history-explorer': 'croc-explorer',
  'croc-history-explorer': 'croc-explorer',
  'crocn-history-explorer': 'croc-explorer',
  'croc-history': 'croc-n-history',
  'general': 'general-entry',
  'aviation': 'aviation-combo',
};

export function resolveProductDef(queryOrSlug?: string | null): RezdyProductDef {
  const raw = (queryOrSlug || '').trim().toLowerCase();
  const canonicalSlug = SLUG_ALIASES[raw] || raw;
  if (REZDY_PRODUCTS[canonicalSlug]) {
    return REZDY_PRODUCTS[canonicalSlug];
  }

  // Also allow resolving by fallback product codes (server-side only)
  for (const def of Object.values(REZDY_PRODUCTS)) {
    if (def.fallbackCode.toLowerCase() === raw) return def;
    const envVal = process.env[def.envKey];
    if (envVal && envVal.trim().toLowerCase() === raw) return def;
  }

  // Default to general entry if unspecified or unrecognized
  return REZDY_PRODUCTS['general-entry'];
}

export function getProductCode(def: RezdyProductDef): string {
  const envVal = process.env[def.envKey];
  if (envVal && envVal.trim()) {
    return envVal.trim();
  }
  if (def.slug === 'general-entry') {
    const legacy = process.env.REZDY_PRODUCT_CODE;
    if (legacy && legacy.trim()) return legacy.trim();
  }
  return def.fallbackCode;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function ymd(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function mockSessionsForProduct(def: RezdyProductDef) {
  const out = [];
  const today = new Date();
  const times = def.isAllDay ? ['00:00'] : ['09:30', '11:00', '13:00', '14:30'];

  for (let i = 1; i <= 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Closed on Christmas Day (Dec 25)
    if (d.getMonth() === 11 && d.getDate() === 25) continue;
    const dateStr = ymd(d);
    times.forEach((t, j) => {
      out.push({
        id: `${dateStr}-${t}`,
        date: dateStr,
        time: t,
        seatsAvailable: def.isAllDay ? 50 : Math.max(0, 40 - ((i + j) % 9) * 4),
      });
    });
  }
  return out;
}

function sanitiseSessions(sessions: any[]) {
  return (sessions || []).map((s) => {
    const local = s.startTimeLocal || s.startTime || '';
    const [date, timeRaw] = String(local).split(' ');
    return {
      id: String(s.id ?? `${date}-${timeRaw}`),
      date: date || '',
      time: (timeRaw || '').slice(0, 5),
      seatsAvailable: s.seatsAvailable ?? s.seats ?? null,
    };
  });
}

// In-memory caching
interface CacheEntry<T> {
  data: T;
  expires: number;
}
const cache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T, ttlMs = 300_000) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

// Fetch single product details from Rezdy
export async function getProductDetails(def: RezdyProductDef) {
  const apiKey = process.env.REZDY_API_KEY;
  const cacheKey = `product:${def.slug}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  if (!apiKey) {
    const result = {
      slug: def.slug,
      name: def.name,
      checkoutUrl: def.fallbackCheckoutUrl,
      tiers: def.defaultTiers,
      lead: def.slug === 'general-entry' 
        ? { label: 'Family Pass', price: def.defaultTiers.find((t) => t.code === 'family')?.price || 90 }
        : { label: 'Adult', price: def.defaultTiers[0]?.price || 30 },
      isLive: false,
    };
    return result;
  }

  const productCode = getProductCode(def);
  try {
    const res = await fetch(`${REZDY_BASE}/products/${encodeURIComponent(productCode)}?apiKey=${encodeURIComponent(apiKey)}`);
    if (!res.ok) throw new Error(`Rezdy ${res.status}`);
    const data = await res.json();
    const p = data.product || {};

    const checkoutUrl = p.bookingUrl || def.fallbackCheckoutUrl;
    let tiers = def.defaultTiers;

    if (Array.isArray(p.priceOptions) && p.priceOptions.length > 0) {
      tiers = p.priceOptions.map((opt: any) => {
        const label = opt.label || 'Ticket';
        const lower = label.toLowerCase();
        let code = 'adult';
        if (lower.includes('child')) code = 'child';
        else if (lower.includes('concession') || lower.includes('senior') || lower.includes('student')) code = 'concession';
        else if (lower.includes('family')) code = 'family';
        else code = String(opt.id || label.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

        const matchingDefault = def.defaultTiers.find((d) => d.code === code || d.label.toLowerCase() === label.toLowerCase());
        return {
          code,
          label,
          price: Number(opt.price || 0),
          note: matchingDefault?.note || opt.description || undefined,
          max: matchingDefault?.max || 20,
        };
      });
    }

    let lead;
    if (def.slug === 'general-entry') {
      const familyTier = tiers.find((t) => t.code === 'family') || tiers[0];
      lead = { label: familyTier?.label || 'Family Pass', price: familyTier?.price || 90 };
    } else {
      const adultTier = tiers.find((t) => t.code === 'adult') || tiers[0];
      lead = { label: adultTier?.label || 'Adult', price: adultTier?.price || 30 };
    }

    const result = {
      slug: def.slug,
      name: p.name || def.name,
      checkoutUrl,
      tiers,
      lead,
      isLive: true,
    };

    setCached(cacheKey, result, 300_000); // 5 min TTL
    return result;
  } catch (err: any) {
    console.warn(`[Rezdy] Failed to fetch product details for ${def.slug} (${productCode}):`, err.message);
    const result = {
      slug: def.slug,
      name: def.name,
      checkoutUrl: def.fallbackCheckoutUrl,
      tiers: def.defaultTiers,
      lead: def.slug === 'general-entry' 
        ? { label: 'Family Pass', price: def.defaultTiers.find((t) => t.code === 'family')?.price || 90 }
        : { label: 'Adult', price: def.defaultTiers[0]?.price || 30 },
      isLive: false,
    };
    return result;
  }
}

// Fetch availability & sessions for a product
export async function getProductAvailability(def: RezdyProductDef) {
  const apiKey = process.env.REZDY_API_KEY;
  const productCode = getProductCode(def);
  const cacheKey = `avail:${def.slug}:${productCode}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const details = await getProductDetails(def);

  if (!apiKey) {
    const result = {
      mock: true,
      reason: 'no-key',
      productSlug: def.slug,
      productName: def.name,
      sessions: mockSessionsForProduct(def),
      tiers: details.tiers,
      lead: details.lead,
      checkoutUrl: details.checkoutUrl,
    };
    return result;
  }

  try {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 30);

    const url = `${REZDY_BASE}/availability?productCode=${encodeURIComponent(productCode)}` +
      `&startTimeLocal=${ymd(today)}%2000:00:00&endTimeLocal=${ymd(end)}%2023:59:59&apiKey=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url);
    if (!r.ok) throw new Error(`Rezdy ${r.status}`);
    const data = await r.json();

    const result = {
      mock: false,
      productSlug: def.slug,
      productName: details.name,
      sessions: sanitiseSessions(data.sessions),
      tiers: details.tiers,
      lead: details.lead,
      checkoutUrl: details.checkoutUrl,
    };

    setCached(cacheKey, result, 180_000); // 3 min TTL for live availability
    return result;
  } catch (err: any) {
    console.warn(`[Rezdy] Failed to fetch live availability for ${def.slug} (${productCode}):`, err.message);
    return {
      mock: true,
      reason: String(err.message || 'upstream'),
      productSlug: def.slug,
      productName: details.name,
      sessions: mockSessionsForProduct(def),
      tiers: details.tiers,
      lead: details.lead,
      checkoutUrl: details.checkoutUrl,
    };
  }
}
