# Gemini column — run metadata

**Analyst:** Wenbo (wli56) · **All runs:** 2026-09-13

Two mandatory prompts, two different channels, because the first channel broke mid-column. Both
channels and both failures are recorded here; nothing below is reconstructed from memory.

## Channels used

| Channel | Used for | Identification |
|---|---|---|
| Antigravity CLI (`agy`) **1.1.24**, at `~/.local/bin/agy` | P10 red team | Model `gemini-3.8-flash-high` (Gemini 3.8 Flash, reasoning High), confirmed in the session's own `init` event. Session `24fc6090-0d85-424d-bbf6-dd2d9ad2404e`. |
| Gemini web app | P01 market survey | Session had web-search grounding; no repository access of any kind. |

The CLI version is recorded on the day of the run on purpose: the binary self-updates, and the
Project 1a record was left naming a version that no longer matched by the time anyone checked.

## Prompts issued

Both were extracted verbatim from the `## Prompt, exactly as issued` blocks of the Claude column's
run records, so this column received the same input the Claude column did.

| Prompt | Source of text | Copy issued |
|---|---|---|
| P01 market survey, direct-planners angle | `p1b/evidence/claude/runs/sweep-direct-planners.md` | `p1b/prompts/gemini/P01-ready-to-paste.txt`, 52 lines |
| P10 red team | `p1b/evidence/claude/runs/gap-redteam.md` | `p1b/prompts/gemini/P10-ready-to-paste.txt`, 168 lines including the verified-market JSON |

One thing was deliberately **not** edited: the P01 text carries a Claude-Code-specific instruction to
load tools via `ToolSearch`. Rewriting it would have made the input differ from the Claude column's,
so it was left in place; Gemini reached for its own tools instead.

## Failure 1 — the CLI's web search was out of capacity, upstream

Every `search_web` call in every CLI session returned:

```
503 Service Unavailable
"No capacity available for model gemini-3.5-flash-lite on the server"
reason: MODEL_CAPACITY_EXHAUSTED
retryDelay: 77980s
```

`search_web` is implemented on top of `gemini-3.5-flash-lite`, which was exhausted provider-side. The
suggested retry delay is about 21.7 hours.

**Switching the analyst model does not help, and this was tested rather than assumed:**

| Model requested | search_web | Backend named in the error |
|---|---|---|
| `gemini-3.8-flash-high` | 503 | `gemini-3.5-flash-lite` |
| `gemini-3.1-pro-high` | 503 | `gemini-3.5-flash-lite` |
| `gemini-3.6-flash-high` | 503 | `gemini-3.5-flash-lite` |
| `gemini-3.7-flash-high` | 503 | `gemini-3.5-flash-lite` |
| `gpt-oss-120b-medium` | 503 | `gemini-3.5-flash-lite` |

Every model, including a non-Gemini one, routes search through the same fixed helper. The limit
belongs to the tool implementation, not to the analyst model.

The CLI also offers `claude-sonnet-4-6` and `claude-opus-4-6-thinking`. Neither was used and neither
should be: this column exists to be a third *independent* model, the team already has a Claude
column, and the rubric treats agreement manufactured by reusing one model as worthless.

## Failure 2 — headless mode cannot answer a permission prompt

The first two runs were issued with `agy --print` and both aborted with an empty response:

```
P01:  permission check failed for read_url "mealime.com"
P10:  permission check failed for command "echo \"test\""
```

stderr explains it: *"a tool required the ... permission that headless mode cannot prompt for, so it
was auto-denied."* The `user denied` wording is misleading — no human refused anything. Raw
transcripts: `runs/2026-09-13-P01-market-survey.jsonl`, `runs/2026-09-13-P10-red-team.jsonl`.

A narrow `read_url(*)` allow-rule was added to `~/.gemini/antigravity-cli/settings.json`, which fixed
URL fetching but not shell, because the agent legitimately needs shell to parse JavaScript-rendered
pages. Running **interactively** was what unblocked it: the prompts then appear one at a time and can
be judged, which is also the right control for a tool that can execute arbitrary commands.

## What each channel produced

**P10, CLI, interactive.** 29 tool calls, 26 successful. With shell available the model routed around
the search outage by itself: `lite.duckduckgo.com` and the Hacker News Algolia API answered, while
`html.duckduckgo.com`, Brave and Apple's App Store did not. Four pages fetched with
`read_url_content`. Full trajectory: `runs/2026-09-13-P10-tool-trajectory.md`. Result:
`result/gemini/10-red-team.md`.

**P01, web app.** After the CLI account reached its individual quota — reset roughly 167 hours out —
the survey was run in the Gemini web app instead. The first web session had no browsing tools and
correctly refused to invent anything, marking all sixty feature cells `unknown`; that attempt, and
the three things it still got wrong, are at `runs/2026-09-13-P01-webapp-attempt.md`. The second
session had search and produced the survey at `result/gemini/01-market-survey.md`.

## Verification performed on this column's own output

The P01 survey was checked after the fact rather than filed as received. Three claims did not stand:
a dead product (PlateJoy, `NXDOMAIN`) reported as a live priced rival on the strength of a third-party
review blog; two Samsung Food+ quotations attributed to a URL that returns HTTP 403 here; and two rows
resting on a competitor-comparison site and an App Store user review rather than on the vendor. All
three are recorded in the survey itself, above its content, with the commands used to check them.
