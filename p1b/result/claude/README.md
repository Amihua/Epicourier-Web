# Project 1b — Claude Column

**Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]` · **Analyst:** Andy (yyu55)

One of the team's model columns. Sihao's Codex column is [`../codex/`](../codex/). The Gemini and
local-model columns belong to other teammates and nothing here is claimed on their behalf.

**Scale:** three orchestrated runs, 35 independent agents, zero failures, 1,310 tool calls —
**210 web searches and 521 pages fetched**, every one recorded.

---

## What this column concluded

**Two of our four candidate gaps are dead, and the one that survived had to be narrowed after our
own prompt refuted it.**

- **G2** "nothing measures whether the plan reduced waste" — **dead.** Five shipping products do
  it, *and* the measurement is out of budget: the closest published trial ran six students for a
  month and found no change. No waste-reduction number goes on our poster.
- **G4** "nothing connects a calorie target to this week's groceries" — **dead.** Eat This Much
  ships the whole chain; Prospre ships per-training-day macro cycling.
- **G3** "nobody treats the pantry as uncertain" — **narrowed.** Three products already do. What
  survives is that nobody propagates that uncertainty *into the ranking*.
- **G1** "nobody explains why it recommended this" — **narrowed, by our own disconfirmation
  sprint.** *RecipeFix* ships "**No black-box AI.** Every substitution comes with the culinary
  reasoning behind it". The surviving claim is the narrow one: explaining a recommendation
  **against inventory state and a date** is unshipped.

**The proposal that survives all of it:** Epicourier prints a match percentage in 2xl bold
(`RecipeRecommendationModal.tsx:304`) that comes from `match_score` at
`backend/api/inventory_recommender.py:51` — a field Gemini writes and **no line of our code
recomputes**. Replace it with arithmetic, publish the terms, and print the receipt beneath it.

**The measurable claim M0 will test, offline, with no human subjects:** across 50 recipes × 10
seeded pantries = 500 recommendations, the displayed total equals the sum of the displayed line
items in 500/500 cases, and the ordering is byte-identical across 20 shuffles of input order —
against a baseline measured by the same harness on today's build.

---

## The files

### D1 — Market survey
| File | What it is |
|---|---|
| [`01-market-survey.md`](01-market-survey.md) | 14 confirmed live rivals, 4 confirmed **dead**, the feature matrix, and the four gaps interrogated to destruction |
| [`02-table-stakes-vs-differentiator.md`](02-table-stakes-vs-differentiator.md) | All twenty use cases classified against the verified rivals |
| [`15-codex-prompt-reruns.md`](15-codex-prompt-reruns.md) | P13 / P17 / P19 / P20 rerun independently, as the Codex run requested — **P17 is where G1 got refuted** |

### D2 — Mission and stakeholders
| File | What it is |
|---|---|
| [`11-mission-statements.md`](11-mission-statements.md) | Three candidates, banned words enforced, each with a metric/threshold/baseline; one picked, with the sentence a marker will challenge and how we defend it |
| [`02b-stakeholders.md`](02b-stakeholders.md) | 18 stakeholders, each with a fear and a **testable** design decision |
| [`13-name-the-test.md`](13-name-the-test.md) | Every claim's fixture, assertion and threshold — the untestable ones listed first, for deletion |

### D3 — Milestones and engineering evidence
| File | What it is |
|---|---|
| [`12-milestones.md`](12-milestones.md) | Before / Now / Future, every NOW milestone costed and graded |
| [`14-cut-list.md`](14-cut-list.md) | The order of sacrifice, with dated triggers and the exact poster sentence each cut removes |
| [`03-engineering-evidence.md`](03-engineering-evidence.md) | Every P1a defect re-grepped against the working tree — **including the two findings that weaken our own claims** |
| [`04-support-material.md`](04-support-material.md) | 80 laws, standards, licences and domain sources, each mapped to a use case |
| [`04b-citation-audit.md`](04b-citation-audit.md) | All 80 URLs re-fetched and every quote re-checked against the live page |

### D5 — Prompt report
| File | What it is |
|---|---|
| [`16-prompt-report.md`](16-prompt-report.md) | **The D5 deliverable.** Most/least useful prompts, the prompt × model tables for P01 and P10, the two-model-rule survival table, model strengths and weaknesses, and the local-model sentence |
| [`05-caught-errors.md`](05-caught-errors.md) | 142 corrections, 129 genuine errors, with the ten that changed a conclusion |
| [`06-disagreement-with-codex.md`](06-disagreement-with-codex.md) | 12 registered disagreements with the Codex analyst — including where Claude lost |

### Supporting analysis
| File | What it is |
|---|---|
| [`07-premortem.md`](07-premortem.md) | The failure autopsy written a month in advance |
| [`08-three-futures.md`](08-three-futures.md) | SAFE / BOLD / WILD, kept distinct, each with a dated kill signal |
| [`09-pivot.md`](09-pivot.md) | Stay or pivot, asked with the P1a product deliberately set aside |
| [`10-team-fit.md`](10-team-fit.md) | Direction and ownership against *demonstrated* skill, plus the git-as-evidence argument |

---

## Three things a marker should check first

1. **We killed our own claims, repeatedly, and left the record in.** Two gaps dead, one gap
   refuted by a prompt we wrote to make us lose, one headline security finding downgraded to a
   probable false positive, and one stakeholder table left standing with a correction note
   attached rather than quietly edited. [`05-caught-errors.md`](05-caught-errors.md),
   [`03-engineering-evidence.md`](03-engineering-evidence.md).
2. **Every market claim has a page behind it, and the pages were fetched twice.** Once by an
   analyst, once by a fact-checker told to assume the analyst was lying.
   [`../../evidence/claude/runs/`](../../evidence/claude/runs/) records the searches run and the
   pages retrieved, per agent.
3. **The disagreements are real and go both ways.** Claude caught Codex carrying a discontinued
   product as a live rival and killing a gap on a marketing page; Codex reached a Samsung source
   Claude could not (HTTP 403) and we say so.
   [`06-disagreement-with-codex.md`](06-disagreement-with-codex.md).

## What this column cannot support

No user interviews. Complaint evidence is a convenience sample — `reddit.com` failed on every
fetch all session. Verification was capped at 18 of 54 candidate products, and the cap is recorded
rather than hidden. All Samsung Food+ claims rest on the support centre and third parties, never
the vendor's own page. Three prompts (P05, P08, and the P09 classification) produced their answers
with **zero retrieval** and are labelled as model priors, not evidence. No local model was run in
this column.
