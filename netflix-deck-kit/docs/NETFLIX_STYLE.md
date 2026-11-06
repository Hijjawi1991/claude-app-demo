# Netflix-documentary style spec

Goal: the deck should feel like a premium streaming documentary about Ahmad's first 90 days at Mindray. Moody, cinematic, confident, human. Evoke the genre, never copy Netflix branding (see CLAUDE.md rule 9).

## 1. Mood in five words
**Dark. Cinematic. Intimate. Bold. Restrained.**

## 2. Colour
| Token | Value | Use |
|---|---|---|
| Stage | `#0A0A0A` to `#000000` | Every slide background (dark is default) |
| Film black | `#050505` | Letterbox bars, title cards |
| Text primary | `#F2F2F2` (not pure white) | Titles and key lines |
| Text secondary | `#9A9A9A` | Labels, captions, lower-third subtitles |
| Accent | Mindray red `#C7000B` | Thin rules, chapter numbers, one key word per title, progress marks. Never a red background. |
| Abbott | `#009CDE` | Abbott items only |
| Warm highlight | `rgba(255,190,140,.06)` | Optional very soft warm light leak in vignettes |

Light theme (L key) must still work: keep it as a clean "daylight" variant with the same layouts.

## 3. Typography
- Font: Myriad Pro, Arial fallback (CLAUDE.md rule 8).
- **Titles:** very large, bold, tight tracking (`letter-spacing: -.03em`), often **uppercase for chapter cards**.
- **Kickers / labels:** small uppercase with wide tracking (`.25em` to `.35em`), secondary grey.
- **Lower thirds:** two lines, name in bold, role in secondary grey, with a short red rule.
- Max 2 type sizes per slide plus labels. Fewer words, bigger.

## 4. Cinematic layers (global, subtle)
| Layer | Spec | Rule |
|---|---|---|
| **Film grain** | Animated noise overlay over the stage, opacity about .05 to .07, `mix-blend-mode: overlay`. Build it with an inline SVG `feTurbulence` filter or a small generated PNG; no external files | Must not reduce text legibility. Off (static) in soft motion mode |
| **Vignette** | Radial darkening at the edges, about 35% at corners | Never over the centre |
| **Letterbox** | Optional thin black bars (about 40px top and bottom) that slide in on section dividers and hero slides only | Never cover content or the logo |
| **Light leak** | Very soft warm glow drifting slowly behind titles on dividers/hero slides | Very subtle |

## 5. Slide types and their treatment
| Slide type (see SLIDE_MAP.md) | Netflix treatment |
|---|---|
| **Cover (1)** | Keep the Mindray template red cover (rule 4 exception). Add only grain and a slow fade-up of the title, like an opening title. |
| **Section dividers (2, 4, 19, 32, 35, 46)** | **Chapter cards.** small label ("CHAPTER 1" only if Ahmad approved the rename, otherwise keep "SECTION 1 OF 6"), huge uppercase title, thin red rule, letterbox bars slide in, slow light sweep, the section list on the right in secondary grey with the current one bright. Feel: an episode list. |
| **Intro with photo (3)** | **Character introduction.** Ahmad's cutout stays as is (rule 6). Timeline styled like credits. Name as a bold lower-third. Do not touch the photo pixels. |
| **Two questions / regret slide (5, 52)** | **Big-question cards.** Black screen, one line of huge type, long pause feel. Keep the two-click "Absolutely" then "Not." reveal on 52. |
| **Reasons, culture comparisons (6 to 18)** | **Documentary interview cards.** Dark cards with fine borders, red accent only on Mindray side, Abbott in blue. Keep the existing animated illustrations but make them thinner, more refined line work. |
| **Numbers slides (10, 11, 33, 36, 34)** | **Data like a doc's on-screen stats.** Big numbers, small caps labels, thin bars, count-ups. No heavy boxes. |
| **RTS role images (20 to 31)** | Company images stay unchanged and on white (they are white images). Frame them like a "document on screen": centred with a thin border and soft shadow on the dark stage at about 92% size, grain must NOT be over the image (legibility). Keep the plain cross-fade. |
| **Customer visits (37 to 45)** | **B-roll + lower third.** Photo large and full-bleed-ish with slow Ken Burns zoom, site name as a lower third, "What I did" as captions. Keep blurred screenshots blurred. |
| **Career plan (47 to 51)** | **"What comes next" episode cards**: step label ("PART 2 of 5" only if Ahmad approved, otherwise keep "Step 2 of 5"), illustration on one side, title large. |
| **Q&A, Thank you (53, 54)** | Q&A as an end card. Thank you keeps the template red. |

## 6. Motion
| Element | Spec |
|---|---|
| Slide change (default) | **Dip through black**: outgoing fades to black (about .35s), incoming fades up (about .6s). No zoom/blur on most slides |
| Chapter cards | Letterbox bars slide in (.6s), title fades up with slight tracking change, light sweep (2.5s) |
| Text reveals (`data-step`) | Fade up 16px, .7s, ease `cubic-bezier(.16,1,.3,1)` |
| Photos | Ken Burns: scale 1 to 1.07 over 16s; never on drawings or company images |
| Count-ups | Keep existing `data-count` engine |
| Soft motion (`body.lite`) | All of the above near-instant, grain static |
| `prefers-reduced-motion` | Same as soft motion |

One easing curve for everything: `cubic-bezier(.16,1,.3,1)`. Three durations only: .35s, .7s, 1.2s (plus long ambient ones).

## 7. Do and don't
| Do | Don't |
|---|---|
| Fewer, bigger words on screen | Add new text or change wording |
| Use black space generously | Fill every corner |
| One red accent per slide | Red backgrounds, Netflix red |
| Subtle grain and vignette | Heavy noise that hurts readability |
| Keep all click reveals | Merge or add clicks |
| Test on all screen shapes | Use vw/vh or scrollable slides |
