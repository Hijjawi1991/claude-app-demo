# Netflix-style restyle kit for Claude Code

This folder holds everything Claude Code needs to restyle your approved Mindray review deck into a **Netflix-documentary look**, with **the same content**.

## What's inside
| Item | Purpose |
|---|---|
| `CLAUDE.md` | Claude Code reads this automatically. It explains the project, your rules (no em dashes, no red backgrounds, don't edit your face, etc.) and how the deck works. |
| `docs/NETFLIX_STYLE.md` | The design spec: colours, type, grain, chapter cards, motion. |
| `docs/TASK_PLAN.md` | The step-by-step plan (8 phases) with checks for each one. |
| `docs/SLIDE_MAP.md` | All 54 slides and their click counts. |
| `src/` | The deck source Claude Code will edit. |
| `assets/` | Your photo, logos and all slide images. |
| `tools/` | Build and test scripts. |
| `reference/apple-version-approved.html` | Your current approved deck, untouched, as a backup and content reference. |

## How to use it

### 1. Put the folder on your computer
Unzip `netflix-deck-kit.zip`, for example to `Documents/netflix-deck-kit`.

### 2. Open it in Claude Code
**Terminal (CLI):**
```bash
cd ~/Documents/netflix-deck-kit
claude
```
**Desktop app:** open Claude Code and choose the `netflix-deck-kit` folder as the project.

### 3. Paste this as your first message
```
Read CLAUDE.md, docs/NETFLIX_STYLE.md, docs/SLIDE_MAP.md and docs/TASK_PLAN.md.
Then do Phase 0 only: set up the tools, build the deck, run the baseline checks,
and report back. Ask me about the "Chapter" and "Part" label renames.
Do not start Phase 1 until I say go.
```

### 4. Go phase by phase
After Phase 0, reply **"go Phase 1"**, check the result, then **"go Phase 2"**, and so on. Each phase:
- backs up the source first,
- builds `output/monthly-review-deck.html`,
- runs the checks and looks at screenshots,
- reports a short table of what changed.

Open `output/monthly-review-deck.html` in Chrome or Edge after each phase to see it yourself. If you don't like a phase, say **"undo Phase N"**.

### 5. Final file
When Phase 8 passes, your new deck is `output/monthly-review-deck.html`. It's one file, just like before.

## First-time setup Claude Code may ask to run
```bash
pip install playwright
python -m playwright install chromium
```
These install the browser used for the automatic screenshots and checks. Say yes.

## Tips to save credits
- Let it work phase by phase. Don't ask for everything at once; big all-in-one requests waste tokens on rework.
- Give feedback with slide numbers ("slide 37: the lower third is too big").
- If a phase goes wrong, undo it rather than asking for many small fixes.
