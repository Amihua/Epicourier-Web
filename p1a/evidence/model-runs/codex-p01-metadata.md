# Codex P01 Fresh-Run Metadata

- **Run date:** 2026-09-02
- **Thread ID:** `01a0629b-b87a-7ff1-89ce-64156f64f621`
- **Model:** `gpt-5.6-sol`
- **Codex CLI:** `0.152.1`
- **Invocation source:** `codex exec`
- **Working directory:** `/mnt/data1/sliu78/Epicourier-Web`
- **Prompt:** `p1a/prompts/codex/prompt.md`
- **Transcript:** `p1a/evidence/model-runs/codex-p01-transcript.jsonl`
- **Final response:** `p1a/evidence/model-runs/codex-p01-response.md`

## Clean-room controls

The session was instructed to read the P01 prompt and only the permitted product artifacts named there. The inner read-only `bwrap` sandbox could not initialize in this environment, so the successful run used the CLI external-sandbox mode. The prompt prohibited repository modification, and the transcript was audited after completion.

The executed commands accessed only:

- `p1a/prompts/codex/prompt.md`
- `README.md` and `INSTALL.md`
- `docs/user-guides/`
- `web/src/`
- `backend/api/`
- `supabase/migrations/`

No command accessed existing tests, prior use-case sets, traceability documents, model responses, or other forbidden P1a evidence. The final response contains exactly 20 use cases and 20 verification rows.

## Notable result

The fresh run independently included **Add recipe ingredients** as UC5. The earlier Codex baseline omitted that goal, while Gemini and Claude found it. This demonstrates genuine run-to-run disagreement rather than identical outputs relabeled as different model runs.
