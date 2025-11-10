/**
 * Analytics Service - Track & Store Web Analytics
 * Stocke les événements analytics dans le KV Store pour des métriques en temps réel
 */

import * as kv from "./kv_store.tsx";

// Types
interface AnalyticsEvent {
  type: "pageview" | "conversion" | "session_start" | "session_end";
  timestamp: string;
  sessionId: string;
  page?: string;
  referrer?: string;
  userAgent?: string;
  duration?: number;
  data?: any;
}

interface PageView {
  id: string;
  sessionId: string;
  page: string;
  referrer: string;
  timestamp: string;
  userAgent: string;
}

interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageCount: number;
  bounced: boolean;
  referrer: string;
  userAgent: string;
}

interface Conversion {
  id: string;
  sessionId: string;
  type: string; // "contact_form", "booking", "newsletter", etc.
  timestamp: string;
  data: any;
}

// Helper: Get date key for daily aggregation
function getDateKey(date = new Date()): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Helper: Get month key for monthly aggregation
function getMonthKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`; // YYYY-MM
}

/**
 * Track Page View
 */
export async function trackPageView(data: {
  sessionId: string;
  page: string;
  referrer: string;
  userAgent: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const pageViewId = `pageview:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

  const pageView: PageView = {
    id: pageViewId,
    sessionId: data.sessionId,
    page: data.page,
    referrer: data.referrer || "",
    timestamp,
    userAgent: data.userAgent,
  };

  // Store individual page view
  await kv.set(pageViewId, pageView);

  // Update daily stats
  const dateKey = getDateKey();
  const statsKey = `analytics:daily:${dateKey}`;
  const stats = (await kv.get(statsKey)) || {
    date: dateKey,
    pageviews: 0,
    uniqueVisitors: new Set(),
    sessions: new Set(),
    conversions: 0,
  };

  stats.pageviews = (stats.pageviews || 0) + 1;
  
  // Track unique visitors (using session as proxy)
  if (!stats.uniqueVisitors) stats.uniqueVisitors = new Set();
  if (Array.isArray(stats.uniqueVisitors)) {
    stats.uniqueVisitors = new Set(stats.uniqueVisitors);
  }
  stats.uniqueVisitors.add(data.sessionId);
  
  // Track sessions
  if (!stats.sessions) stats.sessions = new Set();
  if (Array.isArray(stats.sessions)) {
    stats.sessions = new Set(stats.sessions);
  }
  stats.sessions.add(data.sessionId);

  // Convert Sets to Arrays for JSON storage
  await kv.set(statsKey, {
    ...stats,
    uniqueVisitors: Array.from(stats.uniqueVisitors),
    sessions: Array.from(stats.sessions),
  });

  console.log(`📊 Pageview tracked: ${data.page}`);
}

/**
 * Track Session Start
 */
export async function trackSessionStart(data: {
  sessionId: string;
  referrer: string;
  userAgent: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const sessionKey = `session:${data.sessionId}`;

  const session: Session = {
    id: data.sessionId,
    startTime: timestamp,
    pageCount: 1,
    bounced: true, // Will be updated if more than 1 page
    referrer: data.referrer || "",
    userAgent: data.userAgent,
  };

  await kv.set(sessionKey, session);
  console.log(`🎯 Session started: ${data.sessionId}`);
}

/**
 * Track Session End
 */
export async function trackSessionEnd(data: {
  sessionId: string;
  duration: number; // en secondes
}): Promise<void> {
  const sessionKey = `session:${data.sessionId}`;
  const session = await kv.get(sessionKey);

  if (session) {
    const endTime = new Date().toISOString();
    const bounced = session.pageCount <= 1;

    await kv.set(sessionKey, {
      ...session,
      endTime,
      duration: data.duration,
      bounced,
    });

    console.log(`⏱️ Session ended: ${data.sessionId} (${data.duration}s)`);
  }
}

/**
 * Update Session Page Count
 */
export async function updateSessionPageCount(sessionId: string): Promise<void> {
  const sessionKey = `session:${sessionId}`;
  const session = await kv.get(sessionKey);

  if (session) {
    session.pageCount = (session.pageCount || 1) + 1;
    session.bounced = session.pageCount <= 1;

    await kv.set(sessionKey, session);
  }
}

/**
 * Track Conversion
 */
export async function trackConversion(data: {
  sessionId: string;
  type: string;
  data: any;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const conversionId = `conversion:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

  const conversion: Conversion = {
    id: conversionId,
    sessionId: data.sessionId,
    type: data.type,
    timestamp,
    data: data.data,
  };

  // Store conversion
  await kv.set(conversionId, conversion);

  // Update daily stats
  const dateKey = getDateKey();
  const statsKey = `analytics:daily:${dateKey}`;
  const stats = (await kv.get(statsKey)) || {
    date: dateKey,
    pageviews: 0,
    uniqueVisitors: [],
    sessions: [],
    conversions: 0,
  };

  stats.conversions = (stats.conversions || 0) + 1;
  await kv.set(statsKey, stats);

  console.log(`✅ Conversion tracked: ${data.type}`);
}

/**
 * Get Analytics Stats for a Date Range
 */
export async function getAnalyticsStats(params: {
  startDate?: string;
  endDate?: string;
  days?: number; // Alternative to startDate/endDate
}): Promise<any> {
  const { days = 30 } = params;

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get daily stats for the range
  const dailyStats: any[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = getDateKey(currentDate);
    const statsKey = `analytics:daily:${dateKey}`;
    const stats = await kv.get(statsKey);

    if (stats) {
      dailyStats.push(stats);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Aggregate stats
  const totalPageviews = dailyStats.reduce((sum, day) => sum + (day.pageviews || 0), 0);
  
  // Count unique visitors across all days
  const allVisitors = new Set();
  dailyStats.forEach((day) => {
    if (day.uniqueVisitors) {
      day.uniqueVisitors.forEach((v: string) => allVisitors.add(v));
    }
  });
  const totalVisitors = allVisitors.size;

  const totalConversions = dailyStats.reduce((sum, day) => sum + (day.conversions || 0), 0);

  // Get all sessions for the period
  const allSessions: Session[] = [];
  for (const day of dailyStats) {
    if (day.sessions && Array.isArray(day.sessions)) {
      for (const sessionId of day.sessions) {
        const session = await kv.get(`session:${sessionId}`);
        if (session) {
          allSessions.push(session);
        }
      }
    }
  }

  // Calculate bounce rate
  const bouncedSessions = allSessions.filter((s) => s.bounced).length;
  const bounceRate =
    allSessions.length > 0 ? (bouncedSessions / allSessions.length) * 100 : 0;

  // Calculate average session time
  const sessionsWithDuration = allSessions.filter((s) => s.duration && s.duration > 0);
  const avgSessionTime =
    sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0) /
        sessionsWithDuration.length
      : 0;

  // Conversion rate
  const conversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

  // Get recent conversions
  const recentConversions = await kv.getByPrefix("conversion:");
  const conversionsInRange = recentConversions
    .filter((c: Conversion) => {
      const conversionDate = new Date(c.timestamp);
      return conversionDate >= startDate && conversionDate <= endDate;
    })
    .sort(
      (a: Conversion, b: Conversion) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return {
    period: {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      days,
    },
    totals: {
      visitors: totalVisitors,
      pageviews: totalPageviews,
      sessions: allSessions.length,
      conversions: totalConversions,
      bounceRate: Math.round(bounceRate * 10) / 10,
      avgSessionTime: Math.round(avgSessionTime),
      conversionRate: Math.round(conversionRate * 10) / 10,
    },
    dailyStats,
    recentConversions: conversionsInRange.slice(0, 10),
  };
}

/**
 * Get Top Pages
 */
export async function getTopPages(days = 30): Promise<any[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all pageviews
  const allPageviews = await kv.getByPrefix("pageview:");
  const pageviewsInRange = allPageviews.filter((pv: PageView) => {
    const pvDate = new Date(pv.timestamp);
    return pvDate >= startDate && pvDate <= endDate;
  });

  // Count by page
  const pageCounts: Record<string, number> = {};
  pageviewsInRange.forEach((pv: PageView) => {
    pageCounts[pv.page] = (pageCounts[pv.page] || 0) + 1;
  });

  // Sort and return top 10
  return Object.entries(pageCounts)
    .map(([page, count]) => ({ page, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

/**
 * Get Traffic Sources
 */
export async function getTrafficSources(days = 30): Promise<any[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all sessions
  const allSessions = await kv.getByPrefix("session:");
  const sessionsInRange = allSessions.filter((session: Session) => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= startDate && sessionDate <= endDate;
  });

  // Extract and categorize referrers
  const sourceCounts: Record<string, number> = {};
  
  sessionsInRange.forEach((session: Session) => {
    let source = "Direct";
    
    if (session.referrer) {
      try {
        const url = new URL(session.referrer);
        const hostname = url.hostname;
        
        // Categorize sources
        if (hostname.includes("google")) source = "Google";
        else if (hostname.includes("facebook")) source = "Facebook";
        else if (hostname.includes("twitter") || hostname.includes("t.co")) source = "Twitter";
        else if (hostname.includes("linkedin")) source = "LinkedIn";
        else if (hostname.includes("instagram")) source = "Instagram";
        else source = hostname;
      } catch (e) {
        source = "Direct";
      }
    }
    
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  // Sort and return
  return Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, sessions: count }))
    .sort((a, b) => b.sessions - a.sessions);
}
