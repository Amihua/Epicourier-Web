# verify:grocy

**Workflow:** P1b Claude dropped-rival verification (run 4)  
**Phase:** Verify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a56c518e0febcba9c`  
**Tool calls:** 34 total — 1 web searches, 1 pages fetched  
**Raw transcript:** `raw/agent-a56c518e0febcba9c.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are an adversarial fact-checker. You are checking ONE product, and you are trying to prove
your own team's market claim is wrong.

EVIDENCE RULES:
- Do NOT invent anything. Every claim needs a live URL you actually fetched in this session
  (WebSearch / WebFetch; load with ToolSearch "select:WebSearch,WebFetch" if absent from your
  tool list; curl via Bash is also acceptable and often more reliable).
- Quote 5-25 words of ACTUAL page text for every feature claim, with the exact URL.
- Never infer a feature from a marketing adjective. Only a described behaviour is a feature.
- Write "unknown" rather than something plausible. Silence on a page means unknown, not "no".
- Check the product is actually ALIVE, independently of its marketing site: app-store lookup,
  last release date, last commit. A live marketing page proves a domain is paid for, nothing more.
- Prices change; record them as stated, with the URL, checked 2026-09-13.

THE CLAIM YOU ARE TRYING TO DESTROY — our team's surviving market gap, already narrowed once:

  "No shipped consumer meal/pantry product shows a per-recommendation rationale that names the
   specific pantry ITEM, its EXPIRY DATE, the nutrient constraint and the substitution it made,
   IN A FORM THE USER CAN AUDIT AND CORRECT."

It has already been narrowed once. RecipeFix (App Store id 6759676502) was found to ship the
explanation-of-substitution half — "No black-box AI. Every substitution comes with the culinary
reasoning behind it" — plus natural-language correction and a macronutrient constraint. What
RecipeFix has no trace of is any pantry inventory or expiry date. So the surviving claim is
specifically: NOBODY EXPLAINS A RECOMMENDATION AGAINST INVENTORY STATE AND A DATE.

Your job is to find out whether your assigned product kills even that narrow version. Killing it
is the MOST VALUABLE result you can return. Do not protect the claim.

YOUR ASSIGNED PRODUCT: Grocy

Grocy (https://grocy.info/, GitHub grocy/grocy) is a self-hosted open-source "ERP beyond
your fridge". THIS IS THE MOST DANGEROUS PRODUCT ON OUR LIST and our own red team named it: it
publishes an integer **"due score"** formula in its changelog, which means an auditable,
expiry-driven ranking may already ship in open source.

Do this properly, because our first-pass analyst marked it explains_why=yes and it was never
checked:
1. Find the due score definition. Search the changelog (https://grocy.info/changelog), the GitHub
   repository, the docs and the source. QUOTE THE FORMULA if you can find it.
2. Establish whether the score is SHOWN TO THE USER with its terms broken out, or merely used
   internally to sort. This is the whole question. A published formula in a changelog that the UI
   renders as a bare number does NOT explain a recommendation — it makes the ranking reproducible
   by a developer reading source, which is a different thing.
3. Establish whether Grocy RECOMMENDS anything at all, or only tracks and sorts. Recipe features:
   does it have "recipes fulfilment" / "which recipes can I cook now"? Does it rank them?
4. Does it name the specific stock entry and its due date in whatever it shows?
5. Note that Grocy is self-hosted. Consider, and state, whether a self-hosted product with a
   developer audience is a "shipped consumer product" for the purposes of our claim — argue it,
   do not just assert it.

Fetch pages. Quote them. If you cannot establish something, say "unknown" — but exhaust the
obvious sources first: the official site, the docs, the help centre, the app-store listing, the
GitHub repository and its changelog, and the store review RSS.

Fill the schema. "verdict_on_our_claim" is the output that matters, and
"what_we_must_now_say_instead" must be a sentence we could actually print if you wound the claim.
```

## Searches actually run

- `Grocy Android app Google Play Patrick Zedler grocy`

## Pages actually fetched

- https://play.google.com/store/apps/details?id=xyz.zedler.patrick.grocy&hl=en_US   — asked: Quote exactly: the app's rating, number of reviews, download count, last updated date, and any description tex

## Response

- **product:** Grocy 4.7.1 — self-hosted open-source "ERP beyond your fridge" (https://grocy.info/, https://github.com/grocy/grocy), MIT, by Bernd Bestel
- **alive:** ALIVE
- **liveness proof:** Independently confirmed via GitHub API, not the marketing site. Release v4.7.1 published 2026-09-04 (nine days before check date); v4.7.0 on 2026-08-28. Repo pushed_at 2026-09-04T15:52:38Z, archived=false. Recent commit messages include "Prepared next release", "Updated dependencies", "Fixed CopyProduct did not copy product specific QU conversions (references #2789)". Sources: https://api.github.com/repos/grocy/grocy/releases, https://api.github.com/repos/grocy/grocy/commits. The live public demo also serves the current build: https://demo.grocy.info/recipes returned HTTP 200 with a rendered recipes table. Homepage confirms "Current version: 4.7.1 (released on 09/04/2026)" (https://grocy.info/).
- **adoption signal:** GitHub: 9,486 stars, 807 forks, 134 open issues, 86 watchers, created 2017-04-15, MIT licensed, 87 pages of contributors at 1/page (i.e. ~87 contributors) — https://api.github.com/repos/grocy/grocy. Distribution well beyond a repo: a Windows one-click installer (Grocy Desktop), a LinuxServer.io Docker image, a Home Assistant add-on, an iOS/macOS client (Grocy Mobile) and an Android client, all listed on https://grocy.info/. The Android client (xyz.zedler.patrick.grocy) is on Google Play; WebSearch reported 4.5 stars from ~420 reviews and 50K+ downloads with a $9.49 unlock key — I could NOT verify those numbers by direct fetch (the Play HTML came back obfuscated), so treat the store figures as search-reported, not confirmed. The GitHub and release figures are directly confirmed.
- **explains why recommended:** partial
- **explanation evidence:** THE FORMULA EXISTS AND IS PUBLISHED. Changelog v3.3.0 (2022-04-08), https://grocy.info/changelog: "The score is in detail based on: 1 point for each due soon ingredient (based on the stock setting \"Due soon days\") 10 points per overdue ingredient 20 points per expired ingredient (or else 0) The corresponding ingredient is also highlighted in red/yellow/grey". Same page: "A score to see which recipes to cook to not waste already overdue/expired or due soon products".
  
  SOURCE CONFIRMS THE FORMULA VERBATIM. /Users/andy/.../scratchpad/grocy/repo/migrations/0249.sql lines 36-41: "CASE pvs.current_due_status WHEN 'ok' THEN 0 WHEN 'due_soon' THEN 1 WHEN 'overdue' THEN 10 WHEN 'expired' THEN 20 END AS due_score".
  
  BUT WHAT THE UI SHOWS IS A BARE INTEGER. due_score appears in exactly TWO places in the entire front end (grep of views/ and public/viewjs/): views/recipes.blade.php:219 renders it as an unadorned table cell, and :524 uses it only to pick a CSS colour class ("@if($selectedRecipePosition->due_score == 20) text-danger @elseif(...== 10) text-secondary @elseif(...== 1) text-warning").
  
  CONFIRMED ON THE LIVE SHIPPED DEMO (https://demo.grocy.info/recipes, fetched this session). Rendered rows: ["Chocolate sauce", "5", "1", "Enough in stock"], ["Pancakes", "1", "0", "Enough in stock"], ["Pizza", "1", "0", "Not enough in stock, 3 ingredients missing"]. The Due score column is the bare "1" / "0". The ONLY explanatory text anywhere near it is a generic column-header tooltip, verbatim from the demo HTML: title="The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired". That is a legend for the metric, not a rationale for a recommendation: it names no item and no date.
  
  THE INGREDIENT LINE CARRIES NO DATE AND NO TOOLTIP. Rendered ingredient text from the demo: "5 Packs Chocolate Enough in stock ( 17 Packs) 20.6 123 kcal" and "1000 Milliliters Milk Enough in stock ( 3 Bottles) 0.0009425 83.6 kcal". The due status is conveyed purely as colour — the demo HTML contains class="productcard-trigger cursor-link  text-warning" with no title attribute. The user sees a yellow word.
  
  THE API IS NO BETTER. https://demo.grocy.info/api/recipes/fulfillment returns "due_score":0 per recipe with no per-ingredient breakdown and no dates — e.g. {"recipe_id":-87,...,"calories":270.6,"due_score":0,"product_names_comma_separated":"Cheese,Cold cuts,Dark Chocolate"}. The aggregate is not decomposable without recomputing it from stock yourself.
  
  THE ONE REAL RATIONALE GROCY DOES SHIP — a substitution explanation, and it is due-date-driven. views/recipes.blade.php:546 and localization/strings.pot:2260: "The parent product %1$s is currently not in stock, %2$s is the current next sub product based on the default consume rule (Opened first, then first due first, then first in first out)". This names BOTH specific items and states the rule. It names the ORDERING RULE, not the date, and it fires only for parent/sub-product structures.
  
  NO NUTRIENT CONSTRAINT EXISTS AT ALL. Calories are displayed per ingredient and per recipe, but config-dist.php:51 says of the energy unit: "doesn't really matter, it's only used to display energy values". There is no calorie or macro target, and nothing is ever substituted for a nutrition reason.
  
  NOT RANKED BY DEFAULT. public/viewjs/recipes.js:2 — "'order': [[1, 'asc']]" — column 1 is Name. The live demo listed recipes alphabetically (Chocolate sauce, Pancakes, Pizza, Sandwiches, Spaghetti bolognese). Due score is a sortable column the user must click, not a served ranking.
- **has pantry inventory:** yes
- **has expiry dates:** yes
- **names the specific item:** yes
- **names the expiry date:** no
- **ranks or recommends:** yes
- **user can correct the input:** yes
- **price as stated:** Grocy itself is free and MIT-licensed — confirmed from https://api.github.com/repos/grocy/grocy ("license": {"spdx_id": "MIT"}) and https://grocy.info/ ("Open Source. Built with passion.", with Download / Source on GitHub and a voluntary PayPal/Stripe "Say thanks"). No paid tier for the server. The third-party Android client is free with a separately-sold unlock key reported by WebSearch at $9.49 — search-reported only, not verified by direct fetch. Checked 2026-09-13.
- **what it actually does:** Grocy is a full self-hosted household ERP with a genuine per-stock-entry pantry inventory carrying real expiry dates, plus a recipe module that scores recipes by how much of their stock is going off. The stock entries page (https://demo.grocy.info/stockentries) has a per-entry "Due date" column and distinguishes two lots of the same product — Chocolate, 1 Pack, due 2027-03-12, and Chocolate, 12 Packs, due 2027-09-13. The stock overview (https://demo.grocy.info/stockoverview) has a "Next due date" column per product — Yogurt 2026-09-27, Eggs 2026-10-03, Cheese 2026-10-04. All of it is directly editable by the user (purchase / consume / inventory / edit stock entry), so the INPUT is fully auditable and correctable, and the code is open source so the formula is inspectable. The recipes page adds a "Due score" column marketed on the homepage as: "A \"Due Score\" indicates which recipes are good for using up stock items that are due soon or already overdue, to help not waste them." So Grocy does rank by expiry. What it does NOT do is explain the ranking: the score reaches the user as a bare integer plus a generic header tooltip, and the contributing ingredient is flagged only by red/yellow/grey text colour. To get from a yellow ingredient to the actual date a user must click the ingredient to open the product card (which shows stock amount, average price, average shelf life, spoil rate — no due date inline), then click a separate "Stock entries" button to open a generic table. The date is two clicks away in an inventory grid, never attached to the recommendation. There is no nutrient constraint of any kind.
- **verdict on our claim:** WOUNDS_IT
- **verdict reasoning:** Our red team was right to be afraid of Grocy, and it does real damage — but not to the literal conjunction.
  
  What Grocy destroys: the half RecipeFix lacked. Grocy has a true per-lot pantry inventory with real expiry dates, and it ships an expiry-driven recipe ranking whose integer formula is published in the changelog AND readable in migrations/0249.sql. If our claim had been "nothing ranks recipes by what's going off", Grocy would have killed it outright in 2022. It also ships one genuine per-ingredient substitution rationale that names both the item swapped out and the item swapped in and states the rule — "the current next sub product based on the default consume rule (Opened first, then first due first, then first in first out)" — and that rule is due-date-ordered. That is uncomfortably close to our territory.
  
  Why the literal claim survives: our claim requires FOUR things in ONE shown rationale — the specific item, its expiry DATE, the nutrient constraint, and the substitution. Grocy shows at most two, and never the date. The score reaches the user as "1" with a legend that says only "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired" — true of every recipe, specific to none. The contributing ingredient is marked by a CSS colour with no tooltip. The API returns the same undecomposed integer. And Grocy has NO nutrient constraint whatsoever — config-dist.php states the energy unit is "only used to display energy values" — so the nutrient clause of our claim is untouched by this product. This is exactly the failure mode the brief anticipated: a published formula plus a bare rendered number makes the ranking reproducible by a developer reading source, which is not the same as explaining a recommendation to a user.
  
  On self-hosting, arguing rather than asserting: I do NOT think we can wave Grocy away as "not a consumer product". It has a one-click Windows desktop installer, a Home Assistant add-on, an iOS/macOS client and an Android client on Google Play — that is consumer packaging, and 9,486 stars with ~87 contributors and a release nine days ago is not a toy. But the server genuinely must be self-hosted (the Android listing itself says it "requires a running self-hosted instance of the grocy server application and cannot run standalone"), and the author calls it "a hobby project by Bernd Bestel" on his own homepage. The honest position for a poster: Grocy is a shipped product with real reach that any informed reviewer will raise, so we should name it ourselves and beat it on the specific thing it doesn't do, rather than rely on a "consumer" qualifier that looks like special pleading. Our defensible edge over Grocy is the explanation layer and the nutrient constraint — not the inventory or the expiry tracking, where Grocy is frankly better than we are.
  
  Downgrading the first-pass analyst's "explains_why=yes" to "partial" is the single most important correction here: it was scored off the changelog formula, and the formula is not the UI.
- **what we must now say instead:** "No shipped meal or pantry product explains an individual recommendation in a sentence the user can read and correct — naming the specific stock item, the actual date on it, the nutrient constraint and the substitution made. The closest shipped system, the self-hosted open-source Grocy, does rank recipes by an expiry-driven 'due score' built from real per-lot due dates, but surfaces that reasoning to the user only as a bare integer and a colour-coded ingredient name, and applies no nutrient constraint at all."
- **searches and pages:**
  - https://grocy.info/ (homepage — 'A "Due Score" indicates which recipes are good for using up stock items that are due soon or already overdue', 'Current version: 4.7.1 (released on 09/04/2026)', 'Grocy is a hobby project by Bernd Bestel')
  - https://grocy.info/changelog (v3.3.0 2022-04-08 — full due score formula: 1/10/20 points; only ONE 'due score' mention in the entire changelog history)
  - https://api.github.com/repos/grocy/grocy (9,486 stars, 807 forks, MIT, archived=false, pushed_at 2026-09-04)
  - https://api.github.com/repos/grocy/grocy/releases (v4.7.1 published 2026-09-04; v4.7.0 2026-08-28; v4.6.0 2026-03-06)
  - https://api.github.com/repos/grocy/grocy/commits (latest 2026-09-04)
  - https://api.github.com/repos/grocy/grocy/contributors (Link header rel=last page=87)
  - https://github.com/grocy/grocy — full shallow clone inspected: migrations/0249.sql lines 36-41 (due_score CASE formula), views/recipes.blade.php:219 (bare integer cell), :524 (colour-only class), :546 (parent-product substitution tooltip), views/components/productcard.blade.php (no due date shown inline), public/viewjs/recipes.js:2 ('order': [[1,'asc']] = sort by Name), config-dist.php:51 ('doesn't really matter, it's only used to display energy values'), localization/strings.pot:2239 ('Due score') and :2260 (substitution tooltip msgid)
  - https://demo.grocy.info/recipes (LIVE SHIPPED UI — rendered Due score column header tooltip 'The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired'; rendered rows showing bare '1'/'0'; rendered ingredient 'Milk' carrying class text-warning with no title attribute)
  - https://demo.grocy.info/stockoverview (LIVE — 'Next due date' column: Yogurt 2026-09-27, Eggs 2026-10-03, Cheese 2026-10-04)
  - https://demo.grocy.info/stockentries (LIVE — per-entry 'Due date' column: Chocolate 1 Pack due 2027-03-12, Chocolate 12 Packs due 2027-09-13)
  - https://demo.grocy.info/api/recipes/fulfillment (LIVE API — returns bare 'due_score':0 per recipe, no per-ingredient breakdown, no dates)
  - WebSearch: 'Grocy Android app Google Play Patrick Zedler grocy' (reported 4.5 stars / ~420 reviews / 50K+ downloads / $9.49 unlock key — NOT independently verified; direct Play fetch returned obfuscated HTML)
