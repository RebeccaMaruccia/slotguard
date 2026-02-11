// Source - https://stackoverflow.com/a/78934887
// Posted by Hossein Aghatabar
// Retrieved 2026-02-10, License - CC BY-SA 4.0

import {MetricType} from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: MetricType) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) =>
    {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
