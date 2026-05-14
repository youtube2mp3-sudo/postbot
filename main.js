// ── Header scroll ─────────────────────────────────────────
var header = document.getElementById('header');
window.addEventListener('scroll', function() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Dropdown: full-width fold-down ────────────────────────
var navDropdown = document.getElementById('navDropdown');
var dropdownBtn = document.getElementById('dropdownBtn');
if (navDropdown && dropdownBtn) {
  dropdownBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var open = navDropdown.classList.toggle('open');
    dropdownBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', function(e) {
    if (!navDropdown.contains(e.target)) {
      navDropdown.classList.remove('open');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      navDropdown.classList.remove('open');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Hamburger / Mobile drawer ─────────────────────────────
var hamburger    = document.getElementById('hamburger');
var mobileDrawer = document.getElementById('mobileDrawer');
var isOpen       = false;

function openDrawer() {
  isOpen = true;
  hamburger.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileDrawer.classList.add('is-open');
  mobileDrawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  isOpen = false;
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileDrawer.classList.remove('is-open');
  mobileDrawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (hamburger && mobileDrawer) {
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    isOpen ? closeDrawer() : openDrawer();
  });
  mobileDrawer.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeDrawer); });
  document.addEventListener('click', function(e) {
    if (isOpen && !mobileDrawer.contains(e.target) && !hamburger.contains(e.target)) closeDrawer();
  });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && isOpen) closeDrawer(); });
}

// ── Mobile Resources sub-menu ─────────────────────────────
var drawerResBtn = document.getElementById('drawerResBtn');
var drawerResSub = document.getElementById('drawerResSub');
if (drawerResBtn && drawerResSub) {
  drawerResBtn.addEventListener('click', function() {
    var subOpen = drawerResSub.classList.toggle('open');
    drawerResBtn.classList.toggle('sub-open', subOpen);
    drawerResBtn.setAttribute('aria-expanded', String(subOpen));
  });
}

// ── Reveal animations ─────────────────────────────────────
document.body.classList.add('js-ready');
var revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var ro = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  revealEls.forEach(function(el) { ro.observe(el); });
}
setTimeout(function() {
  revealEls.forEach(function(el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 30) el.classList.add('visible');
  });
}, 60);
window.addEventListener('scroll', function() {
  revealEls.forEach(function(el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 30) el.classList.add('visible');
  });
}, { passive: true });

// ── Count-up ──────────────────────────────────────────────
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function countUp(el, target, duration) {
  var start = performance.now();
  (function tick(now) {
    var p = Math.min((now - start) / duration, 1);
    var v = Math.round(easeOut(p) * target);
    el.textContent = v >= 1000 ? v.toLocaleString('en-US') : String(v);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
var statsEl = document.getElementById('stats');
var srvEl   = document.getElementById('stat-servers');
var corrEl  = document.getElementById('stat-corrections');
var statsDone = false;
if (statsEl) {
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !statsDone) {
      statsDone = true;
      if (srvEl)  countUp(srvEl,  0,    1800);
      if (corrEl) countUp(corrEl, 0, 2200);
    }
  }, { threshold: 0.3 }).observe(statsEl);
}

// ── Status metrics (real browser-measured values only) ────
function loadStatus() {
  var latEl    = document.getElementById('s-latency');
  var latUnit  = document.getElementById('s-latency-unit');
  var memEl    = document.getElementById('s-memory');
  var memUnit  = document.getElementById('s-memory-unit');
  var netEl    = document.getElementById('s-network');
  var netUnit  = document.getElementById('s-network-unit');

  var t0 = performance.now();
  fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
    .then(function() {
      var rtt = Math.round(performance.now() - t0);
      if (latEl) { latEl.textContent = rtt; latEl.classList.remove('na'); }
      if (latUnit) latUnit.textContent = 'ms round-trip';
    })
    .catch(function() {
