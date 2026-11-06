"""Side-by-side contact sheet: approved deck (left) vs new deck (right), fully revealed.
Usage: python tools/compare_sheet.py 1,2,3   -> output/compare/compare-<n>.png
Use it to make sure text is at least as large and readable as in the approved version."""
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "output", "compare"); os.makedirs(OUT, exist_ok=True)
want = [int(x) for x in sys.argv[1].split(",")] if len(sys.argv) > 1 else list(range(1, 55))
async def shoot(b, path, tag):
    pg = await b.new_page(viewport={"width": 1920, "height": 1080})
    await pg.goto("file://" + path); await pg.wait_for_timeout(300)
    got = {}
    for _ in range(500):
        cur, step, mx, total = await pg.evaluate("()=>{const a=window.deckAPI,s=a.slides[a.current()];return [a.current(), s._step||0, a.maxStep(s), a.slides.length]}")
        if step >= mx and (cur + 1) not in got:
            if cur + 1 in want:
                await pg.wait_for_timeout(3200); f = os.path.join(OUT, f"{tag}-{cur+1}.png"); await pg.screenshot(path=f)
            got[cur + 1] = 1
            if cur == total - 1: break
        await pg.keyboard.press("ArrowRight"); await pg.wait_for_timeout(150)
    await pg.close()
async def run():
    async with async_playwright() as p:
        exe = os.environ.get("CHROMIUM_PATH")
        b = await (p.chromium.launch(executable_path=exe) if exe else p.chromium.launch())
        await shoot(b, os.path.join(ROOT, "reference", "approved-deck.html"), "old")
        await shoot(b, os.path.join(ROOT, "output", "monthly-review-deck.html"), "new")
        await b.close()
    for n in want:
        a, c = os.path.join(OUT, f"old-{n}.png"), os.path.join(OUT, f"new-{n}.png")
        if os.path.exists(a) and os.path.exists(c):
            im = Image.new("RGB", (1920, 540), "white")
            im.paste(Image.open(a).resize((960, 540)), (0, 0)); im.paste(Image.open(c).resize((960, 540)), (960, 0))
            im.save(os.path.join(OUT, f"compare-{n}.png"))
    print("saved to", OUT)
asyncio.run(run())
