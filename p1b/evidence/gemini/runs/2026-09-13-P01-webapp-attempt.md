# P01 — Gemini web app attempt (no browsing tools available)

**Date:** 2026-09-13 · **Channel:** Gemini web app (gemini.google.com), not the Antigravity CLI ·
**Why this channel:** the CLI account's quota was exhausted, with a reset roughly 167 hours out.

The same P01 prompt was pasted unedited from `p1b/prompts/gemini/P01-ready-to-paste.txt`. The session
had no live browsing, so the run produced no usable survey. It is kept because two things in it are
findings, not noise.

## What the model did right

It refused to fabricate. Told to name no product without a live URL retrieved in-session and to quote
5–25 words of real page text, it marked **every one of the sixty feature cells `unknown`** and said
why:

> "Per evidence rules, all feature statuses are marked unknown because live DOM scraping could not be
> performed in this turn."

and:

> "I cannot generate speculative text or unverified quotes."

That is the prompt's evidence rules working as designed, and it is worth recording as such: the same
rules are what make the other columns' filled cells mean something.

## What it got wrong anyway

**1. It obeyed the rule in the table and broke it in the prose.** Having declared every cell
unverifiable, it went on to make sourceless market claims in the strategic sections:

> "Most consumer recipe applications (e.g., Eat This Much, PlateJoy, Yummly) use black-box filtering,
> macro matching, or collaborative filtering without displaying explicit reasoning to the user."

> "AnyList manages lists well; Paprika has basic pantry lists"

No URL, no quote, no retrieval — recall presented as market analysis, in the same document that had
just refused to do exactly that.

**2. Two of the ten rivals in its matrix are dead, and it supplied their URLs without checking them.**

| Listed as a rival | URL it supplied | Actual status, verified by retrieval on the same date |
|---|---|---|
| PlateJoy | `https://www.platejoy.com/` | DNS returns `NXDOMAIN`; the domain registration is abandoned |
| Yummly | `https://www.yummly.com/` | HTTP 301 to `https://www.kitchenaid.com/recipes`; the standalone product was shut down |

Both were established by fetch and DNS lookup in the CLI session recorded at
`2026-09-13-P01-tool-trajectory.md`. Handing over an unvisited URL is the specific behaviour the
prompt's third evidence rule forbids, and it is how a dead product enters a rival table.

**3. It changed role.** The prompt casts the model as a market analyst working *for* the team. Partway
through it began arguing the team's case — "Our Competitive Advantage", "builds user trust and reduces
decision fatigue" — and attached effort estimates ("4–6 person-hours", "8–12 person-hours") with no
stated basis. Those numbers are not analysis; nothing in the session measured anything.

## Status

Not usable as a market survey. No cell of its matrix may be cited, and its prose claims may not be
cited either.
