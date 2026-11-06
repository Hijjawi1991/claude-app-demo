# Vox explainer style spec

**Target feel:** a smart video explainer laid out on a desk. Warm paper, printed photos and cut-outs taped down, a yellow highlighter sweeping across key words, red pen circling numbers, typewriter labels. Bold, big, playful but credible.

Open `reference/style-shots/prototype-1.png`, `-2.png`, `-3.png` and `reference/prototype/prototype.html` before designing. They show the target. The real deck must be **at least that bold**.

## 1. Tokens
| Token | Value | Use |
|---|---|---|
| `--paper` | `#F0EADE` + `__PAPER__` texture | Slide background (every content slide) |
| `--card` | `#FBF8F1` | Paper cards / notes |
| `--kraft` | `#D8C7A6` | Backing paper behind photos |
| `--ink` | `#1E1B18` | Main text |
| `--ink2` | `#5B554D` | Secondary text, labels |
| `--marker` | `rgba(255,214,0,.85)` | Highlighter behind key words (max 1 to 2 per slide) |
| `--red` | `#C7000B` | Red pen marks, big numbers, one accent word |
| `--abbott` | `#009CDE` | Abbott only |
| Tape | `rgba(232,220,190,.78)` with torn ends (clip-path) | Holding photos/cards |
| Shadow | `0 18px 40px -18px rgba(60,40,10,.45)` | Paper lift |
| Vignette | radial darkening at edges, about 18% | Every slide, subtle |

**Charcoal variant (L key):** paper `#2A2724` with the same texture multiplied, cards `#34302C`, ink `#F3EEE4`, same marker and red.

## 2. Typography
| Role | Font | Size (min) | Notes |
|---|---|---|---|
| Slide title | Oswald 700, UPPERCASE | **110px min** (chapter titles 160px+) | Tight line-height .95 |
| Big numbers | Oswald 700 | **180px min** | Red or ink; red pen circle around the key one |
| Card / main text | Oswald 500 (sentence case) | **48px min** | Max 2 to 3 lines per card |
| Body / list items | Oswald 500 or Myriad Pro | **36px min** | |
| Labels / kickers | Courier Prime 700, uppercase, tracking .12em | **22px min** | Black tag style: `<b>` with ink background |
| Handwritten notes | Permanent Marker, red, rotated -3 to -5deg | **36px min** | Only for short notes ("with Eng. ...", "vs") |
| Dense lists (course list slide) | Courier Prime | **22px min** | Only on the Planned vs Achieved list |

Fonts are embedded via `@font-face` with `__FONT_OSWALD_700__`, `__FONT_OSWALD_500__`, `__FONT_TYPE_400__`, `__FONT_TYPE_700__`, `__FONT_HAND__` (see `reference/prototype/prototype.html` for the exact CSS).

**Size rule:** for every slide, the main text must be **at least as large as in the approved deck** (check `tools/compare_sheet.py`). Content must fill at least 70% of the slide height.

## 3. Signature elements (use across the deck)
| Element | How | Where |
|---|---|---|
| **Marker highlight** | `::before` yellow skewed band that sweeps in (scaleX 0 to 1, .7s) behind 1 to 3 words | Titles, the key phrase of each card |
| **Red pen marks** | Inline SVG paths with `pathLength="1"` + dash animation: circles round numbers, underlines, arrows | Numbers slides, comparisons, career plan |
| **Tape** | Torn-edge strips at slight angles | Cards, photos, company images |
| **Paper cards** | Slight rotations (-2 to +2deg), lift shadow | Comparisons, lists |
| **Cut-out stickers** | People cut-outs with white outline (stacked `drop-shadow` filters) + soft shadow, on kraft paper | Visit slides 37 to 40, intro |
| **Printed photos** | White border (16px), tape, slight rotation | Visits without cut-outs, Hayat drawings |
| **Typewriter tags** | Courier label with black tag | Kickers like "SECTION 2 OF 6" |
| **Stamps** | Rotated outlined box text in red (e.g. the word "Not." on slide 52 can land like a stamp) | Only on existing words |

## 4. Slide treatments
| Slides | Treatment |
|---|---|
| 1, 54 cover / thank you | Ask Ahmad in Phase 0: keep the Mindray template red as is, or a Vox paper cover with the same text (template background as a taped "printed" element). |
| 2, 4, 19, 32, 35, 46 section dividers | Chapter cards: giant red section number (paper-textured), huge uppercase title with marker on the key words, red underline drawing in, section list as typewriter tags with the current one filled black. See prototype-1. |
| 3 intro | Ahmad's cut-out (`person.webp`) as a big sticker with white outline on kraft paper; career timeline as a taped paper strip / typewritten list with red pen year circles. No floor shadow/reflection needed. Never alter his pixels. |
| 5, 6, 7, 8, 18 questions and reasons | Big headline cards, hand-drawn arrows connecting ideas, marker on the key words. |
| 9 China culture | 8 paper "polaroid" cards with the illustrations redrawn as ink line drawings (black + red), taped in a loose grid. Keep all 8 card texts. |
| 10, 11 company numbers | Newspaper / data-clipping look: big Oswald numbers, Abbott blue vs Mindray red bars as torn paper strips, red pen circle on the key stat. Chart on 11 redrawn as a hand-annotated chart (keep all values and labels). |
| 12 to 17 work cultures | Two taped paper cards, Abbott left (blue label) vs Mindray right (red), handwritten "vs" between, illustration redrawn as ink drawing on each card. See prototype-2. |
| 20 to 31 company images | Each image printed on white with tape at two corners, slight rotation (max 1deg), on paper, about 90% of the slide. **No texture or vignette over the image itself** (legibility). Plain cross-fade between them (no scale/blur: scale caused edge lines before). |
| 33, 36 hero numbers | Giant numbers in Oswald, red pen circles drawing around them one by one, the line on click as a marker-highlighted sentence. Count-up stays. |
| 34 planned vs achieved | Checklist on paper: rows like a printed form, ticks drawn in red pen, course list as a typed sheet on the right, visit tags as small paper labels. Keep 3 clicks. |
| 37 to 45 visits | Title = site name huge; photo(s): cut-out stickers for 37 to 40 (`__V1CUT__`..`__V4CUT__`), printed taped photos for 41 to 45; "What I did" items big (36px+); notes like "Visited with Eng. Mohammad Shahbal" as red handwriting. Hayat (43) is a collage of the 8 images. See prototype-3. |
| 47 to 51 career plan | Hand-drawn roadmap feel: step number in red pen circle, illustration as ink drawing, title with marker. |
| 52 regret | "Absolutely" huge, then "Not." slams in as a red stamp. Keep the 2 clicks. |
| 53 Q&A | Giant "Q&A" with marker, paper torn edge. |

## 5. Motion
| Thing | Spec |
|---|---|
| Slide change | Quick "camera move over the desk": incoming slide slides in 60px + fades (.6s). Company image slides: plain fade. |
| Marker | Sweeps in after the text appears (.7s, delay .4s) |
| Red pen | Draws in (dash offset, .8 to 1.2s) |
| Cards/photos | Drop in with a tiny rotate settle (spring) |
| Soft motion (`body.lite`) and `prefers-reduced-motion` | Everything near-instant |
One easing: `cubic-bezier(.16,1,.3,1)`; spring `cubic-bezier(.34,1.5,.64,1)`.

## 6. Don't
- Don't shrink anything compared with the approved deck.
- Don't leave large empty paper areas; fill with the content at bold size.
- Don't add text (only drawings). Decorative arrows/circles are fine.
- Don't put texture/vignette over the company images or over faces at more than very low opacity.
- No Vox logo or name.
