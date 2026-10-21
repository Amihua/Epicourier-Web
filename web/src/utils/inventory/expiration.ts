import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import { ExpirationStatus } from "@/types/data";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * The calendar date of an expiration value, as a UTC timestamp of that date.
 *
 * A date-only `YYYY-MM-DD` string is read by its digits: `new Date("2026-10-23")`
 * would read it as UTC midnight, which is still 2026-10-22 anywhere west of UTC (#32).
 * A Date, or a string with a time, is an instant, and is read in the shared time
 * zone, the same one "today" comes from.
 */
function calendarDay(value: string | Date): number | null {
  let year: number;
  let month: number;
  let day: number;

  const match = typeof value === "string" ? ISO_DATE_ONLY.exec(value.trim()) : null;
  if (match) {
    [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else {
    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) return null;
    [year, month, day] = asOfDate(date).split("-").map(Number);
  }

  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  // Reject dates that Date.UTC would roll over, such as 2026-02-30.
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1) return null;
  return utc;
}

/**
 * Calculate days until expiration from a given date
 * @param expirationDate - The expiration date (string in YYYY-MM-DD format, Date object, or null)
 * @param today - Today's date as `YYYY-MM-DD`; defaults to the shared rule in `asOfDate()`
 *   (America/New_York unless RECEIPT_TIME_ZONE is set), so the server, the browser and the
 *   receipt all agree whatever clock the machine has.
 * @returns Number of days until expiration (negative if expired), or null if no date provided
 */
export function getDaysUntilExpiration(
  expirationDate: string | Date | null | undefined,
  today: string = asOfDate()
): number | null {
  if (!expirationDate) {
    return null;
  }

  const expiry = calendarDay(expirationDate);
  const start = calendarDay(today);
  if (expiry === null || start === null) {
    return null;
  }

  // Both ends are UTC midnights of calendar dates, so the difference is a whole
  // number of days even across a daylight-saving change.
  return Math.round((expiry - start) / MS_PER_DAY);
}

/**
 * Get expiration status based on days until expiration
 * @param expirationDate - The expiration date (string, Date, or null)
 * @returns ExpirationStatus: 'expired' | 'critical' | 'warning' | 'good' | 'unknown'
 */
export function getExpirationStatus(
  expirationDate: string | Date | null | undefined
): ExpirationStatus {
  const daysUntil = getDaysUntilExpiration(expirationDate);

  if (daysUntil === null) {
    return "unknown";
  }

  if (daysUntil < 0) {
    return "expired";
  }

  if (daysUntil <= 2) {
    return "critical"; // 0-2 days
  }

  if (daysUntil <= 7) {
    return "warning"; // 3-7 days
  }

  return "good"; // > 7 days
}

/**
 * Get a human-readable label for expiration status
 * @param status - The expiration status
 * @returns Human-readable string describing the status
 */
export function getExpirationStatusLabel(status: ExpirationStatus): string {
  switch (status) {
    case "expired":
      return "Expired";
    case "critical":
      return "Expiring Soon";
    case "warning":
      return "Use Soon";
    case "good":
      return "Fresh";
    case "unknown":
      return "No Date";
    default:
      return "Unknown";
  }
}

/**
 * Get CSS class/color for expiration status (for UI styling)
 * @param status - The expiration status
 * @returns Color key for styling
 */
export function getExpirationStatusColor(
  status: ExpirationStatus
): "red" | "orange" | "yellow" | "green" | "gray" {
  switch (status) {
    case "expired":
      return "red";
    case "critical":
      return "orange";
    case "warning":
      return "yellow";
    case "good":
      return "green";
    case "unknown":
    default:
      return "gray";
  }
}

/**
 * Format expiration date for display
 * @param expirationDate - The expiration date
 * @returns Formatted string or appropriate message
 */
export function formatExpirationDate(expirationDate: string | Date | null | undefined): string {
  if (!expirationDate) {
    return "No expiration date";
  }

  const date = typeof expirationDate === "string" ? new Date(expirationDate) : expirationDate;

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const days = getDaysUntilExpiration(expirationDate);

  if (days === null) {
    return "No expiration date";
  }

  if (days < 0) {
    return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  }

  if (days === 0) {
    return "Expires today";
  }

  if (days === 1) {
    return "Expires tomorrow";
  }

  return `Expires in ${days} days`;
}

/**
 * Sort items by expiration date (expired/expiring first)
 * Returns a new sorted array without mutating the original.
 * @param items - Array of items with expiration_date property
 * @returns New sorted array (soonest expiring first)
 */
export function sortByExpiration<T extends { expiration_date: string | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const daysA = getDaysUntilExpiration(a.expiration_date);
    const daysB = getDaysUntilExpiration(b.expiration_date);

    // Items without expiration dates go to the end
    if (daysA === null && daysB === null) return 0;
    if (daysA === null) return 1;
    if (daysB === null) return -1;

    return daysA - daysB;
  });
}

/**
 * Filter items that are expiring within a certain number of days
 * @param items - Array of items with expiration_date property
 * @param days - Number of days to consider (default: 7)
 * @returns Filtered array of items expiring within the specified days
 */
export function getExpiringItems<T extends { expiration_date: string | null }>(
  items: T[],
  days: number = 7
): T[] {
  return items.filter((item) => {
    const daysUntil = getDaysUntilExpiration(item.expiration_date);
    return daysUntil !== null && daysUntil >= 0 && daysUntil <= days;
  });
}

/**
 * Get items that have already expired
 * @param items - Array of items with expiration_date property
 * @returns Filtered array of expired items
 */
export function getExpiredItems<T extends { expiration_date: string | null }>(items: T[]): T[] {
  return items.filter((item) => {
    const daysUntil = getDaysUntilExpiration(item.expiration_date);
    return daysUntil !== null && daysUntil < 0;
  });
}
