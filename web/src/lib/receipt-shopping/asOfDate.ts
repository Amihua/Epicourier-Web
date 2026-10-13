/**
 * The shared rule for "today" on the server (contract §9).
 *
 * Owner: Andy Yu. No code path may fall back to the local clock of whichever
 * machine happens to run it, so the date is always taken in one named time zone:
 * `RECEIPT_TIME_ZONE` if set, otherwise America/New_York (the team and the
 * graders are at NC State). The clock itself is injected so tests can pin it.
 */

import type { IsoDate } from "@/types/receipt";

export const DEFAULT_TIME_ZONE = "America/New_York";

export function receiptTimeZone(): string {
  return process.env.RECEIPT_TIME_ZONE || DEFAULT_TIME_ZONE;
}

/** Calendar date of `now` in `timeZone`, as `YYYY-MM-DD`. */
export function asOfDate(now: Date = new Date(), timeZone: string = receiptTimeZone()): IsoDate {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
