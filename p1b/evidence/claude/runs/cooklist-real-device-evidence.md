# Cooklist, real-device evidence

**Workflow:** P1b Claude gap-closing (run 5)  
**Phase:** Close  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `adb39517465dc80b8`  
**Tool calls:** 61 total — 4 web searches, 3 pages fetched  
**Raw transcript:** `raw/agent-adb39517465dc80b8.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
We have a problem and you are here to reduce it, honestly.

Cooklist's US App Store listing (id 1352600944) carries screenshot 10, headed "Expiration
Reminders / Get alerts when your food is about to expire", rendering a push notification:
"Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it."

**We opened the image. Its status bar reads `Sketch` at `9:41 AM` — it is a Sketch mockup, not a
device capture.** (Screenshot 9 in the same listing, the receipt scanner, IS a real capture with a
real status bar and a photographed receipt — so the vendor mixes both and the distinction is
real.) This matters because that notification is the single strongest threat to our claim, and we
are currently resting it on marketing art.

Find INDEPENDENT, REAL-DEVICE evidence that this behaviour actually ships. Try, in roughly this
order:
1. **Google Play listing** (`com.cooklist.android`) — its screenshot set differs from Apple's and
   may contain real captures. Fetch the listing HTML and pull the screenshot image URLs, then look
   at the images.
2. **YouTube walkthroughs and reviews** — search for Cooklist app demos; a screen recording is a
   real capture. Read titles, descriptions and transcripts where available.
3. **Independent blog walkthroughs** with their own screenshots — e.g.
   food.thefuntimesguide.com/cooklist-app-reviews/ is a long multi-year user walkthrough; find
   others.
4. **App Store and Play reviews** mentioning the expiration notification — a user saying "it told
   me my X was about to expire" is real-world confirmation. Use the iTunes review RSS
   (`itunes.apple.com/us/rss/customerreviews/page=1..10/id=1352600944/sortby=mostrecent/json`,
   also `sortby=mosthelpful`; it rate-limits, retry pages individually).
5. **Archived versions** of cooklist.com via web.archive.org — the live site is a JS-only shell,
   but older captures had real marketing copy.

Then answer the question we actually need: does Cooklist ship a notification that names a pantry
item and a date-derived fact and leads to recipes — and separately, does it ever show a
per-recommendation rationale INSIDE the app, or only this notification?

Be scrupulous about mockup-versus-real for every image you cite, and say what only an install
could settle.

EVIDENCE RULES:
- Do NOT invent anything. Every claim needs a URL you actually retrieved this session.
- Quote 5-25 words of ACTUAL text, with the exact URL it came from.
- "unknown" beats plausible. Silence on a page means unknown, never "no".
- A vendor artifact proves a CLAIM WAS MADE, not that a feature ships. Say which you have.
- If a source is a marketing mockup rather than a real capture, SAY SO. We were burned by exactly
  this: a rival's App Store screenshot that looked like proof turned out to have "Sketch" and
  "9:41 AM" in its status bar.
- WebSearch may hit a 200-call session cap. Prefer direct fetches (Bash curl / WebFetch); the
  routes below are already proven to work, so use them rather than rediscovering them.

OUR SURVIVING CLAIM, already narrowed twice:

  "No shipped consumer meal product joins all four facts in one auditable, correctable
   explanation: the NAMED PANTRY ITEM, its ACTUAL EXPIRY DATE, the NUTRIENT CONSTRAINT the dish
   satisfies, and the REASON for the SUBSTITUTION it made."

Known positions: RecipeFix explains substitutions but holds no inventory and no dates. Cooklist
advertises "Your parsley is 7 days old and may expire soon" but the artifact is a vendor mockup.
Remy prints "Using up before they expire: <item> · <qty>" above suggested recipes but states no
date and no reason. Grocy publishes a due-score formula but shows the user a bare integer.

Refuting this claim is MORE valuable to us than confirming it.
```

## Searches actually run

- `Cooklist app expiration notification "about to expire" push notification review`
- `Cooklist app walkthrough demo youtube pantry expiring soon`
- `Cooklist "expiration reminder" notification settings turn off help`
- `reddit Cooklist app notification expiring "cooklist" expiration alert experience`

## Pages actually fetched

- https://food.thefuntimesguide.com/cooklist-app-reviews/   — asked: Quote verbatim anything about expiration notifications, expiring soon alerts, push notifications naming a food
- https://cooklist.com/cooklist-app   — asked: Quote verbatim any sentence about expiration notifications, alerts, reminders, recipes for expiring items, or 
- https://www.youtube.com/watch?v=24hfHVrRaTw   — asked: Give the exact video title, channel name, upload date, and the full description text verbatim. Note anything a

## Response

- **real capture found:** PARTIAL
- **evidence:**
  - _item 1_
    - **source type:** Vendor App Store screenshot (live listing, re-fetched today)
    - **url:** https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/1b/d7/ab/1bd7ab5e-27a6-d95c-e013-5cd4bf7c4bc4/pr_source.jpg/1242x2688bb.jpg
    - **what it shows:** Independently re-confirms your finding. Lock screen reads 9:41 / 'Tuesday, 6 June' (Apple's canonical mockup clock). Notification card is composited OUTSIDE the device bezel, overlapping the pink frame and the red marketing background. Text: 'Expiration Reminder / Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it.' iOS-10-era notification chrome on a 2026 listing.
    - **mockup or real:** MOCKUP (marketing composite, not a device capture)
    - **is vendor or independent:** vendor
  - _item 2_
    - **source type:** Vendor Google Play screenshot (com.cooklist.android, fetched today)
    - **url:** https://play-lh.googleusercontent.com/lmRMAA-NCSKQKuvQ9vPDdVnhB5qsz7wjYQFrn5YVFolNhUuMt8TbDZK-JIDS8v6aijSv771B3uyu0-uNVrQQwg=w1600
    - **what it shows:** A DIFFERENT artifact carrying the SAME claim — Android lock screen headed 'Expiration Reminders / Get alerts when your food is about to expire', same parsley copy. It is ALSO a composite and it self-contradicts: the lock-screen clock reads 3:05 / 'Monday, September 23' while the notification card above it is stamped '11:49 AM'. The card again sits outside the phone bezel. Play's other screenshots use the generic '12:30' Android mockup status bar.
    - **mockup or real:** MOCKUP (composite; internally inconsistent clocks)
    - **is vendor or independent:** vendor
  - _item 3_
    - **source type:** Apple App Store customer review, v1.108.0 (near-current; live is 1.109.1)
    - **url:** https://itunes.apple.com/us/rss/customerreviews/page=6/id=1352600944/sortby=mosthelpful/json
    - **what it shows:** Review 'Useful' by scarecrow88m, 4 stars, review id 12351563416: "gives you reminders on when things in your fridge or cupboard are about to expire". Real user, recent shipped version.
    - **mockup or real:** real-world user testimony (text, no image)
    - **is vendor or independent:** independent
  - _item 4_
    - **source type:** Apple App Store customer review, v1.101.1
    - **url:** https://itunes.apple.com/us/rss/customerreviews/page=9/id=1352600944/sortby=mosthelpful/json
    - **what it shows:** Review 'Game changer', 5 stars, id 11722798948: "we get a 1 week warning it's going to expire". Independently corroborates the ~7-day horizon in the mockup copy ('is 7 days old').
    - **mockup or real:** real-world user testimony
    - **is vendor or independent:** independent
  - _item 5_
    - **source type:** Apple App Store customer review, v1.91.1 — strongest behavioural proof
    - **url:** https://itunes.apple.com/us/rss/customerreviews/page=7/id=1352600944/sortby=mostrecent/json
    - **what it shows:** Review 'So far, so good!' by wolff.jess, 4 stars, id 10528739536: "milk and butter that doesn't require a notification about expirations" — a user asking to SUPPRESS a notification they are actually receiving. You cannot complain about being over-notified by a feature that does not fire.
    - **mockup or real:** real-world user testimony
    - **is vendor or independent:** independent
  - _item 6_
    - **source type:** Apple App Store customer reviews, v1.79.0 and v1.87.0
    - **url:** https://itunes.apple.com/us/rss/customerreviews/page=9/id=1352600944/sortby=mostrecent/json
    - **what it shows:** 'Nice idea but buggy' (3 stars, id 9707923405): "I like the expiration reminders!"; 'Cooler than I thought' (5 stars, id 10285483347): "Even tells you whenever your food is about to expire". 47 of 494 unique reviews I pulled mention expiry/notification; none contradicts the feature.
    - **mockup or real:** real-world user testimony
    - **is vendor or independent:** independent
  - _item 7_
    - **source type:** Vendor YouTube screen recording — Cooklist channel, 2020-05-28, founder Daniel
    - **url:** https://www.youtube.com/watch?v=24hfHVrRaTw
    - **what it shows:** Transcript: "send you a reminder when one of those items is about to expire". Also reveals the in-app representation is AGE + traffic light, not a date: "red means an items expired yellow means it's in a warning status... green typically means that that item is still in a good status" and "this is gonna say that it's now 0 days old". Tapping the status bar "will open up the expiration modal" (correctable).
    - **mockup or real:** REAL screen recording of the shipped app (vendor-produced)
    - **is vendor or independent:** vendor
  - _item 8_
    - **source type:** Vendor YouTube screen recording — 'Recipes You Can Cook With Ingredients You Have', 2020-06-11
    - **url:** https://www.youtube.com/watch?v=GnDFyXemhzY
    - **what it shows:** THE MOST DANGEROUS SOURCE FOR OUR CLAIM. In-app substitution disclosure: "if you tap on it it's going to show you that it's substituting chicken thigh for chicken breast" and "you can tap on it and then see exactly what the recipe was originally calling for and which product in your pantry it's matched to". The UI label is 'Recipe Ingredient' vs the matched pantry product — i.e. it names WHAT was substituted. The narrator's 'you can most of the time substitute' is his spoken gloss, NOT shown UI text; no on-screen reason string is demonstrated.
    - **mockup or real:** REAL screen recording of the shipped app (vendor-produced)
    - **is vendor or independent:** vendor
  - _item 9_
    - **source type:** Vendor YouTube screen recording — 'How The Cooklist App Works', 2020-05-28 (run on simulator, stated)
    - **url:** https://www.youtube.com/watch?v=zxWyVSMI6fM
    - **what it shows:** Co-location evidence: on ONE recipe-detail screen — "our soy sauce is matched to this actual soy sauce product in the pantry ... and we're showing the expiration status and then cook list will also try to help you use your ingredients in your pantry in new ways by making recommendations for substitutions so here ... dark brown sugar is what the recipe calls for but it's matched to our regular or light brown sugar", plus "the breakdown of the main macronutrients ... as well as your calories". Founder: "the app tries to be as clear as it can about how it's trying to make these connections." Note he says he is recording "on the simulator" — real app UI, not a device.
    - **mockup or real:** REAL app UI, recorded in a simulator (vendor-produced)
    - **is vendor or independent:** vendor
  - _item 10_
    - **source type:** Independent blog with author's own device screenshots, published 2025-04-09, modified 2025-09-10
    - **url:** https://food.thefuntimesguide.com/files/cooklist-pantry-expiration-dates.jpg
    - **what it shows:** REAL capture (genuine Android status bar: 2:25, 87% battery) of Cooklist's recipe-ingredient screen. Each ingredient shows the matched pantry product photo, a coloured quantity badge, and a bare '2 OPTIONS' / '3 OPTIONS' chip. NO reason text anywhere. The author's own alt text: "RED = expired. BLUE = item is in the freezer YELLOW = it's about to expire. GREEN = fresh/not expired".
    - **mockup or real:** REAL device capture
    - **is vendor or independent:** independent
  - _item 11_
    - **source type:** Independent blog body text, same page
    - **url:** https://food.thefuntimesguide.com/cooklist-app-reviews/
    - **what it shows:** "Cooklist lets you know when you have items in your pantry that are about to expire" — ambiguous between push and the in-app 'Expiring Soon' shelf, so it does NOT settle push. But it does settle correctability: "if you want to change the expiration date for an item to the EXACT expiration date that's found on the item's packaging, it's a cinch to do so with one click." Also on substitutions: "it will show that you could substitute the chicken breasts that you already have in your pantry for the chicken thighs that the recipe calls for" — again what, not why.
    - **mockup or real:** independent prose + own screenshots
    - **is vendor or independent:** independent
  - _item 12_
    - **source type:** Independent YouTube walkthrough, 'Lisa Marie Budgets', 2022-06-10
    - **url:** https://www.youtube.com/watch?v=_I3YfE8eVfM
    - **what it shows:** Unpaid independent user ("they have no idea who I am and they don't know that I'm making this video") screen-recording her own account: "it will tell you items that are expiring soon so that's based on either purchase date or barcode" and "I can go into the item and I can edit the expiration date and I can bump that out ... now it shows in green that the expiration date is good". Confirms the in-app Expiring Soon shelf and date-correctability on a real account. She does NOT show or mention a push notification.
    - **mockup or real:** REAL screen recording of a real user account (independent)
    - **is vendor or independent:** independent
  - _item 13_
    - **source type:** Vendor Google Play screenshot — real-capture recipe feed
    - **url:** https://play-lh.googleusercontent.com/J7h_sIKMxrxqQnVCrZSVliXffG7dthVPd-qE05mHEEvXneUTX1MnbSw76M4DCLVDEABYcxJInwK1_vECl2xcCA=w1600
    - **what it shows:** Tablet capture with a genuine status bar ('10:34 AM Thu Dec 9') inside a marketing frame. Shows what a per-recommendation 'reason' actually looks like in Cooklist: a bare ratio in the card corner — '5 / 8', '10 / 16', '10 / 11' (pantry-matched ingredients over total). No named item, no date, no constraint, no reason. Filter chips 'LOW CARB', 'NO EGGS', 'CHICKEN BREAST' are user-applied filters, not stated rationale.
    - **mockup or real:** REAL capture inside a marketing frame
    - **is vendor or independent:** vendor
  - _item 14_
    - **source type:** Live App Store metadata, fetched today (v1.109.1, released 2026-06-29)
    - **url:** https://itunes.apple.com/lookup?id=1352600944&country=us
    - **what it shows:** Current shipped description still lists under REDUCE FOOD WASTE: "Food and pantry inventory expiration notifications" and "Automatic cooking recipes with ingredients that is expiring soon". A claim about the currently shipping build, not a stale 2019 artifact.
    - **mockup or real:** vendor claim (text)
    - **is vendor or independent:** vendor
  - _item 15_
    - **source type:** Google Play listing HTML, fetched today
    - **url:** https://play.google.com/store/apps/details?id=com.cooklist.android&hl=en_US&gl=US
    - **what it shows:** Same bullets: "Food and pantry inventory expiration notifications" / "Automatic cooking recipes with ingredients that is expiring soon".
    - **mockup or real:** vendor claim (text)
    - **is vendor or independent:** vendor
- **does the reminder actually ship:** CONFIRMED_SHIPS
- **per recommendation rationale:** partial
- **verdict on our claim:** WOUNDS_IT
- **sources checked:**
  - Google Play listing HTML for com.cooklist.android (fetched, all 11 screenshots downloaded at w1600 and visually inspected)
  - Apple iTunes lookup API for id=1352600944 (live description + version 1.109.1)
  - All 10 live Apple App Store screenshot URLs; the expiration one re-downloaded at 1242x2688 and cropped/zoomed
  - iTunes customer-review RSS, mostrecent + mosthelpful, pages 1-10 (494 unique reviews de-duplicated; 47 mentioned expiry/notification)
  - YouTube: 24hfHVrRaTw, GnDFyXemhzY, zxWyVSMI6fM, _I3YfE8eVfM, Vf3I4PPJs3o, homQ4ADg7nY - metadata + auto-transcripts pulled via yt-dlp
  - food.thefuntimesguide.com/cooklist-app-reviews/ - full HTML plus the author's own device screenshots downloaded and viewed
  - cooklist.com/cooklist-app (live marketing page)
  - cooklist.com/help, /features, /pantry - all 404; help. and support. subdomains do not resolve
  - web.archive.org CDX index for cooklist.com (rate-limited, low yield)
  - cooklist.en.uptodown.com and apkcombo.app - APK string-extraction route attempted, no hostable APK found
- **what only an install can settle:** "Six things. (1) Does the push actually fire on a real device today, and with what literal wording? Every wording I have is from a composite; no real user quoted the string back, and the string is almost certainly server-generated, so it is not extractable from the binary. (2) Does it say a DATE or an AGE? Every real Cooklist surface I found states age plus a traffic light ('0 days old', red/yellow/green) - the 'may expire soon' in the mockup is a date-DERIVED fact, not a date. An install would show whether any notification or any explanation surface ever prints the actual date. (3) Does tapping the notification really land on a recipe list filtered to that item? Zero users mention it; the deep link is unverified. (4) What exactly does the substitution detail sheet PRINT? The founder demonstrates tapping through to 'Recipe Ingredient' vs the matched pantry product, and he narrates a reason - but I could not obtain a frame of that sheet (YouTube blocks video download; the one real capture of the ingredient list shows only a bare '2 OPTIONS' chip). Whether the sheet contains a reason string, a similarity score, or nothing but two product names is THE load-bearing unknown for our claim. (5) Is the substitution correctable per-item, or only globally via the 'broad substitutions' setting one reviewer names? (6) Does any surface ever state a nutrient CONSTRAINT the dish satisfies, rather than just showing a nutrition panel and letting the user apply a 'LOW CARB' filter?"
