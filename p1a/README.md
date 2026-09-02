# CSC510 Project 1a — Deliverables

This directory collects the source artifacts used to assemble the single Project 1a PDF for Moodle.

Repository: [Epicourier-Web](https://github.com/Amihua/Epicourier-Web)

## D1 — Product choice

Product-choice document: `p1a/product-choice.md` (**not yet added**).

The document should be added after the team confirms the real product-selection history. The repository URL is [https://github.com/Amihua/Epicourier-Web](https://github.com/Amihua/Epicourier-Web).

## D2 — Final 20 use cases

Canonical deliverable:

- [Final 20 use cases](use-cases/final-use-cases.md)

Supporting model outputs:

- [Codex use cases](use-cases/p1a_codex/use-cases.md)
- [Gemini use cases](use-cases/p1a_gemini/use-cases.md)
- [Claude use cases](use-cases/p1a_claude/use-cases.md)
- [qwen2.5 use cases](use-cases/p1a_qwen2.5/use-cases.md)

## D3 — Tests and results

Test code:

- [Web P1a tests](../web/tests/p1a/)
- [Backend P1a tests](../backend/tests/sihao/p1a/)

Results tables:

- [Own-test results](evidence/own-tests/RESULTS.md)
- [Adversarial-test results](evidence/own-tests/ATTACK-RESULTS.md)

Raw test output:

- [Combined Web P1a and security output](evidence/own-tests/2026-08-29-web-p1a-all-with-security-raw.txt)
- [Combined Backend P1a and security output](evidence/own-tests/2026-08-29-backend-p1a-all-with-security-raw.txt)
- [Web P1a rerun output](evidence/own-tests/2026-08-29-web-p1a-rerun-raw.txt)
- [Backend P1a rerun output](evidence/own-tests/2026-08-29-backend-p1a-rerun-raw.txt)
- [Original Web-test baseline](evidence/baseline/original-web-tests-raw.txt)
- [Original Backend-test baseline](evidence/baseline/original-backend-tests-raw.txt)

## D4 — Test-to-use-case traceability

Canonical deliverable:

- [Final human-verified traceability](traceability/final-traceability.md)

Design baseline:

- [Final 20 use cases](use-cases/final-use-cases.md)

Supporting model-specific traceability:

- [Codex traceability](traceability/p1a_codex_traceability.md)
- [Gemini traceability](traceability/p1a_gemini_traceability.md)
- [Claude traceability](traceability/p1a_claude_traceability.md)

## D5 — Prompt notes and cross-model comparison

Canonical deliverable:

- [Prompt × model comparison and reconciliation](prompts/step8-prompt-model-table.md)

Model records:

| Model | Prompt | Response or run record | Derived use cases |
|---|---|---|---|
| Codex | [prompt.md](prompts/codex/prompt.md) | [response.md](prompts/codex/response.md) | [Use cases](use-cases/p1a_codex/use-cases.md) |
| Gemini | [prompt.md](prompts/gemini/prompt.md) | [response.md](prompts/gemini/response.md) | [Use cases](use-cases/p1a_gemini/use-cases.md) |
| Claude | [prompt.md](prompts/claude/prompt.md) | [response.md](prompts/claude/response.md) | [Use cases](use-cases/p1a_claude/use-cases.md) |
| qwen2.5:32b local | [prompt.md](prompts/qwen2.5/prompt.md) | [response.md](prompts/qwen2.5/response.md) | [Use cases](use-cases/p1a_qwen2.5/use-cases.md) |

Local-model scripts:

- [Local-model runner](scripts/run_local_model.py)
- [Context-gathering script](scripts/gather_context_mini.sh)

## PDF assembly order

1. D1 — Product choice
2. D2 — Final 20 use cases
3. D3 — Tests, representative raw output, and results tables
4. D4 — Final traceability and project-test coverage discussion
5. D5 — Prompt notes and cross-model comparison
6. Repository evidence links or a short appendix

## File checklist

- [ ] Add `p1a/product-choice.md` after confirming the team selection history.
- [x] D2 final use cases
- [x] D3 test code, result tables, and raw output
- [x] D4 final traceability
- [x] D5 canonical cross-model comparison and model records
- [ ] Assemble and verify the single PDF
