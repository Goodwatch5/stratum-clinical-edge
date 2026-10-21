// Google Analytics 4 (GA4) Telemetry & Event Dispatcher
// Connected to Google Cloud Project: upbeat-button-464121-g2
// Measurement ID: G-E7SLXKN585

export const GA_MEASUREMENT_ID = "G-E7SLXKN585";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Generic GA4 event dispatcher
export const event = (
  action: string,
  params: Record<string, string | number | boolean | undefined> = {}
) => {
  if (typeof window !== "undefined") {
    if (typeof window.gtag === "function") {
      window.gtag("event", action, params);
    }
    // Also push to dataLayer defensively
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================================
// Seventeen Pockets & Stratum Growth Event Helpers
// ============================================================================

export interface LeadPayload {
  organization: string;
  contactEmail?: string;
  source?: string;
  platformInterest: "god_knew" | "goodwayz_clinical_edge" | "social_business_club";
  estAnnualVolume?: string;
}

export const trackGodKnewLandingView = (source: string = "direct") => {
  event("view_god_knew_landing", {
    event_category: "marketing_launch",
    traffic_source: source,
    brand: "Seventeen Pockets",
    landing_url: "https://those-impartial-environments--deegone.replit.app",
  });
};

export const trackGoodwayzLead = (payload: LeadPayload) => {
  event("generate_lead", {
    event_category: "enterprise_acquisition",
    event_label: payload.platformInterest,
    organization: payload.organization,
    interest: payload.platformInterest,
    source: payload.source || "replit_launchpad",
  });
};

export const trackSocialBusinessClubSignup = (tier: string = "founding_member") => {
  event("sign_up", {
    event_category: "community_membership",
    membership_tier: tier,
    market: "Columbia_SC_Nationwide",
    entity: "Social + Business Club",
  });
};

export const trackAdsAdvisorPromptCopy = (campaignName: string, promptTag: string) => {
  event("ads_advisor_copy_prompt", {
    event_category: "growth_operations",
    campaign: campaignName,
    prompt_tag: promptTag,
  });
};

export const trackBigQuerySyncEvent = (dataset: string, recordCount: number) => {
  event("detrics_bigquery_sync", {
    event_category: "data_warehouse",
    dataset_name: dataset,
    record_count: recordCount,
    cloud_project: "upbeat-button-464121-g2",
  });
};

export const trackMeridianAttributionRun = (channelCount: number) => {
  event("meridian_mmm_run", {
    event_category: "attribution_modeling",
    channels_analyzed: channelCount,
    source: "Meridian_Open_Source_MMM",
  });
};
