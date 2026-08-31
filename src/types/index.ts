export interface User {
  id: string;
  name: string;
  role: 'admin' | 'closer' | 'dm-setter' | 'phone-setter';
  email: string;
}

export interface PhoneSetterForm {
  id?: string;
  date: string;
  userId: string;
  totalDials: number;
  replies: number;
  meaningfulConversations: number;
  totalSets: number;
  inboundCallsOnCalendar: number;
  inboundShowed: number;
  inboundSets: number;
  setsOnCloserCalendar: number;
  setsShowedUp: number;
  closes: number;
  newCashCollected: number;
  revenue: number;
  callOutcomes: string;
  performanceRating: number;
  improvementNeeds: string;
  weeklyProjections: string;
  monthlyProjections: string;
  helpNeeded: string;
}

export interface CloserForm {
  id?: string;
  date: string;
  userId: string;
  discoveryCallsBooked: number;
  discoveryCallNoShows: number;
  sentBackToSetter: number;
  discoveryCallsTaken: number;
  rescheduledDiscoveryCalls: number;
  followUpCallsTaken: number;
  offersMade: number;
  reOffers: number;
  projectedToClose: number;
  totalCloses: number;
  pifsPaymentPlansDeposits: number;
  cashCollected: number;
  revenueClosed: number;
}

export interface DMSetterForm {
  id?: string;
  date: string;
  userId: string;
  outboundIGDMsSent: number;
  outboundIGDMsReplied: number;
  inboundDMs: number;
  qualityInbounds: number;
  inboundComments: number;
  followUps: number;
  callsProposed: number;
  linksSent: number;
  totalCallsBooked: number;
  setsScheduled: number;
  setsTaken: number;
  setsOutcomes: string;
  setsClosed: number;
  revenue: number;
  cashCollected: number;
  recurring: number;
  timeSpentMessaging: number;
  crmUpdated: boolean;
  reschedulesFollowedUp: boolean;
  noShowsFollowedUp: boolean;
  voiceNotesSentToCloser: number;
  kpiGapNotes: string;
  performanceRating: number;
  performanceNotes: string;
}

export interface TeamGoal {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  month: string; // YYYY-MM format
  goalAmount: number;
  currentAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyTeamGoal {
  month: string;
  totalGoal: number;
  totalCurrent: number;
  percentage: number;
  individualGoals: TeamGoal[];
}

export interface KPIMetrics {
  showUpRate: number;
  setToClosePercentage: number;
  cashCollectedPercentage: number;
  projectedReceivable: number;
  totalRevenue: number;
  dmResponseRate: number;
  inboundShowUpPercentage: number;
  closerOfferRate: number;
}

export interface DashboardData {
  daily: any[];
  weekly: any[];
  monthly: any[];
  metrics: KPIMetrics;
}