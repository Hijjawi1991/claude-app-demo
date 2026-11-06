"""Content check: every slide's visible text, click count and image count must match the approved deck.
Usage:  python tools/check_content.py
Only allowed difference: the approved label rename "Section N of 6" -> "Chapter N"."""
import asyncio, os, re
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, "reference", "apple-version-approved.html")
NEW = os.path.join(ROOT, "output", "monthly-review-deck.html")
GRAB = """() => window.deckAPI.slides.map(s => ({
  text: s.textContent.replace(/\\s+/g, ' ').trim(), clicks: window.deckAPI.maxStep(s),
  steps: [...s.querySelectorAll('[data-step]')].map(e => e.tagName + ':' + e.getAttribute('data-step')).join(','),
  imgs: s.querySelectorAll('img').length }))"""
async def grab(page, path):
    await page.goto("file://" + path); await page.wait_for_timeout(300)
    return await page.evaluate(GRAB)
async def run():
    async with async_playwright() as p:
        exe = os.environ.get("CHROMIUM_PATH")
        b = await (p.chromium.launch(executable_path=exe) if exe else p.chromium.launch())
        pg = await b.new_page()
        ref, new = await grab(pg, REF), await grab(pg, NEW)
        await b.close()
    for s in ref: s["text"] = re.sub(r"Section (\d) of 6", r"Chapter \1", s["text"])  # approved rename
    diffs = 0
    if len(ref) != len(new): print(f"slide count differs: {len(ref)} vs {len(new)}"); diffs += 1
    for i, (a, c) in enumerate(zip(ref, new), 1):
        for k in ("text", "clicks", "steps", "imgs"):
            if a[k] != c[k]:
                diffs += 1; print(f"slide {i}: {k} differs")
                if k == "text":
                    j = next((n for n, (x, y) in enumerate(zip(a["text"], c["text"])) if x != y), min(len(a["text"]), len(c["text"])))
                    print("  approved:", a["text"][max(0, j - 40):j + 60]); print("  new:     ", c["text"][max(0, j - 40):j + 60])
    print(f"{len(ref)} vs {len(new)} slides | content differences: {diffs}")
asyncio.run(run())
