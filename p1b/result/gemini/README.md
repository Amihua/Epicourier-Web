# Gemini column — results index

**Analyst:** Wenbo (wli56) · **Run date:** 2026-09-13

Runbook: [`../../prompts/gemini/README.md`](../../prompts/gemini/README.md).
Transcripts and run metadata: [`../../evidence/gemini/`](../../evidence/gemini/).

| Prompt | Required? | Status | Channel |
|---|---|---|---|
| **P01 — Market survey** | Mandatory on every model | **Complete**, with three verification notes on its own output — see [`01-market-survey.md`](01-market-survey.md) | Gemini web app |
| **P10 — Red team** | Mandatory on every model | **Complete** — see [`10-red-team.md`](10-red-team.md) | `gemini-3.8-flash-high` via Antigravity CLI 1.1.24 |
| G1–G4 — our own prompts | Optional, rewarded | Not started; drafts in the runbook | — |

Both mandatory prompts are done.

## What this column contributes

- **Three rivals upgraded to two-model confirmation** — Plan to Eat, AnyList, Prepear — plus an
  independent second confirmation that Mealime is discontinuing on 2026-10-21.
- **A dead product caught in our own survey.** PlateJoy was reported as a live rival with a price;
  its domain returns NXDOMAIN. The row is marked void and the reason is recorded.
- **A red team argued from a different evidence base than the other two columns**, reached through
  the Hacker News Algolia API and DuckDuckGo's lite endpoint after the CLI's own search tool failed.

## What it does not contribute

The market survey verified the ten candidates the prompt supplied and did not search beyond them, so
**Cooklist, Eatvora, KitchenPal, Remy and Grocy remain single-sourced.** The Samsung Food+ page that
the Codex and Claude columns disagree about is still unresolved: it returns HTTP 403 here too.
