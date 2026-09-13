# Project 1b — Claude Prompt Runbook

**Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]` · **Analyst:** Andy (yyu55)

This is the Claude column. Sihao's Codex column is at [`../codex/`](../codex/); the `gemini/` and
`qwen2.5/` slots belong to other teammates.

- [`shared-evidence.md`](shared-evidence.md) — the evidence block pasted into every prompt. Paste
  it unedited if you rerun any of these on another model, or the comparison is not a comparison.
- [`invented-prompts.md`](invented-prompts.md) — our seven prompts, C1–C7, written to be
  model-agnostic.
- **The exact text of every prompt as issued**, together with the searches each agent actually ran
  and the pages it actually fetched, is in [`../../evidence/claude/runs/`](../../evidence/claude/runs/).
  Nothing below is a reconstruction; the runbook points at the record.

## Method

Every prompt went to a **fresh agent with no memory of any other agent's work.** If one model is
asked twelve questions in one conversation, its answer to question 7 is contaminated by its own
answer to question 1, and "independent analyst" quietly stops being true. The five market-survey
angles in particular were run blind to each other, so that where they agreed, the agreement meant
something.

Three orchestrated runs, 35 agents, zero failures, 1,310 tool calls — 210 web searches and 521
pages fetched.

## The twelve starters, as issued

| # | Starter | How it was issued here | Output |
|---|---|---|---|
| **P01** | Map the competition | Split into **five blind angles** — direct planners; pantry/waste apps; nutrition & fitness-first; AI-native and appliance ecosystems; open-source and the graveyard — each with the shared evidence block and the "no invented products / quote the page / write unknown" rules. A single analyst asked for "the ten closest" tends to return a remembered list; five analysts hunting different territory return a map. | [`01-market-survey.md`](../../result/claude/01-market-survey.md) · evidence: `sweep-*.md` |
| **P02** | Mine the complaints | Split by **source quality**: one agent on open-source issue trackers (grocy, mealie, tandoor, kitchenowl — every complaint has a permanent URL, a date and a thread of agreement), one on app-store review RSS and forums. Both required a verbatim quote with its URL or the theme was dropped. | evidence: `complaints-oss-issues.md`, `complaints-reviews-forums.md` |
| **P03** | Table stakes or differentiator? | Issued **after** the market survey, with the verified 14-rival matrix and the twenty canonical use cases extracted from the repository rather than from model memory. Added instruction: check the three features that *feel* distinctive hardest, and never launder an `unknown` into a differentiator. | [`02-table-stakes-vs-differentiator.md`](../../result/claude/02-table-stakes-vs-differentiator.md) |
| **P04** | The support material we have not read yet | Split into **law/accessibility/security** and **food domain/licences/human factors**. Each was asked for the specific clause, not the statute name — "find the success criterion the expiry colour-coding violates if colour is the only channel", "find the ASVS requirement IDs for object-level authorisation". Licences were grounded in *our* `package.json`, `pyproject.toml` and `data/README.md`, not the web. | [`04-support-material.md`](../../result/claude/04-support-material.md) |
| **P05** | Who else is in the room? | Issued as written, with a push past the obvious: the household member who never installed the app, the person with the allergy, the recipe author being summarised by an LLM, next semester's inheriting team. Asked additionally for *the one stakeholder the team is most likely to forget, and the cost of forgetting them*. | [`02b-stakeholders.md`](../../result/claude/02b-stakeholders.md) |
| **P06** | Three futures | Issued as written, plus the assignment's own warning quoted back: dull milestones lose marks and impossible ones lose more, so a SAFE option that is "fix the bugs and add a panel" will be marked dull. Kill signals were required to be an observable condition with a number and a date. | [`08-three-futures.md`](../../result/claude/08-three-futures.md) |
| **P07** | The gap, with receipts | Issued against **four** candidate gaps at once, each with five pre-committed confirming items and the refuting evidence, each to be marked FOUND or NOT_FOUND after actually looking. Explicit instruction: *we want at least one gap killed; a run that confirms everything is a run that checked nothing.* Two died. | [`01-market-survey.md`](../../result/claude/01-market-survey.md#the-gap-with-receipts) · evidence: `gap-interrogate.md` |
| **P08** | Mission statement, minus the buzzwords | Issued **last**, after the gap work, with the banned-word list enforced and two extra constraints: the measurable claim may not be a five-user comprehension test, and nothing may be promised that the schema cannot represent (there are no pantry lots). | [`11-mission-statements.md`](../../result/claude/11-mission-statements.md) |
| **P09** | Milestone reality check | Issued with the real budget arithmetic — 160 person-hours *minus* report, poster and demo — and required to put the budget verdict in the first line. | [`12-milestones.md`](../../result/claude/12-milestones.md) |
| **P10** | Red team | Issued as written, with one addition: *use web search to ground attacks 1 and 3; an ungrounded attack is worth less than a grounded one.* | evidence: `gap-redteam.md` |
| **P11** | Play to the team | Issued with the honest team position, including that individual biographies have not been collected — and with the methodological dispute put to the model directly, because the Codex analyst rejected git history as skill evidence and we did not agree. | [`10-team-fit.md`](../../result/claude/10-team-fit.md) |
| **P12** | The pivot question | Issued as written, with one added nudge: this team's demonstrated output in Project 1a was adversarial testing and evidence discipline, not shipping features, so at least one option that plays to *that* was required. | [`09-pivot.md`](../../result/claude/09-pivot.md) |

## Our own prompts, C1–C7

Full text in [`invented-prompts.md`](invented-prompts.md). They attack a different axis from
Sihao's P13–P20: his ask *is this rival real?*, ours ask *is our own analysis real?*

| # | Prompt | What it bought |
|---|---|---|
| **C1** | Catch them out | 129 genuine errors, 2 dead products unmasked, 1 fabricated feature. The highest-value prompt in the run. |
| **C2** | The citation audit | 80 regulation/standard URLs re-fetched; 2 substantive citation errors and 3 stale URLs caught. |
| **C3** | Make Project 1a pay | Weakened our own headline security claim and found the real bug underneath it. |
| **C4** | Disagreement forcing | 12 registered disagreements with the Codex analyst, including its self-contradiction. |
| **C5** | The autopsy, written in advance | The cut list, the claim freeze, and the sentence for the wall. |
| **C6** | Name the test | Deleted the untestable claims from the mission statement instead of softening them. |
| **C7** | The cut list | The order of sacrifice, with a dated trigger and the exact poster sentence each cut removes. |

## Sihao's prompts, rerun here

The Codex run closed by asking that **P13, P17, P19 and P20** be rerun independently on at least
two other models. This is that rerun: [`15-codex-prompt-reruns.md`](../../result/claude/15-codex-prompt-reruns.md).
P17 refuted our own surviving gap, which is the single most useful result the Claude column
produced.

## To rerun any of this on another model

1. Paste [`shared-evidence.md`](shared-evidence.md), unedited.
2. Paste the prompt body — from [`invented-prompts.md`](invented-prompts.md) for C1–C7, or from
   the `## Prompt, exactly as issued` block of the matching file in
   [`../../evidence/claude/runs/`](../../evidence/claude/runs/) for the starters.
3. Record the searches the model ran and the pages it fetched, not just its answer. Half the
   findings in this column came from noticing *where a quote lived on a page*, and that is
   invisible in a bare transcript.
