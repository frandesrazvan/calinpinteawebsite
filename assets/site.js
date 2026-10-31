/* Comportament comun pentru cele 4 designuri noi: meniu mobil, galerie foto, filtre evenimente, formulare demo. */
(function () {
  'use strict';

  /* ---------- Meniu mobil ---------- */
  var menuBtn = document.querySelector('.s-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = document.body.classList.toggle('s-nav-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.s-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('s-nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Antet fix: umbră după ce pagina începe să se deruleze ---------- */
  var hdr = document.querySelector('.s-header');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mesaje scurte (linkuri încă necompletate) ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 's-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3600);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-todo]');
    if (a) { e.preventDefault(); toast(a.getAttribute('data-todo')); }
  });

  /* ---------- Formulare (demonstrație: nu trimit nimic) ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value) return;
      var ok = form.querySelector('.s-form-ok');
      if (!ok) {
        ok = document.createElement('p');
        ok.className = 's-form-ok';
        ok.setAttribute('role', 'status');
        form.appendChild(ok);
      }
      ok.textContent = form.getAttribute('data-ok') || 'Mesajul a fost trimis. Vă mulțumim!';
      form.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea').forEach(function (f) { f.value = ''; });
    });
  });

  /* ---------- Filtre pe pagina de evenimente ---------- */
  var tabs = document.querySelectorAll('[data-filter]');
  function applyFilter(which) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-filter') === which;
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-ev-section]').forEach(function (s) {
      s.hidden = !(which === 'toate' || s.getAttribute('data-ev-section') === which);
    });
  }
  if (tabs.length) {
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var w = t.getAttribute('data-filter');
        applyFilter(w);
        if (history.replaceState) history.replaceState(null, '', w === 'toate' ? location.pathname : '#' + w);
      });
    });
    var h = (location.hash || '').replace('#', '');
    applyFilter(h === 'lansari' || h === 'simpozioane' ? h : 'toate');
    window.addEventListener('hashchange', function () {
      var hh = (location.hash || '').replace('#', '');
      if (hh === 'lansari' || hh === 'simpozioane') applyFilter(hh);
    });
  }

  /* ---------- Galerie foto (lightbox) ---------- */
  var lb, lbImg, lbCap, lbCount, items = [], idx = 0, lastFocus;
  function ensureLb() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 's-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galerie foto');
    lb.innerHTML =
      '<button type="button" class="s-lb-close" aria-label="Închide galeria">&times;</button>' +
      '<button type="button" class="s-lb-prev" aria-label="Fotografia anterioară">&#8249;</button>' +
      '<figure class="s-lb-fig"><img alt=""><figcaption><span class="s-lb-cap"></span><span class="s-lb-count"></span></figcaption></figure>' +
      '<button type="button" class="s-lb-next" aria-label="Fotografia următoare">&#8250;</button>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbCap = lb.querySelector('.s-lb-cap');
    lbCount = lb.querySelector('.s-lb-count');
    lb.querySelector('.s-lb-close').addEventListener('click', close);
    lb.querySelector('.s-lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.s-lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }
  function show(i) {
    if (!items.length) return;
    idx = (i + items.length) % items.length;
    var it = items[idx];
    lbImg.src = it.src;
    lbImg.alt = it.alt || '';
    lbCap.textContent = it.cap || '';
    lbCount.textContent = items.length > 1 ? (idx + 1) + ' / ' + items.length : '';
    lb.classList.toggle('is-single', items.length < 2);
  }
  function open(list, start) {
    ensureLb();
    items = list;
    lastFocus = document.activeElement;
    show(start || 0);
    lb.classList.add('is-on');
    document.documentElement.classList.add('s-lb-lock');
    lb.querySelector('.s-lb-close').focus();
  }
  function close() {
    lb.classList.remove('is-on');
    document.documentElement.classList.remove('s-lb-lock');
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (!lb || !lb.classList.contains('is-on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  document.addEventListener('click', function (e) {
    var trg = e.target.closest('[data-gallery-open]');
    if (!trg) return;
    e.preventDefault();
    var data = trg.getAttribute('data-gallery-open');
    var list;
    try { list = JSON.parse(data); } catch (err) { list = []; }
    if (list.length) open(list, 0);
  });
})();
