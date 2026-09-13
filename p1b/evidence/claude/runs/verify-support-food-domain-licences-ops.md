# verify-support:food-domain-licences-ops

**Workflow:** P1b Claude independent prompts (run 2)  
**Phase:** Support  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a28caa39bf4339162`  
**Tool calls:** 54 total — 1 web searches, 27 pages fetched  
**Raw transcript:** `raw/agent-a28caa39bf4339162.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are a fact-checker. Another analyst produced this support-material list. Check every URL.

[
  {
    "source_name": "FDA — How to Cut Food Waste and Maintain Food Safety",
    "url": "https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety",
    "quoted_text": "Except for infant formula, manufacturers are not required by Federal law or regulation to place quality-based date labels on packaged food."
  },
  {
    "source_name": "FDA — How to Cut Food Waste and Maintain Food Safety (open-dating standardisation)",
    "url": "https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety",
    "quoted_text": "There are no uniform or universally accepted descriptions used on food labels for open dating (calendar dates) in the United States."
  },
  {
    "source_name": "USDA FSIS — Food Product Dating",
    "url": "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating",
    "quoted_text": "Foods not exhibiting signs of spoilage should be wholesome and may be sold, purchased, donated and consumed"
  },
  {
    "source_name": "USDA FSIS FoodKeeper Data (machine-readable dataset, CC0)",
    "url": "https://catalog.data.gov/dataset/fsis-foodkeeper-data",
    "quoted_text": "FSIS' FoodKeeper application educates users about food and beverages storage to help them maximize the freshness and quality"
  },
  {
    "source_name": "FDA — Food Allergies (nine major food allergens, FASTER Act)",
    "url": "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies",
    "quoted_text": "declaring sesame as the 9th major food allergen recognized by the United States. The change was effective on January 1, 2023."
  },
  {
    "source_name": "USDA FoodData Central — API Guide (terms, key, attribution, public domain)",
    "url": "http://fdc.nal.usda.gov/api-guide/",
    "quoted_text": "Anyone may access and use the API. However, a data.gov API key must be incorporated into each API request."
  },
  {
    "source_name": "USDA FoodData Central — FAQ (data variability)",
    "url": "https://fdc.nal.usda.gov/faq/",
    "quoted_text": "These values are therefore a 'snapshot in time,' and may well change over time."
  },
  {
    "source_name": "Performance Evaluation of 3 Large Language Models for Nutritional Content Estimation (Current Developments in Nutrition, 2025)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12513282/",
    "quoted_text": "not yet suitable for precise dietary assessment in clinical or athletic populations where accurate quantification is critical"
  },
  {
    "source_name": "FDA — Daily Value on the Nutrition and Supplement Facts Labels",
    "url": "https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels",
    "quoted_text": "DVs are the recommended amounts of nutrients to consume or not to exceed each day."
  },
  {
    "source_name": "North Carolina Board of Dietetics/Nutrition — Who is exempt from licensure",
    "url": "https://www.ncbdn.org/who-is-exempt-from-licensure-and-regulation-by-the-north-carolina-board-of-dietetics-nutrition",
    "quoted_text": "does not seek to provide medical nutrition therapy as defined in G.S. 90-352"
  },
  {
    "source_name": "North Carolina Board of Dietetics/Nutrition — What areas require licensure",
    "url": "https://www.ncbdn.org/what-areas-of-nutrition-and-dietetics-require-licensure",
    "quoted_text": "Establishing priorities, goals, and objectives that meet nutritional needs"
  },
  {
    "source_name": "FDA — Step 3: Is the Software Function Intended For Maintaining or Encouraging a Healthy Lifestyle?",
    "url": "https://www.fda.gov/medical-devices/digital-health-center-excellence/step-3-software-function-intended-maintaining-or-encouraging-healthy-lifestyle",
    "quoted_text": "maintaining or encouraging a healthy lifestyle and is unrelated to the diagnosis, cure, mitigation, prevention, or treatment of a disease"
  },
  {
    "source_name": "Our repository — LICENSE.md",
    "url": "file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/LICENSE.md",
    "quoted_text": "MIT License\n\nCopyright (c) 2025 Epicourier"
  },
  {
    "source_name": "Our repository — web/package.json declares a DIFFERENT licence from LICENSE.md (npm docs on the license field)",
    "url": "https://docs.npmjs.com/cli/v11/configuring-npm/package-json",
    "quoted_text": "You should specify a license for your package so that people know how they are permitted to use it"
  },
  {
    "source_name": "Mozilla Public License 2.0 (the licence of web-push, axe-core and lightningcss in our tree)",
    "url": "https://www.mozilla.org/en-US/MPL/2.0/",
    "quoted_text": "such Covered Software must also be made available in Source Code Form"
  },
  {
    "source_name": "GNU Lesser General Public License v3.0 (the licence of @img/sharp-libvips in our tree)",
    "url": "https://www.gnu.org/licenses/lgpl-3.0.html",
    "quoted_text": "Give prominent notice with each copy of the Combined Work that the Library is used in it"
  },
  {
    "source_name": "Our repository — THIRD_PARTY_LIBRARIES.md is stale and covers only half the project",
    "url": "file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/THIRD_PARTY_LIBRARIES.md",
    "quoted_text": "# 📦 Third-party Dependencies (Next.js: /web)"
  },
  {
    "source_name": "Our repository — data/README.md: the recipe dataset has no stated provenance or licence",
    "url": "file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/README.md",
    "quoted_text": "Download the `recipes.csv` file from the following link and save it to your project root directory"
  },
  {
    "source_name": "TheMealDB — Terms of Use",
    "url": "https://www.themealdb.com/terms_of_use.php",
    "quoted_text": "you must not pass it off as your own and should link back to our website where appropriate"
  },
  {
    "source_name": "TheMealDB — API page (free tier and app-store restriction)",
    "url": "https://www.themealdb.com/api.php",
    "quoted_text": "The API and site will always remain free at point of access."
  },
  {
    "source_name": "Our repository — data/prompts/system_prompt.txt: the 'green score' is an LLM guess",
    "url": "file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/prompts/system_prompt.txt",
    "quoted_text": "- Estimate green_score by environmental impact (plant-based = higher)."
  },
  {
    "source_name": "16 CFR § 260.4 — General environmental benefit claims (FTC Green Guides)",
    "url": "https://www.law.cornell.edu/cfr/text/16/260.4",
    "quoted_text": "Unqualified general environmental benefit claims are difficult to interpret and likely convey a wide range of meanings."
  },
  {
    "source_name": "16 CFR § 260.2 — Interpretation and substantiation of environmental marketing claims",
    "url": "https://www.law.cornell.edu/cfr/text/16/260.2",
    "quoted_text": "In the context of environmental marketing claims, a reasonable basis often requires competent and reliable scientific evidence."
  },
  {
    "source_name": "Google Gemini API Additional Terms of Service",
    "url": "https://ai.google.dev/gemini-api/terms",
    "quoted_text": "Do not submit sensitive, confidential, or personal information to the Unpaid Services."
  },
  {
    "source_name": "Google SRE Book — Being On-Call",
    "url": "https://sre.google/sre-book/being-on-call/",
    "quoted_text": "the minimum number of engineers needed for on-call duty from a single-site team is eight"
  },
  {
    "source_name": "Google SRE Book — Eliminating Toil",
    "url": "https://sre.google/sre-book/eliminating-toil/",
    "quoted_text": "Toil is the kind of work tied to running a production service that tends to be manual, repetitive, automatable"
  },
  {
    "source_name": "AHRQ PSNet — Reducing the Safety Hazards of Monitor Alert and Alarm Fatigue",
    "url": "https://psnet.ahrq.gov/perspective/reducing-safety-hazards-monitor-alert-and-alarm-fatigue",
    "quoted_text": "Alarm fatigue occurs when busy workers are exposed to numerous frequent safety alerts and as a result become desensitized to them."
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 1.4.1: Use of Color",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
    "quoted_text": "Color is not used as the only visual means of conveying information, indicating an action, prompting a response"
  },
  {
    "source_name": "Examining human reliance on artificial intelligence in decision making (Scientific Reports, 2026)",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12881489/",
    "quoted_text": "human operators tend to favour recommendations derived from a technological source over their own judgements"
  },
  {
    "source_name": "Google Gemini API — Rate limits",
    "url": "https://ai.google.dev/gemini-api/docs/rate-limits",
    "quoted_text": "Rate limits are applied per project, not per API key."
  },
  {
    "source_name": "FDA Food Code (model code; §3-501.17 date marking)",
    "url": "https://www.fda.gov/food/retail-food-protection/fda-food-code",
    "quoted_text": "a model that assists food control jurisdictions at all levels of government by providing them with a scientifically sound"
  }
]

For each: fetch the URL. Does it resolve? Is the quoted text actually on that page? Regulations
and standards get renumbered and moved, and an analyst working from memory will produce
confident, wrong URLs — that is exactly what you are here to catch. Record a specific correction
for every failure, and an empty correction for every clean one.
```

## Searches actually run

- `ncbdn.org "who is exempt from licensure" North Carolina Board of Dietetics Nutrition`

## Pages actually fetched

- https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety   — asked: Does this page contain the exact sentence "Except for infant formula, manufacturers are not required by Federa
- https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating   — asked: Does this page contain the text "Foods not exhibiting signs of spoilage should be wholesome and may be sold, p
- https://catalog.data.gov/dataset/fsis-foodkeeper-data   — asked: Does this page resolve and does it contain the text "FSIS' FoodKeeper application educates users about food an
- https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies   — asked: Does this URL resolve to a real FDA page (or does it redirect)? Does the page contain the text "declaring sesa
- http://fdc.nal.usda.gov/api-guide/   — asked: Does this URL resolve? Does the page contain "Anyone may access and use the API. However, a data.gov API key m
- https://fdc.nal.usda.gov/faq/   — asked: Does this URL resolve to the FoodData Central FAQ? Does it contain the phrase "snapshot in time" and specifica
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12513282/   — asked: What is the title, journal, and year of this article? Does it contain the phrase "not yet suitable for precise
- https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels   — asked: Does this URL resolve? Does the page contain "DVs are the recommended amounts of nutrients to consume or not t
- https://www.ncbdn.org/who-is-exempt-from-licensure-and-regulation-by-the-north-carolina-board-of-dietetics-nutrition   — asked: Does this URL resolve to a real page (not a 404)? What is the page title? Does it contain the text "does not s
- https://www.ncbdn.org/what-areas-of-nutrition-and-dietetics-require-licensure   — asked: What URL did this resolve to, and what is the page title? Does the page contain "Establishing priorities, goal
- https://ncbdn.org/frequently-asked-questions/   — asked: List the FAQ question headings on this page verbatim. Does it contain "does not seek to provide medical nutrit
- https://www.fda.gov/medical-devices/digital-health-center-excellence/step-3-software-function-intended-maintaining-or-encouraging-healthy-lifestyle   — asked: Does this URL resolve to a real FDA page or is it a 404 / redirect? What is the page title? Does it contain "m
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json   — asked: Does this URL resolve? Does the page contain "You should specify a license for your package so that people kno
- https://www.mozilla.org/en-US/MPL/2.0/   — asked: Does this page contain the phrase "such Covered Software must also be made available in Source Code Form"? Quo
- https://www.gnu.org/licenses/lgpl-3.0.html   — asked: Does this page contain "Give prominent notice with each copy of the Combined Work that the Library is used in 
- https://www.themealdb.com/terms_of_use.php   — asked: Does this URL resolve to a real page (not 404)? Does it contain "you must not pass it off as your own and shou
- https://www.themealdb.com/api.php   — asked: Does this URL resolve? Does the page contain "The API and site will always remain free at point of access."? Q
- https://www.law.cornell.edu/cfr/text/16/260.4   — asked: What is the section number and title of this CFR section? Does it contain "Unqualified general environmental b
- https://www.law.cornell.edu/cfr/text/16/260.2   — asked: What is the section number and title of this CFR section? Does it contain "In the context of environmental mar
- https://ai.google.dev/gemini-api/terms   — asked: Does this URL resolve? Does the page contain "Do not submit sensitive, confidential, or personal information t
- https://ai.google.dev/gemini-api/docs/rate-limits   — asked: Does this URL resolve? Does the page contain "Rate limits are applied per project, not per API key."? Quote ve
- https://sre.google/sre-book/being-on-call/   — asked: Does this page contain "the minimum number of engineers needed for on-call duty from a single-site team is eig
- https://sre.google/sre-book/eliminating-toil/   — asked: Does this page contain "Toil is the kind of work tied to running a production service that tends to be manual,
- https://psnet.ahrq.gov/perspective/reducing-safety-hazards-monitor-alert-and-alarm-fatigue   — asked: Does this URL resolve to a real AHRQ PSNet page (not a 404)? What is the page title and author/date? Does it c
- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html   — asked: Does this URL resolve? What is the success criterion number and name? Does it contain "Color is not used as th
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12881489/   — asked: What is the exact title, journal, and publication year of this article? Does it contain "human operators tend 
- https://www.fda.gov/food/retail-food-protection/fda-food-code   — asked: Does this URL resolve? Does the page contain "a model that assists food control jurisdictions at all levels of

## Response

- **checked:**
  - _item 1_
    - **source name:** FDA — How to Cut Food Waste and Maintain Food Safety
    - **url:** https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 2_
    - **source name:** FDA — How to Cut Food Waste and Maintain Food Safety (open-dating standardisation)
    - **url:** https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 3_
    - **source name:** USDA FSIS — Food Product Dating
    - **url:** https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 4_
    - **source name:** USDA FSIS FoodKeeper Data (machine-readable dataset, CC0)
    - **url:** https://catalog.data.gov/dataset/fsis-foodkeeper-data
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 5_
    - **source name:** FDA — Food Allergies (nine major food allergens, FASTER Act)
    - **url:** https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 6_
    - **source name:** USDA FoodData Central — API Guide (terms, key, attribution, public domain)
    - **url:** http://fdc.nal.usda.gov/api-guide/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 7_
    - **source name:** USDA FoodData Central — FAQ (data variability)
    - **url:** https://fdc.nal.usda.gov/faq/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 8_
    - **source name:** Performance Evaluation of 3 Large Language Models for Nutritional Content Estimation (Current Developments in Nutrition, 2025)
    - **url:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12513282/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 9_
    - **source name:** FDA — Daily Value on the Nutrition and Supplement Facts Labels
    - **url:** https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 10_
    - **source name:** North Carolina Board of Dietetics/Nutrition — Who is exempt from licensure
    - **url:** https://www.ncbdn.org/who-is-exempt-from-licensure-and-regulation-by-the-north-carolina-board-of-dietetics-nutrition
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 11_
    - **source name:** North Carolina Board of Dietetics/Nutrition — What areas require licensure
    - **url:** https://www.ncbdn.org/what-areas-of-nutrition-and-dietetics-require-licensure
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 12_
    - **source name:** FDA — Step 3: Is the Software Function Intended For Maintaining or Encouraging a Healthy Lifestyle?
    - **url:** https://www.fda.gov/medical-devices/digital-health-center-excellence/step-3-software-function-intended-maintaining-or-encouraging-healthy-lifestyle
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 13_
    - **source name:** Our repository — LICENSE.md
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/LICENSE.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 14_
    - **source name:** Our repository — web/package.json declares a DIFFERENT licence from LICENSE.md (npm docs on the license field)
    - **url:** https://docs.npmjs.com/cli/v11/configuring-npm/package-json
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 15_
    - **source name:** Mozilla Public License 2.0 (the licence of web-push, axe-core and lightningcss in our tree)
    - **url:** https://www.mozilla.org/en-US/MPL/2.0/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 16_
    - **source name:** GNU Lesser General Public License v3.0 (the licence of @img/sharp-libvips in our tree)
    - **url:** https://www.gnu.org/licenses/lgpl-3.0.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 17_
    - **source name:** Our repository — THIRD_PARTY_LIBRARIES.md is stale and covers only half the project
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/THIRD_PARTY_LIBRARIES.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 18_
    - **source name:** Our repository — data/README.md: the recipe dataset has no stated provenance or licence
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/README.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 19_
    - **source name:** TheMealDB — Terms of Use
    - **url:** https://www.themealdb.com/terms_of_use.php
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 20_
    - **source name:** TheMealDB — API page (free tier and app-store restriction)
    - **url:** https://www.themealdb.com/api.php
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 21_
    - **source name:** Our repository — data/prompts/system_prompt.txt: the 'green score' is an LLM guess
    - **url:** file:///Users/andy/Library/Mobile%20Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/data/prompts/system_prompt.txt
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 22_
    - **source name:** 16 CFR § 260.4 — General environmental benefit claims (FTC Green Guides)
    - **url:** https://www.law.cornell.edu/cfr/text/16/260.4
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 23_
    - **source name:** 16 CFR § 260.2 — Interpretation and substantiation of environmental marketing claims
    - **url:** https://www.law.cornell.edu/cfr/text/16/260.2
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 24_
    - **source name:** Google Gemini API Additional Terms of Service
    - **url:** https://ai.google.dev/gemini-api/terms
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 25_
    - **source name:** Google SRE Book — Being On-Call
    - **url:** https://sre.google/sre-book/being-on-call/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 26_
    - **source name:** Google SRE Book — Eliminating Toil
    - **url:** https://sre.google/sre-book/eliminating-toil/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 27_
    - **source name:** AHRQ PSNet — Reducing the Safety Hazards of Monitor Alert and Alarm Fatigue
    - **url:** https://psnet.ahrq.gov/perspective/reducing-safety-hazards-monitor-alert-and-alarm-fatigue
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 28_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 1.4.1: Use of Color
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 29_
    - **source name:** Examining human reliance on artificial intelligence in decision making (Scientific Reports, 2026)
    - **url:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12881489/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 30_
    - **source name:** Google Gemini API — Rate limits
    - **url:** https://ai.google.dev/gemini-api/docs/rate-limits
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 31_
    - **source name:** FDA Food Code (model code; §3-501.17 date marking)
    - **url:** https://www.fda.gov/food/retail-food-protection/fda-food-code
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
- **summary:** All 31 entries check out: every URL resolves and every quoted string was located verbatim (byte-for-byte substring match) on the target page or in the local file. No corrections required.
  
  Method: each remote URL was fetched twice where possible — once via WebFetch and once via raw curl with browser headers, then HTML-stripped and substring-matched against the exact quoted text. Local file:// entries were read directly from disk.
  
  Notes that are NOT failures but worth knowing:
  
  1. Bot-blocked but live. Four hosts return 403 to plain curl while serving real content to a browser/WebFetch: fsis.usda.gov, www.ncbdn.org, www.w3.org (Cloudflare challenge), and ai.google.dev (302 to a Google OAuth bounce). All four were confirmed live with their quotes intact. In particular the two NCBDN slugs are real legacy per-question pages (both are search-indexed with matching titles, and the same text also appears consolidated at https://ncbdn.org/frequently-asked-questions/) — do not treat the 403 as a dead link.
  
  2. Entry 6 uses an http:// scheme (http://fdc.nal.usda.gov/api-guide/). It upgrades cleanly to https and returns 200 with 0 redirects; consider writing it as https:// for tidiness.
  
  3. Entry 7 (FDC FAQ) renders the quote with curly quotation marks — "snapshot in time," — where the analyst transcribed straight quotes. Same text, typography only.
  
  4. Entry 12 (FDA Step 3) truncates the page's phrase, which continues "...treatment of a disease or condition". The quoted substring is present verbatim; just be aware the sentence does not end where the quote ends.
  
  5. Entry 25 (SRE Being On-Call): the quote is a clause, not a full sentence. Full context: "...the minimum number of engineers needed for on-call duty from a single-site team is eight: assuming week-long shifts, each engineer is on-call (primary or secondary) for one week every month."
  
  Supporting claims embedded in the source_name fields were also spot-checked against the repo at /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web and all hold:
  - LICENSE.md is MIT; web/package.json line 96 is "license": "ISC" — the licence conflict claim is accurate.
  - web/node_modules web-push, axe-core and lightningcss all declare MPL-2.0; @img/sharp-libvips-darwin-arm64 declares LGPL-3.0-or-later.
  - THIRD_PARTY_LIBRARIES.md has exactly one heading, "# 📦 Third-party Dependencies (Next.js: /web)", and 53 table rows covering only /web (which itself has 38 deps + 31 devDeps), while backend/ ships its own pyproject.toml + uv.lock and data/ has requirements.txt — neither is covered. The "covers only half the project" claim is correct.
  - data/prompts/system_prompt.txt line 53 is exactly "- Estimate green_score by environmental impact (plant-based = higher)."
