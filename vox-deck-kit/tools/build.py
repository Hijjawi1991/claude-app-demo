"""Build the single-file deck:  python tools/build.py   ->  output/monthly-review-deck.html
Placeholders in src/deck-src.html are replaced by embedded files:
  __PHOTO__ __SHADOW__ __LOGO__ __LOGOW__ __TPLBG__      fixed assets
  __V1__ __R03__ ...                                     assets/photos/<name>.webp
  __V1CUT__ ...                                          assets/cutouts/<name>.webp
  __PAPER__                                              assets/texture/paper.jpg
  __FONT_OSWALD_700__ __FONT_OSWALD_500__ __FONT_TYPE_400__ __FONT_TYPE_700__ __FONT_HAND__   fonts
  __EDIT__                                               src/edit.js
Fails (exit 1) if an em/en dash or unreplaced placeholder remains."""
import base64, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "assets")
MIME = {"webp": "image/webp", "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "svg": "image/svg+xml", "woff2": "font/woff2"}
def uri(path):
    ext = path.rsplit(".", 1)[1].lower()
    return f"data:{MIME[ext]};base64," + base64.b64encode(open(path, "rb").read()).decode()
s = open(os.path.join(ROOT, "src", "deck-src.html"), encoding="utf-8").read()
fixed = {"__PHOTO__": "person.webp", "__SHADOW__": "shadow.webp", "__LOGO__": "logo-red.png", "__LOGOW__": "logo-white.png", "__TPLBG__": "tplbg.jpg",
         "__PAPER__": "texture/paper.jpg",
         "__FONT_OSWALD_700__": "fonts/oswald-latin-700-normal.woff2", "__FONT_OSWALD_500__": "fonts/oswald-latin-500-normal.woff2",
         "__FONT_TYPE_400__": "fonts/courier-prime-latin-400-normal.woff2", "__FONT_TYPE_700__": "fonts/courier-prime-latin-700-normal.woff2",
         "__FONT_HAND__": "fonts/permanent-marker-latin-400-normal.woff2"}
for k, f in fixed.items():
    if k in s: s = s.replace(k, uri(os.path.join(A, f)))
for folder in ("photos", "cutouts"):
    d = os.path.join(A, folder)
    for f in sorted(os.listdir(d)):
        if f.rsplit(".", 1)[-1].lower() in MIME:
            s = s.replace("__" + f.rsplit(".", 1)[0].upper().replace("-", "_") + "__", uri(os.path.join(d, f)))
s = s.replace("__EDIT__", open(os.path.join(ROOT, "src", "edit.js"), encoding="utf-8").read())
left = sorted(set(re.findall(r"__[A-Z0-9_]+__", s)) - {"__proto__"})
out = os.path.join(ROOT, "output", "monthly-review-deck.html")
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w", encoding="utf-8").write(s)
dashes = s.count("—") + s.count("–")
print(f"built {out}  {len(s)/1e6:.2f} MB | em/en dashes: {dashes} | unreplaced placeholders: {left or 'none'}")
sys.exit(1 if dashes or left else 0)
