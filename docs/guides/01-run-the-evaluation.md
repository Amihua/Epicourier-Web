# Run the evaluation in under a minute

The quickest way to see what this project is for. No install, no API key, no database, no network.

```bash
git clone https://github.com/Amihua/Epicourier-Web.git
cd Epicourier-Web
python3 p2/eval/run_eval.py
```

You should see something like this:

```
M0 · rule_version=receipt-v1 · as_of_date=2026-10-10 · 2 case(s)

ok    corrupted: rejected as required, 6 violation(s), all 4 planted defects found
ok    hand-computed: 3 receipts, no violations

ok    scorer-vs-hand-computed: the real scorer matches every hand-written value
ok    corrections: top-up, expiry, unit and relocation edits all move the score as the rules say
ok    corpus: 500 cells scored, 6120 receipt lines, every receipt adds up; 25 cells x 20 shuffles order-blind

------------------------------------------------------------------------
M0 hypotheses (see p2/eval/HYPOTHESIS.md)

  H1  MET    500/500 = 100.0%  (threshold 100%)  every displayed total is the sum of its displayed parts
      baseline: 0/300 (old path cannot decompose at all)
  ...
PASS
```

## What each line is claiming

| Line | Claim |
|---|---|
| `corrupted` | A receipt with four planted defects **was rejected**. If this ever passes, every green line above it is worthless, so it is checked first. |
| `hand-computed` | Expectations written by hand from the contract, before any scorer existed, still hold. |
| `scorer-vs-hand-computed` | The real scorer agrees with those hand-written values, line by line. Two independent derivations matching. |
| `corrections` | Editing inventory moves the score the way the rules say — including one edit that must move nothing. |
| `corpus` | All 500 cells of the real dataset produce receipts that add up and do not depend on array order. |

## Watch it fail

A suite that cannot fail proves nothing, so prove it can:

```bash
python3 p2/eval/run_eval.py --case corrupted
```

That case is *supposed* to be rejected, and the runner says so explicitly. To see a real failure,
break something on purpose — edit a `rank_score` in `p2/eval/cases/hand-computed.json` and run again:

```
FAIL  scorer-vs-hand-computed:
        scorer_rank_score: recipe 101 hand-computed 7.5, scorer 3.0
```

Put it back with `git checkout p2/eval/cases/hand-computed.json`.

## Next

- [Add a scoring rule](02-add-a-scoring-rule.md)
- [Change the contract](03-change-the-contract.md)
