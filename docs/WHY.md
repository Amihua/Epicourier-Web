# Why this project exists

## The number nobody can check

Epicourier recommends recipes from what is in your kitchen. Open the recommendation dialog and a
match percentage appears in bold, next to a sentence explaining the choice.

Both are written by a language model. No line of our code computes either one.

`RecommendedRecipe` — the whole of what the recommender returns — is this:

```python
recipe_id: int
recipe_name: str
match_score: int          # 0-100
ingredients_available: List[str]
ingredients_missing: List[str]
expiring_ingredients_used: List[str]
reason: str               # free text
```

There is no field that could hold a per-ingredient contribution, so **no score it returns can be
broken down into the things that produced it.** That is not an estimate. It is a property of the
schema, and `p2/baseline/run_baseline.py --check-schema-only` re-derives it from the class rather
than restating it.

Three consequences follow, and the third is the one that matters.

**A user who disagrees has nothing to point at.** The spinach you already used is still counted.
There is no line to correct, because there are no lines.

**The same input can give a different answer.** How different is unknown — measuring it needs 30
live calls we have not made, and that figure is recorded as *not collected* rather than estimated.

**We cannot tell whether a change improved the ranking or merely moved it.** This is the real cost.
A team that cannot measure its own ranking cannot improve it on purpose. Every tuning decision
becomes a matter of taste, and taste does not survive a code review.

## What we are building

A receipt.

Not an explanation — an explanation is prose, and prose is what we already have. A receipt is a list
of lines that add up to the total, where each line names the pantry item, its date, and the points it
contributed, and the user can correct any line and watch the order change.

The ranking moves out of the model and into a pure function scored against a published table. The
model keeps the job it is good at: writing the sentence that describes a ranking it was handed. It
loses the authority to invent the number.

## Why this is worth a month

The hard part is not the arithmetic. It is proving the arithmetic is trustworthy, which is why M0 —
the evaluation — came before the scorer rather than after it.

`p2/eval/HYPOTHESIS.md` states three falsifiable claims with thresholds and baselines. The one that
captures the whole project:

> **H1.** Every displayed total is the sum of its displayed parts.
> **Threshold:** 500 / 500. Zero tolerance.
> **Baseline:** 0 / 300 — the current path cannot decompose a score at all.

Zero to a hundred percent is the entire change, stated as a number before anything was built.

## How we know it is not circular

The expectations in `p2/eval/cases/hand-computed.json` were written from the contract **before the
scorer existed**. The scorer was then written independently against the same contract. They agree on
every value — three totals, nine subtotals, fifteen receipt lines, including the four cases a scorer
gets wrong quietly: a requirement of zero that stays zero, stock expiring exactly today that is still
usable, expired stock at zero available, and a stored quantity with no unit that is left unresolved
rather than guessed.

Two independent derivations matching is evidence. A function compared with itself is not, which is
why `p2/eval/cases/corrupted.json` exists: four planted defects, and the suite is required to reject
it. CI asserts that rejection in its own step, because a suite that cannot fail proves nothing about
the suite that passes.

The evaluation has already caught its own author. A hand-computed line said `status: "ok"` for stock
that had expired while the recipe needed zero of it; the harness said the contract called that
`"expired"`. Both readings were defensible, which was the actual defect — `status` was conflating *is
this row usable* with *was this requirement met*. The contract was fixed, not the check.

## What we are not claiming

- We have not measured how unstable the current recommender is. That needs live calls. It is marked
  not collected, in three places, rather than filled with a plausible number.
- A receipt is not correctness. It makes the ranking checkable; whether the ranking is *good* is a
  separate question and a later one.
- Nothing here removes the model. It writes the explanation. It no longer writes the score.

## Where to look next

| You want | Read |
|---|---|
| to see it run, in a minute, with nothing installed | [guides/01-run-the-evaluation.md](guides/01-run-the-evaluation.md) |
| the rules, frozen | [`p2/contracts/receipt-v1.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/p2/contracts/receipt-v1.md) |
| what is measured and what is not | [p2/evaluation.md](p2/evaluation.md) |
| the API reference | [api/backend/](api/backend/) and [api/web/](api/web/) |
