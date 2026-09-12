# Project 1b — Codex Prompt Runbook

Run date: 2026-09-12

This is a **Project 1b** requirements-discovery run. P1a artifacts are evidence inputs only.

## Global instruction used for all prompts

- Do not guess. Use `unknown` for unsupported facts.
- Cite live sources for changing or market claims.
- Hard constraint: four graduate students have one month, approximately 160 person-hours total, to build **and test**.
- Separate facts, inferences, hypotheses, and refuted claims.

## Shared evidence input

Epicourier is a Next.js/FastAPI/Supabase application combining recipe browsing, AI meal planning, meal scheduling, nutrient goals and history, challenges, pantry inventory and expiry status, inventory-based suggestions, and shopping-list-to-inventory flow. The canonical 20 existing use cases are in `p1a/use-cases/final-use-cases.md`. The recorded P1a functional reruns report Web 31/32 and Backend 18/18. The adversarial run found missing object-ownership checks, weak type/range validation, unbounded model inputs, and prompt-injection exposure. Individual current-team biographies are unknown.

## P01 — Map the competition

Role: market analyst. Use the shared product paragraph. List ten closest products as product | who uses it | main strength | main weakness | price | evidence URL. Omit invented products and write unknown for unsupported cells.

## P02 — Mine the complaints

Use the public complaint threads linked in the result. Cluster themes, rank frequency times severity, quote one complaint per theme, and say whether a current product fixes it. State the sampling limitation.

## P03 — Table stakes or differentiator?

Use all 20 canonical P1a use cases. Classify each as TABLE STAKES or DIFFERENTIATOR, justify against a named rival or say none was verified, and propose two unobserved use cases.

## P04 — Support material

Domain: consumer meal planning, nutrition tracking, pantry inventory, and AI recommendations. Produce a long prioritized list covering laws, accessibility, application/AI security, food/allergen guidance, privacy, licenses, data provenance, and operations.

## P05 — Who else is in the room?

Starting list: customer, staff, admin. Add people who pay, profit, may be harmed or ignored, regulate, maintain at 3 a.m., face liability, publish recipes, or have jobs changed. Give a fear and design decision for each.

## P06 — Three futures

Create distinct SAFE, BOLD, and WILD Epicourier i+1 proposals. For each give a pitch, one-month tested slice, biggest risk, and measurable kill signal. Do not merge them.

## P07 — The gap, with receipts

Interrogate: “No rival provides an auditable pantry-to-plan workflow that explains expiry, nutrition, cost, and safety trade-offs and records whether the recommendation reduced waste.” List five confirming and five refuting items, each FOUND with source or NOT FOUND. Say plainly if refuting evidence wins.

## P08 — Mission statement

Facts: existing Epicourier and stack above; audience is household cooks managing perishables; candidate detail is a receipt showing which pantry lots and unknown expiry data caused a recommendation. Write three five-sentence missions with why/what/so-what and a measurable M0 claim. Ban leverage, empower, seamless, revolutionize, cutting-edge, innovative, solution.

## P09 — Milestone reality check

Capacity: four students, four weeks, ten hours/person/week. Collective repository-demonstrated skills only: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI integration. Evaluate: evidence baseline, security fixes, typed recommendation receipt, full optimizer, closed-loop waste study, and delivery.

## P10 — Red team

Attack the recommended mission, milestones, and market survey on: nobody wants it; the team cannot build it; someone does it better. Provide evidence that would defeat every attack.

## P11 — Play to the team

Member A–D biographies are unknown. Candidate directions: secure explainable pantry planner, broader all-in-one expansion, retailer price optimizer/OCR, clean-slate CLI, or reusable receipt component. Recommend only from proven collective skills; do not invent member assignments.

## P12 — Pivot question

Facts: four students and 160 hours; P1a showed a broad existing feature set plus concrete authorization/input/prompt failures; the current stack and tests are reusable. Propose three genuinely different project forms and decide stay or pivot without hedging.

## Outputs

- Conversation record: `p1b/evidence/codex/2026-09-12-transcript.md`
- Metadata: `p1b/evidence/codex/metadata.md`
- Adjudicated outputs: `p1b/result/codex/README.md`
