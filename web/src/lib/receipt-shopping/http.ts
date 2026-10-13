/**
 * Shared request/response handling for the receipt-shopping routes.
 * Owner: Andy Yu.
 */

import { NextResponse } from "next/server";
import type { ZodType } from "zod";

import { DeltaInputError } from "./delta";
import { DataAccessError, NotFoundError } from "./data";

export type Parsed<T> = { ok: true; value: T } | { ok: false; response: NextResponse };

/**
 * Reads a JSON body and validates it; any failure becomes a 400 that says why.
 * With `allowEmpty`, a missing body is read as `{}`.
 */
export async function parseBody<T>(
  req: Request,
  schema: ZodType<T>,
  options: { allowEmpty?: boolean } = {}
): Promise<Parsed<T>> {
  let raw: unknown;
  try {
    const text = await req.text();
    raw = text.trim() === "" && options.allowEmpty ? {} : JSON.parse(text);
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Request body must be JSON" }, { status: 400 }),
    };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid request", details }, { status: 400 }),
    };
  }
  return { ok: true, value: result.data };
}

/** Maps the module's error types to status codes. Database detail stays in the log. */
export function errorResponse(err: unknown, context: string): NextResponse {
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
  if (err instanceof DeltaInputError) {
    return NextResponse.json({ error: err.message }, { status: 422 });
  }
  if (err instanceof DataAccessError) {
    console.error(`${context}: ${err.message}`, err.cause);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  console.error(`${context}: unexpected error`, err);
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}
