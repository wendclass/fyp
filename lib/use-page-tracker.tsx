"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, getInitialUTM, getVisitorId } from "./tracker";

export function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialise visitor ID and UTM capture
    getVisitorId();
    getInitialUTM();

    // Track page view
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackEvent("page_vue", {
      path: pathname,
      full_url: url,
    });
  }, [pathname, searchParams]);

  return null;
}
