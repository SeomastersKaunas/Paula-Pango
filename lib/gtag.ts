// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';

/** Google Ads ID (e.g. AW-17942476859). Used for conversion tracking. */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17942476859';

/** Google Ads conversion label for contact form (from Ads > Goals > Conversions). */
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';

/** Google Ads conversion label for purchases (from Ads > Goals > Conversions > Purchase). */
export const GOOGLE_ADS_PURCHASE_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONVERSION_LABEL || '';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track pageviews
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

/**
 * Fire Google Ads conversion for contact form submission.
 * Call when user lands on contact-success (or localized equivalent).
 * Fires at most once per session; safe to call on every mount.
 */
export const reportContactConversion = (): boolean => {
  if (typeof window === 'undefined' || !window.gtag) return false;
  const sendTo = GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
    : '';
  if (!sendTo) return false;
  window.gtag('event', 'conversion', { send_to: sendTo });
  return true;
};

/**
 * Fire Google Ads conversion for purchase completion.
 * Call when user lands on cart page with ?success=true (or localized equivalent).
 * Fires at most once per session; safe to call on every mount.
 * @param value Optional purchase value (revenue) for enhanced conversion tracking
 * @param currency Optional currency code (e.g., 'USD', 'EUR')
 */
export const reportPurchaseConversion = (value?: number, currency?: string): boolean => {
  if (typeof window === 'undefined' || !window.gtag) return false;
  const sendTo = GOOGLE_ADS_ID && GOOGLE_ADS_PURCHASE_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_CONVERSION_LABEL}`
    : '';
  if (!sendTo) return false;
  const params: { send_to: string; value?: number; currency?: string } = { send_to: sendTo };
  if (value !== undefined) params.value = value;
  if (currency) params.currency = currency;
  window.gtag('event', 'conversion', params);
  return true;
};
