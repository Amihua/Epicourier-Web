# verify-support:law-a11y-security

**Workflow:** P1b Claude independent prompts (run 2)  
**Phase:** Support  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a5277099f38802daa`  
**Tool calls:** 28 total — 0 web searches, 9 pages fetched  
**Raw transcript:** `raw/agent-a5277099f38802daa.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are a fact-checker. Another analyst produced this support-material list. Check every URL.

[
  {
    "source_name": "16 CFR § 318.2 — Definitions, FTC Health Breach Notification Rule (as amended 2024)",
    "url": "https://www.law.cornell.edu/cfr/text/16/318.2",
    "quoted_text": "An electronic record of PHR identifiable health information on an individual that has the technical capacity to draw information from multiple sources"
  },
  {
    "source_name": "Health Breach Notification Rule: The Basics for Business",
    "url": "https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business",
    "quoted_text": "underscores the Rule's application to most health apps and similar technologies"
  },
  {
    "source_name": "FTC Finalizes Changes to the Health Breach Notification Rule (press release, 26 Apr 2024)",
    "url": "https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule",
    "quoted_text": "unauthorized acquisition of identifiable health information that occurs as a result of a data security breach or an unauthorized disclosure"
  },
  {
    "source_name": "FTC Enforcement Action to Bar GoodRx from Sharing Consumers' Sensitive Health Info for Advertising",
    "url": "https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising",
    "quoted_text": "GoodRx violated the Health Breach Notification Rule by failing to notify consumers, the FTC, and the media"
  },
  {
    "source_name": "Mobile Health Apps Interactive Tool",
    "url": "https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool",
    "quoted_text": "the HIPAA Rules do not apply to health information maintained by anyone who isn't a covered entity or business associate"
  },
  {
    "source_name": "RCW 19.373.010 — Washington My Health My Data Act, definitions",
    "url": "https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.010",
    "quoted_text": "consumer's past, present, or future physical or mental health status"
  },
  {
    "source_name": "California Consumer Privacy Act (CCPA) — Attorney General overview",
    "url": "https://oag.ca.gov/privacy/ccpa",
    "quoted_text": "information concerning a consumer's health, sex life, or sexual orientation"
  },
  {
    "source_name": "N.C.G.S. § 75-65 — Protection from security breaches",
    "url": "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-65.html",
    "quoted_text": "provide notice to the affected person that there has been a security breach following discovery or notification of the breach"
  },
  {
    "source_name": "N.C.G.S. § 75-61 — Definitions, Identity Theft Protection Act",
    "url": "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-61.html",
    "quoted_text": "A person's first name or first initial and last name in combination with identifying information as defined in G.S. 14-113.20(b)"
  },
  {
    "source_name": "GDPR Article 9 — Processing of special categories of personal data",
    "url": "https://gdpr-info.eu/art-9-gdpr/",
    "quoted_text": "Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs"
  },
  {
    "source_name": "GDPR Article 3 — Territorial scope",
    "url": "https://gdpr-info.eu/art-3-gdpr/",
    "quoted_text": "the offering of goods or services, irrespective of whether a payment of the data subject is required"
  },
  {
    "source_name": "CJEU Case C-184/20, OT v Vyriausioji tarnybinės etikos komisija (1 Aug 2022)",
    "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A62020CJ0184",
    "quoted_text": "are liable to reveal information on certain sensitive aspects of the data subjects' private life, including, for example, their sexual orientation"
  },
  {
    "source_name": "EU AI Act, Article 50 — Transparency obligations for providers and deployers of certain AI systems",
    "url": "https://artificialintelligenceact.eu/article/50/",
    "quoted_text": "AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed"
  },
  {
    "source_name": "FTC Green Guides (Guides for the Use of Environmental Marketing Claims)",
    "url": "https://www.ftc.gov/news-events/topics/truth-advertising/green-guides",
    "quoted_text": "how consumers are likely to interpret particular claims and how marketers can substantiate these claims"
  },
  {
    "source_name": "Bringing Dark Patterns to Light (FTC Staff Report, September 2022)",
    "url": "https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf",
    "quoted_text": "design practices that trick or manipulate users into making choices they would not otherwise have made and that may cause harm"
  },
  {
    "source_name": "Effects of diet and fitness apps on eating disorder behaviours: qualitative study",
    "url": "https://www.cambridge.org/core/journals/bjpsych-open/article/effects-of-diet-and-fitness-apps-on-eating-disorder-behaviours-qualitative-study/2D1EE739D97AB3EFC6573835E4C527BD",
    "quoted_text": "fixation on numbers, rigid diet, obsession, app dependency, high sense of achievement, extreme negative emotions"
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 1.4.1: Use of Color (Level A)",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
    "quoted_text": "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 1.4.11: Non-text Contrast (Level AA)",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
    "quoted_text": "have a contrast ratio of at least 3:1 against adjacent color(s): User Interface Components"
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 1.4.3: Contrast (Minimum) (Level AA)",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
    "quoted_text": "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1"
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 2.5.8: Target Size (Minimum) (Level AA, new in 2.2)",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    "quoted_text": "The size of the target for pointer inputs is at least 24 by 24 CSS pixels"
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 3.3.1: Error Identification (Level A)",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
    "quoted_text": "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text."
  },
  {
    "source_name": "WCAG 2.2 — Understanding Success Criterion 4.1.3: Status Messages (Level AA)",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
    "quoted_text": "status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies"
  },
  {
    "source_name": "Color Blindness — National Eye Institute",
    "url": "https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness",
    "quoted_text": "About 1 in 12 men have color vision deficiency"
  },
  {
    "source_name": "Fact Sheet: New Rule on the Accessibility of Web Content and Mobile Apps Provided by State and Local Governments (28 CFR Part 35)",
    "url": "https://www.ada.gov/resources/2024-03-08-web-rule/",
    "quoted_text": "WCAG 2.1, Level AA is the technical standard for state and local governments' web content and mobile apps"
  },
  {
    "source_name": "REG 04.25.05 — Information and Communication Technology Accessibility",
    "url": "https://policies.ncsu.edu/regulation/reg-04-25-05",
    "quoted_text": "any digital or electronic resource used for instruction, information distribution, or communication"
  },
  {
    "source_name": "OWASP ASVS 5.0, V8 Authorization",
    "url": "https://github.com/OWASP/ASVS/blob/master/5.0/en/0x17-V8-Authorization.md",
    "quoted_text": "data-specific access is restricted to consumers with explicit permissions to specific data items to mitigate insecure direct object reference (IDOR)"
  },
  {
    "source_name": "OWASP ASVS 5.0, V2 Validation and Business Logic — requirement 2.2.1",
    "url": "https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md",
    "quoted_text": "positive validation against an allow list of values, patterns, and ranges, or be based on comparing the input to an expected structure"
  },
  {
    "source_name": "OWASP ASVS 5.0, V2 — requirement 2.4.1 (anti-automation)",
    "url": "https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md",
    "quoted_text": "anti-automation controls are in place to protect against excessive calls to application functions"
  },
  {
    "source_name": "OWASP ASVS 5.0, V13 Configuration — requirement 13.3.1",
    "url": "https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x22-V13-Configuration.md",
    "quoted_text": "Secrets must not be included in application source code or included in build artifacts."
  },
  {
    "source_name": "OWASP API Security Top 10 2023 — API1:2023 Broken Object Level Authorization",
    "url": "https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/",
    "quoted_text": "Attackers can exploit API endpoints that are vulnerable to broken object-level authorization by manipulating the ID of an object"
  },
  {
    "source_name": "CWE-639: Authorization Bypass Through User-Controlled Key",
    "url": "https://cwe.mitre.org/data/definitions/639.html",
    "quoted_text": "The system's authorization functionality does not prevent one user from gaining access to another user's data or record by modifying the key value"
  },
  {
    "source_name": "CWE-1284: Improper Validation of Specified Quantity in Input",
    "url": "https://cwe.mitre.org/data/definitions/1284.html",
    "quoted_text": "receives input that is expected to specify a quantity (such as size or length), but it does not validate"
  },
  {
    "source_name": "OWASP Top 10 for LLM Applications 2025 — LLM01:2025 Prompt Injection",
    "url": "https://genai.owasp.org/llmrisk/llm01-prompt-injection/",
    "quoted_text": "A Prompt Injection Vulnerability occurs when user prompts alter the LLM's behavior or output in unintended ways."
  },
  {
    "source_name": "OWASP Top 10 for LLM Applications 2025 — LLM02:2025 Sensitive Information Disclosure",
    "url": "https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/",
    "quoted_text": "personal identifiable information (PII), financial details, health records, confidential business data, security credentials, and legal documents"
  },
  {
    "source_name": "OWASP Top 10 for LLM Applications 2025 — LLM10:2025 Unbounded Consumption",
    "url": "https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/",
    "quoted_text": "strict input validation to ensure that inputs do not exceed reasonable size limits"
  },
  {
    "source_name": "Supabase Docs — Row Level Security",
    "url": "https://supabase.com/docs/guides/database/postgres/row-level-security",
    "quoted_text": "A table in an exposed schema without RLS is readable and writable by any role with a grant on it."
  },
  {
    "source_name": "Supabase Docs — API Keys",
    "url": "https://supabase.com/docs/guides/api/api-keys",
    "quoted_text": "A secret key bypasses every Row Level Security policy you have."
  },
  {
    "source_name": "Next.js Docs — How to use environment variables",
    "url": "https://nextjs.org/docs/app/guides/environment-variables",
    "quoted_text": "Non-NEXT_PUBLIC_ environment variables are only available in the Node.js environment, meaning they aren't accessible to the browser"
  },
  {
    "source_name": "OWASP — CSV Injection",
    "url": "https://community.owasp.org/attacks/CSV_Injection",
    "quoted_text": "CSV Injection, also known as Formula Injection, occurs when websites embed untrusted input inside CSV files."
  },
  {
    "source_name": "NIST SP 800-63B-4 — Digital Identity Guidelines: Authentication and Authenticator Management",
    "url": "https://pages.nist.gov/800-63-4/sp800-63b.html",
    "quoted_text": "SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length"
  },
  {
    "source_name": "Pydantic Docs — Fields (constraints)",
    "url": "https://pydantic.dev/docs/validation/latest/concepts/fields/",
    "quoted_text": "positive: int = Field(gt=0) ... short_str: str = Field(max_length=3)"
  },
  {
    "source_name": "Zod — API reference (enums, numbers, runtime parsing)",
    "url": "https://zod.dev/api",
    "quoted_text": "Use z.enum to validate inputs against a fixed set of allowable string values."
  },
  {
    "source_name": "Food Allergies — FDA",
    "url": "https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies",
    "quoted_text": "vary in severity from mild symptoms involving hives and lip swelling to severe, life-threatening symptoms, often called anaphylaxis"
  },
  {
    "source_name": "Food Product Dating",
    "url": "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating",
    "quoted_text": "The \"Best if Used By\" date is not a safety date except for when used on infant formula."
  },
  {
    "source_name": "About Listeria Infection",
    "url": "https://www.cdc.gov/listeria/about/index.html",
    "quoted_text": "Listeria infection is the fourth leading cause of death from foodborne illness in the United States"
  },
  {
    "source_name": "Daily Value on the Nutrition and Supplement Facts Labels",
    "url": "https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels",
    "quoted_text": "5% DV or less of a nutrient per serving is considered low."
  },
  {
    "source_name": "FoodData Central — About",
    "url": "https://fdc.nal.usda.gov/about-us/",
    "quoted_text": "Not all data types provide data on all nutrients"
  },
  {
    "source_name": "Google APIs Terms of Service / Gemini API Additional Terms",
    "url": "https://ai.google.dev/gemini-api/terms",
    "quoted_text": "Do not submit sensitive, confidential, or personal information to the Unpaid Services."
  },
  {
    "source_name": "The MIT License",
    "url": "https://opensource.org/license/mit",
    "quoted_text": "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software."
  }
]

For each: fetch the URL. Does it resolve? Is the quoted text actually on that page? Regulations
and standards get renumbered and moved, and an analyst working from memory will produce
confident, wrong URLs — that is exactly what you are here to catch. Record a specific correction
for every failure, and an empty correction for every clean one.
```

## Pages actually fetched

- https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html   — asked: Quote verbatim the full text of Success Criterion 1.4.1 Use of Color as stated on this page. Does the page con
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html   — asked: Quote verbatim the full text of Success Criterion 1.4.11 Non-text Contrast as stated on this page. Does it con
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html   — asked: Quote verbatim the full text of Success Criterion 1.4.3 Contrast (Minimum) as stated on this page. Does it con
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html   — asked: Quote verbatim the full text of Success Criterion 2.5.8 Target Size (Minimum) as stated on this page. Does it 
- https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html   — asked: Quote verbatim the full text of Success Criterion 3.3.1 Error Identification as stated on this page. Does it c
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html   — asked: Quote verbatim the full text of Success Criterion 4.1.3 Status Messages as stated on this page. Does it contai
- https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating   — asked: Does this page contain the sentence: 'The "Best if Used By" date is not a safety date except for when used on 
- https://www.cdc.gov/listeria/about/index.html   — asked: Does this page contain the phrase "Listeria infection is the fourth leading cause of death from foodborne illn
- https://ai.google.dev/gemini-api/terms   — asked: Does this page contain the sentence "Do not submit sensitive, confidential, or personal information to the Unp

## Response

- **summary:** Checked all 49 entries (48 distinct URLs — entries 27 and 28 cite the same ASVS V2 file). Every URL resolves (HTTP 200), and 47 of 49 quotes are verbatim on the cited page. Two problems: (1) Entry 44 (FSIS Food Product Dating) — a substantive misattribution: the page assigns the infant-formula safety exception to the "Use-By" date, not the "Best if Used By" date, so the quote as written contradicts the source. (2) Entry 24 (ADA web rule fact sheet) — the quoted sentence is a splice, not verbatim; the page reads "The Web Content Accessibility Guidelines (WCAG) Version 2.1, Level AA is the technical standard..." The substance is correct. Three URLs still work but have moved and should be updated to their canonical targets: entry 23 NEI 301s to /eye-health-information/eye-conditions-and-diseases/color-blindness; entry 37 Supabase 308s to /docs/guides/getting-started/api-keys; entry 25 NCSU 301s to a trailing-slash URL. Spot-verified the renumbering-prone citations and all held: ASVS requirement numbers 2.2.1, 2.4.1 and 13.3.1 match the live V2/V13 chapters exactly (V8's IDOR text is 8.2.2, and that entry claims no number); WCAG 2.5.8 is confirmed Level AA and new in 2.2; CJEU C-184/20 is confirmed as OT v Vyriausioji tarnybinės etikos komisija, Grand Chamber, 1 Aug 2022, ECLI:EU:C:2022:601; RCW 19.373.010 is confirmed as the My Health My Data Act definitions section (2023 c 191 s 3); N.C.G.S. 75-65 and 75-61 carry the stated section headings. Three minor formatting notes, all counted clean: entry 1 capitalizes "An" because the quote starts mid-sentence (page: "means an electronic record..."); entry 38 is verbatim apart from inline code formatting around NEXT_PUBLIC_; entry 41's ellipsis joins two adjacent lines of one Pydantic code block, both present. Six W3C pages, CDC, FSIS and the Gemini terms blocked plain curl (403 / OAuth redirect) and were verified via WebFetch or full browser headers — none of those blocks indicates a bad URL.
- **checked:**
  - _item 1_
    - **source name:** 16 CFR § 318.2 — Definitions, FTC Health Breach Notification Rule (as amended 2024)
    - **url:** https://www.law.cornell.edu/cfr/text/16/318.2
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 2_
    - **source name:** Health Breach Notification Rule: The Basics for Business
    - **url:** https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 3_
    - **source name:** FTC Finalizes Changes to the Health Breach Notification Rule (press release, 26 Apr 2024)
    - **url:** https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 4_
    - **source name:** FTC Enforcement Action to Bar GoodRx from Sharing Consumers' Sensitive Health Info for Advertising
    - **url:** https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 5_
    - **source name:** Mobile Health Apps Interactive Tool
    - **url:** https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 6_
    - **source name:** RCW 19.373.010 — Washington My Health My Data Act, definitions
    - **url:** https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.010
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 7_
    - **source name:** California Consumer Privacy Act (CCPA) — Attorney General overview
    - **url:** https://oag.ca.gov/privacy/ccpa
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 8_
    - **source name:** N.C.G.S. § 75-65 — Protection from security breaches
    - **url:** https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-65.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 9_
    - **source name:** N.C.G.S. § 75-61 — Definitions, Identity Theft Protection Act
    - **url:** https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_75/GS_75-61.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 10_
    - **source name:** GDPR Article 9 — Processing of special categories of personal data
    - **url:** https://gdpr-info.eu/art-9-gdpr/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 11_
    - **source name:** GDPR Article 3 — Territorial scope
    - **url:** https://gdpr-info.eu/art-3-gdpr/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 12_
    - **source name:** CJEU Case C-184/20, OT v Vyriausioji tarnybinės etikos komisija (1 Aug 2022)
    - **url:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A62020CJ0184
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 13_
    - **source name:** EU AI Act, Article 50 — Transparency obligations for providers and deployers of certain AI systems
    - **url:** https://artificialintelligenceact.eu/article/50/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 14_
    - **source name:** FTC Green Guides (Guides for the Use of Environmental Marketing Claims)
    - **url:** https://www.ftc.gov/news-events/topics/truth-advertising/green-guides
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 15_
    - **source name:** Bringing Dark Patterns to Light (FTC Staff Report, September 2022)
    - **url:** https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 16_
    - **source name:** Effects of diet and fitness apps on eating disorder behaviours: qualitative study
    - **url:** https://www.cambridge.org/core/journals/bjpsych-open/article/effects-of-diet-and-fitness-apps-on-eating-disorder-behaviours-qualitative-study/2D1EE739D97AB3EFC6573835E4C527BD
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 17_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 1.4.1: Use of Color (Level A)
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 18_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 1.4.11: Non-text Contrast (Level AA)
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 19_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 1.4.3: Contrast (Minimum) (Level AA)
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 20_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 2.5.8: Target Size (Minimum) (Level AA, new in 2.2)
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 21_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 3.3.1: Error Identification (Level A)
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 22_
    - **source name:** WCAG 2.2 — Understanding Success Criterion 4.1.3: Status Messages (Level AA)
    - **url:** https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 23_
    - **source name:** Color Blindness — National Eye Institute
    - **url:** https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 24_
    - **source name:** Fact Sheet: New Rule on the Accessibility of Web Content and Mobile Apps Provided by State and Local Governments (28 CFR Part 35)
    - **url:** https://www.ada.gov/resources/2024-03-08-web-rule/
    - **url resolves:** True
    - **quote found on page:** PARAPHRASED_NOT_QUOTED
    - **correction:** The string as quoted does not appear on the page. The page's actual sentence is: "Requirement: The Web Content Accessibility Guidelines (WCAG) Version 2.1, Level AA is the technical standard for state and local governments' web content and mobile apps." The only place the page uses the short form "WCAG 2.1, Level AA" adjacent to "technical standard" reads "...why the Department picked WCAG 2.1, Level AA AS the technical standard..." — 'as', not 'is'. The analyst spliced the short name from one sentence onto the verb of another. Substance is correct; replace with the verbatim sentence above.
  - _item 25_
    - **source name:** REG 04.25.05 — Information and Communication Technology Accessibility
    - **url:** https://policies.ncsu.edu/regulation/reg-04-25-05
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 26_
    - **source name:** OWASP ASVS 5.0, V8 Authorization
    - **url:** https://github.com/OWASP/ASVS/blob/master/5.0/en/0x17-V8-Authorization.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 27_
    - **source name:** OWASP ASVS 5.0, V2 Validation and Business Logic — requirement 2.2.1
    - **url:** https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 28_
    - **source name:** OWASP ASVS 5.0, V2 — requirement 2.4.1 (anti-automation)
    - **url:** https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 29_
    - **source name:** OWASP ASVS 5.0, V13 Configuration — requirement 13.3.1
    - **url:** https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x22-V13-Configuration.md
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 30_
    - **source name:** OWASP API Security Top 10 2023 — API1:2023 Broken Object Level Authorization
    - **url:** https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 31_
    - **source name:** CWE-639: Authorization Bypass Through User-Controlled Key
    - **url:** https://cwe.mitre.org/data/definitions/639.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 32_
    - **source name:** CWE-1284: Improper Validation of Specified Quantity in Input
    - **url:** https://cwe.mitre.org/data/definitions/1284.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 33_
    - **source name:** OWASP Top 10 for LLM Applications 2025 — LLM01:2025 Prompt Injection
    - **url:** https://genai.owasp.org/llmrisk/llm01-prompt-injection/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 34_
    - **source name:** OWASP Top 10 for LLM Applications 2025 — LLM02:2025 Sensitive Information Disclosure
    - **url:** https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 35_
    - **source name:** OWASP Top 10 for LLM Applications 2025 — LLM10:2025 Unbounded Consumption
    - **url:** https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 36_
    - **source name:** Supabase Docs — Row Level Security
    - **url:** https://supabase.com/docs/guides/database/postgres/row-level-security
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 37_
    - **source name:** Supabase Docs — API Keys
    - **url:** https://supabase.com/docs/guides/api/api-keys
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 38_
    - **source name:** Next.js Docs — How to use environment variables
    - **url:** https://nextjs.org/docs/app/guides/environment-variables
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 39_
    - **source name:** OWASP — CSV Injection
    - **url:** https://community.owasp.org/attacks/CSV_Injection
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 40_
    - **source name:** NIST SP 800-63B-4 — Digital Identity Guidelines: Authentication and Authenticator Management
    - **url:** https://pages.nist.gov/800-63-4/sp800-63b.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 41_
    - **source name:** Pydantic Docs — Fields (constraints)
    - **url:** https://pydantic.dev/docs/validation/latest/concepts/fields/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 42_
    - **source name:** Zod — API reference (enums, numbers, runtime parsing)
    - **url:** https://zod.dev/api
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 43_
    - **source name:** Food Allergies — FDA
    - **url:** https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 44_
    - **source name:** Food Product Dating
    - **url:** https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating
    - **url resolves:** True
    - **quote found on page:** NO
    - **correction:** URL is correct but the quote misstates the source and gets the substance backwards. The page attaches the infant-formula exception to the "Use-By" date, not "Best if Used By". Verbatim: 'A "Use-By" date is the last date recommended for the use of the product while at peak quality. It is not a safety date except when used on infant formula as described below.' What the page actually says about the quoted label is: 'A "Best if Used By/Before" date indicates when a product will be of best flavor or quality. It is not a purchase or safety date.' — with no infant-formula carve-out. Either re-label the quote as the "Use-By" date or replace it with the "Best if Used By/Before" sentence.
  - _item 45_
    - **source name:** About Listeria Infection
    - **url:** https://www.cdc.gov/listeria/about/index.html
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 46_
    - **source name:** Daily Value on the Nutrition and Supplement Facts Labels
    - **url:** https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 47_
    - **source name:** FoodData Central — About
    - **url:** https://fdc.nal.usda.gov/about-us/
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 48_
    - **source name:** Google APIs Terms of Service / Gemini API Additional Terms
    - **url:** https://ai.google.dev/gemini-api/terms
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
  - _item 49_
    - **source name:** The MIT License
    - **url:** https://opensource.org/license/mit
    - **url resolves:** True
    - **quote found on page:** YES
    - **correction:** 
