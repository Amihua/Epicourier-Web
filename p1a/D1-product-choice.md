# D1 — Product choice

> Draft. Everything below marked **[TEAM: confirm]** is a fact only the team can
> supply; the rest is verifiable from the repository and from runs recorded in
> `p1a/evidence/`. Do not submit with the brackets still in.

## The product

**Epicourier-Web** — a meal-planning web application built for CSC 510 in
Fall 2025: recipe browsing, AI meal recommendation, calendar scheduling,
nutrient tracking, gamified streaks and challenges, inventory management with
expiry alerts, and shopping lists.

**Repository:** https://github.com/sdxshuai/Epicourier-Web
**Our fork:** https://github.com/Amihua/Epicourier-Web
**State when we forked it:** 467 commits, 79 test files, last commit 2025-12-07.
**Stack:** Next.js 15 / TypeScript / Tailwind on the front end; FastAPI and
Python on the back end; Supabase (PostgreSQL) for data and authentication;
Google Gemini for recommendation.

## Why we picked it

**[TEAM: confirm or replace this paragraph — it must be your actual reason.]**

Three properties made it a good subject for a testing and reverse-engineering
exercise rather than simply an impressive one:

1. **It is large enough to defeat reading, which is the point of the exercise.**
   The assignment asks us to use an LLM as a librarian over a body of work we
   cannot read in full. At 467 commits across two languages and 34 API routes,
   this repository is that body of work.
2. **It arrived with a substantial test suite of its own — 1,095 passing web
   tests.** Step 7 asks us to judge the tests a project already had. A project
   with no tests would have made that step vacuous. A project claiming
   "1,130+ automated test cases" on its README gave us a claim to check, and
   the claim turned out to be accurate (1,144 by our count).
3. **It spans two runtimes and an external AI service.** That gave us more than
   one kind of failure to study, which is what made our results table
   interesting rather than uniform.

## What we found on day one

We built and ran it before committing to it, as the assignment's day-one rule
directs. It runs, and it is unusually healthy for a year-old student project:
`npm ci` resolved cleanly, and the inherited web suite passed 1,095 of 1,096
tests in 3.6 seconds with no flakes across repeated runs.

It did not, however, build by following its own instructions. `npm run build`
fails at `Failed to collect page data for /api/achievements` with
`supabaseKey is required`, because the code reads `SUPABASE_SERVICE_ROLE_KEY`
and neither `INSTALL.md` nor `web/.env.example` documents it. Three further
variables the code reads are also undocumented. Standing the product up for the
demo additionally required applying thirteen database migrations and importing
five CSV datasets, neither of which the install guide mentions; one migration
also had to be patched, because the base schema empties `search_path` and the
seven later hand-written migrations create unqualified tables.

We judged this a documentation defect rather than code rot — the product itself
was sound once configured — so we kept it. The full account is finding **F2** in
`p1a/traceability/p1a_claude_traceability.md`.

## Products we tried first and abandoned

**[TEAM: required by the assignment — "Note any product you tried first and
abandoned, and why." Fill in honestly. If Epicourier-Web was the only candidate
we ever built, say exactly that in one sentence; an honest "none" is worth more
than an invented abandonment. If anyone did try another poster project first,
name it, say how far they got, and what stopped them.]**
