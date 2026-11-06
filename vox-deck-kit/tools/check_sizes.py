"""Size check: no word may get smaller than in the approved deck, and content should fill the slide.
Usage:  python tools/check_sizes.py            (all slides)
        python tools/check_sizes.py 4,12,38    (some slides)
For every slide (fully revealed) it reads each visible word's rendered font size (including any scale
transform) in reference/approved-deck.html and in output/monthly-review-deck.html, matches the words
in order, and reports:
  smaller : words rendered smaller than in the approved deck (tolerance 0.5px)
  hidden  : words present in the approved deck but invisible in the new one
  min     : smallest text size on the new slide (px at 1920x1080)
  fill    : height of the area covered by text, images, drawings and cards, as % of the slide height
SVG text is ignored (drawings may be redrawn). Exit code 1 if any slide has smaller or hidden words."""
import asyncio, os, sys
from collections import defaultdict
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
want = [int(x) for x in sys.argv[1].split(",")] if len(sys.argv) > 1 else list(range(1, 55))
JS = """() => {
  const slide = document.querySelector('.slide.active'), sr = slide.getBoundingClientRect(), k = sr.width / 1920;
  const words = [], boxes = [];
  const walk = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    const el = n.parentElement; if (!el || el.closest('svg')) continue;
    const t = n.textContent.replace(/\\s+/g, ' ').trim(); if (!t) continue;
    const cs = getComputedStyle(el);
    const r = document.createRange(); r.selectNodeContents(n); const rr = r.getBoundingClientRect();
    let vis = rr.width > 0 && rr.height > 0 && cs.visibility !== 'hidden';
    for (let e = el; e && e !== slide.parentElement; e = e.parentElement) { if (+getComputedStyle(e).opacity < 0.05) { vis = false; break; } }
    const scale = el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1;
    const size = parseFloat(cs.fontSize) * (isFinite(scale) && scale > 0 ? scale : 1) ;
    for (const w of t.split(' ')) words.push([w, vis ? size : 0]);
    if (vis) boxes.push([rr.top, rr.bottom]);
  }
  // images, drawings and paper cards count as content too
  slide.querySelectorAll('img, svg, *').forEach(i => { const b = i.getBoundingClientRect(), cs = getComputedStyle(i);
    if (b.width < 40 || b.height < 40 || +cs.opacity < 0.05 || cs.visibility === 'hidden') return;
    const bg = cs.backgroundColor.match(/[\\d.]+/g), solid = bg && (bg.length < 4 || +bg[3] > 0.5);
    if (i.tagName === 'IMG' || i.tagName === 'svg' || (solid && b.width * b.height > 40000 && b.height < sr.height * .98)) boxes.push([b.top, b.bottom]); });
  const top = Math.max(sr.top, Math.min(...boxes.map(b => b[0]))), bot = Math.min(sr.bottom, Math.max(...boxes.map(b => b[1])));
  return { words, fill: boxes.length ? (bot - top) / sr.height : 0, k };
}"""
async def collect(b, path):
    pg = await b.new_page(viewport={"width": 1920, "height": 1080})
    await pg.goto("file://" + path); await pg.wait_for_timeout(400)
    await pg.add_style_tag(content="*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}")
    res = {}
    for n in want:
        await pg.evaluate("""n => { const a = window.deckAPI; while (a.current() > n - 1) a.backward();
          while (a.current() < n - 1) { const s = a.slides[a.current()]; a.setStep(s, a.maxStep(s)); a.forward(); }
          const s = a.slides[n - 1]; a.setStep(s, a.maxStep(s)); }""", n)
        await pg.wait_for_timeout(250)
        r = await pg.evaluate(JS)
        r["words"] = [[w, s / r["k"]] for w, s in r["words"]]   # px at 1920x1080
        res[n] = r
    await pg.close(); return res
async def run():
    async with async_playwright() as p:
        exe = os.environ.get("CHROMIUM_PATH")
        b = await (p.chromium.launch(executable_path=exe) if exe else p.chromium.launch())
        old = await collect(b, os.path.join(ROOT, "reference", "approved-deck.html"))
        new = await collect(b, os.path.join(ROOT, "output", "monthly-review-deck.html"))
        await b.close()
    bad = 0
    print(f"{'slide':>5}  {'smaller':>7}  {'hidden':>6}  {'min px':>6}  {'fill':>5}  worst")
    for n in want:
        pool = defaultdict(list)
        for w, s in new[n]["words"]: pool[w].append(s)
        smaller, hidden, worst = 0, 0, ""
        for w, s in old[n]["words"]:
            if s <= 0: continue
            cand = pool.get(w)
            if not cand: continue                       # word moved into a drawing or differs: check_content.py covers words
            ns = cand.pop(0)
            if ns <= 0: hidden += 1; worst = worst or f"'{w}' hidden"
            elif ns < s - 0.5:
                smaller += 1
                if not worst or "hidden" not in worst: worst = f"'{w}' {s:.0f}px -> {ns:.0f}px"
        vis = [s for _, s in new[n]["words"] if s > 0]
        mn = min(vis) if vis else 0
        fill = new[n]["fill"] * 100
        bad += 1 if (smaller or hidden) else 0
        print(f"{n:>5}  {smaller:>7}  {hidden:>6}  {mn:>6.0f}  {fill:>4.0f}%  {worst}")
    print(f"{len(want)} slides checked, {bad} with smaller or hidden words")
    sys.exit(1 if bad else 0)
asyncio.run(run())
