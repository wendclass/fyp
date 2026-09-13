"use client";

import { createClient } from "./supabase/client";

const VISITOR_COOKIE_KEY = "fyp_vid";
const SESSION_STORAGE_KEY = "fyp_sid";
const INITIAL_UTM_KEY = "fyp_initial_utm";
const CONSENT_KEY = "fyp_consent";

// Helper: Get or create Visitor ID (persisted for 1 year)
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let vid = localStorage.getItem(VISITOR_COOKIE_KEY);
  if (!vid) {
    // Check document.cookie
    const match = document.cookie.match(new RegExp(`(^| )${VISITOR_COOKIE_KEY}=([^;]+)`));
    if (match) {
      vid = match[2];
    }
  }

  if (!vid) {
    vid = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(VISITOR_COOKIE_KEY, vid);
    document.cookie = `${VISITOR_COOKIE_KEY}=${vid}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return vid;
}

// Helper: Get or create Session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sid) {
    sid = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
  }

  return sid;
}

// Helper: Capture UTM parameters and Referrer
export function getInitialUTM(): Record<string, any> {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(INITIAL_UTM_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utm: Record<string, any> = {
    source: urlParams.get("utm_source") || null,
    medium: urlParams.get("utm_medium") || null,
    campaign: urlParams.get("utm_campaign") || null,
    content: urlParams.get("utm_content") || null,
    term: urlParams.get("utm_term") || null,
    referrer: document.referrer || "direct",
    landing_page: window.location.pathname,
    initial_visit_at: new Date().toISOString(),
  };

  // Only store if there is at least one UTM or referrer
  localStorage.setItem(INITIAL_UTM_KEY, JSON.stringify(utm));
  return utm;
}

// Helper: Device, OS, Browser detection
export function getDeviceInfo(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const ua = navigator.userAgent;
  let device = "Desktop";
  if (/mobile/i.test(ua)) device = "Mobile";
  else if (/tablet|ipad/i.test(ua)) device = "Tablet";

  let os = "Autre";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Autre";
  if (/chrome|crios/i.test(ua) && !/edge|opr\//i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";

  return {
    device,
    os,
    browser,
    language: navigator.language || "fr",
  };
}

// Track an event flexible JSON
export async function trackEvent(
  eventName: string,
  customProperties: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const supabase = createClient();
    const visitor_id = getVisitorId();
    const session_id = getSessionId();
    const utm = getInitialUTM();
    const device = getDeviceInfo();

    // Check if user is logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id || null;

    // Detect timezone or country guess
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    let detectedCountry: string | null = null;
    if (timeZone.includes("Ouagadougou")) detectedCountry = "Burkina Faso";
    else if (timeZone.includes("Abidjan")) detectedCountry = "Côte d’Ivoire";
    else if (timeZone.includes("Dakar")) detectedCountry = "Sénégal";
    else if (timeZone.includes("Bamako")) detectedCountry = "Mali";
    else if (timeZone.includes("Niamey")) detectedCountry = "Niger";
    else if (timeZone.includes("Lome")) detectedCountry = "Togo";
    else if (timeZone.includes("Cotonou") || timeZone.includes("Porto-Novo")) detectedCountry = "Bénin";
    else if (timeZone.includes("Bissau")) detectedCountry = "Guinée-Bissau";
    else if (timeZone.includes("Paris")) detectedCountry = "France";

    const payload = {
      visitor_id,
      user_id,
      session_id,
      event_name: eventName,
      page_url: window.location.pathname + window.location.search,
      pays_detecte: customProperties.pays || detectedCountry || timeZone || null,
      properties: {
        ...device,
        ...utm,
        ...customProperties,
        timestamp: new Date().toISOString(),
      },
    };

    await supabase.from("events").insert(payload);
  } catch (err) {
    // Fail silently in analytics to never block user flow
    console.debug("Analytics track error", err);
  }
}

// Link visitor ID to user ID on signup / login
export async function linkVisitorToUser(userId: string) {
  if (typeof window === "undefined" || !userId) return;

  try {
    const supabase = createClient();
    const visitor_id = getVisitorId();
    await supabase.rpc("link_visitor_to_user", {
      p_visitor_id: visitor_id,
      p_user_id: userId,
    });
  } catch (err) {
    console.debug("Error linking visitor to user", err);
  }
}
