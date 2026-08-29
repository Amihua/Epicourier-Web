# CSC510 Project 1a

This directory contains our use cases, test evidence, LLM prompt records,
traceability analysis, and ACM report for Project 1a.

Edited Date: 2026.08.29

Prompt:

```
You are a senior software engineer independently reverse-engineering
Epicourier-Web.

IMPORTANT CLEAN-ROOM CONSTRAINT:

During this task, do not inspect, search, cite, or use any existing test case,
test name, test implementation, test plan, coverage report, or pre-existing
use-case list from the Epicourier repository.

Forbidden sources include, but are not limited to:

- web/__tests__/
- web/e2e/
- backend/tests/
- data/test_recipe.py
- AGENT-PLAN/07-TESTING-STRATEGY.md
- any file whose main purpose is testing, test coverage, or test-case design

You still have repository access, but for this task you must derive the design
independently from product artifacts such as:

- README.md and INSTALL.md
- docs/user-guides/
- web/src/
- backend/api/
- supabase/migrations/
- product architecture documentation that is not a testing document

If you accidentally rely on a forbidden source, explicitly disclose it and
do not use that conclusion.

COURSE FORMAT EXAMPLE:

The following example comes from an unrelated food-delivery system. It is
provided ONLY to demonstrate the required use-case structure.

You must NOT:
- count this example as one of the 20 Epicourier use cases;
- reuse its actors, scenarios, extensions, or postconditions;
- replace food-delivery nouns with Epicourier nouns and call it a new use case;
- assume Epicourier supports any behavior shown in this example.

[Paste “The structure of a use case” table here.]

[Paste only “UC1: Place order” from usecases0.md here.]

TASK:

Independently identify exactly 20 of the most important user-facing use cases
implemented by Epicourier-Web.

Use this exact format for every use case:

## UC<number>: <Verb + noun>

| Part | Content |
|---|---|
| **Name** | <Actor's goal: verb + noun> |
| **Primary actor** | <Who wants the goal> |
| **Stakeholders & interests** | <Who else cares and what they want> |
| **Preconditions** | <What must already be true> |
| **Trigger** | <Event that begins the use case> |
| **Main success scenario** | 1. <Step>. 2. <Step>. 3. <Step>. |
| **Extensions** | 2a: <Variation/failure> → <system behavior>. |
| **Postconditions** | <What is guaranteed after success> |

RULES:

1. Produce exactly 20 Epicourier use cases.
2. Use verb + noun names from the primary actor's perspective.
3. Keep the main success scenario as the happy path only.
4. Put all branches and failures in Extensions.
5. Key extensions to main-flow steps, such as 2a or 4b.
6. Describe what the actor and system do, not UI widgets, databases, APIs,
   frameworks, or internal functions.
7. Do not copy or paraphrase pre-existing test cases or use-case lists.
8. Verify every claimed feature against permitted product artifacts.
9. Mark unsupported claims as UNSUPPORTED instead of guessing.
10. Do not include the course example in the final 20.

After the 20 use cases, provide this separate verification table:

| UC | Permitted product evidence | File and line | Confidence | Concern |
|---|---|---|---|---|
```

