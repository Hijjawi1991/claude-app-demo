"""Checks the fixed 16:9 stage on many screen shapes.  Usage: python tools/check_devices.py"""
import asyncio, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = [("Laptop 16:9",1920,1080,1),("Small laptop",1366,768,1),("4K TV",3840,2160,1),("MacBook 16:10",1440,900,2),("Surface 3:2",1500,1000,2),
     ("iPad 4:3",1024,768,2),("iPad portrait",768,1024,2),("Ultrawide 21:9",2560,1080,1),("Super-ultrawide 32:9",3840,1080,1),
     ("Phone landscape",844,390,3),("Phone portrait",390,844,3)]
async def run():
    async with async_playwright() as p:
        exe = os.environ.get("CHROMIUM_PATH")
        b = await (p.chromium.launch(executable_path=exe) if exe else p.chromium.launch())
        for name, w, h, dpr in V:
            pg = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=dpr); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto("file://" + os.path.join(ROOT, "output", "monthly-review-deck.html")); await pg.wait_for_timeout(400)
            r = await pg.evaluate("""()=>{const f=document.getElementById('frame').getBoundingClientRect();let over=0;
              document.querySelectorAll('.slide').forEach(s=>{if(s.scrollHeight>s.clientHeight+2||s.scrollWidth>s.clientWidth+2)over++});
              return [(f.width/f.height).toFixed(3), f.right<=innerWidth+1&&f.bottom<=innerHeight+1&&f.left>=-1&&f.top>=-1, document.documentElement.scrollWidth>innerWidth, over]}""")
            ok = r[0] == "1.778" and r[1] and not r[2] and r[3] == 0 and not errs
            print(f"{'PASS' if ok else 'FAIL'}  {name:22} ratio {r[0]} fits {r[1]} sideScroll {r[2]} overflowingSlides {r[3]} errors {len(errs)}")
            await pg.close()
        await b.close()
asyncio.run(run())
