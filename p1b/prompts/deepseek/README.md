# Project 1b — DeepSeek Prompt Runbook (third cloud model)

**Run date:** 2026-09-13 · **Model:** `deepseek-v4-pro` (DeepSeek V4, a reasoning model), via the
OpenAI-compatible API · **Analyst:** Jeffery (fzheng4)

This is the team's **third cloud analyst**, added so the market survey is checked by more than two
models. (It stands in for the Gemini slot the runbook originally sketched.)

## Method

- The team's shared evidence block ([`../claude/shared-evidence.md`](../claude/shared-evidence.md))
  was pasted, **unedited**, into every prompt.
- Each of the **twelve starter prompts** was issued in a **separate, fresh call with no memory** of
  any other prompt.
- `temperature=0.3`. `deepseek-v4-pro` is a reasoning model; the token budget was raised to leave
  room for its hidden reasoning after an initial pass returned an empty answer on P04.

## Honest limitations

- **No browsing tool was available via the API**, so — like the local model — its product names,
  URLs and prices are **recalled priors, not fetched pages**, and do not satisfy the two-model
  rule's live-URL clause. Where it independently names a rival the web-grounded columns also named,
  it adds to the "named by N models" count; where it invents a URL, that is a caught-error result.
- **Reasoning can starve the answer.** On the first pass P04 spent its entire budget on hidden
  reasoning tokens and returned nothing; it was rerun with a larger budget.

## Files

- Assembled column: [`../../result/deepseek/README.md`](../../result/deepseek/README.md)
- Per-prompt transcripts: [`../../evidence/deepseek/runs/`](../../evidence/deepseek/runs/)

## To reproduce

```bash
export DEEPSEEK_API_KEY=...  export DEEPSEEK_BASE_URL=https://api.deepseek.com
python3 prompts/run_starters.py run deepseek        # writes evidence/deepseek/runs/
python3 prompts/run_starters.py assemble deepseek   # writes result/deepseek/README.md
```

The harness ([`../run_starters.py`](../run_starters.py)) embeds the exact composed prompts.
The API key is a secret — pass it via the environment; do **not** commit it.
