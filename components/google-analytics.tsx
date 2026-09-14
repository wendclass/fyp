"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

export function GoogleAnalytics() {
  useEffect(() => {
    // Check saved cookie consent on mount
    const savedConsent = localStorage.getItem("fyp_cookie_consent_v1");
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.localisation !== undefined) {
          // If consent banner was answered, grant analytics storage
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
              analytics_storage: "granted",
            });
          }
        }
      } catch (e) {
        // ignore
      }
    }

    // Listen to consent update events
    const handleConsentUpdated = () => {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    };

    window.addEventListener("fyp-consent-updated", handleConsentUpdated);
    return () => window.removeEventListener("fyp-consent-updated", handleConsentUpdated);
  }, []);

  return (
    <>
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}
