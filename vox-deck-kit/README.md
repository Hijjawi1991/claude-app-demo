# Vox-style rebuild kit for Claude Code

Rebuilds your approved Mindray review deck in a **Vox explainer style** (paper, collage, cut-out photos, yellow marker, red pen). **The content stays exactly the same**; a checker enforces it.

## What's inside
| Item | Purpose |
|---|---|
| `CLAUDE.md` | Claude Code reads it automatically: project, your rules, lessons from the failed Netflix attempt |
| `docs/VOX_STYLE.md` | Design spec with minimum text sizes |
| `docs/TASK_PLAN.md` | 7 phases. Phase 1 builds only 3 pilot slides and **stops for your approval** |
| `docs/SLIDE_MAP.md` | 54 slides, clicks and images |
| `reference/style-shots/` | 3 sample slides showing the target look |
| `reference/approved-deck.html` | Your approved deck (backup, content reference) |
| `tools/` | Build, content check, screenshot check, old-vs-new compare, device check |
| `assets/` | Photos, people cut-outs, fonts (free licence), paper texture |

## Option A: Claude Code on your computer (desktop app or terminal)
1. Unzip, open the `vox-deck-kit` folder in Claude Code.
2. Paste the first message below.

## Option B: Claude Code in the cloud (claude.ai/code)
1. Create a **private** GitHub repo, upload everything inside `vox-deck-kit` (not the folder itself).
2. Open https://claude.ai/code, connect GitHub, pick the repo.
3. Paste the first message below.
4. After each phase, download `output/monthly-review-deck.html` from the branch it pushes.

## First message
```
Read CLAUDE.md, docs/VOX_STYLE.md, docs/SLIDE_MAP.md and docs/TASK_PLAN.md,
and look at the images in reference/style-shots/.
Do Phase 0 only and ask me the Phase 0 questions. Then wait.
If Chromium can't be installed, tell me and continue with build.py and
check_content.py only.
```

## Then
- Answer the questions, then: `Go Phase 1.`
- Phase 1 shows you 3 pilot slides. **Judge the look here.** Ask for changes until you like it, e.g. `Slide 12: cards are too small, make the text bigger and the marker thicker.`
- When happy: `Approved. Go Phase 2.` and so on to Phase 7.
- Undo anything: `Undo Phase 3.`

## Why this kit is safer than the Netflix one
- **Pilot first:** you approve 3 slides before it touches the other 51.
- **Size rules:** minimum text sizes, and a side-by-side old vs new comparison per slide.
- **Content checker:** fails if any word or click changes.
