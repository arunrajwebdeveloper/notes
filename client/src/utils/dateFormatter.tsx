/**
 * Industry-standard relative time formatting using Intl.RelativeTimeFormat
 * Provides localized, accessible, and standards-compliant time formatting
 */

import React from "react";

interface RelativeTimeFormatOptions {
  locale?: string;
  numeric?: "always" | "auto"; // 'auto' gives "yesterday" instead of "1 day ago"
}

/**
 * Formats a date into a human-readable relative time string
 * Uses the Intl.RelativeTimeFormat API for proper i18n support
 * @param date - The date to format (Date object, timestamp, or date string)
 * @param options - Formatting options
 * @returns Formatted string like "just now", "5 minutes ago", "yesterday", etc.
 */
export function formatRelativeTime(
  date: Date | string | number,
  options: RelativeTimeFormatOptions = {},
): string {
  const { locale = "en-US", numeric = "auto" } = options;

  const now = new Date();
  const past = new Date(date);

  // Calculate difference in seconds
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  // Define time units in seconds
  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  // "just now" for times less than 45 seconds
  if (Math.abs(diffSeconds) < 45) {
    return "just now";
  }

  // Find the appropriate unit
  for (const { unit, seconds } of units) {
    const diff = diffSeconds / seconds;

    if (Math.abs(diff) >= 1) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric });
      return rtf.format(-Math.round(diff), unit);
    }
  }

  return "just now";
}

/**
 * Formats a date with fallback to absolute date for older timestamps
 * Shows relative time for recent dates, absolute date for older ones
 * @param date - The date to format
 * @param thresholdDays - Days after which to show absolute date (default: 30)
 * @param options - Formatting options
 */
export function formatSmartTime(
  date: Date | string | number,
  thresholdDays: number = 30,
  options: RelativeTimeFormatOptions = {},
): string {
  const { locale = "en-US" } = options;
  const now = new Date();
  const past = new Date(date);
  const diffDays = Math.floor((now.getTime() - past.getTime()) / 86400000);

  // Use relative time for recent dates
  if (diffDays < thresholdDays) {
    return formatRelativeTime(date, options);
  }

  // Use absolute date for older dates
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric", // "numeric" | "2-digit" | undefined
    month: "short", // "numeric" | "2-digit" | "long" | "short"
    day: "numeric", // "numeric" | "2-digit" | undefined
  });

  return dateFormatter.format(past);
}

/**
 * React hook for auto-updating relative time
 * Automatically updates the display at smart intervals
 */
export function useRelativeTime(
  date: Date | string | number,
  options: RelativeTimeFormatOptions = {},
) {
  const [relativeTime, setRelativeTime] = React.useState(() =>
    formatRelativeTime(date, options),
  );

  React.useEffect(() => {
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(date, options));
    };

    // Update immediately
    updateTime();

    // Calculate smart update interval based on how old the date is
    const now = new Date();
    const past = new Date(date);
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    let interval: number;
    if (diffMinutes < 1) {
      interval = 10000; // Update every 10 seconds for "just now"
    } else if (diffMinutes < 60) {
      interval = 60000; // Update every minute for recent times
    } else if (diffMinutes < 1440) {
      interval = 300000; // Update every 5 minutes for hours
    } else {
      interval = 3600000; // Update every hour for days+
    }

    const timer = setInterval(updateTime, interval);

    return () => clearInterval(timer);
  }, [date, options.locale, options.numeric]);

  return relativeTime;
}

// Example usage:
/*
// Basic usage
import { formatRelativeTime, formatSmartTime } from './dateFormatter';

function MyComponent() {
  const updatedDate = new Date('2024-10-15T10:30:00');
  
  return (
    <div>
      <p>Relative: {formatRelativeTime(updatedDate)}</p>
      <p>Smart: {formatSmartTime(updatedDate, 30)}</p>
      <p>Always numeric: {formatRelativeTime(updatedDate, { numeric: 'always' })}</p>
    </div>
  );
}

// With auto-updating hook
import { useRelativeTime } from './dateFormatter';

function LiveTimeComponent() {
  const updatedDate = new Date();
  const relativeTime = useRelativeTime(updatedDate);
  
  return <div>Updated: {relativeTime}</div>;
}

// With localization
function LocalizedComponent() {
  const updatedDate = new Date('2024-10-15T10:30:00');
  
  return (
    <div>
      <p>English: {formatRelativeTime(updatedDate, { locale: 'en-US' })}</p>
      <p>Spanish: {formatRelativeTime(updatedDate, { locale: 'es-ES' })}</p>
      <p>French: {formatRelativeTime(updatedDate, { locale: 'fr-FR' })}</p>
    </div>
  );
}
*/
