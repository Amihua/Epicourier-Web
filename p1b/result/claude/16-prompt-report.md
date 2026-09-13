# D5 — Prompt Report (Claude column)

**Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`, driven from
Claude Code with web search and web fetch enabled · **Analyst:** Andy (yyu55)

This is the Claude column only. The Codex column is Sihao's, at
[`../codex/README.md`](../codex/README.md); the Gemini and local-model columns belong to other
teammates and are not claimed here.

---

## 1. How the prompts were run, and why the method matters

Every prompt was issued to a **fresh agent with no memory of any other agent's work**. That is not
a convenience; it is the point. If one model is asked twelve questions in one conversation, the
answer to question 7 is contaminated by its own answer to question 1, and the "independent
analyst" framing the assignment asks for quietly collapses. Running each prompt cold, and running
the five market-survey angles cold *against each other*, is what makes the agreements between them
worth anything.

Five orchestrated runs, **42 agents, zero failures**:

| Run | Prompts | Agents |
|---|---|---:|
| 1 — Market survey | P01 ×5 angles, **C1** ×6 fact-check groups, P02 ×2 sources, P07, P10 | 15 |
| 2 — Independent prompts | P04 ×2 slices, **C2** ×2, P05, **C3**, **C4**, **C5** | 8 |
| 3 — Decide and commit | P03, P06, P08, P09, P11, P12, **C6**, **C7**, and Codex's P13/P17/P19/P20 rerun | 12 |
| 4 — Dropped-rival verification | **C1** again, on the three load-bearing rivals the cap had dropped | 3 |
| 5 — Closing the limitations | Samsung via Wayback, Reddit via `.rss`, real-device evidence for Cooklist, and nine more rivals at source level | 4 |

**Audit trail: 1,629 tool calls — 220 web searches and 534 `WebFetch` retrievals.** Pages pulled
with `curl` (the iTunes lookup API, GitHub API, Wayback, Reddit `.rss`) are additional and are not
in that figure, so it understates retrieval rather than inflating it. Every agent's prompt as
issued, the searches it actually ran, the pages it actually retrieved and its full response are in
[`../../evidence/claude/runs/`](../../evidence/claude/runs/). Raw machine-readable transcripts are
in [`../../evidence/claude/raw/`](../../evidence/claude/raw/).

## 2. What came back wrong, and how each was caught

**142 corrections recorded across 18 products and 80 citations; 129 were genuine errors.** The full
ledger, including the thirteen entries the checker verified and found *correct*, is
[`05-caught-errors.md`](05-caught-errors.md). Headlines:

| Error class | n | The one that mattered most |
|---|---:|---|
| Product not actually on the market | 14 | **Fridgely** — presented as a live rival with receipt-photo entry. Its App Store ID 404s, the store links on its own site 404, and "receipt-photo entry" was **fabricated**: the cited page contains zero occurrences of `receipt`, `photo`, `snap` or `grocery`. |
| Quote not on the page / spliced / misattributed | 19 | **Eatvora** — two "feature" quotes turned out to be steps of a generic listicle on Eatvora's own marketing page, under a heading reading "Why Eatvora Is the Best…". |
| Price wrong, stale or never checked | 19 | **KitchenPal** — the vendor page says "completely free… at no cost"; the App Store listing carries seven paid tiers, $1.99–$39.99. |
| Claim stronger than the page supports | 12 | **Eat This Much** — called "the only rival that generates plans from inventory against nutrient targets"; its own cited help page says the opposite, twice. |
| Feature fabricated outright | 2 | (Fridgely, above; Eatvora's "shop-the-gaps list", a name that appears nowhere.) |
| Citation errors in law/standards | 2 | **FSIS** — the infant-formula safety exception was attributed to "Best if Used By"; the page assigns it to "Use-By". The quote contradicted its own source, and the URL resolved perfectly. |

### The error that outranks all 129: one of our own citations

Our G1 confirming evidence cited a Cooklist customer review dated 2023-07-09. A fourth-run
fact-checker pulled **272 unique Cooklist reviews** from the iTunes review RSS, spanning
2018-06-14 to 2026-08-05 and including **all 45 from calendar 2023**. The one review actually dated
2023-07-09 is by `AngryNorsemen3`, titled "Best app for food management", and is about autofill
miscategorising cream cheese jalapeño. The sentence we quoted returns **zero hits** across the
whole corpus. **We withdrew the citation.**

Every other error in this report is Claude misreading someone else's page. This one was a
fabricated-looking citation inside our own deliverable, supporting our own central claim — which is
precisely what a marker is entitled to spot-check.

**The mechanism that caught them was not a second vendor's model.** It was a second *Claude* agent
with no memory of the first, told to assume every claim was wrong until the page proved it right,
and given no credit for agreeing (prompt **C1**). That is worth stating plainly because it is the
cheapest thing in this report to reproduce and it caught more than the two-model rule did.

### A later audit found 129 more, and they were all ours

Everything above concerns errors about **the market**. A sixth run then audited the *reasoning* in
the ten result files that had only ever been checked mechanically, and found **129 findings, 56
HIGH, plus 23 cross-file contradictions** — including a charge against our own Project 1a that its
own scope note refutes, a Codex self-contradiction we manufactured by truncating a quote at a
comma, and a "9,232-file codebase" that was a Python virtualenv. See
[`18-self-audit.md`](18-self-audit.md). The lesson is one sentence: *the facts checking out and the
argument holding are not the same question.*

### The three errors that were ours, not the market's

The most valuable catches were self-inflicted:

1. **We killed two of our own four candidate gaps** (P07). G2 "nothing measures waste outcomes" is
   refuted by five shipping products *and* is unmeasurable in 160 hours — the closest published
   trial ([JMIR PMC9482070](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)) ran six students
   for a month and found no change. Without this check a waste-reduction percentage would have
   gone on the poster. G4 "nothing connects a calorie target to groceries" is refuted by Eat This
   Much, Prospre and Cooklist.
2. **We refuted our own surviving gap** (P17). *RecipeFix* markets on "**No black-box AI.** Every
   substitution comes with the culinary reasoning behind it", and takes correction in natural
   language. Four of the six things G1 claimed nobody ships, ship. G1 survives only in the narrow
   form: *explaining a recommendation against inventory state and a date.*
3. **We endangered our surviving gap a second time, withdrew a citation doing it, and then caught
   our own over-correction** (C1, fourth run). **Cooklist** — 11,297 iOS ratings — advertises
   *"Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it."*
   Before writing that up we opened the image: its status bar reads `Sketch` at `9:41 AM`, so it is
   a vendor mockup, not a device capture (a control screenshot in the same listing *is* genuine).
   G1's narrow form is therefore **endangered, not settled**, the action item is to install the app,
   and what we claim on the poster is the four-way conjunction — a conjunction gap, **not a moat**,
   since Remy already holds every input and a chat surface to say it in.
4. **We weakened our own headline security finding** (C3). The cross-user IDOR we reported in
   Project 1a is probably a false positive at system level — `shopping_list_items` has no
   `user_id` column and RLS enforces ownership through the parent list, so the fix its failing
   test demands would query a column that does not exist. We also confirmed that most of our
   Project 1a "security tests" are **source-text greps, not executed attacks**. Reporting eleven
   failures without saying so inflates them.

## 3. The most useful prompts, and the least

### Most useful

| Prompt | Why |
|---|---|
| **C1 — Catch them out** *(ours)* | Produced 129 genuine errors, unmasked two dead products and one fabricated feature. Every other market claim in this report is only trustworthy because this ran. Highest value per token in the entire run. |
| **P17 — Disconfirmation sprint** *(Codex's, rerun here)* | The only prompt designed to make us lose, and the only one that did. It narrowed our central claim from something a reviewer would have broken in fifteen seconds to something defensible. |
| **P07 — The gap, with receipts** | Killed two of four gaps and narrowed a third. The structure that does the work is the *pre-committed* list of five confirming and five refuting items, each marked FOUND or NOT_FOUND — it makes "I looked and found nothing" a reportable result instead of a silence. |
| **C4 — Disagreement forcing** *(ours)* | Twelve registered disagreements with the Codex analyst, including one where Codex rejected git history as skill evidence in its D5 ledger and then used repository evidence to assert team capability three sections later. Makes disagreement a deliverable instead of leaving it to luck. |
| **C3 — Make Project 1a pay** *(ours)* | The only prompt that reduced our claims. It found the real UC20 bug — RLS blocks the cross-user write, but the route never checks how many rows it touched, so it returns `success: true` for transfers that did not happen while the inventory row *was* inserted — and it found `shopping_list_shares`, a table shipped code writes to that has **no migration, no RLS and no policy** anywhere in the repository. |

### Least useful

| Prompt | Why |
|---|---|
| **P08 — Mission statement** | Made **zero** tool calls. It is a writing prompt, and its output is a pure function of what you feed it; run before P07/P17/P20 it would have produced five fluent sentences about a gap that does not exist. Useful *last*, worthless *first* — which is a scheduling finding, not a criticism of the prompt. |
| **P05 — Who else is in the room?** | Produced the best single table in the run — eighteen stakeholders, each with a testable design decision — on **zero** tool calls. That is exactly the problem: nothing in it can be checked, and one of its rows was invalidated within the hour by C3. High value, unverifiable, and we have flagged the affected rows in place rather than editing them away. |
| **P12 — The pivot question** | *Reassessed 2026-09-13.* An earlier draft of this row said P12 "answered stay the course". **It did not** — [`09-pivot.md`](09-pivot.md) returns **Pivot**, on the grounds that the chosen plan puts on its critical path the three things this team has zero commits behind: a production `.tsx` change, a Supabase migration, and an RLS policy. That is the most uncomfortable finding in the column and it is **unresolved**, so P12 moves out of "least useful" entirely. The row was wrong because the summary was written without reading the file — which is the same failure this report spends 10,000 words documenting. |
| **P10 — Red team** *(still valuable, but not where expected)* | Its three named fronts were largely already covered by P07 and P17. Its genuine contribution was one sentence — *"fourteen products, several funded, several sitting on the pantry data required, independently chose not to ship a recommendation rationale. What do you know that they don't?"* |

**The generalisation.** The prompts that earned their marks were the ones that could come back
*against* us. Every high-yield prompt in this run — C1, P17, P07, C4, C3 — has a failure mode where
it returns "you are wrong". Every low-yield one — P08, P05 — is a prompt that cannot be wrong in a
checkable way, and those produced our most fluent and least defensible output.

## 4. Prompt × model comparison

### P01 — Market survey

| | **Codex** (Sihao) | **Claude** (this column) |
|---|---|---|
| Rivals reported | 7, refused to pad to 10 | 14 confirmed live + 4 confirmed dead, from 48 distinct candidates after name normalisation |
| Method | One analyst, live-source rule | Five blind angles → adversarial fact-check of every claim |
| Dead products found | 0 | **4** (Mealime, Kitche, Fridgely, CozZo) |
| Verdict on the broad expiry gap | DEAD, on Samsung Food+ and Eat This Much **marketing pages** | DEAD, but for different reasons — one of Codex's two pillars does not hold |
| Notable failure | Listed **Mealime** as a live rival with a "main strength" | Could not reach `samsungfood.com/food-plus/` (HTTP 403); Reddit unreachable all session; **WebSearch hit a hard 200-call session cap** in three of three run-3 sessions |

**Cross-model catches, both directions.** This is the part the rubric asks for, and it did not go
one way:

- *Claude caught Codex.* Codex's rival table lists **Mealime** as a live competitor. Mealime's own
  site announces discontinuation on 2026-10-21. Codex's row is stale.
- *Claude caught Codex.* Codex killed the expiry gap partly on "Eat This Much advertises
  pantry-prioritized automatic planning". Eat This Much's own help centre says it prioritises
  **leftovers** and decrements the pantry by *assumed consumption timing*, explicitly not shelf
  life. That pillar does not support the claim it was used for (disagreement **D3**).
- *Codex held against Claude.* Codex's Samsung Food+ pillar is substantially right, and Claude
  **could not verify it** — `samsungfood.com/food-plus/` returned HTTP 403 to every Claude agent.
  We record it as unverified-on-our-run, not as contradicted. Codex reached a source we could not.
- *Both models were wrong in the same direction once.* Neither analyst noticed, until C4 forced the
  question, that Epicourier's UC17 prompt labels ingredients `EXPIRED` and recommends cooking them
  anyway. Two models reading marketing pages converge on marketing questions; a food-safety defect
  sitting in our own prompt template was invisible to both.

#### Two-model rule: which rivals survive

The rule is *named by two of our LLMs, **or** one gives a live URL*. Applied honestly:

| Rival | Codex | Claude | Survives by |
|---|:-:|:-:|---|
| Samsung Food / Food+ | ✓ | ✓ | **two models** + live URL |
| Eat This Much | ✓ | ✓ | **two models** + live URL |
| Paprika Recipe Manager | ✓ | ✓ | **two models** + live URL |
| SideChef | ✓ | ✓ | **two models** + live URL |
| SuperCook | ✓ | ✓ | **two models** + live URL (Claude adds: no update since 2022-06-15) |
| Mealime | ✓ | ✓ | **two models** — but Claude establishes it is **discontinued 2026-10-21** |
| MyFitnessPal Premium+ | ✓ | — | live URL (Codex) |
| Plan to Eat, AnyList, Prepear, NoWaste, KitchenPal, Eatvora, PantryWise, Xpiry, "OH, a potato!" | — | ✓ | live URL, each independently re-fetched by a second agent |
| **Cooklist** | — | ✓ | live URL — **verified only in the fourth run, and it endangers our own gap**; 11,297 iOS ratings |
| **Remy** | — | ✓ | live URL — verified from its shipped web bundle's i18n table, not its marketing copy |
| **Grocy** | — | ✓ | live URL + GitHub API + the formula confirmed in `migrations/0249.sql` |
| Kitche, Fridgely, CozZo | — | ✓ | **excluded from the rival set** — confirmed withdrawn; retained as prior art only |

Six rivals clear the two-model bar outright. Thirteen more clear the live-URL bar. Three are struck.
The three added last are the ones that mattered most, which is the argument for not capping
verification by relevance ranking: **relevance ranking is a guess, and ours was wrong.**

### P10 — Red team

| | **Codex** | **Claude** |
|---|---|---|
| Front 1, nobody wants it | Auditability may be the team's engineering preference, not a household pain | Same conclusion, grounded harder: [Bansal et al., CHI 2021](https://idl.cs.washington.edu/files/2021-AIExplanationsTeamPerformance-CHI.pdf) finds explanations raise acceptance **regardless of correctness** — so Codex's own named risk, "decorative explanations", is the documented *default*, not a tail case |
| Front 2, cannot build it | Existing failures + unknown biographies | Named the specific blocker: `user_inventory` upserts by `(user_id, ingredient_id, location)` and **sums** quantities, so there are no per-purchase lots — "show which pantry **lot**" is not representable in the schema |
| Front 3, someone does it better | Samsung Food+, Eat This Much, SuperCook | **Grocy** publishes an integer "Due Score" formula — auditable ranking already ships, in open source; plus **Remy** ships all three legs free (2 US ratings), and **Plan to Eat** publicly retreated from the pantry |
| Killer question | — | *"Fourteen products, several funded, several sitting on the data required, independently chose not to ship this. What do you know that they don't?"* |

The two red teams agree on the *shape* of every attack and disagree on every *source*. Codex argued
from vendor marketing; Claude argued from an open-source competitor's published formula, a vendor's
published retreat, a peer-reviewed null result and an HCI paper. Agreement on shape is cheap
confirmation; the difference in sourcing is where the marks are.

## 5. Model assessment, one line each

**Claude Opus 5 — strength.** Sustained, verifiable retrieval under an adversarial harness: 1,629
tool calls across 42 independent agents, and — the part that matters — it reliably argued *against*
its own prior output when instructed to, overturning two of its own gaps, refuting its own
surviving gap, and downgrading our own headline security finding.

**Claude Opus 5 — weakness.** Its unverified first pass was confidently wrong 129 times: it
fabricated features, quoted marketing listicles as vendor feature text, and read two zombie
websites as shipping products. It is trustworthy only inside a checking harness, never on one pass.
It also hit a hard **200-search session cap in three of three run-3 sessions**, which silently
degraded later agents to direct fetches — a limitation the agents reported themselves, and one
nobody would see if they had not been asked to record their own searches.

**Codex (Sihao's column) — as seen from here.** Strength: conservative source discipline, explicit
`unknown`s, and a refusal to pad seven rivals to ten. Weakness: single-pass, so nothing checked it —
it carried a discontinued product as a live rival and killed a gap on a marketing page, and it
contradicted itself between §11 and its own D5 ledger on whether repository evidence is admissible.

## 6. The local model

**No local model was run for the Claude column, and none is claimed.** Ollama is installed on this
machine and the daemon starts, but the model library is empty — `ollama list` returns no rows. The
`qwen2.5:32b` used in Project 1a ran on a lab server (`/mnt/data1/sliu78`) that was not reachable
from this session, and a 7B model pulled locally would not be the same analyst, so pretending
otherwise would have been worse than the honest gap. The `qwen2.5` slot at
[`../../prompts/qwen2.5/`](../../prompts/qwen2.5/) is a separate column and remains unfilled.

The assignment loses no marks for an absent local model, and this is the one honest sentence it
asks for in exchange.

## 7. What this column cannot support

Three of the limitations first recorded here were later **closed**, and the account of how is in
[`17-gap-closing.md`](17-gap-closing.md). Two of them turned out not to be properties of the
sources at all, but of how we asked — a finding worth more than the evidence it recovered:

- **Reddit was reachable all along.** `.rss` instead of `.json`, exponential backoff for the 429s,
  and *short* keyword queries with `restrict_sr=1`. We got all three wrong and wrote down
  "unreachable". 851 entries indexed on the retry.
- **Samsung Food+ was reachable all along**, through the Wayback Machine. Price resolved, and every
  Food+ feature confirmed first-party as *"Exclusively on mobile app"* — which matters, because our
  product is a web app and the closest rival's strongest feature does not exist on our platform.
- **The verification cap is closed for the relevant set**: 21 verified, then 9 more; 10 skipped as
  irrelevant and named as skipped; ~7 never examined.

What remains, honestly:

- **Our gap has no demand-side evidence.** A regex sweep across 851 Reddit entries for eleven
  explainability phrasings returned **zero hits** in any meal, pantry or recipe context. We can show
  no product joins the four facts; we cannot show anyone wants them joined. This is a searched
  negative and it is the most important limitation in the report.
- **No user interviews**, and no rival installed by anyone on this team — the cheapest remaining
  improvement to our evidence, and an hour's work.
- **The paywall gap.** EverShelf's recipe engine is Premium and was not bought; Nosh AI is partly
  Pro-gated; ChefGPT is behind a sign-in. For the three closed products with the most plausible
  architecture we verified marketing surfaces, not running paid features.
- **Complaint evidence is a convenience sample**, not a frequency estimate.
- **Three prompts produced their answers with zero retrieval** (P05, P08, and the P09
  classification). They are model priors, labelled as such, and should be read as drafting aids
  rather than as evidence.
