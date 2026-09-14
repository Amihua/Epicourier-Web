#!/usr/bin/env python3
"""Project 1b — run the 12 starter prompts through a non-Claude/Codex model column.

Usage:
    python run_models.py run   deepseek|qwen
    python run_models.py assemble deepseek|qwen

Each prompt is a single-shot, fresh-context call (no conversation memory), so every
prompt is an independent analyst exactly like the Claude column's fresh-agent method.
Shared evidence block is pasted into every prompt, unedited, per the runbook.

ponytail: one file, stdlib + curl-free urllib. No framework, no dep added.
"""
import json, os, sys, time, urllib.request, urllib.error, pathlib, datetime

REPO = pathlib.Path(__file__).resolve().parents[1]  # the p1b/ directory
SHARED = (REPO / "prompts/claude/shared-evidence.md").read_text()
RUN_DATE = "2026-09-13"

MODELS = {
    "deepseek": {"id": "deepseek-v4-pro", "dir": "deepseek"},
    "qwen":     {"id": "qwen2.5:32b",     "dir": "qwen2.5"},
}

# ---- paste-in materials (same inputs every column saw) --------------------
USE_CASES = """UC1 Register account; UC2 Sign in; UC3 Browse recipes; UC4 View recipe details;
UC5 Request a personalized meal plan; UC6 Schedule a meal; UC7 Track meal completion;
UC8 Review nutrient progress; UC9 Set nutrient goals; UC10 Export nutrient history;
UC11 Review achievements; UC12 Join a wellness challenge; UC13 Review inventory;
UC14 Add inventory item; UC15 Edit inventory item; UC16 Remove inventory items;
UC17 Get inventory-based recipe suggestions; UC18 Create and populate shopping list;
UC19 Generate shopping list from meal plan; UC20 Complete shopping and stock inventory."""

COMPLAINTS = """1. "hard time adding my own recipes/meals ... to the Meal Planner" (MyFitnessPal user) — https://www.reddit.com/r/Myfitnesspal/comments/1lknx5e/
2. "Easier pantry management" (Paprika feature-request thread) — https://www.reddit.com/r/PaprikaApp/comments/1miegwj/
3. "only available to premium plus members" (MyFitnessPal user) — https://www.reddit.com/r/Myfitnesspal/comments/1l34c5v/
4. no social-media/video import (Paprika comparison thread) — https://www.reddit.com/r/PaprikaApp/comments/1tud35i/
5. "EXPORT ... or SHARE directly to email" request (Paprika thread) — https://www.reddit.com/r/PaprikaApp/comments/1uq1smi/"""

GAP = ('No rival provides an auditable pantry-to-plan workflow that explains the expiry, '
       'nutrition, cost, and safety trade-offs behind a recommendation and lets the user '
       'correct the inputs.')

MILESTONES = """- M0: build a dated rival feature matrix + a baseline functional/security test harness.
- M1: fix the recorded P1a defects (object-ownership/IDOR on shopping/transfer, weak type/range
  validation, unbounded LLM free-text inputs = prompt-injection surface).
- M2: ship one typed "recommendation receipt" endpoint + UI (names pantry lots, expiry dates,
  nutrient constraints, substitutions; ranking computed by pure code, not the LLM; user-correctable).
- M3: full weekly meal optimizer with live retailer prices, stores, allergies, and nutrition.
- M4: statistically valid food-waste-reduction study with real households.
- M5: report, poster, demo."""

MISSION = ('Extend Epicourier with a "recommendation receipt" that names the exact pantry lots, '
           'expiry dates, nutrient constraints, and substitutions that caused a recipe to rank, '
           'computed by a pure function (not the Gemini LLM) and correctable by the user. '
           'Measurable M0: across 50 recipes x 10 seeded pantries (500 recommendations), the '
           'displayed total equals the sum of the displayed line items in 500/500 cases and the '
           'ordering is byte-identical across 20 shuffles of inventory input order.')

SURVEY = ('Verified live rivals include Samsung Food/Food+, Eat This Much, Mealime, Paprika, '
          'SideChef, MyFitnessPal, SuperCook, Cooklist, Grocy, Mealie, Tandoor, KitchenOwl, '
          'RecipeFix, Prospre. Samsung Food+ and Eat This Much already prioritize near-expiry '
          'pantry items; RecipeFix ships substitution reasoning; Grocy computes an expiry due-score.')

DIRECTIONS = """- secure explainable pantry planner (the recommendation receipt);
- broader all-in-one expansion (more planner features);
- retailer price optimizer / grocery-receipt OCR;
- clean-slate CLI security-regression tool for CRUD apps;
- reusable "receipt" component/library;
- dump the old product and start fresh in a new language."""

P1A = ('Epicourier is a Next.js/FastAPI/Supabase meal planner. Our adversarial testing found '
       'object-ownership/IDOR gaps on the shopping-list and purchased-transfer paths, weak '
       'type/range validation (negatives, Boolean("false")->true), unbounded LLM free-text inputs '
       '(a live prompt-injection surface), and a recipe "match percentage" the UI prints in bold '
       'that the Gemini LLM writes and no line of our code recomputes.')

SKILLS = ('Individual member biographies are UNKNOWN. Collective, repository-demonstrated skills '
          'only: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration.')

# ---- the 12 starters (assignment-verbatim task text, placeholders filled) --
STARTERS = [
 ("p01","map-competition","Map the competition",
  "You are a market analyst. Our product, in one paragraph: see the evidence block above (section A).\n\n"
  "List the ten closest competing products. Output a table: product | who uses it | main strength | "
  "main weakness | price | evidence URL.\n\nRules: no invented products. If you are not sure a product "
  "exists, leave it out. If you cannot support a claim, write \"unknown\" \u2014 do not fill the cell with "
  "something plausible."),
 ("p02","mine-complaints","Mine the complaints",
  "Below are real user complaints about products like ours (collected by the team from issue trackers, "
  "review excerpts, and forum posts):\n\n"+COMPLAINTS+"\n\nCluster these complaints into themes. Rank the "
  "themes by frequency times severity. For each theme: quote one complaint verbatim as evidence, and say "
  "whether any current product has fixed it. The unfixed themes are our opportunity list. State the "
  "sampling limitation."),
 ("p03","table-stakes","Table stakes or differentiator?",
  "Here are our 20 use cases from Project 1a:\n\n"+USE_CASES+"\n\nClassify each: TABLE STAKES (every rival "
  "has it; we must too) or DIFFERENTIATOR (rare or absent in rivals). One sentence of justification each "
  "\u2014 name the rival that has it, or state that none does.\n\nThen propose two use cases that appear in "
  "NO current product but follow naturally from ours. For each: who wants it, and why nobody has built it yet."),
 ("p04","support-material","The support material we have not read yet",
  "We are designing Epicourier for the domain of consumer meal planning, nutrition tracking, pantry "
  "inventory, and AI recommendations. We know the code. We do not yet know the world around it.\n\n"
  "What support material would change this design if we read it? Make a LONG list. Consider at least: "
  "laws and regulations (privacy/data protection, consumer protection, food/health codes); standards "
  "(accessibility WCAG/ADA, security OWASP, relevant ISO/IEEE); licenses (of our dependencies and data); "
  "domain knowledge (medical/nutrition/food-safety practice guides); human factors (on-call load our "
  "product imposes). For each item: name a real, findable source; one sentence on which of our use cases "
  "it touches; and rate it MUST-READ / SHOULD-READ / SKIM."),
 ("p05","stakeholders","Who else is in the room?",
  "Our stakeholders so far: customer, staff, admin.\n\nThat list is lazy. Extend it. Consider: who pays, "
  "who profits, who is harmed, who is ignored, who regulates, who maintains this at 3 a.m., who gets sued "
  "when it fails, whose job changes because it exists.\n\nFor each new stakeholder: what they fear about "
  "our product, and one design decision that would win them over. Output as a table."),
 ("p06","three-futures","Three futures",
  "Our product: see the evidence block above.\n\nPropose three versions: SAFE (obvious next step), BOLD "
  "(a real bet), and WILD (probably wrong, but instructive). For each: elevator pitch (two sentences); "
  "what four students could build AND test of it in one month; the biggest risk; the kill signal "
  "(\"we abandon this version if we see ___\", an observable condition with a number and a date). "
  "Do not blend them into one compromise."),
 ("p07","gap-receipts","The gap, with receipts",
  "We claim this market gap: \""+GAP+"\"\n\nInterrogate the claim. What evidence would CONFIRM the gap is "
  "real? List five findable items. What evidence would REFUTE it (an existing product we missed, evidence "
  "that nobody wants it)? For each item, mark FOUND (with source) or NOT FOUND. If the refuting evidence "
  "wins, say so plainly. We want at least one gap killed; a run that confirms everything checked nothing."),
 ("p08","mission","Mission statement, minus the buzzwords",
  "A mission statement gives the WHY (the challenge), the WHAT (the thing we build), and the SO WHAT (the "
  "benefit).\n\nFacts about our product: existing Epicourier and the stack in the evidence block; audience "
  "is household cooks managing perishables; candidate distinctive detail is a receipt showing which pantry "
  "lots and unknown-expiry data caused a recommendation.\n\nWrite three candidate mission statements, five "
  "sentences each. Banned words: leverage, empower, seamless, revolutionize, cutting-edge, innovative, "
  "solution. Each candidate must contain one concrete detail a rival could not copy-paste, and one "
  "measurable M0 claim (metric, threshold, baseline)."),
 ("p09","milestones","Milestone reality check",
  "The team: four graduate students, one month to build AND test, roughly ten hours per person per week "
  "(~160 person-hours total). Skills: "+SKILLS+"\n\nOur draft milestones:\n"+MILESTONES+"\n\nClassify each: "
  "REALISTIC / STRETCH / FANTASY, with one sentence of why, judged against the hours above \u2014 not against "
  "a funded startup. For every FANTASY, propose the largest slice of it that would be REALISTIC. Dull "
  "milestones lose marks, impossible ones lose more."),
 ("p10","red-team","Red team",
  "You are hostile to our proposal. Below: our mission statement, milestones, and market survey.\n\n"
  "MISSION: "+MISSION+"\n\nMILESTONES:\n"+MILESTONES+"\n\nMARKET SURVEY: "+SURVEY+"\n\nAttack on three "
  "fronts: (1) nobody wants it \u2014 the need is imagined; (2) they cannot build it \u2014 the month is too "
  "short, the team too green; (3) someone does it better \u2014 name who. Make each attack as strong as you "
  "honestly can; no strawmen. Then, for each attack, state what evidence would defeat it."),
 ("p11","team-fit","Play to the team",
  "Here are the skills of the current team, stated honestly:\n"+SKILLS+"\n\nCandidate directions for our "
  "product:\n"+DIRECTIONS+"\n\nGiven these skills \u2014 not the skills we wish we had \u2014 what is a good "
  "approach? Which direction lets this team build and test the most in one month, and why? Which direction "
  "is a trap (needs a skill nobody has)? Where one needed skill is missing, is it learnable in a weekend or "
  "should we redesign around it? Who should own what, so nobody is a bottleneck?"),
 ("p12","pivot","The pivot question",
  "Forget our current plan for a moment. Here are the facts:\n- Team: four graduate students, ~10 hours "
  "each per week, one month to build AND test.\n- Team skills, honest: "+SKILLS+"\n- What we learned in "
  "Project 1a: "+P1A+"\n\nIs there a DIFFERENT kind of project we should be exploring \u2014 one we have not "
  "considered because we anchored on the Project 1a product? Propose three genuinely different project "
  "kinds (different domain, user, or form: CLI vs web vs library vs bot). For each: why THIS team "
  "specifically would be unusually good at it; what a one-month build-and-test slice looks like; what we "
  "lose by walking away. Then answer plainly: stay the course, or pivot? No hedging."),
]

def compose(body):
    return (SHARED + "\n\n---\n\n## TASK (Project 1b starter prompt, issued to an independent analyst)\n\n" + body)

def call_deepseek(prompt):
    body = json.dumps({"model": MODELS["deepseek"]["id"],
                       "messages":[{"role":"user","content":prompt}],
                       "temperature":0.3, "max_tokens":int(os.environ.get("DS_MAXTOK","8000")), "stream":False}).encode()
    req = urllib.request.Request(os.environ["DEEPSEEK_BASE_URL"]+"/chat/completions", data=body,
        headers={"Authorization":"Bearer "+os.environ["DEEPSEEK_API_KEY"],"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=1200) as r:
        d = json.load(r)
    m = d["choices"][0]["message"]
    return m.get("content","").strip(), {"usage":d.get("usage"),"reasoning_len":len(m.get("reasoning_content") or "")}

def call_qwen(prompt):
    body = json.dumps({"model": MODELS["qwen"]["id"],
                       "messages":[{"role":"user","content":prompt}],
                       "options":{"temperature":0.3,"num_ctx":16384}, "stream":False}).encode()
    req = urllib.request.Request("http://localhost:11434/api/chat", data=body,
        headers={"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=900) as r:
        d = json.load(r)
    return d["message"]["content"].strip(), {"eval_count":d.get("eval_count"),"prompt_eval_count":d.get("prompt_eval_count")}

def run(kind, only=None):
    m = MODELS[kind]; caller = call_deepseek if kind=="deepseek" else call_qwen
    outdir = REPO/"evidence"/m["dir"]/"runs"; outdir.mkdir(parents=True, exist_ok=True)
    starters = [s for s in STARTERS if (only is None or s[0] in only)]
    for pid, slug, title, body in starters:
        prompt = compose(body); t0=time.time()
        try:
            out, meta = caller(prompt); err=None
        except Exception as e:
            out, meta, err = "", {}, f"{type(e).__name__}: {e}"
        dt = round(time.time()-t0,1)
        fn = outdir/f"{pid}-{slug}.md"
        fn.write_text(
          f"# {pid.upper()} \u2014 {title} ({m['id']})\n\n"
          f"- Run date: {RUN_DATE}\n- Model: `{m['id']}`\n"
          f"- Method: single-shot API call, fresh context (no conversation memory), "
          f"{'no web retrieval (offline model priors)' if kind=='qwen' else 'no web browsing tool available via API (model priors)'}\n"
          f"- Params: temperature=0.3\n- Duration: {dt}s  Meta: {json.dumps(meta)}\n"
          + (f"- ERROR: {err}\n" if err else "") +
          f"\n## Prompt, exactly as issued\n\n```\n{prompt}\n```\n\n## Raw model output\n\n{out or '(no output)'}\n")
        print(f"[{kind}] {pid} {dt}s {'ERR:'+err if err else 'ok '+str(len(out))+'ch'}", flush=True)

def assemble(kind):
    m = MODELS[kind]; runs = REPO/"evidence"/m["dir"]/"runs"
    parts = [f"""# Project 1b \u2014 {m['id']} Column

**Run date:** {RUN_DATE} · **Model:** `{m['id']}` · **Analyst:** Jeffery (fzheng4)

{'Local model run via Ollama on this team machine (2x RTX A5000).' if kind=='qwen' else 'Third cloud model, DeepSeek V4 (a reasoning model), via the OpenAI-compatible API.'} Each of the twelve
starter prompts was issued in a **separate, fresh call with no memory of any other prompt**, with the
team's shared evidence block pasted in unedited \u2014 the same inputs the Claude and Codex columns saw,
so the cross-model comparison is a real comparison.

## Method and honest limitations

- **No live web retrieval.** {'This is a local model with no browsing tool.' if kind=='qwen' else 'The DeepSeek API call had no browsing tool enabled.'}
  So any product name, URL, or price below is the **model's recalled prior, not a fetched page** \u2014
  it does NOT satisfy the two-model rule's "live URL" clause and must be treated as a lead to verify,
  not as evidence. Where this column agrees with Claude/Codex on a rival, it adds to the "named by N
  models" count; where it invents a URL, that is a caught error for the D5 report, not a source.
- Single-shot, temperature 0.3. Raw transcripts (prompt exactly as issued + raw output + timing/token
  meta) are in [`../../evidence/{m['dir']}/runs/`](../../evidence/{m['dir']}/runs/).

---
"""]
    for pid, slug, title, _ in STARTERS:
        f = runs/f"{pid}-{slug}.md"
        txt = f.read_text() if f.exists() else "(missing)"
        out = txt.split("## Raw model output\n\n",1)[-1].strip() if "## Raw model output" in txt else "(no output)"
        parts.append(f"## {pid.upper()} \u2014 {title}\n\n{out}\n")
    (REPO/"result"/m["dir"]).mkdir(parents=True, exist_ok=True)
    (REPO/"result"/m["dir"]/"README.md").write_text("\n".join(parts))
    print(f"assembled result/{m['dir']}/README.md")

if __name__=="__main__":
    cmd, kind = sys.argv[1], sys.argv[2]
    if cmd=="run":
        only = sys.argv[3].split(",") if len(sys.argv)>3 else None
        run(kind, only)
    else:
        assemble(kind)
