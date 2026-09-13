# Self-audit of this column (run 6)

**2026-09-13 · Claude column.** Ten of these result files were shipped as model prose with only
mechanical checking behind them — references resolved, numbers tallied, invalidated claims grepped
for. All of that passed. **None of it reads an argument.**

So six auditors were pointed at our own work with one instruction: find bad *arguments*, not bad
facts. Five took two files each; one looked only for contradictions *between* files.

## The result

**129 findings — 56 HIGH, 59 MEDIUM, 14 LOW — plus 23 cross-file contradictions, 5 of them Critical.**

| Category | n |
|---|---:|
| Internal contradiction | 45 |
| Conclusion does not follow from its evidence | 28 |
| Weak source treated as settled | 15 |
| Estimate presented as measurement | 14 |
| Stale against a later run | 10 |
| Recommendation nobody could act on | 10 |
| Marker will challenge this first | 7 |

The auditor's diagnosis is worth quoting, because it names a failure mode rather than a list of
mistakes:

> *"Every contradiction runs the same way — later runs corrected earlier ones, and the corrections
> were appended to the files that made them rather than pushed into the files that depend on
> them."*

That is exactly right, and it is a process defect, not a knowledge defect. Runs 4 and 5 fixed the
market survey and told nobody else.

## The three that were worst, and all three were ours

1. **We accused our own Project 1a of hiding its methodology, and it had not.** Disagreement D10
   said the "security tests" are source-text greps and that *"neither P1a nor Codex says so"*.
   P1a says so in the first paragraph of `ATTACK-RESULTS.md`: *"Web tests are executable
   source-level security contracts: a failure proves the required guard is absent … but does not
   by itself prove exploitation."* Our flagship methodological reversal libelled our own artifact.
   **Withdrawn**; what survives is that the caveat was dropped from the summary tables, including
   ours.
2. **We manufactured Codex's self-contradiction by cutting its sentence at a comma.** We quoted
   *"Repository evidence demonstrates collective TypeScript/Next.js … work"* and charged Codex with
   attributing the upstream team's skill to us. The sentence continues: *"**but not which current
   member owns each skill**"* — the exact distinction we accused it of missing. **Charge
   withdrawn.** The narrower finding survives: its inspection had no `--since` cut.
3. **"A 9,232-file inherited codebase" was `backend/.venv`.** The real figure is **192**
   git-tracked non-test files, 164 of them in `web/src`. Off by roughly 48×, and it appeared twice
   as the rhetorical basis of an argument. Corrected — and the argument is *stronger* at 192,
   because it removes the "nobody could learn that codebase" escape hatch.

## The contradiction a marker would have found first

**[`09-pivot.md`](09-pivot.md) answers "Pivot". Every other deliverable builds the receipt inside
Epicourier. And [`16-prompt-report.md`](16-prompt-report.md) reported that 09 answered "stay the
course".** That row was written without reading the file it described — the same failure this
column spends ten thousand words documenting in other people's work.

09's verdict has **not** been rewritten to match the others. It is prompt P12 run cold, and its
argument is the strongest objection anyone raised: the chosen plan puts on its critical path the
three things this team has zero commits behind — a production `.tsx` change, a Supabase migration,
an RLS policy. It now carries a header saying so, and the decision is the team's.

## Fixed in this pass

1. 01 omitted Use It Up, a fifteenth rival cited in three other files
2. 02 re-imported the 5-user comprehension test
3. 02 still cited the withdrawn Cooklist review as demand evidence
4. 02b closing narrative still asserted the downgraded IDOR
5. 03 "MUST fix before any feature" contradicted the cut list
6. 03 repeated the D10 concealment charge
7. 06 "9,232-file codebase" was ~48x inflated by backend/.venv
8. 06 D10 falsely accused P1a of concealing the grep methodology
9. 06 D2 manufactured a self-contradiction by truncating Codex at a comma
10. 09 read as the team's decision rather than a dissent
11. 11b/11 carried a 0/500 baseline the API cannot produce
12. 12 N4 under-costed by 6h; margin now negative
13. 16 carried the stale "54 candidates" figure
14. 16 reported that P12 answered "stay the course"

## A second pass applied the rest — and the verification caught six new errors in it

The list above was the first fourteen. A remediation round then applied **112 more edits** across
the ten files, and a verification agent re-read everything against the working tree.

**Its verdict was "not ready to submit", and it was right.** The remediation had introduced six new
errors, five of them *inside newly written correction blocks* — which is the worst place for an
error, because a wrong correction is unrecoverable by a reader:

- `03` and `12` both described `transfer/route.ts:152-155` as a **DELETE**. It is an
  `.update({ is_checked: false })`; the file's only `.delete()` is `:170`, against `user_inventory`.
- `12` dated a checkpoint **"Sat 2026-09-20"** — in the same pass that corrected three other files
  because those dates are **Sundays**.
- `08` quoted a sentence from `12` that `12` had **struck the same day** as a false attribution.
- `13` finished its arithmetic against a base it had declared superseded two sentences earlier.
- `09` wrote "81 of the 99 touched files" inside a correction about mixing units — its own
  histogram sums to **115**, and these are file-*touches*, not unique files.
- And the largest reconciliation failure was simply **not done**: `14-cut-list.md` was left keyed to
  the superseded 94.75 h plan, in the file that `12` had explicitly assigned.

All six are now fixed, plus two pre-existing bad line references the verifier found
(`page.tsx:152-155` → `:146-149`; `supabaseServer.ts:5` → `:6`), and the baseline denominator is
reconciled across four files at **30 calls / 100 cells / up to 300 returned scores**.

> **The lesson, which is the same one twice:** delegating the *fix* has the same failure mode as
> delegating the *draft*. Both need a verification pass that reads the artifact rather than the
> report of the artifact. The second pass found six errors the first pass was confident about.

## Not fixed, and deliberately left as an open list

**115 findings remain**, mostly MEDIUM and LOW plus the remaining HIGHs. They are
recorded rather than silently closed, because an audit whose findings all vanish is not an audit.
The four that need a *decision* rather than an edit:

| Open fork | The two positions |
|---|---|
| **Pivot or stay** | [`09`](09-pivot.md) says pivot the form; everything else builds the receipt |
| **Python or TypeScript** | [`11b`](11b-mission-final.md)/[`10`](10-team-fit.md)/[`15`](15-codex-prompt-reruns.md) say a pure **Python** module; [`08`](08-three-futures.md)/[`13`](13-name-the-test.md)/[`14`](14-cut-list.md) put it in **TypeScript** with a 61 h Jest plan behind it |
| **Share route in or out** | Four files fund it, [`12`](12-milestones.md) and [`14`](14-cut-list.md) cut it, [`15`](15-codex-prompt-reruns.md) gates the whole project on it |
| **Expired items: excluded or scored at zero** | [`10`](10-team-fit.md)/[`15`](15-codex-prompt-reruns.md) exclude them in code; [`11b`](11b-mission-final.md)/[`13`](13-name-the-test.md) score them at zero — and zero points is not exclusion, because coverage still ranks them |

Full per-agent findings, with the quoted sentence and suggested fix for each, are in
[`../../evidence/claude/runs/`](../../evidence/claude/runs/) under `audit-*.md`, and the complete
cross-file contradiction table is in `cross-file-contradictions.md`.

## Why this is in the report rather than quietly fixed

D5 is graded on caught errors shown, not claimed. The 129 errors in this file were made by the
same model, on the same day, as the 129 it caught in the market survey — and they were only found
because someone asked whether "the facts check out" and "the argument holds" are the same question.

They are not.
