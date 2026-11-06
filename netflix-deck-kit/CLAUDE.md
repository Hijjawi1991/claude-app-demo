# Project: Mindray probation review deck (Netflix-documentary restyle)

You are restyling an existing, approved presentation. **Read this file fully, then `docs/NETFLIX_STYLE.md`, then follow `docs/TASK_PLAN.md` phase by phase.**

## Who this is for
- Presenter: **Ahmad Abdulghafer**, Regional Technical Support (RTS), IVD, Middle East & Africa, at **Mindray** (Riyadh, Saudi Arabia). Previously 12 years at Abbott.
- Audience: his managers at Mindray, at the end of his 90-day probation ("Wrap Up Review").
- Ahmad wants frank, direct answers. Challenge him when something is a bad idea. Present comparisons and lists as tables.

## The job in one sentence
Replace the current Apple-keynote look with a **Netflix-documentary look** (full replacement, not a switchable theme) while keeping **every word, number, photo, slide, slide order and click reveal exactly the same**.

## Files
| Path | What it is |
|---|---|
| `src/deck-src.html` | **The only file you edit for the design.** One HTML file: CSS, slide markup and JS. Images are `__PLACEHOLDER__` tokens. |
| `src/edit.js` | In-browser edit mode (Edit button). Leave it working; do not restyle its logic. |
| `assets/` | Intro photo cutout (`person.webp`), its cast shadow, logos, template cover background. |
| `assets/photos/` | `v*.webp` customer-visit photos (already colour graded), `r*.webp` 12 RTS role slide images. |
| `tools/build.py` | Builds `output/monthly-review-deck.html` (single self-contained file). Fails if an em/en dash or unreplaced placeholder remains. |
| `tools/check_slides.py` | Steps through every slide fully revealed, screenshots it, reports overflow and JS errors. |
| `tools/check_devices.py` | Confirms the 16:9 stage on 11 screen shapes. |
| `reference/apple-version-approved.html` | The approved deck before restyling. Content source of truth. Never edit it. |
| `docs/SLIDE_MAP.md` | All 54 slides, what each contains. |
| `docs/NETFLIX_STYLE.md` | The design spec. |
| `docs/TASK_PLAN.md` | Phases, checks and the definition of done. |

## Commands
```bash
pip install playwright && python -m playwright install chromium   # once
python tools/build.py                         # after every edit
python tools/check_slides.py dark             # all slides, dark (default theme)
python tools/check_slides.py dark 1,2,3       # only some slides
python tools/check_slides.py light            # light theme must still work
python tools/check_devices.py                 # 16:9 on all screen shapes
```
Always build, then check, then **look at the screenshots yourself** (open the PNGs in `output/shots/`) before saying a phase is done.

## How the deck engine works (do not break)
- **Fixed stage:** `#frame` is a 1920×1080 box scaled by JS to fit any screen (letterboxed). Design everything in px at 1920×1080. Never use `vw`/`vh` inside slides.
- **Slides:** `<section class="slide ...">`. The active one gets `.active`. Transitions are CSS on `.slide` / `.slide.active` / `.slide.leaving`.
- **Click reveals:** any element with `data-step="N"` gets `.shown` when the presenter reaches click N on that slide. Keep every `data-step` exactly as it is (same elements, same numbers).
- **Entrance motion:** classes `rise`, `zoom`, `pop` with `style="--d:ms"` delay. Count-up numbers use `data-count`.
- **Themes:** dark is the default. `body.light` is the light theme (L key). Slides with `data-dark` always render dark (the photo intro, section dividers, hero number slides). Both themes must keep working.
- **Keys:** arrows/space/click navigate, L theme, M soft motion (`body.lite`, used for screen sharing: animations must be near-instant there), P presenter view, Edit button = edit mode.
- **Brand logo:** `.brand` image, bottom right, static on every slide. Hidden on slides with `data-nobrand` (the 12 RTS role images already carry a logo).
- `window.deckAPI` exposes `slides, current(), setStep, maxStep, forward, backward`. The test scripts and presenter view rely on it.

## Hard rules from Ahmad (never break these)
1. **Content is frozen.** No changes to any text, number, name, date, photo, slide order or click count. If you think content should change, say so and ask; do not do it.
2. **Never use em dashes (—) or en dashes (–)** anywhere, including date ranges (use " - " or "to").
3. **No leading zeros** on numbers: "1", "Reason 1", never "01".
4. **Never use a red background** on content slides. Red is an accent only. Exception: the cover (slide 1) and Thank you (last slide) use the official Mindray template red background; keep them.
5. **Mindray logo bottom right on every slide, static** (no animation), except `data-nobrand` slides.
6. **Do not edit Ahmad's face** in any photo. The intro cutout (`person.webp`) must not be colour graded, filtered, warped or retouched. Overlays (grain, vignette) may sit over the slide but must stay very subtle over his face.
7. **Brand palette stays Mindray:** red `#C7000B`, greys `#3E3A39 #727171 #B5B5B6 #DCDDDD`, black, white. Do **not** use Netflix red `#E50914`.
8. **Brand font:** Myriad Pro (installed on Ahmad's laptop) with Arial fallback. Do not embed or require Netflix Sans.
9. **No Netflix trademarks:** no Netflix logo, no "N" mark, no "ta-dum" intro, no "A Netflix Original" wording. Evoke the style only.
10. **16:9 fixed stage on every device**, no sideways scrolling, nothing cut off.
11. Mindray-blue is used only for Abbott (`--abbott: #009CDE`); Mindray items are red.

## Known pitfalls already solved (keep the fixes)
- **Gradient text clipping:** big numbers with `background-clip: text` need padding around the glyphs (`.hr-num` has padding + negative margin). Myriad Pro digits overflow the line box.
- **Scroll bar line on Mac/iPhone:** slides are `overflow: hidden` with scroll bars disabled. Never make a slide scrollable.
- **iPhone landscape text inflation:** `-webkit-text-size-adjust: 100%` and no `viewport-fit=cover`. Keep both.
- **Image slides** (`.img-slide`) use a plain cross-fade with no scale/blur, otherwise an edge line flashes.
- **Controls bar** appears only on real mouse movement, not on key presses or clicks.
- Patient names/IDs in two Nahdi Tuweeq screenshots are already blurred. Never use unblurred originals.

## Style of your replies to Ahmad
Short, direct, honest. Say what changed, what you checked, and anything uncertain. Use tables for lists of changes.
