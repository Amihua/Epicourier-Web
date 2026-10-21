/**
 * @jest-environment node
 *
 * Issue #32: expiry badges were a day early on machines west of UTC, and a day
 * off the other way on a UTC server late in the Eastern evening. Days are now
 * counted between calendar dates: `YYYY-MM-DD` read by its digits, and "today"
 * taken from the shared rule (America/New_York unless RECEIPT_TIME_ZONE is set).
 * The clock is pinned, so these hold on any machine, whatever its time zone.
 */

import { getDaysUntilExpiration } from "@/utils/inventory/expiration";

describe("getDaysUntilExpiration counts calendar days in one named zone (#32)", () => {
  const originalZone = process.env.RECEIPT_TIME_ZONE;

  beforeEach(() => {
    delete process.env.RECEIPT_TIME_ZONE;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    if (originalZone === undefined) delete process.env.RECEIPT_TIME_ZONE;
    else process.env.RECEIPT_TIME_ZONE = originalZone;
  });

  it("raspberries expiring 2026-10-23 are 2 days out on the afternoon of 2026-10-21", () => {
    jest.setSystemTime(new Date("2026-10-21T14:00:00-04:00"));
    expect(getDaysUntilExpiration("2026-10-23")).toBe(2);
  });

  it("are still 2 days out at 23:30 Eastern, when UTC is already the next day", () => {
    jest.setSystemTime(new Date("2026-10-21T23:30:00-04:00"));
    expect(getDaysUntilExpiration("2026-10-23")).toBe(2);
  });

  it("turn over at Eastern midnight, not UTC midnight", () => {
    jest.setSystemTime(new Date("2026-10-22T00:05:00-04:00"));
    expect(getDaysUntilExpiration("2026-10-23")).toBe(1);
  });

  it("an item expiring in 6 days shows 6, not 5", () => {
    jest.setSystemTime(new Date("2026-10-21T09:00:00-04:00"));
    expect(getDaysUntilExpiration("2026-10-27")).toBe(6);
  });

  it("today is 0 and yesterday is -1", () => {
    jest.setSystemTime(new Date("2026-10-21T21:00:00-04:00"));
    expect(getDaysUntilExpiration("2026-10-21")).toBe(0);
    expect(getDaysUntilExpiration("2026-10-20")).toBe(-1);
  });

  it("counts across the November daylight-saving change without drifting", () => {
    jest.setSystemTime(new Date("2026-10-31T22:00:00-04:00"));
    expect(getDaysUntilExpiration("2026-11-14")).toBe(14);
  });

  it("follows RECEIPT_TIME_ZONE when it is set", () => {
    process.env.RECEIPT_TIME_ZONE = "UTC";
    jest.setSystemTime(new Date("2026-10-21T23:30:00-04:00")); // 2026-10-22 03:30 UTC
    expect(getDaysUntilExpiration("2026-10-23")).toBe(1);
  });

  it("reads only the date part of a timestamp string", () => {
    jest.setSystemTime(new Date("2026-10-21T14:00:00-04:00"));
    expect(getDaysUntilExpiration("2026-10-23T00:00:00+00:00")).toBe(2);
  });

  it("rejects an impossible calendar date instead of rolling it over", () => {
    jest.setSystemTime(new Date("2026-02-20T12:00:00-05:00"));
    expect(getDaysUntilExpiration("2026-02-30")).toBeNull();
  });
});
