"""Build the single-file deck:  python tools/build.py   ->  output/monthly-review-deck.html
Replaces the __PLACEHOLDER__ tokens in src/deck-src.html with embedded images and edit.js.
Exit code 1 if any em/en dash or unreplaced placeholder remains."""
import base64, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "assets")
MIME = {"webp": "image/webp", "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "svg": "image/svg+xml"}
def uri(path):
    ext = path.rsplit(".", 1)[1].lower()
    return f"data:{MIME[ext]};base64," + base64.b64encode(open(path, "rb").read()).decode()
s = open(os.path.join(ROOT, "src", "deck-src.html"), encoding="utf-8").read()
fixed = {"__PHOTO__": "person.webp", "__SHADOW__": "shadow.webp", "__LOGO__": "logo-red.png", "__LOGOW__": "logo-white.png", "__TPLBG__": "tplbg.jpg"}
for k, f in fixed.items(): s = s.replace(k, uri(os.path.join(A, f)))
# any other image: assets/photos/v1.webp -> __V1__ ; assets/grain.png -> __GRAIN__
for folder in (os.path.join(A, "photos"), A):
    for f in sorted(os.listdir(folder)):
        p = os.path.join(folder, f)
        if os.path.isfile(p) and f not in fixed.values() and f.rsplit(".", 1)[-1].lower() in MIME:
            s = s.replace("__" + f.rsplit(".", 1)[0].upper().replace("-", "_") + "__", uri(p))
s = s.replace("__EDIT__", open(os.path.join(ROOT, "src", "edit.js"), encoding="utf-8").read())
left = sorted(set(re.findall(r"__[A-Z0-9_]+__", s)) - {"__proto__"})
out = os.path.join(ROOT, "output", "monthly-review-deck.html")
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w", encoding="utf-8").write(s)
dashes = s.count("—") + s.count("–")
print(f"built {out}  {len(s)/1e6:.2f} MB | em/en dashes: {dashes} | unreplaced placeholders: {left or 'none'}")
sys.exit(1 if dashes or left else 0)
