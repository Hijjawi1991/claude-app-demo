/* Edit mode: click any text on the slides to change it.
   Changes are kept in this browser automatically; "Save copy" downloads a new .html file with the edits built in. */
(function () {
  var frame = document.getElementById('frame');
  var btn = document.getElementById('edit'), saveBtn = document.getElementById('savecopy'), resetBtn = document.getElementById('resetedits');
  if (!frame || !btn) return;
  var KEY = 'deckEdits:' + location.pathname;
  var toast = window.deckToast || function () {};

  // every element that directly holds text (outside drawings) becomes editable
  var list = [];
  (function walk(el) {
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) {
      if (/^(SCRIPT|STYLE|IMG|CANVAS|svg)$/i.test(c.tagName)) continue;
      var direct = Array.prototype.some.call(c.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      if (direct) { list.push(c); continue; }
      walk(c);
    }
  })(frame);
  var orig = list.map(function (el) { return el.innerHTML; });

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || '{}');
      Object.keys(d).forEach(function (k) { if (list[+k]) list[+k].innerHTML = d[k]; });
    } catch (e) {}
  }
  function store() {
    try {
      var d = {};
      list.forEach(function (el, i) { if (el.innerHTML !== orig[i]) d[i] = el.innerHTML; });
      localStorage.setItem(KEY, JSON.stringify(d));
      return true;
    } catch (e) { return false; }
  }
  load();

  function setEditing(on) {
    document.body.classList.toggle('editing', on);
    document.body.classList.remove('idle');
    list.forEach(function (el) { if (on) el.setAttribute('contenteditable', 'true'); else el.removeAttribute('contenteditable'); });
    btn.textContent = on ? 'Done' : 'Edit';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    saveBtn.hidden = !on; resetBtn.hidden = !on;
    var api = window.deckAPI;
    if (on && api) { var s = api.slides[api.current()]; api.setStep(s, api.maxStep(s)); }
    if (on) toast('Edit mode: click any text to change it. Use the dots to move between slides. Press Esc or Done to finish.');
    else toast(store() ? 'Changes saved in this browser. Use "Save copy" for a file with your edits.' : 'Could not save in this browser. Use "Save copy" before closing.');
    if (on && document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  var timer = null;
  frame.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(store, 400); });
  frame.addEventListener('paste', function (e) {
    if (!document.body.classList.contains('editing')) return;
    e.preventDefault();
    var t = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, t);
  });
  frame.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('editing')) return;
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.blur && e.target.blur(); }
    else if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); document.execCommand('insertLineBreak'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('editing')) { e.preventDefault(); setEditing(false); }
  });

  btn.addEventListener('click', function (e) { e.stopPropagation(); setEditing(!document.body.classList.contains('editing')); });

  saveBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    store();
    var clone = document.documentElement.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll('[contenteditable]'), function (el) { el.removeAttribute('contenteditable'); });
    var body = clone.querySelector('body'); body.className = document.body.classList.contains('light') ? 'light' : '';
    Array.prototype.forEach.call(clone.querySelectorAll('.slide'), function (s, i) {
      s.classList.remove('active', 'leaving', 'back');
      if (i === 0) { s.classList.add('active'); s.removeAttribute('hidden'); } else s.setAttribute('hidden', '');
    });
    Array.prototype.forEach.call(clone.querySelectorAll('.shown'), function (el) { el.classList.remove('shown'); });
    var dots = clone.querySelector('#dots'); if (dots) dots.innerHTML = '';
    var f = clone.querySelector('#frame'); if (f) f.removeAttribute('style');
    ['savecopy', 'resetedits'].forEach(function (id) { var el = clone.querySelector('#' + id); if (el) el.setAttribute('hidden', ''); });
    var eb = clone.querySelector('#edit'); if (eb) { eb.textContent = 'Edit'; eb.setAttribute('aria-pressed', 'false'); }
    var t = clone.querySelector('#toast'); if (t) { t.textContent = ''; t.className = 'toast'; }
    var html = '<!doctype html>\n' + clone.outerHTML;
    var name = (decodeURIComponent(location.pathname.split('/').pop() || 'deck.html')).replace(/\.html?$/i, '') + '-edited.html';
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      a.download = name; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      toast('Saved "' + name + '" to your Downloads folder.');
    } catch (err) { toast('Download is blocked here. Open the file in Chrome or Edge and try again.'); }
  });

  var armed = false, armTimer = null;
  resetBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!armed) { armed = true; resetBtn.textContent = 'Click again to reset'; toast('Reset removes all your text edits on this deck.'); armTimer = setTimeout(function () { armed = false; resetBtn.textContent = 'Reset'; }, 3500); return; }
    clearTimeout(armTimer); armed = false; resetBtn.textContent = 'Reset';
    list.forEach(function (el, i) { el.innerHTML = orig[i]; });
    try { localStorage.removeItem(KEY); } catch (err) {}
    toast('All edits removed. The original text is back.');
  });
})();
