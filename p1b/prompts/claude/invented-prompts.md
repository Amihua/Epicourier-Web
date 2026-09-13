# Project 1b — Prompts of Our Own (Claude run)

The assignment says the twelve starters "are not enough" and that the higher scores go to teams
that invent better prompts. These seven are ours. They are written to be model-agnostic: paste
[`shared-evidence.md`](shared-evidence.md) in first, then the prompt body, and they will run on
Gemini or a local model unchanged.

The design principle behind all seven is the same one that makes the twelve starters work — role,
real evidence, fixed output format, no guessing — plus one addition the starters do not have:
**every prompt has a way to come back wrong.** A prompt that cannot fail cannot be evidence.

Sihao's Codex run contributed a separate, non-overlapping set (P13–P20, competitor discovery by
workflow proof) at [`../codex/market-support-prompts.md`](../codex/market-support-prompts.md).
Ours attack a different axis: not "is this rival real?" but "is *our own analysis* real?"

---

## C1 — Catch them out

**Why it exists.** The two-model rule filters invented *products*. Nothing in the twelve starters
filters invented *features*, invented *prices*, or a real URL attached to a claim the page does
not make. This prompt makes one model the adversary of another model's output, which is cheaper
than a second vendor and catches a different class of error.

**Why it can fail:** if the first analyst was clean, this prompt returns an empty corrections
array, and that is a reportable result.

```
You are a fact-checker. Another analyst claimed the following products exist and have the
quoted features. Your job is to CATCH THEM OUT. Assume each claim is wrong until the page
proves it right.

<paste the evidence rules>

CLAIMS TO CHECK:
<paste the other analyst's rows as JSON: name, url, quoted_evidence, price, feature claims>

For EACH product:
1. Actually fetch the URL. Record whether it resolved.
2. Search for the product's official site, help centre, and app-store listing INDEPENDENTLY of
   the URL you were given — the analyst may have given you a plausible URL that does not exist.
3. Find the quoted evidence on the page. If the quote is not there, say CLAIM_UNSUPPORTED and
   record exactly what the page says instead.
4. Check the price on the official pricing page as of <date>.
5. Fill the feature matrix row from page text only. "unknown" is the right answer when the page
   is silent.

The "corrections" array is the most important output: every specific error the first analyst
made — invented product, wrong URL, quote not on the page, price out of date, feature claimed
that the page does not support, feature denied that the page does support. If a product checks
out completely, return an empty corrections array for it and say so.
```

---

## C2 — The citation audit

**Why it exists.** Prompt 4 asks for laws and standards. Models are at their most confident and
least reliable exactly here: regulation names are memorable, their URLs and clause numbers are
not. A cited standard that has been renumbered is indistinguishable from a correct one until
someone fetches it.

```
You are a fact-checker. Another analyst produced this support-material list.

<paste the list: source_name, url, quoted_text — one row each>

For each: fetch the URL. Does it resolve? Is the quoted text actually on that page?

Regulations and standards get renumbered, superseded and moved, and an analyst working from
memory will produce confident, wrong URLs — that is exactly what you are here to catch. Record a
specific correction for every failure and an empty correction for every clean one. Do not repair
a bad citation silently; report it, then give the correct one.
```

---

## C3 — Make Project 1a pay

**Why it exists.** Project 1b is graded on engineering evidence, and the team already owns a
month of it. But a Project 1a finding is only evidence for Project 1b if the defect is *still
there*. This prompt forbids the model from citing last month's test result without re-reading
this month's source — and it deliberately invites the model to *weaken* our own claims.

**Why it can fail:** if Supabase RLS already blocks the IDOR, our headline security finding is
application-layer only. The prompt asks for that answer explicitly, because discovering it now is
cheaper than having a marker discover it at the poster session.

```
You are auditing a repository to turn Project 1a's findings into Project 1b's engineering
evidence. Work from the actual files, not from memory.

REPOSITORY: <path>

Read: the P1a results tables, the traceability table, the canonical use cases, the raw run logs,
and the actual defective source files.

Produce:
1. The canonical use cases with one-line summaries, verbatim from the repo.
2. An "evidence boast" paragraph for a poster: the strongest TRUE claim about our P1a testing,
   using only numbers that appear in our own run logs. Give the exact number and the file it came
   from. Do NOT use the inherited README's test-count boast — that is the previous team's claim,
   not ours. Flag it explicitly if you see anyone tempted to.
3. A prioritised defect list: for each recorded FAIL, the file and line the defect lives at,
   whether you CONFIRMED it is still present in current source, the hours a competent fix plus a
   regression test would take, and whether a database-layer control might already mitigate it —
   if it does, some of our "failures" are application-layer only, and saying so honestly is a
   stronger result than overclaiming a vulnerability.
4. The three defects that MUST be fixed before any new feature ships, with the reason.
```

---

## C4 — Disagreement forcing

**Why it exists.** The rubric says "All models agreed on everything" reads as one model used
three times. Running the same prompt on three models and hoping they differ leaves the most
valuable output to chance. This prompt makes disagreement the *deliverable*: one model is shown
another model's conclusions and is scored on where it dissents and on what evidence would settle
it. It is the single highest-yield prompt we wrote.

**Why it can fail:** the register can come back empty, or the challenger can lose every
disagreement on checking — both are reportable, and both are more informative than agreement.

```
You are a second analyst reviewing a rival analyst's work. Your value to the team comes ENTIRELY
from where you disagree with it. Agreement is cheap confirmation; disagreement is where the marks
are. Do not be contrarian for sport — but do not soften a real disagreement either.

<paste the shared evidence block>
<paste the rival model's conclusions, verbatim or faithfully summarised, and say which model
 produced them>

1. NAME EVERY POINT WHERE YOU DISAGREE. For each: the rival's position, yours, the evidence that
   would settle it, and then go and get that evidence.
2. NAME WHERE YOU AGREE AND WHY THAT AGREEMENT IS STRONG — specifically, which of its conclusions
   you independently verified rather than merely accepted. An agreement you did not check is not
   confirmation, it is an echo.
3. NAME THE THING BOTH OF YOU MAY HAVE MISSED because you are both language models reasoning from
   published web text about a domain whose truth lives in people's kitchens.

Output a DISAGREEMENT REGISTER table first:
| # | Topic | Rival position | My position | Evidence that would settle it | Status after my check |
```

---

## C5 — The autopsy, written in advance

**Why it exists.** Prompt 9 asks whether a milestone is realistic, and a model will answer in the
abstract. A pre-mortem gets a different and better answer, because it asks the model to *assume
the failure has already happened* and explain it. Failure is easier to explain than to predict.

```
Write a failure autopsy IN ADVANCE. Assume it is one month from now. The project FAILED: the team
demoed something dull, the poster did not sell it, and the marker wrote "ambitious claims, thin
evidence".

<paste the plan, the budget constraint, and the P1a facts>

Write the autopsy as if it already happened. Be specific and unkind:
- Week by week, what actually consumed the hours? Name the specific task that ran long.
- Which single decision, made in week 1, caused the failure?
- What did the team build that nobody asked for?
- What did the team NOT build that the poster promised?
- Where did the evidence turn out to be thinner than claimed?

Then work backwards: the five changes to make NOW, this week, that would have prevented each
failure, ranked by failure prevented per hour spent. End with the single sentence the team should
write on the wall.
```

---

## C6 — Name the test

**Why it exists.** D2 requires the *so what* to carry a measurable claim — metric, threshold,
baseline — that Project 2's M0 evaluation will test. "Users will trust it more" is not that.
This prompt refuses to let a benefit through unless a specific executable test can be named for
it, with the fixture, the assertion and the number that decides pass or fail. Any benefit that
cannot be tested is deleted, not softened.

```
For each claimed benefit below, write the TEST that would prove it — not a description of a test,
the test itself.

<paste the mission statement's "so what" claims and the milestone list>

For each benefit, output:
| Benefit | Test name | Fixture (the exact inputs and starting state) | Assertion | Threshold that decides pass/fail | Baseline it is compared against | Who or what produces the number | Hours to build the test |

Rules:
- A threshold is a number. "Improved" is not a threshold. "Most users" is not a threshold.
- A baseline is a measurement of the CURRENT state, taken before the change. If no baseline
  exists, the first row of your table is the work of measuring it.
- If a claimed benefit cannot be given a test that four students could run in one month, mark it
  UNTESTABLE and say so. We will delete it from the mission statement rather than ship a claim we
  cannot check. List the untestable ones first.
```

---

## C7 — The cut list

**Why it exists.** Prompt 9 sorts milestones into REALISTIC / STRETCH / FANTASY, which is a
judgement made while the month still looks long. What actually happens is that week 3 arrives and
something has to go. Deciding the order *now*, while nobody is panicking, is worth more than the
classification — and the order reveals which milestones the team secretly does not believe in.

```
The team will run out of time. Assume it. Your job is to decide the order of sacrifice NOW, while
nobody is panicking, rather than in week 4, when the decision will be made badly.

<paste the milestone list, the budget, and the team's other obligations — report, poster, demo>

Produce a strict cut list: an ordered sequence of everything that would be dropped, first to last,
as hours run out. For each entry:
- What is cut.
- The hours it returns.
- What the team can still honestly claim after cutting it.
- What the poster must then stop saying.
- The trigger: the observable condition, with a date, that fires this cut.

Then name the IRREDUCIBLE CORE: what remains after every possible cut, and the exact number of
hours it costs. If the irreducible core is larger than the budget, say so plainly — that finding
is the most useful thing this prompt can produce, and it is better found this week than in week 4.
```
