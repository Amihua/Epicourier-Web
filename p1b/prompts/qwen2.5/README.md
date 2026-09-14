# Project 1b — Qwen2.5 Prompt Runbook (local model)

**Run date:** 2026-09-13 · **Model:** `qwen2.5:32b` via Ollama · **Analyst:** Jeffery (fzheng4)

This is the **local-model column** the assignment asks for. Qwen2.5:32B was run on the team
machine (2× NVIDIA RTX A5000) through Ollama — no cloud, no cost, no network.

## Method

- The team's shared evidence block ([`../claude/shared-evidence.md`](../claude/shared-evidence.md))
  was pasted, **unedited**, into every prompt, so this column is comparable to the Claude and
  Codex columns.
- Each of the **twelve starter prompts** (assignment-verbatim task text, with the same paste-in
  materials the other columns saw) was issued in a **separate, fresh call with no memory** of any
  other prompt — the same "independent analyst per prompt" discipline the Claude column used.
- Single-shot, `temperature=0.3`, `num_ctx=16384`.

## Honest limitation (this is the point of running it)

Qwen2.5 is a **local model with no web-retrieval tool**. Every product name, URL and price it
returns is a **recalled prior, not a fetched page** — so it **cannot satisfy the two-model rule's
"live URL" clause**. In practice it *ignored* the prompt-level evidence rule ("quote the page or
write unknown") and **fabricated URLs and prices wholesale** (invented `$9.99/mo` cells, a dead
product — Foodily — and a non-product — "Fitbit Food"). That is exactly the failure the
team-level two-model rule exists to catch, and it is written up as a caught-error result in
[`../../result/claude/16-prompt-report.md`](../../result/claude/16-prompt-report.md) / the D5
report, **not** used as evidence.

## Files

- Assembled column: [`../../result/qwen2.5/README.md`](../../result/qwen2.5/README.md)
- Per-prompt transcripts (prompt exactly as issued + raw output + timing/token meta):
  [`../../evidence/qwen2.5/runs/`](../../evidence/qwen2.5/runs/)

## To reproduce

```bash
ollama serve &                      # daemon
python3 prompts/run_starters.py run qwen        # writes evidence/qwen2.5/runs/
python3 prompts/run_starters.py assemble qwen   # writes result/qwen2.5/README.md
```

The harness ([`../run_starters.py`](../run_starters.py)) embeds the exact composed prompts.
