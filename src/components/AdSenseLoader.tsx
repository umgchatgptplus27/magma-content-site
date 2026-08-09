"use client";

import { useEffect } from "react";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9723123826200643";

/**
 * AdSense can insert an extra <script> in <head>.  Loading it only after the
 * React tree hydrates prevents that third-party mutation from changing the
 * server HTML before React compares it with the client DOM.
 */
export default function AdSenseLoader() {
  useEffect(() => {
    if (document.querySelector(`script[src="${ADSENSE_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = ADSENSE_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("fetchpriority", "low");
    document.head.appendChild(script);
  }, []);

  return null;
}
