#!/usr/bin/env python3
"""Send the shared keeper prompt + codebase context to a local Ollama model.
Uses the exact same prompt as other models (Codex, Claude, Gemini) per course requirement."""
import ollama
import sys
from pathlib import Path

CONTEXT_FILE = Path(__file__).parent / "context_mini.txt"
MODEL = "qwen2.5:32b"

# Exact shared keeper prompt from p1a/README.md, with placeholders filled in
KEEPER_PROMPT = r"""You are a senior software engineer independently reverse-engineering
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

## The structure of a use case

| Part | What it says |
|---|---|
| **Name** | Verb + noun, actor's goal ("Place order") |
| **Primary actor** | Who wants the goal |
| **Stakeholders & interests** | Who else cares, what they want |
| **Preconditions** | Must be true before start |
| **Trigger** | Event that kicks it off |
| **Main success scenario** | Numbered steps, actor ↔ system, happy path only |
| **Extensions** | Numbered variations/failures, keyed to steps ("3a: card declined → ...") |
| **Postconditions** | Guaranteed true on success |

## UC1: Place order

| Part | Content |
|---|---|
| **Name** | Place order |
| **Primary actor** | Customer |
| **Stakeholders & interests** | Customer: fast, correct meal. Restaurant: accurate order, payment. Platform: commission, fraud avoidance. |
| **Preconditions** | Customer registered and logged in; at least one restaurant open and in range. |
| **Trigger** | Customer decides to order food. |
| **Main success scenario** | 1. Customer browses nearby restaurants. 2. Customer selects restaurant and views menu. 3. Customer adds items to cart. 4. Customer confirms delivery address and pays. 5. System charges payment and creates the order. 6. System confirms order with estimated delivery time. |
| **Extensions** | 3a: Item out of stock → system hides or marks it; customer picks another. 4a: Address outside delivery zone → system rejects, asks for new address. 5a: Payment declined → system asks for another payment method. |
| **Postconditions** | Order exists, paid for, and is queued for the restaurant; customer has confirmation and ETA. |

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

Below is the codebase (permitted product artifacts only). Read it all, then produce the 20 use cases.

"""

def main():
    context = CONTEXT_FILE.read_text()
    full_prompt = KEEPER_PROMPT + context

    print(f"Sending {len(full_prompt)} chars to {MODEL}...", file=sys.stderr)
    print(f"Estimated tokens: ~{len(full_prompt)//4}", file=sys.stderr)

    response = ollama.chat(
        model=MODEL,
        messages=[
            {"role": "user", "content": full_prompt},
        ],
        options={"num_ctx": 32768, "temperature": 0.3, "num_predict": 16384},  # qwen2.5:32b max ctx is 32768
    )

    output = response["message"]["content"]
    print(output)

    out_path = Path(__file__).parent.parent / "prompts" / "qwen2.5" / "response.md"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(output)

    prompt_path = Path(__file__).parent.parent / "prompts" / "qwen2.5" / "prompt.md"
    prompt_path.write_text(KEEPER_PROMPT.strip() + "\n\n[codebase context from context_slim.txt appended here]\n")

    print(f"\nResponse saved to {out_path}", file=sys.stderr)
    print(f"Prompt saved to {prompt_path}", file=sys.stderr)

if __name__ == "__main__":
    main()
