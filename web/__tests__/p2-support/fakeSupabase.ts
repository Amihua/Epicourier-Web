/**
 * In-memory stand-in for the Supabase client, for P2 route tests.
 *
 * Owner: Andy Yu. Lives outside `__tests__/node` and `__tests__/jsdom` so Jest
 * does not collect it as a test file. It supports the calls the receipt-shopping
 * routes make — select/eq/in/maybeSingle/single/insert/rpc — and filters rows for
 * real, so a route that forgets `.eq("user_id", …)` gets other users' rows here too.
 */

type Row = Record<string, unknown>;
type Result = { data: unknown; error: { message: string } | null };

export interface FakeOptions {
  user?: { id: string } | null;
  tables?: Record<string, Row[]>;
  /** Make every query on these tables fail with the given message. */
  failTables?: Record<string, string>;
  rpc?: (name: string, args: Record<string, unknown>) => Result | Promise<Result>;
}

export interface FakeSupabase {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null }; error: unknown }> };
  from: (table: string) => QueryBuilder;
  rpc: jest.Mock;
  tables: Record<string, Row[]>;
  /** Every query run, as [table, filters], for asserting scoping. */
  log: Array<{ table: string; op: string; filters: Array<[string, string, unknown]> }>;
}

let idCounter = 0;

class QueryBuilder implements PromiseLike<Result> {
  private filters: Array<[string, string, unknown]> = [];
  private op: "select" | "insert" = "select";
  private inserted: Row[] = [];
  private mode: "many" | "single" | "maybeSingle" = "many";

  constructor(
    private readonly fake: FakeSupabase,
    private readonly table: string,
    private readonly failMessage: string | undefined
  ) {}

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push(["eq", column, value]);
    return this;
  }

  in(column: string, values: unknown[]) {
    this.filters.push(["in", column, values]);
    return this;
  }

  order() {
    return this;
  }

  limit() {
    return this;
  }

  insert(rows: Row | Row[]) {
    this.op = "insert";
    this.inserted = (Array.isArray(rows) ? rows : [rows]).map((r) => ({
      id: `00000000-0000-4000-8000-${String(++idCounter).padStart(12, "0")}`,
      applied_at: null,
      ...r,
    }));
    return this;
  }

  single() {
    this.mode = "single";
    return this;
  }

  maybeSingle() {
    this.mode = "maybeSingle";
    return this;
  }

  private run(): Result {
    this.fake.log.push({ table: this.table, op: this.op, filters: this.filters });
    if (this.failMessage) return { data: null, error: { message: this.failMessage } };

    let rows: Row[];
    if (this.op === "insert") {
      const table = (this.fake.tables[this.table] ??= []);
      table.push(...this.inserted);
      rows = this.inserted;
    } else {
      rows = (this.fake.tables[this.table] ?? []).filter((row) =>
        this.filters.every(([kind, column, value]) =>
          kind === "eq"
            ? row[column] === value
            : (value as unknown[]).includes(row[column] as unknown)
        )
      );
    }

    if (this.mode === "many") return { data: rows, error: null };
    if (rows.length > 1) return { data: null, error: { message: "multiple rows" } };
    if (rows.length === 0) {
      return this.mode === "single"
        ? { data: null, error: { message: "no rows" } }
        : { data: null, error: null };
    }
    return { data: rows[0], error: null };
  }

  then<A = Result, B = never>(
    onfulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null
  ): PromiseLike<A | B> {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }
}

export function makeFakeSupabase(options: FakeOptions = {}): FakeSupabase {
  const fake: FakeSupabase = {
    auth: {
      getUser: async () =>
        options.user
          ? { data: { user: options.user }, error: null }
          : { data: { user: null }, error: new Error("Not authenticated") },
    },
    from: (table: string) => new QueryBuilder(fake, table, options.failTables?.[table]),
    rpc: jest.fn(async (name: string, args: Record<string, unknown>) =>
      options.rpc ? options.rpc(name, args) : { data: null, error: { message: "no rpc" } }
    ),
    tables: structuredClone(options.tables ?? {}),
    log: [],
  };
  return fake;
}
