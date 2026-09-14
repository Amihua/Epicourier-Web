# P01 — the headless attempt that produced nothing

Superseded by [`01-market-survey.md`](01-market-survey.md), which is the interactive rerun that
worked. This file is kept because the failure is evidence in its own right: it is why the survey
that exists was run a different way, and it carries the measurement that explains the outage.

**Nothing here is a market finding.** Two headless runs on 2026-09-13 returned an empty response
after zero successful searches and zero fetched pages. The raw transcripts are at
`p1b/evidence/gemini/runs/2026-09-13-P01-*`.

## Blocker 1 — the search backend is out of capacity, upstream

The agent's first action was a search, which returned:

```
503 Service Unavailable
"No capacity available for model gemini-3.5-flash-lite on the server"
reason: MODEL_CAPACITY_EXHAUSTED
retryDelay: 77980s
```

`search_web` in this CLI is implemented on top of `gemini-3.5-flash-lite`, and that model was
exhausted on the provider's side. The service's own suggested retry delay is about 21.7 hours.

**Changing the analyst model does not help, and this was tested rather than assumed.** Five models
were probed with the same minimal search:

| Model requested | search_web | Backend named in the error |
|---|---|---|
| `gemini-3.8-flash-high` | 503 | `gemini-3.5-flash-lite` |
| `gemini-3.1-pro-high` | 503 | `gemini-3.5-flash-lite` |
| `gemini-3.6-flash-high` | 503 | `gemini-3.5-flash-lite` |
| `gemini-3.7-flash-high` | 503 | `gemini-3.5-flash-lite` |
| `gpt-oss-120b-medium` | 503 | `gemini-3.5-flash-lite` |

Every model routes search through the same fixed helper, including a non-Gemini one. The limit
belongs to the tool implementation, not to the model selected.

The CLI also offers `claude-sonnet-4-6` and `claude-opus-4-6-thinking`. Neither was used and neither
should be: this column exists to be a third *independent* model, the team already has a Claude
column, and the rubric treats agreement manufactured by reusing one model as worthless.

## Blocker 2 — headless mode cannot answer a permission prompt

Both runs then stopped on a permission, not on the network:

```
P01:  permission check failed for read_url "mealime.com"
P10:  permission check failed for command "echo \"test\""
```

`agy --print` has no way to ask, so anything requiring consent is auto-denied and the whole run
aborts with no output. The `user denied` wording is misleading: no human refused anything.

Granting a narrow `read_url(*)` allow-rule fixed the first of these. The second could not be fixed
narrowly, because the agent legitimately needs shell to parse JavaScript-rendered pages — the denied
command was a Python one-liner decoding `self.__next_f.push([1,"..."])` chunks out of a Next.js page
it had already fetched.

## What actually unblocked it

Running interactively. The permission prompts then appear and can be judged one at a time, which is
also the right control for a tool that can execute arbitrary shell. Given shell, the model routed
around the search outage by itself — `lite.duckduckgo.com` and the Hacker News Algolia API both
answered, while `html.duckduckgo.com`, Brave and the Apple App Store did not.

The cost of the detour is recorded in the disclosure at the top of `01-market-survey.md`: discovery
breadth is narrower than a native search tool would give.
