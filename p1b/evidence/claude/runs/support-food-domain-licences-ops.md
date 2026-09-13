# support:food-domain-licences-ops

**Workflow:** P1b Claude independent prompts (run 2)  
**Phase:** Support  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a2180d24e90e71714`  
**Tool calls:** 78 total — 12 web searches, 47 pages fetched  
**Raw transcript:** `raw/agent-a2180d24e90e71714.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are a requirements analyst listing the support material — laws, standards, licences,
domain knowledge, human factors — that would CHANGE this design if the team read it.

OUR PRODUCT:
Epicourier-Web is a full-stack meal-planning web application (Next.js 15 / TypeScript / Tailwind
front end; FastAPI + Python back end; Supabase/PostgreSQL; Google Gemini 2.5 Flash for
recommendation). Its twenty implemented use cases cover: account registration and sign-in;
recipe browsing with search, dietary tags and an "inventory match percentage"; recipe detail
with nutrients and a green/sustainability score; AI meal-plan recommendation from a free-text
goal (3/5/7 meals); calendar meal scheduling and meal-completion tracking; a nutrient dashboard
with daily/weekly/monthly trends, custom nutrient goals, and CSV/text export; gamified
achievements, streaks and wellness challenges; pantry/fridge/freezer inventory with expiry
colour-coding and low-stock thresholds; AI recipe suggestions that prioritise ingredients that
are expiring or already expired; shopping-list creation from a meal plan or a recipe; and a
"purchased" transfer flow that moves checked shopping-list items into the user's inventory.

HARD BUDGET CONSTRAINT, to be respected in every recommendation: four graduate students,
ONE MONTH, about ten hours per person per week (roughly 160 person-hours TOTAL), to build
AND test the result.

WHAT PROJECT 1A ESTABLISHED, with auditable numbers (do not inflate these, and do not use the
inherited README's "1,130+ tests" boast, which is the previous team's claim, not ours):
- The team forked Epicourier-Web at 467 commits, 79 test files, last upstream commit 2025-12-07.
- The inherited web suite passed 1,095 of 1,096 tests in 3.6 seconds with no flakes.
- The team wrote its own tests: Web P1a 32 tests, 31 PASS / 1 FAIL. Backend P1a 18 cases, 18 PASS.
- With adversarial tests included: Web 44 executed, 33 PASS / 11 FAIL; Backend 25 executed,
  18 PASS / 7 FAIL.
- Real defects found: (a) shopping-item update and "purchased" transfer are scoped by item ID
  only, with no authenticated-ownership check — a cross-user IDOR subject to Supabase RLS;
  (b) quantity validation accepts negative, zero, and non-finite values (quantity || 1 turns 0
  into 1); (c) Boolean("false") coerces to true and flips purchase state; (d) storage location
  is validated only by a TypeScript cast, so any string passes at runtime; (e) achievement
  trigger values are unchecked; (f) Pydantic accepts unbounded free-text goals and preferences
  (>4096 chars) that are interpolated straight into the Gemini prompt with no untrusted-data
  boundary — a live prompt-injection surface; (g) share-link creation has no ownership check and
  no bound on expiryDays.
- Documentation defect: npm run build fails on a missing, undocumented SUPABASE_SERVICE_ROLE_KEY;
  three further env vars the code reads are undocumented; thirteen migrations and five CSV
  imports are required and unmentioned; one migration needed patching because the base schema
  empties search_path.

EVIDENCE RULES:
- Never invent a source. Every source must be real and findable, with a URL you actually fetched
  in this session (use WebSearch / WebFetch; if absent from your tool list, load them with
  ToolSearch query "select:WebSearch,WebFetch").
- Quote 5-25 words of real page text for every substantive claim.
- Write "unknown" rather than filling a cell with something plausible.
- Distinguish fact, inference, and hypothesis in your own output.

Your slice: FOOD/DOMAIN KNOWLEDGE, LICENCES, AND HUMAN FACTORS.
- Food safety: US FDA and USDA FoodKeeper guidance on how long food actually keeps. This matters
  because our product colour-codes expiry — find out what the official guidance says about
  "use-by" versus "best-by" dates and whether an app that tells a user food is fine is making a
  safety claim. Also find the FDA's major-allergen list.
- Nutrition data provenance: USDA FoodData Central — its API terms and what it says about data
  accuracy, because our nutrient dashboard sums numbers users may act on.
- Dietetics scope: find a real professional source (Academy of Nutrition and Dietetics, or a
  state licensure board) on where nutrition education ends and medical nutrition therapy begins.
- LICENCES — this part you must ground in OUR ACTUAL REPOSITORY, not the web. Read these files
  with Bash/Read and report what is really there:
    /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/LICENSE.md
    /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/THIRD_PARTY_LIBRARIES.md
    /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/web/package.json
    /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/backend/pyproject.toml (or requirements files)
    /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/README.md  (the recipe dataset — where did the data come from, and under what terms?)
  Report the actual licence of the project and flag any dependency or dataset whose licence is
  copyleft, non-commercial, or unstated. A dataset with unclear provenance is a real finding.
- Human factors: find a real source on the operational load of on-call and of AI-assisted systems
  that a four-person team will impose on itself.

Make the list LONG. For each item: a real findable source with a URL you fetched, one sentence
on which of our use cases or recorded defects it touches, and a priority of MUST-READ /
SHOULD-READ / SKIM. "what_it_would_change" must name a concrete design decision — a validation
rule, a UI element, a schema field, a test — not a platitude.

Fill "deliberately_excluded" honestly: naming a regulation that does NOT apply, and saying why,
is worth more to our marker than one more MUST-READ.
```

## Searches actually run

- `FDA "Confused by Date Labels on Packaged Foods" best if used by use by sell by`
- `FSIS food product dating "use-by" "best if used by" quality date not safety date`
- `USDA FoodData Central data accuracy disclaimer "no warranty" citation policy`
- `Academy of Nutrition and Dietetics "medical nutrition therapy" definition scope of practice versus nutrition education`
- `North Carolina Board of Dietetics Nutrition practice act "dietetics/nutrition practice" exemption general non-medical nutrition information`
- `FDA "General Wellness: Policy for Low Risk Devices" guidance weight management diet app not a medical device`
- `Ag Data Commons FoodKeeper dataset API storage times licence public domain`
- `automation bias over-reliance AI decision support human factors study operators accept incorrect recommendations`
- `NIST AI 600-1 Generative AI Profile "Confabulation" "Human-AI Configuration" risk`
- `FDA Food Code 3-501.17 ready-to-eat time/temperature control for safety food date marking 7 days 41F`
- `alarm fatigue alert fatigue too many notifications users disable desensitization study Joint Commission`
- `study accuracy of large language model generated nutrition information calories macronutrients compared to USDA database`

## Pages actually fetched

- https://www.fda.gov/food/consumers/confused-date-labels-packaged-foods   — asked: Quote exactly what this page says about the difference between "Best if Used By", "Use By", "Sell By" and "Fre
- https://cacmap.fda.gov/consumers/consumer-updates/confused-date-labels-packaged-foods   — asked: Quote verbatim sentences about: whether date labels indicate safety or quality; the "Best if Used By" standard
- https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety   — asked: Quote verbatim what this page says about date labels ("Best if Used By", "Use By", "Sell By", "Freeze By"), wh
- https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating   — asked: Quote verbatim what USDA FSIS says about: "Best if Used By/Before", "Sell-By", "Use-By", "Freeze-By" dates; wh
- https://www.foodsafety.gov/keep-food-safe/foodkeeper-app   — asked: Quote verbatim what this page says about the FoodKeeper app, who developed it, what storage timelines it gives
- https://www.usda.gov/sites/default/files/guidance-documents/FSIS.%20Food%20Product%20Dating.pdf   — asked: Quote verbatim sentences about: whether dates are an indicator of safety; which products federally require a d
- https://www.fda.gov/food/food-labeling-nutrition/food-allergies   — asked: List the major food allergens named on this page verbatim, quote the sentence defining "major food allergens",
- https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies   — asked: List the major food allergens named on this page verbatim, quote the sentence defining "major food allergens",
- https://fdc.nal.usda.gov/api-guide   — asked: Quote verbatim the API terms of service, rate limits, API key requirements, attribution/citation requirements,
- http://fdc.nal.usda.gov/api-guide/   — asked: Quote verbatim the API terms of service, rate limits, API key requirements, attribution/citation requirements,
- https://fdc.nal.usda.gov/faq/   — asked: Quote verbatim anything about: data accuracy, variability of nutrient values, whether values are analytic or c
- https://www.themealdb.com/api.php   — asked: Quote verbatim any terms of use, licensing, attribution requirements, API key policy, commercial-use restricti
- https://www.themealdb.com/terms_of_use.php   — asked: Quote verbatim the terms of use: ownership of content and images, permitted/prohibited uses, whether redistrib
- https://cse.tcu.edu/nutrition/files/Scope-of-Practice-for-the-RD.pdf   — asked: Quote verbatim the definition of Medical Nutrition Therapy, what is unique to RDs, the distinction between nut
- https://www.ncleg.gov/EnactedLegislation/Statutes/pdf/ByArticle/Chapter_90/Article_25.pdf   — asked: Quote verbatim: the definition of "dietetics/nutrition practice" and "medical nutrition therapy" in G.S. 90-35
- https://www.ncbdn.org/who-is-exempt-from-licensure-and-regulation-by-the-north-carolina-board-of-dietetics-nutrition   — asked: Quote verbatim the exemption language about individuals who provide nutrition information, guidance, or indivi
- https://sre.google/sre-book/being-on-call/   — asked: Quote verbatim: the recommended cap on incidents per on-call shift, statements about operational load / the 50
- https://www.fda.gov/medical-devices/digital-health-center-excellence/step-3-software-function-intended-maintaining-or-encouraging-healthy-lifestyle   — asked: Quote verbatim the criteria for a "general wellness" software function, the two categories of general wellness
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html   — asked: Quote verbatim Success Criterion 1.4.1 Use of Color, its intent statement, and any example about colour being 
- https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts   — asked: Quote verbatim the refrigerator and freezer storage times for: raw ground meat, raw poultry, fresh eggs in she
- https://catalog.data.gov/dataset/fsis-foodkeeper-data   — asked: Quote verbatim the dataset description, the licence/rights statement, the access URL/format for the FoodKeeper
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12881489/   — asked: Quote verbatim 2-3 sentences with the study's definition of over-reliance/automation bias, its main empirical 
- https://sre.google/sre-book/eliminating-toil/   — asked: Quote verbatim the definition of toil, the characteristics that make work toil, the recommended cap on toil as
- https://www.mozilla.org/en-US/MPL/2.0/   — asked: Quote verbatim section 3.1 and 3.2 (distribution of Source Code Form / Executable Form), and the definition of
- https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf   — asked: Quote verbatim the definition of "Confabulation" in the risk list, the definition of "Human-AI Configuration",
- https://ai.google.dev/gemini-api/terms   — asked: Quote verbatim: how Google uses data submitted via the free/unpaid tier versus paid services; any statement ab
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json   — asked: Quote verbatim the documentation for the "license" field in package.json — what it is for, the SPDX expression
- https://airc.nist.gov/docs/NIST.AI.600-1.GenAI-Profile.ipd.pdf   — asked: Quote verbatim the definition of "Confabulation" and of "Human-AI Configuration" from the list of GAI risks, a
- https://psnet.ahrq.gov/perspective/reducing-safety-hazards-monitor-alert-and-alarm-fatigue   — asked: Quote verbatim: the definition of alarm/alert fatigue, the proportion of alarms that are false or non-actionab
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12513282/   — asked: Quote verbatim: the models tested, the reference database used, the MAPE figures for each model (especially Ge
- https://www.fda.gov/food/hfp-constituent-updates/fda-releases-educational-food-safety-posters-retail-food-employees-focusing-importance-date-marking   — asked: Quote verbatim what this page says about date marking of ready-to-eat TCS foods, the 7-day/41°F limit, and Lis
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12513282/   — asked: Quote verbatim: the models tested, the reference database used, the MAPE figures for each model (especially Ge
- https://www.fda.gov/food/retail-food-protection/fda-food-code   — asked: Quote verbatim what the Food Code is, who it applies to (retail and food service establishments), whether it i
- https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx   — asked: Quote verbatim the definitions of RDA, AI, UL (Tolerable Upper Intake Level) and EAR, and any statement about 
- https://www.ftc.gov/news-events/topics/truth-advertising/green-guides   — asked: Quote verbatim what the Green Guides cover, the requirement to substantiate environmental marketing claims, an
- https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-260   — asked: Quote verbatim §260.4 General environmental benefit claims and §260.2 Interpretation and substantiation of env
- https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/   — asked: Quote verbatim the Tolerable Upper Intake Level (UL) for vitamin D for adults, the RDA, and any statement abou
- https://www.law.cornell.edu/cfr/text/16/260.4   — asked: Quote verbatim the full text of 16 CFR 260.4 "General environmental benefit claims", especially the sentence a
- https://www.dietaryguidelines.gov/food-sources-select-nutrients   — asked: Quote verbatim anything about Dietary Reference Intakes, Tolerable Upper Intake Levels, or nutrient recommenda
- https://www.nationalacademies.org/our-work/summary-report-of-the-dietary-reference-intakes   — asked: Quote verbatim the definitions of Dietary Reference Intakes, RDA, Adequate Intake, and Tolerable Upper Intake 
- https://ai.google.dev/gemini-api/docs/rate-limits   — asked: Quote verbatim the free tier rate limits for gemini-2.5-flash (RPM, TPM, RPD), how limits are applied (per pro
- https://www.law.cornell.edu/cfr/text/16/260.2   — asked: Quote verbatim the full text of 16 CFR 260.2 "Interpretation and substantiation of environmental marketing cla
- https://www.gnu.org/licenses/lgpl-3.0.html   — asked: Quote verbatim section 4 "Combined Works" — what a distributor of a work that links to an LGPL library must do
- https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels   — asked: Quote verbatim: the definition of Daily Value and %DV, the 2,000 calorie basis, the Daily Values for sodium, d
- https://www.jandonline.org/article/S2212-2672(17)31624-6/fulltext   — asked: Quote verbatim the definition of Medical Nutrition Therapy, the statement about what is unique to RDNs, and an
- https://fsis-dev.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating   — asked: Quote verbatim: whether dates indicate safety; the definitions of "Best if Used By/Before", "Sell-By", "Use-By
- https://www.ncbdn.org/what-areas-of-nutrition-and-dietetics-require-licensure   — asked: Quote verbatim which activities require licensure in North Carolina, the definition of dietetics/nutrition pra

## Response

- **items:**
  - _item 1_
    - **category:** domain knowledge
    - **source name:** FDA — How to Cut Food Waste and Maintain Food Safety
    - **url:** https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety
    - **issuing body:** U.S. Food and Drug Administration
    - **which use case it touches:** UC pantry/fridge/freezer inventory with expiry colour-coding, and the ExpirationBadge that prints the word "Fresh" in green for anything >7 days out (web/src/utils/inventory/expiration.ts, web/src/components/inventory/ExpirationBadge.tsx)
    - **priority:** MUST-READ
    - **quoted text:** Except for infant formula, manufacturers are not required by Federal law or regulation to place quality-based date labels on packaged food.
    - **what it would change:** Split the single `expiration_date` column into `date_value` + `date_label_type` enum ('use_by' | 'best_if_used_by' | 'sell_by' | 'user_estimate'), and make getExpirationStatus() return 'good'/"Fresh" ONLY for best_if_used_by/user_estimate — a 'use_by' item past its date must never render green, and a 'best_if_used_by' item past its date must render amber "check it", not red "Expired".
    - **applies only if:** unconditional — the app already shows date-based verdicts to US users
  - _item 2_
    - **category:** domain knowledge
    - **source name:** FDA — How to Cut Food Waste and Maintain Food Safety (open-dating standardisation)
    - **url:** https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety
    - **issuing body:** U.S. Food and Drug Administration
    - **which use case it touches:** UC "purchased" transfer flow — web/src/components/shopping/TransferFlow/ExpirationInput.tsx asks the user to type one free-form date with no indication of which printed date on the packet to copy
    - **priority:** SHOULD-READ
    - **quoted text:** There are no uniform or universally accepted descriptions used on food labels for open dating (calendar dates) in the United States.
    - **what it would change:** Replace the single date input in ExpirationInput.tsx with a two-field control: a radio for which phrase is printed on the pack, plus the date. Without the label-type field the stored date is uninterpretable and every downstream colour is a guess.
    - **applies only if:** unconditional
  - _item 3_
    - **category:** domain knowledge
    - **source name:** USDA FSIS — Food Product Dating
    - **url:** https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating
    - **issuing body:** USDA Food Safety and Inspection Service
    - **which use case it touches:** UC AI recipe suggestions that deliberately prioritise ingredients that are expiring OR ALREADY EXPIRED — the app currently recommends cooking food it has itself labelled "Expired 🚨"
    - **priority:** MUST-READ
    - **quoted text:** Foods not exhibiting signs of spoilage should be wholesome and may be sold, purchased, donated and consumed
    - **what it would change:** Change the inventory_recommender ranking rule so that already-expired items are still eligible but the suggestion card must carry a sensory-check line ("FSIS: check colour, smell and texture before using") and a required confirm tap; today the card just says 'uses your expiring items'. CAVEAT ON EVIDENCE: fsis.usda.gov returns HTTP 403 to our fetcher — this quote came from a WebSearch extract of that page, not a direct fetch, so a human must open it and re-verify before citing.
    - **applies only if:** unconditional; FSIS covers meat, poultry and egg products specifically
  - _item 4_
    - **category:** domain knowledge
    - **source name:** USDA FSIS FoodKeeper Data (machine-readable dataset, CC0)
    - **url:** https://catalog.data.gov/dataset/fsis-foodkeeper-data
    - **issuing body:** USDA Food Safety and Inspection Service / data.gov
    - **which use case it touches:** UC "purchased" transfer flow that moves checked shopping-list items into inventory, and the low-stock/expiry thresholds — today the 2-day/7-day cutoffs in expiration.ts are invented constants with no source
    - **priority:** MUST-READ
    - **quoted text:** FSIS' FoodKeeper application educates users about food and beverages storage to help them maximize the freshness and quality
    - **what it would change:** Seed a `foodkeeper_storage(name, pantry_days, fridge_days, freezer_days)` table from the CC0 foodkeeper.json and auto-default `expiration_date = purchase_date + days[storage_location]` on transfer, instead of making the user type a date. This also finally gives `storage_location` (defect (d), validated only by a TypeScript cast) a real domain to CHECK against: pantry/fridge/freezer are the three FoodKeeper columns.
    - **applies only if:** unconditional — dataset is CC0 1.0 public domain, so no licence cost
  - _item 5_
    - **category:** law
    - **source name:** FDA — Food Allergies (nine major food allergens, FASTER Act)
    - **url:** https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies
    - **issuing body:** U.S. Food and Drug Administration
    - **which use case it touches:** UC recipe browsing with dietary tags, UC AI meal-plan recommendation, and the live false claim in web/src/components/landing/FAQ.tsx that users "can customize your profile to exclude allergens" — grep shows NO allergen column exists anywhere in the schema or CSVs
    - **priority:** MUST-READ
    - **quoted text:** declaring sesame as the 9th major food allergen recognized by the United States. The change was effective on January 1, 2023.
    - **what it would change:** Add `allergens text[]` to the `ingredients` table with a CHECK constrained to exactly the nine FDA allergens (milk, eggs, fish, Crustacean shellfish, tree nuts, peanuts, wheat, soybeans, sesame), and stop pretending the marketing tag list in backend/dataset/tags-supabase.csv ('Seafood', 'Shellfish', 'Dairy', 'Nutty', 'Cheasy') is an allergen model. Until that field exists, delete the allergen sentence from FAQ.tsx — it is a safety claim we cannot honour.
    - **applies only if:** unconditional for any US-facing deployment
  - _item 6_
    - **category:** licence
    - **source name:** USDA FoodData Central — API Guide (terms, key, attribution, public domain)
    - **url:** http://fdc.nal.usda.gov/api-guide/
    - **issuing body:** USDA Agricultural Research Service
    - **which use case it touches:** UC nutrient dashboard with daily/weekly/monthly trends and CSV export — the numbers it sums come from backend/dataset/ingredients-supabase.csv, which data/prompts/system_prompt.txt shows was generated by Gemini, not measured
    - **priority:** MUST-READ
    - **quoted text:** Anyone may access and use the API. However, a data.gov API key must be incorporated into each API request.
    - **what it would change:** Add `fdc_id integer` and `nutrient_source text` columns to `ingredients`, backfill the ~200 ingredient rows from FoodData Central (public domain, CC0, no licence fee), and render the citation string 'U.S. Department of Agriculture, Agricultural Research Service. FoodData Central' in the dashboard footer. Note the API-key rule bites us directly: "Any API keys discovered online, such as those in a code repository, will be deactivated" — so the key joins SUPABASE_SERVICE_ROLE_KEY on the undocumented-env-var list we already found.
    - **applies only if:** unconditional
  - _item 7_
    - **category:** domain knowledge
    - **source name:** USDA FoodData Central — FAQ (data variability)
    - **url:** https://fdc.nal.usda.gov/faq/
    - **issuing body:** USDA Agricultural Research Service
    - **which use case it touches:** UC nutrient dashboard trend charts and CSV/text export — it currently renders summed nutrient totals as if they were exact measurements
    - **priority:** SHOULD-READ
    - **quoted text:** These values are therefore a 'snapshot in time,' and may well change over time.
    - **what it would change:** Round every displayed nutrient total to two significant figures rather than the raw float, and add a one-line provenance caption under the dashboard chart naming the source and retrieval date. Do not let the CSV export emit more precision than the source data has.
    - **applies only if:** unconditional
  - _item 8_
    - **category:** domain knowledge
    - **source name:** Performance Evaluation of 3 Large Language Models for Nutritional Content Estimation (Current Developments in Nutrition, 2025)
    - **url:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12513282/
    - **issuing body:** Current Developments in Nutrition (peer-reviewed; indexed in PubMed Central)
    - **which use case it touches:** The entire nutrient substrate of UC recipe detail and UC nutrient dashboard: data/prompts/system_prompt.txt opens "You are a nutrition expert and data engineer" and asks Gemini to emit calories_kcal, protein_g, vit_a_microg etc. for every ingredient — those are the numbers in backend/dataset/ingredients-supabase.csv
    - **priority:** MUST-READ
    - **quoted text:** not yet suitable for precise dietary assessment in clinical or athletic populations where accurate quantification is critical
    - **what it would change:** Write one cheap, decisive test (~3 person-hours): sample 20 rows from ingredients-supabase.csv, query FoodData Central for each, and fail if median absolute percentage error on calories exceeds a stated threshold. The paper measured Gemini at MAPE 64.2% for energy and 109.9% for protein against a USDA-derived reference, so this test is likely to fail — which is exactly the number the report needs, and it converts 'the data might be wrong' into an auditable figure.
    - **applies only if:** unconditional
  - _item 9_
    - **category:** domain knowledge
    - **source name:** FDA — Daily Value on the Nutrition and Supplement Facts Labels
    - **url:** https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
    - **issuing body:** U.S. Food and Drug Administration
    - **which use case it touches:** UC custom nutrient goals — web/src/app/api/nutrients/goals/route.ts accepts any value where `typeof value === "number" && !Number.isNaN(value)`, so -5000 kcal and Infinity both pass; this is the same defect family as (b) quantity validation and (e) unchecked achievement trigger values
    - **priority:** MUST-READ
    - **quoted text:** DVs are the recommended amounts of nutrients to consume or not to exceed each day.
    - **what it would change:** Replace the NaN-only check in parseGoalPayload with per-field bounds anchored to the published DVs (sodium 2,300 mg, fibre 28 g, protein 50 g, total fat 78 g, total carbohydrate 275 g, 2,000 kcal basis): require Number.isFinite(value) && value > 0 && value <= 5 × DV, and add the matching 400-response test. Also adopt the "5% DV or less is low, 20% DV or more is high" rule as the dashboard's colour thresholds instead of inventing them.
    - **applies only if:** unconditional for US users; EU/UK reference intakes differ if the deployment ever moves
  - _item 10_
    - **category:** law
    - **source name:** North Carolina Board of Dietetics/Nutrition — Who is exempt from licensure
    - **url:** https://www.ncbdn.org/who-is-exempt-from-licensure-and-regulation-by-the-north-carolina-board-of-dietetics-nutrition
    - **issuing body:** North Carolina Board of Dietetics/Nutrition (state licensure board)
    - **which use case it touches:** UC17 AI meal-plan recommendation from a free-text goal — api/index.py declares `goal: str` with no content constraint, so a user can type "manage my type 2 diabetes" and the app will emit a seven-day meal plan in response
    - **priority:** MUST-READ
    - **quoted text:** does not seek to provide medical nutrition therapy as defined in G.S. 90-352
    - **what it would change:** Add a server-side clinical-term screen in front of the Gemini call: if the free-text goal matches a maintained deny-list (diabetes, kidney/renal, pregnancy, eating disorder, chemotherapy, celiac, hypertension, cholesterol...), return 422 with a referral message instead of a meal plan. This is the same input path as defect (f) — one validator on `goal` closes both the >4096-char prompt-injection surface and the scope-of-practice exposure, so it is the highest value-per-hour fix in the whole backlog.
    - **applies only if:** North Carolina (our jurisdiction — NC State). Every US state has its own act; ~30 have title-and-practice protection, so the deny-list travels but the statute citation does not.
  - _item 11_
    - **category:** law
    - **source name:** North Carolina Board of Dietetics/Nutrition — What areas require licensure
    - **url:** https://www.ncbdn.org/what-areas-of-nutrition-and-dietetics-require-licensure
    - **issuing body:** North Carolina Board of Dietetics/Nutrition
    - **which use case it touches:** UC custom nutrient goals + UC gamified achievements/wellness challenges — the product literally sets numeric nutritional targets for a named individual and then scores them against it
    - **priority:** MUST-READ
    - **quoted text:** Establishing priorities, goals, and objectives that meet nutritional needs
    - **what it would change:** Because that phrase is verbatim one of the enumerated nutrition care services, the custom-goal feature must be reframed as user-authored: the user enters their own number, the app never suggests or defaults a personalised target, and the AI is never asked to propose a calorie or macro goal. Concretely: remove any 'recommended for you' goal preset, and add a persistent footer — 'EpiCourier provides general nutrition information and is not medical nutrition therapy.' grep confirms the string 'not medical advice' appears nowhere in web/src, README.md or INSTALL.md today.
    - **applies only if:** North Carolina; the title-protection half ("dietitian", "nutritionist") applies to our marketing copy in every state
  - _item 12_
    - **category:** law
    - **source name:** FDA — Step 3: Is the Software Function Intended For Maintaining or Encouraging a Healthy Lifestyle?
    - **url:** https://www.fda.gov/medical-devices/digital-health-center-excellence/step-3-software-function-intended-maintaining-or-encouraging-healthy-lifestyle
    - **issuing body:** FDA Digital Health Center of Excellence
    - **which use case it touches:** The whole product's positioning: UC nutrient dashboard + UC wellness challenges + UC AI recommendation, taken together, decide whether we are a general-wellness app or an unregistered device
    - **priority:** MUST-READ
    - **quoted text:** maintaining or encouraging a healthy lifestyle and is unrelated to the diagnosis, cure, mitigation, prevention, or treatment of a disease
    - **what it would change:** Write a one-page, testable product rule and enforce it in CI: no user-visible string and no LLM system prompt may contain disease-treatment language. Add a grep-based test over web/src and data/prompts/*.txt for a banned-terms list. This is what keeps the free-text goal box on the safe side of the line, and it costs about two hours.
    - **applies only if:** US; the app must stay inside the general-wellness compliance policy to avoid device classification
  - _item 13_
    - **category:** licence
    - **source name:** Our repository — LICENSE.md
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/LICENSE.md
    - **issuing body:** Epicourier (inherited upstream project)
    - **which use case it touches:** Project-wide — this is the licence we inherited and the one our fork redistributes under
    - **priority:** MUST-READ
    - **quoted text:** MIT License
      
      Copyright (c) 2025 Epicourier
    - **what it would change:** FACT: the root licence is MIT, permissive, and fine to build on. But the copyright line names 'Epicourier', not the upstream authors and not us — before we publish our fork we must add our own copyright line for the 2026 contributions rather than silently extending someone else's notice. One line, five minutes, and it is the difference between a clean and an unclean submission.
    - **applies only if:** unconditional
  - _item 14_
    - **category:** licence
    - **source name:** Our repository — web/package.json declares a DIFFERENT licence from LICENSE.md (npm docs on the license field)
    - **url:** https://docs.npmjs.com/cli/v11/configuring-npm/package-json
    - **issuing body:** npm, Inc. (documentation) / our own repo (the defect)
    - **which use case it touches:** Project-wide licence integrity; a documentation defect in the same class as the missing SUPABASE_SERVICE_ROLE_KEY finding from P1a
    - **priority:** MUST-READ
    - **quoted text:** You should specify a license for your package so that people know how they are permitted to use it
    - **what it would change:** FACT, verified by reading the file: /Epicourier-Web/web/package.json line ~90 says `"license": "ISC"` while /Epicourier-Web/LICENSE.md says MIT, and backend/pyproject.toml declares NO license field at all. Fix: set package.json to "MIT", add `license = "MIT"` to backend/pyproject.toml and data/pyproject.toml, and add a three-line CI check that the three declarations agree. Also note package.json still carries the upstream placeholder `"description": "node.js >= 20.x.x - [Install Node.js]..."` and `"author": ""`.
    - **applies only if:** unconditional
  - _item 15_
    - **category:** licence
    - **source name:** Mozilla Public License 2.0 (the licence of web-push, axe-core and lightningcss in our tree)
    - **url:** https://www.mozilla.org/en-US/MPL/2.0/
    - **issuing body:** Mozilla Foundation
    - **which use case it touches:** UC expiry alerting — web/src/lib/pushNotifications.ts does `import webpush from "web-push"`; web-push 3.6.7 is MPL-2.0, is a direct runtime dependency, and appears nowhere in THIRD_PARTY_LIBRARIES.md
    - **priority:** SHOULD-READ
    - **quoted text:** such Covered Software must also be made available in Source Code Form
    - **what it would change:** FACT, from scanning all 885 installed npm packages: there is NO GPL or AGPL anywhere, but there ARE four MPL-2.0 packages (web-push 3.6.7, axe-core 4.11.0, lightningcss 1.30.2, lightningcss-darwin-arm64) and, on the Python side, certifi, hypothesis and tqdm. MPL-2.0 is file-level copyleft: it does not infect our MIT code, but if we ever modify a web-push source file, that file must stay MPL. Concrete change: add an 'MPL-2.0 components' section to THIRD_PARTY_LIBRARIES.md and a rule that we never patch node_modules/web-push in place.
    - **applies only if:** Obligations under §3.2 bite only on distribution of an Executable Form. A Vercel-hosted SaaS is arguably not distribution; a Docker image handed to the grader is.
  - _item 16_
    - **category:** licence
    - **source name:** GNU Lesser General Public License v3.0 (the licence of @img/sharp-libvips in our tree)
    - **url:** https://www.gnu.org/licenses/lgpl-3.0.html
    - **issuing body:** Free Software Foundation
    - **which use case it touches:** Recipe browsing and recipe detail images — Next.js image optimisation pulls sharp, which pulls the native libvips binary
    - **priority:** SKIM
    - **quoted text:** Give prominent notice with each copy of the Combined Work that the Library is used in it
    - **what it would change:** FACT: node_modules/@img/sharp-libvips-darwin-arm64@1.2.3 is LGPL-3.0-or-later — the only (L)GPL-family artefact in the entire 885-package tree. It is a native shared library, so §4's shared-library exception is satisfied by construction. Change: add a NOTICE file naming it; do not spend budget on relinking machinery. Deliberately low priority — flagging it and moving on is the correct call for a 160-hour project.
    - **applies only if:** only if we distribute a build artefact containing the binary (a container image or a desktop bundle). Hosted-only deployment = no obligation triggered.
  - _item 17_
    - **category:** licence
    - **source name:** Our repository — THIRD_PARTY_LIBRARIES.md is stale and covers only half the project
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/THIRD_PARTY_LIBRARIES.md
    - **issuing body:** Inherited upstream project
    - **which use case it touches:** Project-wide; extends the P1a documentation-defect finding (undocumented env vars, unmentioned migrations) into the licence inventory
    - **priority:** MUST-READ
    - **quoted text:** # 📦 Third-party Dependencies (Next.js: /web)
    - **what it would change:** FACT, verified by diffing the table against web/package.json: fourteen direct dependencies are missing from it — recharts, zod, web-push, react-markdown, remark-gfm, react-hook-form, @hookform/resolvers, @radix-ui/react-select, @playwright/test, @swc/jest, tw-animate-css, identity-obj-proxy, concurrently, dotenv — and the backend's 85 installed Python packages (torch, transformers, sentence-transformers, scikit-learn, pandas, supabase, google-genai) have NO licence inventory at all. Change: delete the hand-maintained table and generate it, `license-checker --production --json` for web plus `pip-licenses` for backend, wired into the existing GitHub Actions workflow with a failing allowlist. Roughly four person-hours and it never goes stale again.
    - **applies only if:** unconditional
  - _item 18_
    - **category:** licence
    - **source name:** Our repository — data/README.md: the recipe dataset has no stated provenance or licence
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/README.md
    - **issuing body:** Inherited upstream project
    - **which use case it touches:** Every recipe use case — browsing, search, dietary tags, inventory match %, recipe detail, AI recommendation, shopping-list generation — all run on backend/dataset/recipes-supabase.csv
    - **priority:** MUST-READ
    - **quoted text:** Download the `recipes.csv` file from the following link and save it to your project root directory
    - **what it would change:** FACT: the 'following link' is a personal GitHub gist (SeojinSeojin/e09119e728826ff07e5f9ba4d39a4648) with no licence statement, and the resulting CSV is unmistakably TheMealDB — recipe ids 52764/52765, and every image_url is https://www.themealdb.com/images/media/meals/*. INFERENCE (high confidence, from the id scheme, the image host, and the strMeal/strArea/strMealThumb field names in data/prompts/user_prompt.txt): the corpus is scraped TheMealDB content laundered through a third-party gist. Change: add a DATA_PROVENANCE.md recording origin, retrieval date, terms relied on, and the fact that all nutrient and green_score columns are Gemini-generated rather than sourced. This is the single highest-value hour in the licence slice — unclear dataset provenance is a finding in itself.
    - **applies only if:** unconditional
  - _item 19_
    - **category:** licence
    - **source name:** TheMealDB — Terms of Use
    - **url:** https://www.themealdb.com/terms_of_use.php
    - **issuing body:** TheDataDB Ltd
    - **which use case it touches:** UC recipe browsing and UC recipe detail — web/next.config.ts whitelists `images.domains: ["www.themealdb.com"]`, so we hot-link their images from their servers, and grep finds zero occurrences of 'themealdb' anywhere in web/src (no credit is shown to any user)
    - **priority:** MUST-READ
    - **quoted text:** you must not pass it off as your own and should link back to our website where appropriate
    - **what it would change:** Two concrete changes: (1) add a visible credit line on the recipe-detail page and the browse footer — 'Recipe data and images courtesy of TheMealDB' linking to themealdb.com; (2) stop hot-linking — either mirror the images into Supabase Storage or accept that every page view of our app bills their bandwidth. The terms also say scraping the website (as opposed to the API) is forbidden, which is precisely the provenance question the gist leaves open.
    - **applies only if:** unconditional while any TheMealDB-derived row or image ships
  - _item 20_
    - **category:** licence
    - **source name:** TheMealDB — API page (free tier and app-store restriction)
    - **url:** https://www.themealdb.com/api.php
    - **issuing body:** TheDataDB Ltd
    - **which use case it touches:** Deployment of the whole product — determines whether a publicly reachable Vercel URL of a TheMealDB-derived catalogue is inside their free terms
    - **priority:** SHOULD-READ
    - **quoted text:** The API and site will always remain free at point of access.
    - **what it would change:** The free/test key is scoped to "development of your app or for educational use", with supporter status required when releasing publicly. Change: label the deployment explicitly as a course project in the README and on the landing page, and do not put it on any app store or charge for it. If the team ever wants a public launch, budget the supporter tier — which is a licensing decision, not an engineering one, and it belongs in the report rather than in code.
    - **applies only if:** the free tier suffices for educational use; any commercial release changes the answer
  - _item 21_
    - **category:** licence
    - **source name:** Our repository — data/prompts/system_prompt.txt: the 'green score' is an LLM guess
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/prompts/system_prompt.txt
    - **issuing body:** Inherited upstream project
    - **which use case it touches:** UC recipe detail with nutrients and a green/sustainability score — recipes-supabase.csv carries green_score values like 78 with no method, no units and no source
    - **priority:** MUST-READ
    - **quoted text:** - Estimate green_score by environmental impact (plant-based = higher).
    - **what it would change:** FACT: that eight-word instruction is the entire methodology behind every sustainability number in the product. Change: either delete the 0–100 score and replace it with a factual, checkable badge derived from data we actually have (e.g. 'plant-based' / 'contains ruminant meat' computed from the ingredient map), or keep the number and rename the UI label to 'Plant-forward index (estimated by a language model)' with the method in a tooltip. Do not ship an unexplained 0–100 'green' number.
    - **applies only if:** unconditional
  - _item 22_
    - **category:** law
    - **source name:** 16 CFR § 260.4 — General environmental benefit claims (FTC Green Guides)
    - **url:** https://www.law.cornell.edu/cfr/text/16/260.4
    - **issuing body:** U.S. Federal Trade Commission (text via Cornell LII)
    - **which use case it touches:** UC recipe detail green/sustainability score, and any landing-page copy that describes EpiCourier as reducing waste or being sustainable
    - **priority:** SHOULD-READ
    - **quoted text:** Unqualified general environmental benefit claims are difficult to interpret and likely convey a wide range of meanings.
    - **what it would change:** Directly supports the change above: the rule is that a marketer should avoid unqualified general environmental claims and instead use clear and prominent qualifying language limiting the claim to a specific benefit. So 'Green Score: 78' must become a qualified, specific claim ('estimated plant-protein share') or go. Also forces a rewrite of any 'sustainable' headline in web/src/components/landing.
    - **applies only if:** FTC deception authority reaches commercial advertising. A non-commercial student project is at low practical risk — but the exercise is to design as if it shipped, and this is what shipping would require.
  - _item 23_
    - **category:** law
    - **source name:** 16 CFR § 260.2 — Interpretation and substantiation of environmental marketing claims
    - **url:** https://www.law.cornell.edu/cfr/text/16/260.2
    - **issuing body:** U.S. Federal Trade Commission (text via Cornell LII)
    - **which use case it touches:** The green_score column and the evidence standard behind it
    - **priority:** SKIM
    - **quoted text:** In the context of environmental marketing claims, a reasonable basis often requires competent and reliable scientific evidence.
    - **what it would change:** Sets the bar an LLM estimate cannot clear: 'tests, analyses, research, or studies… conducted and evaluated in an objective manner by qualified persons'. Concretely it means we must not attempt to defend green_score by citing the model; if we keep a sustainability figure it must be computed from a published LCA table with a citation column in the schema.
    - **applies only if:** same commercial-advertising caveat as §260.4
  - _item 24_
    - **category:** licence
    - **source name:** Google Gemini API Additional Terms of Service
    - **url:** https://ai.google.dev/gemini-api/terms
    - **issuing body:** Google LLC
    - **which use case it touches:** UC17 AI meal-plan recommendation and UC AI recipe suggestions — api/index.py takes `goal: str`, api/inventory_recommender.py takes `preferences: Optional[str]`, and both are interpolated into the gemini-2.5-flash prompt; this is defect (f), the unbounded free-text prompt-injection surface
    - **priority:** MUST-READ
    - **quoted text:** Do not submit sensitive, confidential, or personal information to the Unpaid Services.
    - **what it would change:** Two decisions fall straight out. (1) Because the terms also say "human reviewers may read, annotate, and process your API input and output", a free-text box that invites health goals must carry an explicit pre-submit notice and a stored `ai_consent_at` timestamp — or the field must be replaced with a fixed enum of goals (lose/maintain/gain, 3/5/7 meals) and no free text at all, which is the cheaper option and also kills defect (f) outright. (2) The terms' own disclaimer — "Don't rely on the Services for medical, mental health, legal, financial, or other professional advice" — must be surfaced verbatim next to every AI plan, because we are currently passing through advice under a licence that disclaims it.
    - **applies only if:** unconditional while the free (unpaid) tier is used, which our pyproject's google-genai default strongly implies
  - _item 25_
    - **category:** human factors
    - **source name:** Google SRE Book — Being On-Call
    - **url:** https://sre.google/sre-book/being-on-call/
    - **issuing body:** Google (Site Reliability Engineering, O'Reilly)
    - **which use case it touches:** The web-push notification path (web/src/lib/pushNotifications.ts) and the expiry-alert cron it implies — a background sender is a service someone must own, against a 4-person / 160-person-hour budget
    - **priority:** MUST-READ
    - **quoted text:** the minimum number of engineers needed for on-call duty from a single-site team is eight
    - **what it would change:** Decision: do NOT ship server-initiated push notifications. Make expiry alerting pull-only — ExpiringSoonBanner already renders on page load from web/src/app/api/inventory/expiring/route.ts, which needs no queue, no VAPID key rotation and no owner. Delete or feature-flag off pushNotifications.ts. That single scoping call removes the MPL-2.0 web-push dependency, removes an undocumented env var pair, and removes the on-call obligation that four part-time students structurally cannot staff. Roughly 15 hours reclaimed.
    - **applies only if:** unconditional given the stated budget
  - _item 26_
    - **category:** human factors
    - **source name:** Google SRE Book — Eliminating Toil
    - **url:** https://sre.google/sre-book/eliminating-toil/
    - **issuing body:** Google (Site Reliability Engineering, O'Reilly)
    - **which use case it touches:** The P1a documentation defect: npm run build fails on an undocumented SUPABASE_SERVICE_ROLE_KEY, three more env vars are undocumented, and thirteen migrations plus five CSV imports are required and unmentioned — every new team member pays that cost again
    - **priority:** SHOULD-READ
    - **quoted text:** Toil is the kind of work tied to running a production service that tends to be manual, repetitive, automatable
    - **what it would change:** Spend one budgeted work item (~8 hours) on a single `make bootstrap` that creates .env from a checked-in .env.example listing all four vars, applies all thirteen migrations in order (including the one that must be patched because the base schema empties search_path), and loads the five CSVs. Then add a CI job that runs it from a clean checkout — so the install documentation can never silently rot again. With a 160-hour budget, the 50%-ops ceiling means we can afford at most ~80 hours of setup-and-rerun friction across the whole team; today's manual path burns a visible fraction of that per person.
    - **applies only if:** unconditional
  - _item 27_
    - **category:** human factors
    - **source name:** AHRQ PSNet — Reducing the Safety Hazards of Monitor Alert and Alarm Fatigue
    - **url:** https://psnet.ahrq.gov/perspective/reducing-safety-hazards-monitor-alert-and-alarm-fatigue
    - **issuing body:** Agency for Healthcare Research and Quality (US HHS)
    - **which use case it touches:** UC inventory with expiry colour-coding — ExpirationBadge.tsx paints a coloured, emoji-bearing badge on EVERY item (red 🚨 / orange ⚠️ / yellow ⏰ / green ✓ / grey), plus ExpiringSoonBanner, plus the low-stock thresholds, plus push
    - **priority:** MUST-READ
    - **quoted text:** Alarm fatigue occurs when busy workers are exposed to numerous frequent safety alerts and as a result become desensitized to them.
    - **what it would change:** Collapse the five-state badge to two actionable states. Concretely: show a badge ONLY for 'expired' and 'expiring within N days'; render 'good' and 'unknown' as plain text with no colour, no border, no emoji. Make N a per-user setting defaulting to 3, not the hard-coded 7 in getExpiringItems(). The PSNet evidence that 80–99% of monitor alarms are false, and that users respond by silencing them, is the direct argument: a pantry where every one of sixty items wears a coloured warning badge teaches the user to ignore the one badge that matters.
    - **applies only if:** unconditional — it is a UI-tuning decision, and the healthcare literature is the best-evidenced analogue available
  - _item 28_
    - **category:** standard
    - **source name:** WCAG 2.2 — Understanding Success Criterion 1.4.1: Use of Color
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
    - **issuing body:** W3C Web Accessibility Initiative
    - **which use case it touches:** UC inventory expiry colour-coding (red/orange/yellow/green) and the green sustainability score — note ExpirationBadge accepts `showText={false}`, which strips the label and leaves colour plus a decorative emoji as the only signal
    - **priority:** MUST-READ
    - **quoted text:** Color is not used as the only visual means of conveying information, indicating an action, prompting a response
    - **what it would change:** Two specific edits. (1) In ExpirationBadge.tsx, when showText is false the badge must still carry an aria-label built from getExpirationStatusLabel(status) — or the prop should be removed entirely. (2) Red vs orange vs yellow are exactly the triad that deuteranopic and protanopic users cannot separate, which is a second, independent argument for collapsing the five tiers to two. Test: add jest-axe (axe-core 4.11.0 is already installed in node_modules) and one accessibility assertion per inventory component — roughly three hours, and it is the cheapest 'standards compliance' evidence the report can show.
    - **applies only if:** unconditional as a design standard; ADA Title III applicability to a student project is a separate and contested question
  - _item 29_
    - **category:** human factors
    - **source name:** Examining human reliance on artificial intelligence in decision making (Scientific Reports, 2026)
    - **url:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12881489/
    - **issuing body:** Scientific Reports (Nature Portfolio), peer-reviewed
    - **which use case it touches:** UC AI meal-plan recommendation and UC AI recipe suggestions that deliberately push already-expired ingredients — the user is asked to trust a Gemini output about food safety and nutrition
    - **priority:** SHOULD-READ
    - **quoted text:** human operators tend to favour recommendations derived from a technological source over their own judgements
    - **what it would change:** Design the AI card to force a judgement rather than a tap. Concretely: each suggested recipe must display, inline, the specific inventory item that drove the suggestion together with its expiry date and status word, and adding an expired-item recipe to the calendar must require a second confirm. Honest note on the evidence: this paper is actually a partial counter-example — its participants followed correct guidance ~76% of the time but incorrect guidance only ~42%, i.e. they were NOT blindly compliant. The finding that does transfer is that participants with more positive attitudes toward AI discriminated worse, which is exactly our early-adopter user. Cite it as a caution, not as proof.
    - **applies only if:** unconditional
  - _item 30_
    - **category:** human factors
    - **source name:** Google Gemini API — Rate limits
    - **url:** https://ai.google.dev/gemini-api/docs/rate-limits
    - **issuing body:** Google LLC
    - **which use case it touches:** Test strategy for the backend's 25 executed cases against api/recommender.py and api/inventory_recommender.py, both of which call client.models.generate_content(model="gemini-2.5-flash", ...) directly
    - **priority:** SKIM
    - **quoted text:** Rate limits are applied per project, not per API key.
    - **what it would change:** Because quota is per project, four students issuing themselves four keys share ONE bucket — so a single teammate running the adversarial suite can starve everyone else mid-demo. Change: inject the genai client as a constructor argument (or a module-level factory) so every test uses a fake by default, and gate live-model tests behind an explicit GEMINI_LIVE=1 env var. About two hours, and it also makes the 7 failing backend adversarial cases reproducible offline.
    - **applies only if:** unconditional while a shared Google Cloud project backs the API key
  - _item 31_
    - **category:** domain knowledge
    - **source name:** FDA Food Code (model code; §3-501.17 date marking)
    - **url:** https://www.fda.gov/food/retail-food-protection/fda-food-code
    - **issuing body:** U.S. Food and Drug Administration
    - **which use case it touches:** Default expiry windows for cooked/prepared items created by UC meal-completion tracking — leftovers currently get whatever date the user types, or none
    - **priority:** SKIM
    - **quoted text:** a model that assists food control jurisdictions at all levels of government by providing them with a scientifically sound
    - **what it would change:** Borrow §3-501.17's seven-days-at-41°F retention rule as the default expiry we auto-assign to a 'cooked leftover' inventory item created from a completed meal, rather than inventing a number. Honest framing for the report: this is a defensible, citable default, NOT a legal obligation on us.
    - **applies only if:** The Food Code binds retail and food-service establishments in states that adopt it. It does not bind a consumer app or a home kitchen — so cite it as a source of defaults, never as a compliance requirement.
- **deliberately excluded:**
  - HIPAA (45 CFR Parts 160/164) — does NOT apply. HIPAA reaches covered entities (health plans, clearinghouses, providers who transmit standard transactions) and their business associates. Epicourier is a direct-to-consumer app with no provider or plan relationship, so the meal logs and nutrient goals in Supabase are not PHI in our hands. Citing HIPAA would be the single clearest tell that an analyst pattern-matched on 'health data' instead of reading the statute.
  - GDPR / UK GDPR — does NOT apply as scoped. Art. 3(2) needs an establishment in the Union or targeting of data subjects in the Union; a course project on a US campus with no EU marketing, no EU payment options and no EU-language UI meets neither limb. If the team ever puts the Vercel URL in a public directory this needs revisiting, but asserting it now would be inflation.
  - FTC Health Breach Notification Rule (16 CFR Part 318, as amended 2024) — genuinely MIGHT apply to a consumer health app that is not HIPAA-covered, and I am NOT excluding it on the merits. I am excluding it from THIS list because it is a breach-notification and privacy obligation, which belongs to the security/privacy analyst's slice alongside defect (a) (the cross-user IDOR on shopping-item update and 'purchased' transfer) and defect (g) (unbounded share-link expiry). Flagging the boundary rather than double-counting it.
  - EU AI Act (Reg. 2024/1689) — does NOT apply. No placing on the Union market, and even if it were placed there, a meal recommender is not an Annex III high-risk system; it would sit in the limited-risk transparency tier. Naming it would inflate the compliance surface by an order of magnitude for zero design change.
  - FDA nutrition labelling rules (21 CFR 101.9, NLEA) — do NOT apply. Those govern the Nutrition Facts panel on packaged food offered for sale; we print nutrient figures on a screen for a recipe we do not sell. I have instead cited the FDA Daily Value page, which gives the reference NUMBERS without importing the labelling OBLIGATIONS — that is the useful half.
  - FDA menu labelling (21 CFR 101.11) — does NOT apply. It covers restaurant chains with 20 or more locations doing business under the same name. We are not a restaurant.
  - FSMA, the Produce Safety Rule, HACCP, and ISO 22000 — do NOT apply. Every one of these governs entities that grow, process, pack, hold or transport food. Epicourier touches no physical food at any point; it stores strings about food. This is the most commonly mis-cited cluster in food-adjacent software reports.
  - California Proposition 65 — does NOT apply. It attaches to businesses that expose Californians to listed chemicals through a product they sell. We sell nothing.
  - DSHEA / dietary supplement claim rules — do NOT apply. The product makes no supplement or structure-function claims; there is no supplement entity in the schema.
  - GPL and AGPL copyleft — do NOT apply, and I want this on the record as a negative finding rather than silence. I scanned all 885 installed npm packages and all 85 installed Python packages: there is zero GPL, zero AGPL, zero SSPL and zero non-commercial licensing. The only copyleft in the tree is file-level MPL-2.0 (web-push, axe-core, lightningcss, certifi, hypothesis, tqdm) and one LGPL-3.0-or-later native binary (@img/sharp-libvips-darwin-arm64). A lazier report would either ignore licences entirely or warn vaguely about 'copyleft risk'; the accurate statement is that the dependency licensing is clean and the real licence defects are all documentation defects — a stale THIRD_PARTY_LIBRARIES.md, an ISC/MIT contradiction between package.json and LICENSE.md, a backend with no licence field at all, and a recipe dataset with no provenance record.
  - PCI DSS — does NOT apply. No payment flow exists; the shopping list produces a list, not a transaction. The FAQ's 'Smart Cart' copy about filling a grocery delivery cart is aspirational marketing, not implemented code.
  - COPPA — does NOT apply on current features: no child-directed content, no under-13 marketing. Noting honestly that the sign-up flow has no age gate at all, so if the team ever markets to schools or families this flips, and the gamified achievements/streaks are exactly the kind of feature that attracts that audience.
  - ADA Title III web accessibility litigation standards — excluded as a legal theory (whether a student project is a 'place of public accommodation' is unsettled and would eat report space arguing). WCAG 2.2 SC 1.4.1 is cited directly instead, because it produces a concrete, testable code change without needing the legal question resolved.
  - SNAP/WIC eligible-food rules and USDA organic labelling (7 CFR Part 205) — do NOT apply. No benefits integration, no organic claims anywhere in the UI or the dataset.
  - Academy of Nutrition and Dietetics Revised 2017 Scope of Practice for the RDN (JAND) — WANTED but not citable here. jandonline.org returns HTTP 403 to our fetcher and the TCU-hosted PDF is unextractable, so I have no verbatim text I actually retrieved. Rather than quote it from a search summary, I substituted two North Carolina Board of Dietetics/Nutrition pages that I did fetch cleanly — which is also the stronger source for us, since NC law is the law we are actually under. A human should still open the JAND article for the MNT definition before the report goes out.
  - USDA FSIS 'Food Product Dating' and foodsafety.gov/FoodKeeper pages — partially excluded as direct citations because both hosts return HTTP 403 to our fetcher. I kept one FSIS item but labelled its quote as a search extract rather than a fetched page, and I routed the actionable part of the FoodKeeper guidance through the data.gov catalogue entry, which I did fetch and which confirms the dataset is CC0 and downloadable as JSON. Flagging this so nobody mistakes a search snippet for a verified quotation.
