# Project 2 poster

`poster.pdf` is the file to submit. One A4 page, generated from `poster.html`.

## Regenerate

```bash
cd p2/poster
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --no-pdf-header-footer --print-to-pdf=poster.pdf "file://$PWD/poster.html"
```

`qr/*.svg` are generated once by `python3 -c "import qrcode..."` and inlined into the HTML; the
copies in `qr/` are kept so the targets can be re-read without parsing the page.

## The rules this is built against

| Required | Where it is |
|---|---|
| Group number and all member names | header, top right |
| Mission paragraph: why / what / so what | the band under the header, each part labelled |
| Stakeholders | right column, first box |
| QR codes with the URL printed underneath — repo, forum, walkthrough video | "Find us", bottom right |
| Tech stack icons **and a reason the stack matters to the reader** | right column, "why inherit this one" |
| Small screenshots of the system | the terminal panel is a real unedited capture; a worked receipt sits in "Screens" |
| Milestones Before / Now / Future, 3–5 each, goal plus plan | the three-column block, 4 items each |

Also carries what the Project 2 brief asks a poster to sell: what works today, the four milestones
that come next, and why this repo is the one to inherit.

## Two placeholders, deliberately visible

Both point at real gaps rather than being dressed up:

- **Screenshots of the running app.** It needs Supabase credentials that have not been shared within
  the team. The poster says so in the Screens box, and the terminal panel opposite is a genuine
  capture of `p2/eval/run_eval.py` rather than a mock-up.
- **The forum and walkthrough QR codes.** Issues and Discussions are disabled on the repository and
  the walkthrough video is not recorded, so those two QR codes resolve to the repository's
  discussions tab and README anchor. **Re-generate them once the real targets exist** — a QR that
  lands nowhere is worse than one that is missing, and the rubric asks for both to be live.

## Submission

- One PDF to Moodle: this poster, the repo URL, and the self-assessed rubric
  (`p2/rubric/self-assessment.md`).
- A copy of `poster.pdf` into the shared Project 2 poster folder. Without it, no other team can find
  this repo when picking a Project 3 codebase.
