/*
  Comutator de design — calinpintea.ro (variante de prezentare)
  Fiecare pagină declară pe <html>:
    data-design = original | candela | glas | clasic | modern
    data-page   = home | interviuri | interviu:<slug> | lansari | simpozioane | evenimente | contact
    data-root   = calea relativă până la rădăcina site-ului ("" sau "../" sau "../../")
  Butonul duce la pagina echivalentă din designul ales.
*/
(function () {
  var DESIGNS = [
    { id: 'original', name: 'Site-ul actual', note: 'calinpintea.ro, așa cum arată azi', sw: ['#eef1ec', '#ffffff', '#2f806f'] },
    { id: 'candela', name: 'A · Candelă', note: 'întunecat, auriu, spiritual', sw: ['#121318', '#C9A75E', '#EDE6D6'] },
    { id: 'glas', name: 'B · Glas', note: 'vocea autorului, tipografic', sw: ['#F7F7F4', '#1E2B45', '#A8241A'] },
    { id: 'clasic', name: 'C · Clasic', note: 'site de autor clasic, verde', sw: ['#FFFFFF', '#1F4A36', '#EEF3EF'] },
    { id: 'modern', name: 'D · Modern', note: 'site de autor modern, vișiniu', sw: ['#FFFFFF', '#6B1F2E', '#F7F1F1'] }
  ];

  var html = document.documentElement;
  var current = html.getAttribute('data-design') || 'original';
  var root = html.getAttribute('data-root') || '';

  function pageKey() {
    var p = html.getAttribute('data-page') || 'home';
    if (p === 'evenimente') {
      if (location.hash === '#simpozioane') return 'simpozioane';
      if (location.hash === '#lansari') return 'lansari';
    }
    return p;
  }

  function pathFor(design, p) {
    var pre = design === 'original' ? '' : design + '/';
    var m = p.match(/^interviu:(.+)$/);
    if (p === 'home') return pre + 'index.html';
    if (p === 'interviuri') return pre + 'interviuri.html';
    if (m) return pre + 'interviuri/' + m[1] + '.html';
    if (p === 'contact') return pre + 'contact.html';
    if (design === 'original') {
      if (p === 'simpozioane') return 'Simpozioane.html';
      if (p === 'lansari' || p === 'evenimente') return 'carte.html';
    } else {
      if (p === 'lansari') return pre + 'evenimente.html#lansari';
      if (p === 'simpozioane') return pre + 'evenimente.html#simpozioane';
      if (p === 'evenimente') return pre + 'evenimente.html';
    }
    return pre + 'index.html';
  }

  function build() {
    var host = document.createElement('div');
    host.setAttribute('data-design-switcher', '');
    host.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:2147483000;';
    var shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    var cur = DESIGNS.filter(function (d) { return d.id === current; })[0] || DESIGNS[0];

    var css = [
      ':host{all:initial}',
      '*{box-sizing:border-box}',
      '.wrap{font:500 14px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#17171a}',
      '.pill{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 16px 0 12px;border:0;border-radius:999px;background:#17171a;color:#fff;font:inherit;font-weight:600;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.12) inset}',
      '.pill:hover{background:#2a2a30}',
      '.pill:focus-visible,.item:focus-visible{outline:3px solid #7aa7ff;outline-offset:2px}',
      '.dots{display:inline-flex}',
      '.dots i{width:12px;height:12px;border-radius:50%;margin-left:-4px;box-shadow:0 0 0 1.5px #17171a}',
      '.dots i:first-child{margin-left:0}',
      '.lbl{opacity:.7;font-weight:500}',
      '.chev{width:10px;height:10px;transition:transform .15s}',
      '.open .chev{transform:rotate(180deg)}',
      '.panel{position:absolute;left:0;bottom:56px;width:300px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 22px 50px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.06);padding:8px;display:none}',
      '.open .panel{display:block}',
      '.head{padding:10px 12px 8px;font-size:12px;color:#5d5d66}',
      '.item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#17171a;text-decoration:none}',
      '.item:hover{background:#f2f2f4}',
      '.item[aria-current="page"]{background:#eef0f7}',
      '.sw{display:grid;grid-template-columns:repeat(3,10px);gap:2px;padding:4px;border-radius:8px;background:#f2f2f4;flex:0 0 auto}',
      '.sw i{width:10px;height:22px;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.08) inset}',
      '.txt{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.nm{font-weight:650}',
      '.nt{font-size:12.5px;color:#5d5d66}',
      '.ck{margin-left:auto;width:16px;height:16px;flex:0 0 auto}',
      '@media print{.wrap{display:none}}'
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = css;
    shadow.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'wrap';

    var panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = 'ds-panel';
    panel.setAttribute('role', 'menu');
    var head = document.createElement('div');
    head.className = 'head';
    head.textContent = 'Machetă de lucru · alege designul (aceeași pagină)';
    panel.appendChild(head);

    var key = pageKey();
    DESIGNS.forEach(function (d) {
      var a = document.createElement('a');
      a.className = 'item';
      a.setAttribute('role', 'menuitem');
      a.href = root + pathFor(d.id, key);
      if (d.id === current) a.setAttribute('aria-current', 'page');
      var sw = '<span class="sw" aria-hidden="true">' + d.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>';
      var ck = d.id === current ? '<svg class="ck" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="#2f6bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '';
      a.innerHTML = sw + '<span class="txt"><span class="nm">' + d.name + '</span><span class="nt">' + d.note + '</span></span>' + ck;
      panel.appendChild(a);
    });

    var btn = document.createElement('button');
    btn.className = 'pill';
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'ds-panel');
    btn.innerHTML = '<span class="dots" aria-hidden="true">' + cur.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>' +
      '<span><span class="lbl">Design: </span>' + cur.name + '</span>' +
      '<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 6.5L5 3l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

    function setOpen(v) {
      wrap.classList.toggle('open', v);
      btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !wrap.classList.contains('open');
      setOpen(willOpen);
      if (willOpen) {
        var c = panel.querySelector('[aria-current]') || panel.querySelector('a');
        if (c) c.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!host.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrap.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    window.addEventListener('hashchange', function () {
      var k = pageKey();
      var links = panel.querySelectorAll('a');
      DESIGNS.forEach(function (d, i) { links[i].href = root + pathFor(d.id, k); });
    });

    wrap.appendChild(panel);
    wrap.appendChild(btn);
    shadow.appendChild(wrap);
    document.body.appendChild(host);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
