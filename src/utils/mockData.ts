// Mock data for dashboard demonstrations
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

  // Generate mock phone setter names for bar charts
  const phoneSetterNames = ['Will Borns', 'Mateo Rios Cano', 'Cody Guevara', 'Sarah Johnson', 'Mike Chen'];

  if (role === 'phone-setter') {
    return {
      daily: last7Days.map((date, i) => ({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        dials: Math.floor(Math.random() * 50) + 100,
        sets: Math.floor(Math.random() * 10) + 5,
        closes: Math.floor(Math.random() * 3) + 1,
        revenue: Math.floor(Math.random() * 5000) + 2000,
        conversations: Math.floor(Math.random() * 30) + 20,
        showRate: Math.floor(Math.random() * 30) + 60,
      })),
      weekly: last4Weeks.map((week, i) => ({
        name: week,
        dials: Math.floor(Math.random() * 300) + 600,
        sets: Math.floor(Math.random() * 40) + 30,
        closes: Math.floor(Math.random() * 15) + 10,
        revenue: Math.floor(Math.random() * 25000) + 15000,
        conversations: Math.floor(Math.random() * 150) + 100,
        showRate: Math.floor(Math.random() * 20) + 65,
      })),
      monthly: last6Months.map((month, i) => ({
        name: month,
        dials: Math.floor(Math.random() * 1200) + 2500,
        sets: Math.floor(Math.random() * 150) + 120,
        closes: Math.floor(Math.random() * 50) + 40,
        revenue: Math.floor(Math.random() * 100000) + 60000,
        conversations: Math.floor(Math.random() * 600) + 400,
        showRate: Math.floor(Math.random() * 15) + 70,
      })),
      phoneSetterMetrics: phoneSetterNames.map((name, i) => ({
        name,
        newCash: Math.floor(Math.random() * 6000) + 1000,
        totalCash: Math.floor(Math.random() * 8000) + 2000,
        newRevenue: Math.floor(Math.random() * 6000) + 1000,
        newRevenuePerCall: Math.floor(Math.random() * 500) + 200,
        newRevenuePerShowedCall: Math.floor(Math.random() * 600) + 300,
      }))
    };
  }

  if (role === 'closer') {
    return {
      daily: last7Days.map((date, i) => ({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        calls: Math.floor(Math.random() * 8) + 5,
        offers: Math.floor(Math.random() * 6) + 3,
        closes: Math.floor(Math.random() * 3) + 1,
        revenue: Math.floor(Math.random() * 8000) + 3000,
      })),
      weekly: last4Weeks.map((week, i) => ({
        name: week,
        calls: Math.floor(Math.random() * 30) + 25,
        offers: Math.floor(Math.random() * 20) + 15,
        closes: Math.floor(Math.random() * 12) + 8,
        revenue: Math.floor(Math.random() * 40000) + 20000,
      })),
      monthly: last6Months.map((month, i) => ({
        name: month,
        calls: Math.floor(Math.random() * 120) + 100,
        offers: Math.floor(Math.random() * 80) + 60,
        closes: Math.floor(Math.random() * 40) + 30,
        revenue: Math.floor(Math.random() * 150000) + 80000,
      })),
    };
  }

  if (role === 'dm-setter') {
    return {
      daily: last7Days.map((date, i) => ({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        dmsSent: Math.floor(Math.random() * 100) + 150,
        replies: Math.floor(Math.random() * 30) + 20,
        calls: Math.floor(Math.random() * 8) + 5,
        sets: Math.floor(Math.random() * 4) + 2,
      })),
      weekly: last4Weeks.map((week, i) => ({
        name: week,
        dmsSent: Math.floor(Math.random() * 600) + 800,
        replies: Math.floor(Math.random() * 150) + 100,
        calls: Math.floor(Math.random() * 40) + 30,
        sets: Math.floor(Math.random() * 20) + 15,
      })),
      monthly: last6Months.map((month, i) => ({
        name: month,
        dmsSent: Math.floor(Math.random() * 2500) + 3000,
        replies: Math.floor(Math.random() * 600) + 400,
        calls: Math.floor(Math.random() * 150) + 120,
        sets: Math.floor(Math.random() * 80) + 60,
      })),
    };
  }

  // Admin overview data
  return {
    daily: last7Days.map((date, i) => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      totalRevenue: Math.floor(Math.random() * 15000) + 8000,
      totalSets: Math.floor(Math.random() * 20) + 15,
      totalCloses: Math.floor(Math.random() * 8) + 5,
    })),
    weekly: last4Weeks.map((week, i) => ({
      name: week,
      totalRevenue: Math.floor(Math.random() * 80000) + 50000,
      totalSets: Math.floor(Math.random() * 100) + 80,
      totalCloses: Math.floor(Math.random() * 40) + 30,
    })),
    monthly: last6Months.map((month, i) => ({
      name: month,
      totalRevenue: Math.floor(Math.random() * 300000) + 200000,
      totalSets: Math.floor(Math.random() * 400) + 300,
      totalCloses: Math.floor(Math.random() * 150) + 120,
    })),
  };
};

export const calculateKPIs = (role: string, data: any) => {
  if (role === 'phone-setter') {
    const totalDials = data.daily.reduce((sum: number, day: any) => sum + day.dials, 0);
    const totalSets = data.daily.reduce((sum: number, day: any) => sum + day.sets, 0);
    const totalCloses = data.daily.reduce((sum: number, day: any) => sum + day.closes, 0);
    const totalRevenue = data.daily.reduce((sum: number, day: any) => sum + day.revenue, 0);
    const totalConversations = data.daily.reduce((sum: number, day: any) => sum + day.conversations, 0);
    
    // Phone Setter specific KPIs
    const outboundDials = totalDials;
    const outboundDialResponseRate = totalDials > 0 ? ((totalConversations / totalDials) * 100).toFixed(1) : '0';
    const meaningfulConversations = totalConversations;
    const meaningfulConversationRate = totalDials > 0 ? ((totalConversations / totalDials) * 100).toFixed(1) : '0';
    const inboundSets = Math.floor(totalSets * 0.3); // 30% inbound
    const outboundSets = totalSets - inboundSets;
    const dialToSets = totalDials > 0 ? ((totalSets / totalDials) * 100).toFixed(1) : '0';
    const totalSetsInPast = Math.floor(totalSets * 0.85); // Previous period comparison
    const setsShown = Math.floor(totalSets * 0.75); // 75% show rate
    const setShowRate = totalSets > 0 ? ((setsShown / totalSets) * 100).toFixed(1) : '0';
    const setToCloseRate = totalSets > 0 ? ((totalCloses / totalSets) * 100).toFixed(1) : '0';
    const showedUpToCloseRate = setsShown > 0 ? ((totalCloses / setsShown) * 100).toFixed(1) : '0';
    const setsClosed = totalCloses;
    const aavSetsScheduled = totalSets > 0 ? Math.floor(totalRevenue / totalSets) : 0;
    const aavSetsShowed = setsShown > 0 ? Math.floor(totalRevenue / setsShown) : 0;

    return {
      outboundDials,
      outboundDialResponseRate,
      meaningfulConversations,
      meaningfulConversationRate,
      inboundSets,
      outboundSets,
      dialToSets,
      totalSets,
      totalSetsInPast,
      setsShown,
      setShowRate,
      setToCloseRate,
      showedUpToCloseRate,
      setsClosed,
      aavSetsScheduled,
      aavSetsShowed,
      totalRevenue: totalRevenue.toLocaleString(),
    };
  }

  if (role === 'closer') {
    const totalCalls = data.daily.reduce((sum: number, day: any) => sum + day.calls, 0);
    const totalOffers = data.daily.reduce((sum: number, day: any) => sum + day.offers, 0);
    const totalCloses = data.daily.reduce((sum: number, day: any) => sum + day.closes, 0);
    const totalRevenue = data.daily.reduce((sum: number, day: any) => sum + day.revenue, 0);

    return {
      callToOfferRate: totalCalls > 0 ? ((totalOffers / totalCalls) * 100).toFixed(1) : '0',
      offerToCloseRate: totalOffers > 0 ? ((totalCloses / totalOffers) * 100).toFixed(1) : '0',
      avgRevenuePerClose: totalCloses > 0 ? (totalRevenue / totalCloses).toFixed(0) : '0',
      totalRevenue: totalRevenue.toLocaleString(),
    };
  }

  if (role === 'dm-setter') {
    const totalDMs = data.daily.reduce((sum: number, day: any) => sum + day.dmsSent, 0);
    const totalReplies = data.daily.reduce((sum: number, day: any) => sum + day.replies, 0);
    const totalCalls = data.daily.reduce((sum: number, day: any) => sum + day.calls, 0);
    const totalSets = data.daily.reduce((sum: number, day: any) => sum + day.sets, 0);

    return {
      dmResponseRate: totalDMs > 0 ? ((totalReplies / totalDMs) * 100).toFixed(1) : '0',
      replyToCallRate: totalReplies > 0 ? ((totalCalls / totalReplies) * 100).toFixed(1) : '0',
      callToSetRate: totalCalls > 0 ? ((totalSets / totalCalls) * 100).toFixed(1) : '0',
      totalSets: totalSets.toString(),
    };
  }

  return {};
};