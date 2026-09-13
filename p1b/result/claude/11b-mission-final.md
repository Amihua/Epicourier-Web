# D2 — Mission Statement, corrected and print-ready

**Prepared 2026-09-13 · Claude column.** This supersedes the opening sentence of Candidate 1 in
[`11-mission-statements.md`](11-mission-statements.md), which was written before the fourth
verification run and is now factually wrong. The three original candidates are kept unedited there
as the record of what we believed on the evidence we had; **this is the version to print.**

Banned words checked and absent: *leverage, empower, seamless, revolutionize, cutting-edge,
innovative, solution*.

---

## The mission statement

> Every meal planner we verified tells you *that* a recipe matches and not one of them assembles
> the whole argument in one place: Cooklist advertises that your parsley is seven days old,
> RecipeFix reasons about a substitution it made, Grocy computes an expiry-driven due score and
> shows the user a bare integer — but no shipped product joins the named pantry item, its actual
> date, the nutrient constraint and the reason for a swap into one object a person can read and
> correct. Ours is worse than any of theirs: the match percentage Epicourier prints in 2xl bold at
> `RecipeRecommendationModal.tsx:304` is `match_score` from
> `backend/api/inventory_recommender.py:51`, a number Google Gemini writes in prose and that no
> line of our code recomputes from the expiry dates already sitting in `user_inventory`. We will
> move the ranking out of the model into a pure Python function scored by a published integer
> table — Grocy's due score, cited in a code comment, with its twenty-points-per-expired-ingredient
> term deliberately set to zero, because we will not rank food we have ourselves labelled expired
> into a meal — and print the receipt beneath the number: each inventory item, its date, the points
> it contributed, and the running total. Gemini keeps its job and loses its authority; it writes
> the sentence that describes a ranking it was handed, and the user can correct any line of the
> receipt and watch the order move. Project 2's M0 evaluation tests this offline with no human
> subjects: across fifty recipes crossed with ten seeded pantries — five hundred recommendations —
> the displayed total must equal the sum of the displayed line items in **500 of 500** cases and
> the ordering must be **byte-identical across twenty shuffles** of inventory input order, each
> reported against a baseline the same harness measures on today's build — which today's API caps
> at ten recommendations per pantry, so the baseline is stated as *0 of 300* — thirty live calls,
> one hundred distinct (pantry, rank-position) cells, up to three hundred returned scores across
> three repeats — and never as *0 of 500*.

## The measurable claim, isolated

| | |
|---|---|
| **Metric 1** | Displayed total equals the sum of displayed line items |
| **Threshold** | 500 / 500 recommendations (50 recipes × 10 seeded pantries) |
| **Metric 2** | Ranking order is stable under permutation of inventory input order |
| **Threshold** | Byte-identical across 20 shuffles |
| **Baseline** | The same harness run against today's build. **It cannot be run on 500 cases:** `InventoryRecommendRequest.num_recipes` is `Field(default=5, ge=1, le=10)`, so ten seeded pantries yield **at most 100** recommendations today. The baseline is therefore *0 of **300** displayed scores that decompose into line items* — 10 pantries × 3 repeats = **30 live calls**, **100** distinct (pantry, rank-position) cells, up to **300** returned scores — archived once as JSON, plus the measured run-to-run disagreement rate of today's `match_score` across those repeats. *(Second pass, 2026-09-13: this read "0 of 100", which is one repeat's worth; [`13`](13-name-the-test.md) F0 and [`14`](14-cut-list.md) Cut 2 carry the corrected denominator and this file now matches them.)* **The 500 figure belongs to the offline determinism corpus only.** We report what the harness gives; we do not assume zero. |
| **Cost** | Runs offline in seconds over a corpus we can enumerate exhaustively. No users, no field study, no network. |

## The caveat that must travel with this statement

We searched for evidence that anyone *wants* this, and did not find it. A regex sweep across **851
Reddit entries** for eleven phrasings of "explain why it recommended this" returned **zero hits** in
any meal, pantry or recipe context ([`17-gap-closing.md` §2a](17-gap-closing.md#2a-the-result-we-did-not-want-our-gap-has-no-demand-side-evidence)).

That does not sink the mission, and it is important to be exact about why. **The measurable claim
above is about correctness, not desirability**: today the number on screen is written by a language
model and recomputed by nothing, and that is a defect whether or not users have asked for it to be
fixed. What the missing demand evidence does sink is any sentence of the form *"users are crying
out for this"*. We do not write one.

The honest framing for the poster, and for the marker who asks:

> We can show that no product joins these four facts. We cannot yet show that anyone wants them
> joined. Establishing that is Project 2's M0 user work, and if it comes back negative the receipt
> is still worth shipping, because a score nobody can reproduce is a bug on its own terms.

## Three things this deliberately does not claim

1. **Not "nobody explains their recommendations".** Cooklist ships expiry reminders (confirmed by
   real user reviews, not just its mockup), RecipeFix reasons about substitutions, and **Mealie
   renders `"Substituting: {substitute} for {food}"` in shipped, public source.**
   The claim is the four-way *conjunction*, and we say on the poster that a conjunction gap is not
   a moat — Remy already holds every input and a chat surface to say it in.
2. **Not any reduction in food waste.** The closest published trial
   ([JMIR PMC9482070](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)) ran six students for a
   month per app and found no change. Four students in 160 hours cannot beat that design, so no
   percentage goes on the poster.
3. **Not "pantry lots".** `user_inventory` upserts by `(user_id, ingredient_id, location)` and
   **sums** quantities, so per-purchase lots do not exist in the schema. The word is "item"
   throughout, unless a milestone explicitly adds the table.

## The sentence a marker will challenge first, and the answer

**The challenge:** *"500/500 is a tautology. If you write the code so the total is the sum, of
course it passes — you have measured that addition works."*

**The answer, in three parts.**

*What is actually under test* is not that addition works, but that **the number shown to the user
is the number the system ranked with**, and that it is stable under nuisance variation in the
input. Today's build fails both for structural reasons: `inventory_recommender.py:51` has the model
author the integer, so there is nothing to sum, and nothing constrains two runs over the same
pantry to agree.

*The baseline is measured, not defined.* We run the identical harness against the current build on
the same 500 cases and report what it gives, including the observed run-to-run disagreement rate of
today's `match_score`. A baseline we asserted would deserve the challenge; one we measured does not.

*The formula is not the contribution, and we say so on the poster.* Grocy already publishes an
auditable due score. Our contribution is per-recommendation publication of the terms, plus one
named and defended disagreement with Grocy — its twenty points per expired ingredient against our
zero, which is a food-safety position we take deliberately, because prompt rule 5 at
`inventory_recommender.py:157` currently forbids only recipes made *entirely* of expired items and
therefore lets expired food ride along in every other case.

*And the honest concession.* The non-tautological half of the same harness is the **correctability
measure**: after one flagged line is corrected, the fraction of the 500 rankings whose order
changes. No amount of careful coding guarantees that in advance, and it is the first thing to cut
if the month runs short — see [`14-cut-list.md`](14-cut-list.md), Cut 8. If it is cut, we say it
was cut and name it as the open question we hand to Project 3.

## Stakeholders

The full table — eighteen stakeholders, each with a specific fear and a testable design decision —
is [`02b-stakeholders.md`](02b-stakeholders.md). The three the mission statement is directly
accountable to:

| Stakeholder | Fear | What this mission does about it |
|---|---|---|
| **The household co-resident who never installed the app** | Their food is inventoried and planned by software they never consented to | The receipt names every item it used, so what the system assumed about someone else's shelf becomes visible and correctable rather than silent |
| **The person with the allergy** | A model invents a substitution and the consequence is anaphylaxis, not a bad dinner | Ranking leaves the model entirely; Gemini describes a ranking it was handed and never selects food |
| **Whoever inherits this repository next semester** | A README boasting numbers nobody can reproduce, on a tree that does not build | Every number in the mission has a committed query behind it, and the harness that produces it ships with the code |
