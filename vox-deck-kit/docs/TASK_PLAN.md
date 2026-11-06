# Task plan: Vox-style rebuild

Rules for every phase:
- Back up first: `cp src/deck-src.html src/backup-phase-N.html`.
- After editing: `python tools/build.py`, `python tools/check_content.py`, `python tools/check_slides.py paper <slides>`, `python tools/compare_sheet.py <slides>`.
- **Open and look at** the screenshots and compare sheets. If any text is smaller than the approved version, or the slide looks empty, fix it before reporting.
- Report a table: slides changed, checks (pass/fail), concerns.

## Phase 0: Setup and questions (no design edits)
1. Install tools, build, run `check_content.py` (expect 0 differences), `check_slides.py paper` (expect 54 slides, 0 overflow, no errors). This is the baseline.
2. Ask Ahmad, then **STOP and wait**:
   - Cover and Thank you: keep the Mindray template red, or redesign as Vox paper with the same text?
   - Any slides he wants simplified? (Default: none; content stays.)

## Phase 1: Design system + 3 pilot slides, then STOP
- Write the new global CSS: fonts (`@font-face`), tokens, paper background, vignette, marker, tape, red pen, cards, stickers, typewriter tags, transitions, charcoal variant (L), `body.lite`.
- Restyle only **slide 4** (section divider), **slide 12** (Probation comparison) and **slide 38** (KIMS visit) to the target look (see `reference/style-shots/`).
- Checks + compare sheets for 4, 12, 38. Also make sure the rest of the deck still builds, has no JS errors and passes `check_content.py` (other slides may look half-styled at this point, that's OK).
- **STOP.** Send Ahmad the three new screenshots and ask for approval or changes. Do not continue until he approves the look.

## Phase 2: Section dividers and opening (1, 2, 3, 4, 19, 32, 35, 46, 54)
Apply Ahmad's Phase 0 answer for 1 and 54. Intro slide 3: never alter `person.webp` pixels.

## Phase 3: Story slides (5 to 18)
Including the China culture cards (9), company numbers (10, 11) and work cultures (12 to 17). Redraw illustrations as ink drawings.

## Phase 4: Company images (20 to 31)
Printed and taped, about 90% size, no texture over images, plain fade.

## Phase 5: Training (33, 34) and visits (36 to 45)
Cut-out stickers for 37 to 40, printed photos for 41 to 45, Hayat collage. Big readable "What I did".

## Phase 6: Career plan and ending (47 to 53)
Including the "Absolutely" / "Not." stamp (52).

## Phase 7: Final QA (definition of done)
| Check | Pass condition |
|---|---|
| `python tools/build.py` | 0 dashes, 0 unreplaced placeholders |
| `python tools/check_content.py` | 54 slides compared, **0 with differences** |
| `python tools/check_slides.py paper` | 0 overflow, no JS errors |
| `python tools/check_slides.py light` | same (charcoal variant) |
| `python tools/check_devices.py` | all PASS |
| `python tools/compare_sheet.py` (all) | every slide's main text same size or bigger than approved; no slide mostly empty |
| Rules | no red background on content slides; logo static bottom right; faces untouched; no Vox branding; no "01"-style numbers |
| Keys | M soft motion near-instant; P presenter view opens and Next/Previous work; Edit mode works |

Deliver `output/monthly-review-deck.html` plus a one-table summary. If running in a GitHub cloud session, commit the output file after every phase so Ahmad can download it.
