// Sample data for dashboard demonstrations.
//
// Two rules this file follows, both of which it used to break:
//
// 1. DETERMINISTIC. Values are derived from a seeded hash, not Math.random().
//    generateMockData() is called in Dashboard's render body with no memo, so
//    random values re-rolled on every re-render — toggling Daily/Weekly/Monthly
//    changed every number on screen. For a product whose pitch is trustworthy
//    numbers, that was the worst possible demo behaviour.
//
// 2. INTERNALLY CONSISTENT. Dependent metrics are derived from their base
//    rather than rolled independently, so the funnel actually reconciles and
//    tracks the benchmarks the curriculum teaches: 25% lead-to-booked,
//    70% booked-to-showed, 25% showed-to-closed.

/** Benchmarks from the curriculum. The demo should quietly demonstrate them. */
const CONVERSATION_RATE = 0.28; // dials -> meaningful conversations
const LEAD_TO_BOOKED = 0.25;
const BOOKED_TO_SHOWED = 0.7;
const SHOWED_TO_CLOSED = 0.25;
const AVG_DEAL = 3500;

/**
 * Deterministic 0..1 from a string key (FNV-1a). The same key always returns
 * the same value, so the dashboard is stable across renders and reloads while
 * still looking varied.
 */
const seeded = (key: string): number => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
};

/** Deterministic integer in [min, min + range). */
const pick = (key: string, range: number, min: number): number =>
  Math.floor(seeded(key) * range) + min;

/** Applies a small deterministic wobble (±pct) so derived series aren't flat. */
const vary = (key: string, value: number, pct = 0.12): number => {
  const offset = (seeded(key) - 0.5) * 2 * pct;
  return Math.max(0, Math.round(value * (1 + offset)));
};

export const generateMockData = (role: string) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const last4Weeks = Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`);
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date.toLocaleDateString('en-US', { month: 'short' });
  });

  // Deliberately generic. These render on a dashboard that is publicly
  // reachable from the landing page, so no real person's name belongs here.
  const phoneSetterNames = ['Setter A', 'Setter B', 'Setter C', 'Setter D', 'Setter E'];

  /** One phone-setter row, with the whole funnel derived from dials. */
  const phoneRow = (name: string, key: string, dialBase: number, dialRange: number) => {
    const dials = pick(`${key}-dials`, dialRange, dialBase);
    const conversations = vary(`${key}-conv`, dials * CONVERSATION_RATE);
    const sets = Math.max(1, vary(`${key}-sets`, conversations * LEAD_TO_BOOKED));
    const setsShown = Math.min(sets, Math.max(0, vary(`${key}-shown`, sets * BOOKED_TO_SHOWED)));
    const closes = Math.min(setsShown, Math.max(0, vary(`${key}-closes`, setsShown * SHOWED_TO_CLOSED)));
    return {
      name,
      dials,
      conversations,
      sets,
      setsShown,
      closes,
      revenue: vary(`${key}-rev`, closes * AVG_DEAL, 0.2),
      showRate: sets > 0 ? Math.round((setsShown / sets) * 100) : 0,
    };
  };

  if (role === 'phone-setter') {
    return {
      daily: last7Days.map((date, i) =>
        phoneRow(
          new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          `ps-d-${i}`,
          100,
          50
        )
      ),
      weekly: last4Weeks.map((week, i) => phoneRow(week, `ps-w-${i}`, 600, 300)),
      monthly: last6Months.map((month, i) => phoneRow(month, `ps-m-${i}`, 2500, 1200)),
      phoneSetterMetrics: phoneSetterNames.map((name, i) => {
        const newCash = pick(`ps-cash-${i}`, 6000, 1000);
        const calls = pick(`ps-calls-${i}`, 14, 10);
        const showed = Math.max(1, Math.round(calls * BOOKED_TO_SHOWED));
        return {
          name,
          newCash,
          totalCash: newCash + pick(`ps-tcash-${i}`, 4000, 1500),
          newRevenue: vary(`ps-nrev-${i}`, newCash * 1.15),
          newRevenuePerCall: Math.round(newCash / calls),
          newRevenuePerShowedCall: Math.round(newCash / showed),
        };
      }),
    };
  }

  /** One closer row, derived from calls taken. */
  const closerRow = (name: string, key: string, callBase: number, callRange: number) => {
    const calls = pick(`${key}-calls`, callRange, callBase);
    const offers = Math.max(1, vary(`${key}-offers`, calls * 0.7));
    const closes = Math.min(offers, Math.max(0, vary(`${key}-closes`, offers * 0.35)));
    return {
      name,
      calls,
      offers,
      closes,
      revenue: vary(`${key}-rev`, closes * AVG_DEAL * 1.2, 0.2),
    };
  };

  if (role === 'closer') {
    return {
      daily: last7Days.map((date, i) =>
        closerRow(
          new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          `cl-d-${i}`,
          5,
          8
        )
      ),
      weekly: last4Weeks.map((week, i) => closerRow(week, `cl-w-${i}`, 25, 30)),
      monthly: last6Months.map((month, i) => closerRow(month, `cl-m-${i}`, 100, 120)),
    };
  }

  /** One DM-setter row, derived from DMs sent. */
  const dmRow = (name: string, key: string, sentBase: number, sentRange: number) => {
    const dmsSent = pick(`${key}-sent`, sentRange, sentBase);
    const replies = Math.max(1, vary(`${key}-replies`, dmsSent * 0.18));
    const calls = Math.max(1, vary(`${key}-calls`, replies * 0.2));
    const sets = Math.min(calls, Math.max(0, vary(`${key}-sets`, calls * BOOKED_TO_SHOWED)));
    return { name, dmsSent, replies, calls, sets };
  };

  if (role === 'dm-setter') {
    return {
      daily: last7Days.map((date, i) =>
        dmRow(
          new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          `dm-d-${i}`,
          150,
          100
        )
      ),
      weekly: last4Weeks.map((week, i) => dmRow(week, `dm-w-${i}`, 800, 600)),
      monthly: last6Months.map((month, i) => dmRow(month, `dm-m-${i}`, 3000, 2500)),
    };
  }

  /** Executive roll-up, derived from sets so revenue reconciles with closes. */
  const adminRow = (name: string, key: string, setsBase: number, setsRange: number) => {
    const totalSets = pick(`${key}-sets`, setsRange, setsBase);
    const showed = Math.round(totalSets * BOOKED_TO_SHOWED);
    const totalCloses = Math.max(1, vary(`${key}-closes`, showed * SHOWED_TO_CLOSED));
    return {
      name,
      totalSets,
      totalCloses,
      totalRevenue: vary(`${key}-rev`, totalCloses * AVG_DEAL, 0.15),
    };
  };

  return {
    daily: last7Days.map((date, i) =>
      adminRow(
        new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        `ad-d-${i}`,
        15,
        20
      )
    ),
    weekly: last4Weeks.map((week, i) => adminRow(week, `ad-w-${i}`, 80, 100)),
    monthly: last6Months.map((month, i) => adminRow(month, `ad-m-${i}`, 300, 400)),
  };
};

/** A row in any of the generated series: a label plus numeric metrics. */
type SeriesRow = { name: string } & Record<string, number | string>;

export const calculateKPIs = (role: string, data: { daily: SeriesRow[] }) => {
  const sum = (key: string) =>
    data.daily.reduce((total, row) => total + (Number(row[key]) || 0), 0);

  if (role === 'phone-setter') {
    const totalDials = sum('dials');
    const totalSets = sum('sets');
    const totalCloses = sum('closes');
    const totalRevenue = sum('revenue');
    const totalConversations = sum('conversations');
    // Read from the data rather than multiplying totalSets by a constant. The
    // old version computed setsShown = totalSets * 0.75 and then derived the
    // show rate from it, so the "show rate" was just 75% restated.
    const setsShown = sum('setsShown');

    const inboundSets = Math.round(totalSets * 0.3);
    const rate = (numerator: number, denominator: number) =>
      denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0';

    return {
      outboundDials: totalDials,
      outboundDialResponseRate: rate(totalConversations, totalDials),
      meaningfulConversations: totalConversations,
      meaningfulConversationRate: rate(totalConversations, totalDials),
      inboundSets,
      outboundSets: totalSets - inboundSets,
      dialToSets: rate(totalSets, totalDials),
      totalSets,
      totalSetsInPast: Math.round(totalSets * 0.85),
      setsShown,
      setShowRate: rate(setsShown, totalSets),
      setToCloseRate: rate(totalCloses, totalSets),
      showedUpToCloseRate: rate(totalCloses, setsShown),
      setsClosed: totalCloses,
      aavSetsScheduled: totalSets > 0 ? Math.round(totalRevenue / totalSets) : 0,
      aavSetsShowed: setsShown > 0 ? Math.round(totalRevenue / setsShown) : 0,
      totalRevenue: totalRevenue.toLocaleString(),
    };
  }

  if (role === 'closer') {
    const totalCalls = sum('calls');
    const totalOffers = sum('offers');
    const totalCloses = sum('closes');
    const totalRevenue = sum('revenue');

    return {
      callToOfferRate: totalCalls > 0 ? ((totalOffers / totalCalls) * 100).toFixed(1) : '0',
      offerToCloseRate: totalOffers > 0 ? ((totalCloses / totalOffers) * 100).toFixed(1) : '0',
      avgRevenuePerClose: totalCloses > 0 ? (totalRevenue / totalCloses).toFixed(0) : '0',
      totalRevenue: totalRevenue.toLocaleString(),
    };
  }

  if (role === 'dm-setter') {
    const totalDMs = sum('dmsSent');
    const totalReplies = sum('replies');
    const totalCalls = sum('calls');
    const totalSets = sum('sets');

    return {
      dmResponseRate: totalDMs > 0 ? ((totalReplies / totalDMs) * 100).toFixed(1) : '0',
      replyToCallRate: totalReplies > 0 ? ((totalCalls / totalReplies) * 100).toFixed(1) : '0',
      callToSetRate: totalCalls > 0 ? ((totalSets / totalCalls) * 100).toFixed(1) : '0',
      totalSets: totalSets.toString(),
    };
  }

  // Executive roll-up, so the headline cards stop being string literals.
  return {
    totalRevenue: sum('totalRevenue').toLocaleString(),
    totalSets: sum('totalSets').toLocaleString(),
    totalCloses: sum('totalCloses').toLocaleString(),
  };
};
