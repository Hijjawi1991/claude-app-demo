# Task plan: Netflix-documentary restyle

Work phase by phase. After **every** phase: `python tools/build.py`, run the checks listed, open the screenshots and look at them, then report to Ahmad in a short table (what changed, what was checked, anything uncertain). Make a backup copy of `src/deck-src.html` before each phase (e.g. `src/backup-phase-N.html`) so any phase can be undone.

## Phase 0: Understand (no edits)
- Read `CLAUDE.md`, `docs/NETFLIX_STYLE.md`, `docs/SLIDE_MAP.md`.
- Build and run `python tools/check_slides.py dark` on the untouched source. Expect 54 slides, 0 overflow, no JS errors. This is the baseline.
- Skim `src/deck-src.html`: find the `:root` tokens, `.slide` transition rules, the section divider markup, `.why .fit`, `.brand`.
- Report the baseline to Ahmad and confirm the plan before Phase 1.
- **Ask Ahmad** whether he approves renaming the small labels "Section N of 6" to "Chapter N" and "Step N of 5" to "Part N of 5". These are the only wording changes the style suggests. If he says no, keep the current labels.

## Phase 1: Global foundation
- Update colour tokens to the Netflix spec (dark stage, off-white text, Mindray red accent only).
- Add global film grain + vignette layers inside `#frame` (above slides, below controls and logo). Static in `body.lite` and reduced motion.
- Replace the default slide transition with **dip through black**. Keep `.img-slide` cross-fade.
- Unify easing and the three durations.
- Checks: all slides dark and light, devices. Grain must not make small text unreadable (zoom into a screenshot of slide 34).

## Phase 2: Chapter cards (section dividers 2, 4, 19, 32, 35, 46)
- Restyle as chapter cards ("CHAPTER N" label, huge uppercase title, red rule, letterbox bars, light sweep, episode-style section list).
- Keep the section names and the list content exactly.
- Checks: those 6 slides + devices.

## Phase 3: Cover, intro, big-question cards (1, 3, 5, 52, 53, 54)
- Cover/Thank you: keep template red, add grain + opening fade only.
- Intro (3): lower-third name, credits-style timeline. **Do not touch `person.webp` or the shadow.**
- 5, 52, 53: big-question / end-card treatment. Keep the 2-click reveal on 52.

## Phase 4: Story slides (6 to 18)
- Interview-card styling for reasons and culture comparisons; refine the animated illustrations' line weight; keep every `data-step`.
- Check slides 12 to 17 carefully (Abbott blue vs Mindray red).

## Phase 5: Numbers (10, 11, 33, 34, 36)
- Documentary stat styling. Keep all numbers. Re-check big gradient numbers are not clipped (pitfall in CLAUDE.md).

## Phase 6: RTS role images (20 to 31)
- "Document on screen" framing on the dark stage at about 92% size, no grain over the image, logo hidden (data-nobrand stays).

## Phase 7: Customer visits (37 to 45) and career plan (47 to 51)
- B-roll + lower third for visits; "PART N of 5" episode cards for career plan.

## Phase 8: Final QA (definition of done)
| Check | Pass condition |
|---|---|
| `python tools/build.py` | 0 dashes, 0 unreplaced placeholders |
| `python tools/check_slides.py dark` | 54 slides, 0 overflow, no JS errors |
| `python tools/check_slides.py light` | same |
| `python tools/check_devices.py` | all PASS |
| Content diff | Every visible text string in `output/monthly-review-deck.html` matches `reference/apple-version-approved.html` (write a quick script that extracts visible text from both and diffs it). Only differences allowed: the "Chapter" / "Part" label renames, and only if Ahmad approved them in Phase 0 |
| Click counts | Same `data-step` count per slide as the reference |
| Rules | No red background on content slides, logo static bottom right, intro photo pixels untouched, no Netflix trademarks |
| Soft motion | Press M: everything near-instant, grain static |
| Presenter view | Press P: window opens, Next/Previous work |
| Edit mode | Edit button works, Save copy downloads a file |

Deliver `output/monthly-review-deck.html` and a short change summary table.
