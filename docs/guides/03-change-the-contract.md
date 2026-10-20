# Change the contract

Four modules read the same payload. The contract is what stops them drifting apart, and
`additionalProperties: false` is what makes drift a failing test rather than a surprise in week three.

So a new field is never a one-file change. This is the order.

## 1. Open an issue first

Say what the field is, which module needs it, and what the consumer does when it is absent. Half of
the proposals die here, which is cheaper than finding out after three modules have adopted it.

## 2. One PR, four files, nothing else

| File | What changes |
|---|---|
| `p2/contracts/receipt-v1.md` | the prose, which is normative |
| `p2/contracts/receipt-v1.schema.json` | the machine-checkable form |
| `web/src/types/receipt.ts` | the TypeScript mirror |
| `backend/api/receipt_models.py` | the Python mirror |

The contract tests in `backend/tests/p2/test_contract_fixtures.py` check that the schema still
declares every object, that no definition allows unknown fields, and that the status and source enums
stay closed. If your field needs a new enum value, widen the enum in the same PR or the test fails.

Do not put the producer or the consumer change in this PR. A contract PR that also changes behaviour
cannot be reviewed as a contract.

## 3. Then the producers, then the consumers

Merge the contract first. Everyone else rebases onto it. Changing a consumer before the contract
works on your machine and breaks the moment another module reads the same payload.

## Worked example: the bound that was missing

While building the 500-cell corpus, a negative requirement was planted in one cell to prove the check
could fail. It did fail — and the failure came from the Python model, not from the harness:

```
corpus_error: cell 52764-5 raised ValidationError:
  candidates.0.requirements.8.quantity
  Input should be greater than or equal to 0
```

The scorer enforced `quantity >= 0`. The JSON schema said only `["number", "null"]`. Both were
defensible on their own, and together they meant a consumer reading the contract would believe
negatives were allowed while the producer rejected them.

The fix went in the contract, not the code: `minimum: 0` on both the requirement and the inventory
quantity, plus a note in the TypeScript doc comment saying where the bound came from. The
implementation did not change, because the implementation was right — the contract was simply looser
than the thing it was supposed to describe.

That is the usual shape of a contract change. Most of them are not new features; they are the
contract catching up with a rule the code already enforces.

## What never changes without a decision

Two items are deliberately unresolved and are recorded in `receipt-v1.md` §2 as **D1** and **D2**.
They are implemented and tested, so changing either is a code change and a contract change at once,
and both need four-way sign-off. Do not quietly pick a different answer.
