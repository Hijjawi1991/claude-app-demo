# Project: Mindray probation review deck, rebuilt in Vox explainer style

Read this file fully, then `docs/VOX_STYLE.md`, `docs/SLIDE_MAP.md` and `docs/TASK_PLAN.md`. Follow the task plan phase by phase and **stop where it says STOP**.

## Who this is for
- Presenter: **Ahmad Abdulghafer**, Regional Technical Support (RTS), IVD, Middle East & Africa, at **Mindray** (Riyadh). Previously 12 years at Abbott.
- Audience: his Mindray managers, end of his 90-day probation ("Wrap Up Review"), shown on a 16:9 projector.
- Ahmad wants short, frank answers and tables. Challenge him when something is a bad idea.

## The job
Rebuild the **design from the ground up** in a **Vox-style explainer look** (paper, collage, cut-out photos, yellow marker highlights, hand-drawn red marks, typewriter labels). Layouts, visuals, illustrations, transitions and CSS can all be new.

**What must NOT change:** the words, numbers, names, dates, photos used, the 54 slides, their order, and the click reveals. `tools/check_content.py` enforces this and must pass.

## A previous attempt failed. Do not repeat it.
A Netflix-style restyle of this same deck was rejected because:
1. **Everything got smaller.** Text shrank, cards shrank, huge empty areas appeared. Vox style is **bold and big**, not minimal.
2. **The look barely changed**: same layouts recoloured.
3. **Visit slides became hard to read** (tiny captions, title overlapping a label).
4. It never compared its screenshots with the approved version.

So: **every text element must be at least as large as in the approved deck** (check with `tools/compare_sheet.py`), meet the minimum sizes in `docs/VOX_STYLE.md`, and the content must fill the slide. Look at your screenshots and the compare sheets yourself before reporting a phase as done.

## Files
| Path | What it is |
|---|---|
| `src/deck-src.html` | **The file you rebuild.** One HTML file: CSS, slide markup, JS engine. Images/fonts are `__PLACEHOLDER__` tokens. |
| `src/edit.js` | In-browser Edit mode. Keep it working; don't change its logic. |
| `assets/photos/` | `v*.webp` visit photos (colour graded), `r*.webp` 12 company "RTS role" slide images. |
| `assets/cutouts/` | `v1cut..v4cut.webp`: people already cut out of visit photos 1 to 4 (transparent background, original pixels). Use them for the collage look. |
| `assets/person.webp` | Ahmad's full-body cut-out for the intro slide. |
| `assets/fonts/` | Oswald (headlines), Courier Prime (typewriter labels), Permanent Marker (handwritten notes). All SIL Open Font License, free to embed. |
| `assets/texture/paper.jpg` | Seamless paper texture (generated, no copyright). |
| `reference/approved-deck.html` | The approved deck: **content source of truth. Never edit.** |
| `reference/prototype/prototype.html` + `reference/style-shots/` | 3 sample slides showing the target look. Style reference only: some sample labels in it ("Mindray probation review", "What I did" on every item) are NOT in the real content; don't copy those words. |
| `tools/build.py` | Builds `output/monthly-review-deck.html`. Lists every placeholder. |
| `tools/check_content.py` | **Must pass**: same words and click counts per slide as the approved deck. |
| `tools/check_slides.py` | Screenshots every slide fully revealed, reports overflow and JS errors. |
| `tools/compare_sheet.py` | Old vs new side by side per slide, to check size and readability. |
| `tools/check_devices.py` | 16:9 stage on 11 screen shapes. |

## Commands
```bash
pip install playwright pillow && python -m playwright install chromium   # once
python tools/build.py
python tools/check_content.py
python tools/check_slides.py paper            # default theme (any arg other than "light" = default)
python tools/check_slides.py light 1,2,3      # the L-key variant, selected slides
python tools/compare_sheet.py 4,12,38         # old vs new
python tools/check_devices.py
```

## Deck engine (keep working)
- **Fixed stage:** `#frame` is 1920×1080, scaled by JS to fit any screen. Design in px. Never use `vw`/`vh` inside slides. Slides are `overflow: hidden` with no scroll bars (scroll bars caused a visible line on Mac/iPhone).
- **Slides:** `<section class="slide ...">`; active one has `.active`; transitions are CSS on `.slide`, `.slide.active`, `.slide.leaving`.
- **Click reveals:** elements with `data-step="N"` get `.shown` at click N. You may move these elements anywhere and restyle them, but each slide must keep the same number of steps and the same text per step.
- **Entrance motion classes** `rise`, `zoom`, `pop` with `--d` delay; count-ups via `data-count`.
- **Theme:** the new default is the paper look. The **L key** must still switch to an alternative variant (make it a dark "charcoal paper" version). Slides with `data-dark` used to be forced dark; in Vox style remove that forcing unless it helps the design.
- **Keys:** arrows/space/click navigate, L theme, M soft motion (`body.lite`: animations near-instant, for screen sharing), P presenter view, Edit button.
- **Logo:** `.brand`, Mindray logo bottom right, static, every slide except `data-nobrand` ones (the 12 company images already contain a logo).
- `window.deckAPI` (`slides, current(), setStep, maxStep, forward, backward`) is used by the tests and presenter view. Keep it.

## Ahmad's hard rules
1. **Content frozen** (see above). If you think a word should change, ask.
2. **No em dashes (—) or en dashes (–)** anywhere. Use " - " or "to".
3. **No leading zeros**: "1", never "01" (also in decorative numbering).
4. **No red background on content slides.** Red is an accent (marks, numbers, one word). Exception: cover (slide 1) and Thank you (slide 54) use the official Mindray template red background; see Phase 0 question.
5. **Mindray logo bottom right on every slide, static**, except `data-nobrand`.
6. **Never edit faces.** Cut-outs only remove backgrounds; never retouch, recolour, warp or filter the people. A white sticker outline and a drop shadow around a cut-out are fine.
7. **Mindray palette for accents**: red `#C7000B`, greys `#3E3A39 #727171 #B5B5B6 #DCDDDD`. Abbott items in blue `#009CDE`. The yellow marker highlight is the only extra accent colour allowed.
8. **No Vox trademarks**: no Vox logo, no "Vox" wording on slides, no copying their fonts. Evoke the genre only.
9. **16:9 on every device**, nothing cut off, no sideways scrolling.
10. Patient data in two Nahdi Tuweeq screenshots (`v5b`, `v5c`) is already blurred. Never place anything that un-blurs or enlarges them beyond their current size.
11. Big gradient or clipped text: give glyphs padding so digits are not cut (Myriad/Oswald digits overflow their box).

## Reply style
Short and direct. After each phase: a table of what changed, what you checked (with pass/fail), and anything uncertain. Attach or name the compare sheets you looked at.
