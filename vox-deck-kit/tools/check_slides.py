"""Overflow + screenshot check of every slide, fully revealed.
Usage:  python tools/check_slides.py [dark|light] [slide numbers, comma separated (optional)]
Screenshots: output/shots/<theme>-<n>.png
Setup once: pip install playwright && python -m playwright install chromium"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "output", "shots"); os.makedirs(OUT, exist_ok=True)
theme = sys.argv[1] if len(sys.argv) > 1 else "dark"
only = set(int(x) for x in sys.argv[2].split(",")) if len(sys.argv) > 2 else None
async def run():
    async with async_playwright() as p:
        exe = os.environ.get("CHROMIUM_PATH")
        b = await (p.chromium.launch(executable_path=exe) if exe else p.chromium.launch())
        pg = await b.new_page(viewport={"width": 1920, "height": 1080}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + os.path.join(ROOT, "output", "monthly-review-deck.html")); await pg.wait_for_timeout(300)
        if theme == "light": await pg.keyboard.press("l")
        done, bad = set(), 0
        for _ in range(500):
            cur, step, mx, total = await pg.evaluate("()=>{const a=window.deckAPI,s=a.slides[a.current()];return [a.current(), s._step||0, a.maxStep(s), a.slides.length]}")
            if step >= mx and cur not in done:
                want = only is None or (cur + 1) in only
                await pg.wait_for_timeout(3600 if want else 600)
                if want: await pg.screenshot(path=os.path.join(OUT, f"{theme}-{cur+1}.png"))
                done.add(cur)
                ov = await pg.evaluate("()=>{const s=document.querySelector('.slide.active');return [s.scrollHeight>s.clientHeight+2, s.getAttribute('aria-label')]}")
                bad += ov[0]
                print(f"{cur+1:>3} {'OVERFLOW' if ov[0] else 'ok':8} {ov[1]}")
                if cur == total - 1: break
            await pg.keyboard.press("ArrowRight"); await pg.wait_for_timeout(200)
        print(f"slides overflowing: {bad} | JS errors: {errs or 'none'}"); await b.close()
asyncio.run(run())
