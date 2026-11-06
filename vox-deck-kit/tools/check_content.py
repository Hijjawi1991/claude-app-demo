"""Strict content check: the restyled deck must say exactly what the approved deck says.
Usage: python tools/check_content.py
Compares, slide by slide (by aria-label order), the visible words and the number of click reveals (data-step)
between reference/approved-deck.html and output/monthly-review-deck.html.
Allowed differences are listed in ALLOWED below (only purely decorative labels Ahmad approved)."""
import html, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALLOWED_EXTRA_WORDS = {"vs", "VS"}   # decorative words you may add; add more ONLY if Ahmad approves
def slides(path):
    s = open(path, encoding="utf-8").read()
    s = re.sub(r'data:[^"\')]+', '', s)
    s = re.sub(r'<(script|style)[\s\S]*?</\1>', '', s)
    out = []
    for m in re.finditer(r'<section class="[^"]*slide[^"]*"[^>]*>([\s\S]*?)</section>', s):
        body = m.group(1)
        steps = len(set(re.findall(r'data-step="(\d+)"', body)))
        body = re.sub(r'<svg[\s\S]*?</svg>', ' ', body)          # drawings are allowed to change
        text = html.unescape(re.sub(r'<[^>]+>', ' ', body))
        words = [w for w in re.findall(r"[\w’'%$¥+.,:/&#-]+", text) if w.strip(".,:")]
        out.append((steps, words))
    return out
ref = slides(os.path.join(ROOT, "reference", "approved-deck.html"))
new = slides(os.path.join(ROOT, "output", "monthly-review-deck.html"))
bad = 0
if len(ref) != len(new):
    print(f"FAIL slide count: approved {len(ref)}, new {len(new)}"); sys.exit(1)
norm = lambda w: w.strip(".,:").lower()
for i, ((rs, rw), (ns, nw)) in enumerate(zip(ref, new), 1):
    from collections import Counter
    rc, nc = Counter(map(norm, rw)), Counter(map(norm, nw))
    missing = rc - nc; extra = Counter({k: v for k, v in (nc - rc).items() if k not in {norm(x) for x in ALLOWED_EXTRA_WORDS}})
    problems = []
    if rs != ns: problems.append(f"clicks {rs} -> {ns}")
    if missing: problems.append("missing words: " + ", ".join(list(missing)[:12]))
    if extra: problems.append("added words: " + ", ".join(list(extra)[:12]))
    if problems:
        bad += 1; print(f"FAIL slide {i}: " + " | ".join(problems))
print(f"{len(ref)} slides compared, {bad} with differences")
sys.exit(1 if bad else 0)
