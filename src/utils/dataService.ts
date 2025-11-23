/**
 * Data Service - Service unifiÃ© pour toutes les donnÃ©es avec fallback local
 * Utilise serverService pour la dÃ©tection et localDataStorage pour les fallbacks
 */

import { fetchWithFallback, ServerMode } from "./serverService";
import {
  getLocalCaseStudies,
  getLocalCaseStudyBySlug,
  seedLocalCaseStudies,
  getLocalFAQs,
  seedLocalFAQs,
  getLocalResources,
  getLocalResourceBySlug,
  seedLocalResources,
  getLocalDashboardData,
  seedLocalDashboardData,
  getLocalSubscribers,
  seedLocalSubscribers,
  LocalCaseStudy,
  LocalFAQ,
  LocalResource,
  LocalDashboardData,
  LocalSubscriber,
} from "./localDataStorage";

// ==================== CASE STUDIES ====================

export async function fetchCaseStudies(): Promise<{
  caseStudies: LocalCaseStudy[];
  mode: ServerMode;
}> {
  const { data, mode } = await fetchWithFallback(
    "/case-studies",
    { method: "GET" },
    async () => {
      console.log("ðŸ“¦ Chargement des case studies en mode local");
      let caseStudies = getLocalCaseStudies();
      if (caseStudies.length === 0) {
        seedLocalCaseStudies();
        caseStudies = getLocalCaseStudies();
      }
      return caseStudies;
    }
  );

  return { caseStudies: data, mode };
}

export async function fetchCaseStudyBySlug(slug: string): Promise<{
  caseStudy: LocalCaseStudy | null;
  mode: ServerMode;
}> {
  const { data, mode } = await fetchWithFallback(
    `/case-studies/${slug}`,
    { method: "GET" },
    async () => {
      console.log(`ðŸ“¦ Chargement du case study "${slug}" en mode local`);
      let caseStudy = getLocalCaseStudyBySlug(slug);
      if (!caseStudy) {
        seedLocalCaseStudies();
        caseStudy = getLocalCaseStudyBySlug(slug);
      }
      return caseStudy;
    }
  );

  return { caseStudy: data, mode };
}

// ==================== FAQ ====================

export async function fetchFAQs(language: string = "fr"): Promise<{
  faqs: LocalFAQ[];
  mode: ServerMode;
}> {
  const { data, mode } = await fetchWithFallback(
    `/faq?language=${language}`,
    { method: "GET" },
    async () => {
      console.log("ðŸ“¦ Chargement des FAQs en mode local");
      let faqs = getLocalFAQs();
      if (faqs.length === 0) {
        seedLocalFAQs();
        faqs = getLocalFAQs();
      }
      return faqs;
    }
  );

  return { faqs: data, mode };
}

// ==================== RESOURCES ====================

export async function fetchResources(language: string = "fr"): Promise<{
  resources: LocalResource[];
  mode: ServerMode;
}> {
  const { data, mode } = await fetchWithFallback(
    `/resources?lang=${language}`,
    { method: "GET" },
    async () => {
      console.log("ðŸ“¦ Chargement des resources en mode local");
      let resources = getLocalResources();
      if (resources.length === 0) {
        seedLocalResources();
        resources = getLocalResources();
      }
      return resources;
    }
  );

  return { resources: data, mode };
}

export async function fetchResourceBySlug(slug: string): Promise<{
  resource: LocalResource | null;
  mode: ServerMode;
}> {
  const { data, mode } = await fetchWithFallback(
    `/resources/${slug}`,
    { method: "GET" },
    async () => {
      console.log(`ðŸ“¦ Chargement de la resource "${slug}" en mode local`);
      let resource = getLocalResourceBySlug(slug);
      if (!resource) {
        seedLocalResources();
        resource = getLocalResourceBySlug(slug);
      }
      return resource;
    }
  );

  return { resource: data, mode };
}

// ==================== DASHBOARD ====================

export async function fetchDashboardData(): Promise<{
  data: LocalDashboardData;
  mode: ServerMode;
}> {
  console.log("ðŸ” [dataService] Fetching dashboard data...");
  const startTime = Date.now();
  
  try {
    const { data, mode } = await fetchWithFallback(
      "/dashboard/stats",
      { method: "GET" },
      async () => {
        console.log("ðŸ“¦ Chargement des donnÃ©es dashboard en mode local");
        let dashboardData = getLocalDashboardData();
        if (!dashboardData.leads || dashboardData.leads.length === 0) {
          seedLocalDashboardData();
          dashboardData = getLocalDashboardData();
        }
        return dashboardData;
      }
    );
    
    const fetchTime = Date.now() - startTime;
    console.log(`âœ… [dataService] Dashboard data fetched in ${fetchTime}ms (mode: ${mode})`);

    // Ensure data has the right structure with arrays
    const normalizedData = {
      leads: Array.isArray(data.leads) ? data.leads : [],
      clients: Array.isArray(data.clients) ? data.clients : [],
      bookings: Array.isArray(data.bookings) ? data.bookings : [],
    };

    return { data: normalizedData, mode };
  } catch (error) {
    console.error("âŒ [dataService] Error fetching dashboard data:", error);
    // Return empty arrays on error instead of throwing
    return { 
      data: { leads: [], clients: [], bookings: [] }, 
      mode: "local" as ServerMode 
    };
  }
}

// ==================== SUBSCRIBERS ====================

export async function fetchSubscribers(): Promise<{
  subscribers: LocalSubscriber[];
  mode: ServerMode;
}> {
  const { data, mode } = await fetchWithFallback(
    "/newsletter/subscribers",
    { method: "GET" },
    async () => {
      console.log("ðŸ“¦ Chargement des subscribers en mode local");
      let subscribers = getLocalSubscribers();
      if (subscribers.length === 0) {
        seedLocalSubscribers();
        subscribers = getLocalSubscribers();
      }
      return subscribers;
    }
  );

  return { subscribers: data, mode };
}

// ==================== UTILITY ====================

export function getModeBadge(mode: ServerMode): { icon: string; text: string; color: string } {
  switch (mode) {
    case "server":
      return { icon: "ðŸŸ¢", text: "ConnectÃ©", color: "#CCFF00" };
    case "local":
      return { icon: "ðŸŸ ", text: "Mode Local", color: "#FFA500" };
    case "checking":
      return { icon: "ðŸ”„", text: "VÃ©rification...", color: "#888888" };
  }
}
