# Project 1b — Gemini Prompt Runbook

**Run date:** _not yet run_ · **Model:** Gemini 3.7 Flash (reasoning: high), via Antigravity CLI (`agy`) · **Analyst:** Wenbo (wli56)

This is the Gemini column, the third independent analyst. Sihao's Codex column is at
[`../codex/`](../codex/), Andy's Claude column at [`../claude/`](../claude/); the `qwen2.5/` slot is
the optional local model.

**Status: nothing in this column has been run yet.** Everything below is the plan and the exact
text to issue. No result is claimed here until `../../result/gemini/` and `../../evidence/gemini/`
exist.

## Why this column is not optional

The assignment sets a floor of **three different LLMs as independent analysts**, and names two
prompts that must go to every one of them:

> Mandatory prompts: market survey (prompt 1) and red team (prompt 10) on every model.

With only Codex and Claude run, the team is at two. **P01 and P10 on Gemini are the minimum
obligation of this column**; the other ten starters are optional here. The D5 checkpoint also asks
for three-or-more models evidenced by transcripts rather than claims, and warns that "all models
agreed" reads as one model reused.

## Method

One prompt, one fresh session. Do not continue a session from a previous prompt: an answer to the
red team written in the same conversation as the market survey is contaminated by it, and
"independent analyst" stops being true. This is the same rule the Claude column used, and it is the
only way this column's agreement with the other two means anything.

Do not read the Codex or Claude outputs before running P01 and P10. Read them afterwards, to write
up the disagreements. A third analyst who has already seen the first two answers is a reviewer, not
an analyst.

## Procedure, per prompt

1. Paste [`../claude/shared-evidence.md`](../claude/shared-evidence.md), **unedited**. Do not
   substitute the shorter product paragraph from the Codex runbook, and do not rewrite the budget
   block. A cross-model comparison is only a comparison if the inputs match.
2. Paste the prompt body from the `## Prompt, exactly as issued` block of the matching file in
   [`../../evidence/claude/runs/`](../../evidence/claude/runs/) — listed per prompt below.
3. Record the searches the model actually ran and the pages it actually fetched, not only its
   answer. Half the findings in the Claude column came from noticing where a quote sat on a page,
   and that is invisible in a bare answer.

### A note on inputs that already differ

The Codex column ran on 2026-09-12 with a one-paragraph evidence block embedded in its own runbook;
the Claude column ran on 2026-09-13 with the 95-line `shared-evidence.md`. Those two columns were
therefore not given identical inputs. This column uses the Claude block, so Gemini-vs-Claude is a
strict comparison and Gemini-vs-Codex is not. Say so in the report rather than letting a marker
find it.

## P01 — Map the competition (mandatory)

Source text: the `## Prompt, exactly as issued` block in
[`../../evidence/claude/runs/sweep-direct-planners.md`](../../evidence/claude/runs/sweep-direct-planners.md).

Issue it **as written for the direct-planners angle first**. If time allows, repeat with the search
angle swapped for the other four territories the Claude column used — pantry/waste, nutrition and
fitness-first, AI-native and appliance ecosystems, open-source and the graveyard — each in its own
fresh session (`sweep-pantry-waste.md`, `sweep-nutrition-fitness.md`, `sweep-ai-appliance.md`,
`sweep-oss-and-dead.md`). One angle satisfies the requirement; five make this column comparable to
the Claude column rather than a thinner version of it.

### What this run is actually worth: the two-model rule

A rival counts only if **two LLMs name it, or one supplies a live URL**. As it stands, only six
rivals clear the two-model bar. Thirteen rest on a single model plus a URL. Every one of those that
Gemini independently names is upgraded by this run — and that is a D1 scoring line, not bookkeeping.

Do **not** paste this list into the prompt; it would contaminate the run. Use it afterwards, to
score what came back.

| Currently single-sourced | Why it matters |
|---|---|
| **Cooklist** | The Claude column says it "endangers our own gap", found only in the fourth run. One model has seen it. |
| **Remy** | Verified from a shipped web bundle's i18n table, not marketing copy. Ships all three legs free. |
| **Grocy** | Publishes the integer due-score formula the mission statement now cites. |
| Plan to Eat, AnyList, Prepear, NoWaste, KitchenPal, Eatvora, PantryWise, Xpiry, "OH, a potato!" | Live-URL only. |
| MyFitnessPal Premium+ | Codex only. |

Two further jobs only a third model can do:

- **Break the Samsung Food+ tie.** Codex reached `samsungfood.com/food-plus/` and built an argument
  on it; every Claude agent got HTTP 403 and recorded the pillar as unverified-on-our-run. A third
  retrieval settles whether that pillar stands. Antigravity's web grounding is a different fetch
  path, so this is worth a deliberate attempt.
- **Re-check the products ruled dead.** Mealime (announced discontinued 2026-10-21), Kitche,
  Fridgely, CozZo. A withdrawal confirmed by a second model is a much safer claim to print than one
  model's reading of a notice.

## P10 — Red team (mandatory)

Source text: the `## Prompt, exactly as issued` block in
[`../../evidence/claude/runs/gap-redteam.md`](../../evidence/claude/runs/gap-redteam.md). That block
embeds the verified-market JSON; paste it too, so Gemini attacks the same evidence the others did.

Attack the mission as it now stands — the print-ready version in
[`../../result/claude/11b-mission-final.md`](../../result/claude/11b-mission-final.md), not the
superseded candidates — on the three fronts the prompt names: nobody wants it, the team cannot
build it, someone already does it better.

The previous two red teams **agreed on the shape of every attack and disagreed on every source**:
Codex argued from vendor marketing, Claude from an open-source competitor's published formula, a
vendor's published retreat, and a peer-reviewed result. Shape agreement is cheap. The value of a
third red team is a third sourcing axis, so push for evidence neither of them used.

The known soft spot is already recorded in the team's own file: `17-gap-closing.md` §2a is headed
*"The result we did not want: our gap has no demand-side evidence"*, and closes with *"nobody has
asked for it to survive."* A red team that lands there with real sources is worth more than one
that re-runs the competitive argument a third time.

## Our own prompts, G1–G4

The rubric rewards prompts beyond the twelve starters, and the other two columns have already taken
their axes: Sihao's P13–P20 ask *is this rival real?*, Andy's C1–C7 ask *is our own analysis real?*
The axis still open — and the one the team's own gap file names as its weakness — is **does anyone
actually want this?**

These are drafts to issue and revise, not finished text. Each carries the shared evidence block and
the same evidence rules.

| # | Prompt | What it should buy |
|---|---|---|
| **G1** | **Demand, with receipts.** "Find people asking, in their own words, for an explanation of *why* a meal planner recommended a dish, or complaining that they cannot tell. Quote 5–25 words with a URL and a date. Search app-store reviews, Reddit, open-source issue trackers, and support forums. If you find nothing after N searches, say so plainly — an honest empty result is the answer we need most." | Either the demand evidence the gap is missing, or a documented null result that is itself a finding. Both are usable; a fabricated quote is not. |
| **G2** | **The people who left.** "Find users who adopted a pantry or expiry-tracking app and then stopped. Quote the reason in their words, with a URL. Cluster the reasons by frequency." | Attacks the retention assumption under every pantry feature. Plan to Eat's public retreat from its pantry suggests this vein exists. |
| **G3** | **Who would be harmed.** "This product labels food EXPIRED and can still recommend cooking it. Find documented cases, regulator guidance, or platform policy that bears on software making food-safety-adjacent recommendations." | The team already knows its own UC17 prompt labels ingredients `EXPIRED` and recommends them anyway, and that both prior models missed it. Ground the consequence. |
| **G4** | **Price the alternative.** "For each rival that ships pantry plus expiry, record what a household actually pays per year and what the free tier withholds, quoting the pricing page with its URL and today's date." | The mission asks households to maintain inventory data. What competitors charge for the same work is a stakeholder argument no column has made. |

## Evidence to capture — do this during the run, not after

The D5 checkpoint wants transcripts, not claims. Antigravity writes its own record; collect these
immediately after the session, before the CLI self-updates or rotates anything:

| Source | Path | What it proves |
|---|---|---|
| Prompt history | `~/.gemini/antigravity-cli/history.jsonl` | Every prompt, with a millisecond timestamp and the workspace path. Take a SHA-256 of the file. |
| Conversation store | `~/.gemini/antigravity-cli/conversations/<conversation-id>.db` | The full exchange. Its `gen_metadata` table records the model id (`gemini-3.7-flash`) and the flags `used_claude=false` / `used_claude_conservative=false` — which is the direct answer to a marker who suspects one model was reused three times. |
| CLI version | `agy --version` | Record it **on the day of the run**. The binary self-updates; a version checked later will not match. |

The P1a precedent is `p1a/evidence/gemini-session-transcript.md`, which extracts exactly these
fields — reuse its shape.

Two things that column learned the hard way, worth repeating here:

- **Record the version at run time.** The P1a derivation record named v1.1.22; by the time it was
  checked the binary was 1.1.24, and the record had to be corrected.
- **If you type prompts in another language, say so.** The P1a record rendered Chinese prompts in
  English without marking them as translations. A marker comparing a transcript against the write-up
  will notice. Paste the English prompt text as given above and the problem does not arise.

## Output layout

Mirror the other two columns:

```
p1b/evidence/gemini/<date>-transcript.md     conversation record
p1b/evidence/gemini/metadata.md              model id, CLI version, session ids, hashes
p1b/evidence/gemini/runs/                    one file per prompt: text as issued, searches run, pages fetched
p1b/result/gemini/01-market-survey.md        P01 output, adjudicated
p1b/result/gemini/10-red-team.md             P10 output, adjudicated
p1b/result/gemini/README.md                  index for this column
```

## Order of work

1. P01, direct-planners angle — mandatory, and the two-model upgrades come from here.
2. P10, against the print-ready mission — mandatory.
3. Export the Antigravity evidence before doing anything else.
4. Read the Codex and Claude columns, and write up every disagreement in both directions. A column
   that agrees with everything adds nothing the rubric can score.
5. G1 first among the custom prompts: demand-side evidence is the hole the team has already named.
6. The four remaining P01 search angles, if time remains.
