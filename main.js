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
  mobileDrawer.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeDrawer);
  });
  document.addEventListener('click', function(e) {
    if (isOpen && !mobileDrawer.contains(e.target) && !hamburger.contains(e.target)) closeDrawer();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) closeDrawer();
  });
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

// ── Status metrics ────────────────────────────────────────
function loadStatus() {
  var latEl   = document.getElementById('s-latency');
  var latUnit = document.getElementById('s-latency-unit');
  var memEl   = document.getElementById('s-memory');
  var memUnit = document.getElementById('s-memory-unit');
  var netEl   = document.getElementById('s-network');
  var netUnit = document.getElementById('s-network-unit');

  var t0 = performance.now();
  fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
    .then(function() {
      var rtt = Math.round(performance.now() - t0);
      if (latEl) { latEl.textContent = rtt; latEl.classList.remove('na'); }
      if (latUnit) latUnit.textContent = 'ms round-trip';
    })
    .catch(function() {
      if (latEl) latEl.classList.add('na');
      if (latUnit) latUnit.textContent = 'unavailable';
    });

  try {
    var mem = performance.memory;
    if (mem && memEl) {
      memEl.textContent = (mem.usedJSHeapSize / 1048576).toFixed(1);
      memEl.classList.remove('na');
      if (memUnit) memUnit.textContent = 'MB JS heap';
    }
  } catch (e) {}

  try {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && netEl) {
      if (conn.downlink) {
        netEl.textContent = conn.downlink.toFixed(1);
        netEl.classList.remove('na');
        if (netUnit) netUnit.textContent = 'Mbps downlink';
      } else if (conn.effectiveType) {
        netEl.textContent = conn.effectiveType;
        netEl.classList.remove('na');
        if (netUnit) netUnit.textContent = 'connection';
      }
    }
  } catch (e) {}
}
var statusSection = document.getElementById('status');
if (statusSection) {
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) loadStatus();
  }, { threshold: 0.1 }).observe(statusSection);
}

// ── Cookie banner ─────────────────────────────────────────
(function() {
  var banner  = document.getElementById('cookieBanner');
  var accept  = document.getElementById('cookieAccept');
  var decline = document.getElementById('cookieDecline');
  if (!banner) return;
  try { if (localStorage.getItem('cookie-consent')) return; } catch(e) {}
  setTimeout(function() { banner.classList.add('cb-visible'); }, 1400);
  function dismiss(val) {
    try { localStorage.setItem('cookie-consent', val); } catch(e) {}
    banner.classList.add('cb-hiding');
    banner.classList.remove('cb-visible');
    setTimeout(function() { banner.style.display = 'none'; }, 500);
  }
  if (accept)  accept.addEventListener('click',  function() { dismiss('accepted'); });
  if (decline) decline.addEventListener('click', function() { dismiss('declined'); });
})();

// ── Discord live preview animation ────────────────────────
(function() {
  var typing  = document.getElementById('dc-typing');
  var botText = document.getElementById('dc-bot-text');
  var u1Name  = document.getElementById('dc-u1-name');
  var u1Text  = document.getElementById('dc-u1-text');
  var u1Ts    = document.getElementById('dc-u1-ts');
  var u2Name  = document.getElementById('dc-u2-name');
  var u2Text  = document.getElementById('dc-u2-text');
  var u2Ts    = document.getElementById('dc-u2-ts');
  var botTs   = document.getElementById('dc-bot-ts');

  if (!typing || !botText) return;

  var scenarios = [
    {
      u1: { name: 'Alex',   ts: 'Today at 3:42 PM', text: 'hey can you beleive how awsome this update is?? i definately love it' },
      u2: { name: 'Jordan', ts: 'Today at 3:43 PM', text: 'ikr its so good lol' },
      botTs: 'Today at 3:43 PM',
      bot: 'Corrections for <strong>Alex</strong>: \u201cbelieve\u201d (not beleive), \u201cawesome\u201d (not awsome), \u201cdefinitely\u201d (not definately)'
    },
    {
      u1: { name: 'Tyler', ts: 'Today at 5:17 PM', text: 'i would of went there but the wether was to bad tbh' },
      u2: { name: 'Sam',   ts: 'Today at 5:18 PM', text: 'that sucks, shouldve just stayed home' },
      botTs: 'Today at 5:18 PM',
      bot: 'Corrections for <strong>Tyler</strong>: \u201cwould have\u201d (not would of), \u201cgone\u201d (not went), \u201cweather\u201d (not wether), \u201ctoo\u201d (not to)'
    },
    {
      u1: { name: 'Maya', ts: 'Today at 8:02 PM', text: 'there going to there house, its so wierd how their always late' },
      u2: { name: 'Jake', ts: 'Today at 8:03 PM', text: 'lmao classic them honestly' },
      botTs: 'Today at 8:03 PM',
      bot: 'Corrections for <strong>Maya</strong>: \u201cthey\u2019re\u201d (not there), \u201ctheir\u201d (not there), \u201cweird\u201d (not wierd), \u201cthey\u2019re\u201d (not their)'
    }
  ];

  var scIdx = 0;
  var msg1El = document.querySelector('#dc-msgs .dc-msg:nth-child(1)');
  var msg2El = document.querySelector('#dc-msgs .dc-msg:nth-child(2)');
  var msg3El = document.querySelector('#dc-msgs .dc-msg:nth-child(3)');

  function animateIn(el, delay) {
    el.classList.remove('dc-msg-hidden', 'dc-msg-anim');
    setTimeout(function() {
      el.classList.add('dc-msg-anim');
    }, delay || 0);
  }

  function hideAll() {
    [msg1El, msg2El, msg3El].forEach(function(el) {
      if (el) { el.classList.add('dc-msg-hidden'); el.classList.remove('dc-msg-anim'); }
    });
    botText.innerHTML = '';
    botText.style.display = 'none';
    typing.style.display  = 'none';
  }

  function cycle() {
    var sc = scenarios[scIdx % scenarios.length];
    scIdx++;

    hideAll();

    // Update content for this scenario
    if (u1Name) u1Name.textContent = sc.u1.name;
    if (u1Text) u1Text.textContent = sc.u1.text;
    if (u1Ts)   u1Ts.textContent   = sc.u1.ts;
    if (u2Name) u2Name.textContent = sc.u2.name;
    if (u2Text) u2Text.textContent = sc.u2.text;
    if (u2Ts)   u2Ts.textContent   = sc.u2.ts;
    if (botTs)  botTs.textContent  = sc.botTs;

    // Animate user 1 message in
    setTimeout(function() {
      animateIn(msg1El, 0);
    }, 300);

    // Animate user 2 message in
    setTimeout(function() {
      animateIn(msg2El, 0);
    }, 1400);

    // Show bot typing indicator
    setTimeout(function() {
      if (msg3El) { msg3El.classList.remove('dc-msg-hidden'); msg3El.classList.remove('dc-msg-anim'); }
      typing.style.display = 'flex';
      botText.style.display = 'none';
      botText.innerHTML = '';
    }, 2400);

    // Show bot correction
    setTimeout(function() {
      typing.style.display = 'none';
      botText.innerHTML = sc.bot;
      botText.style.display = 'block';
      animateIn(msg3El, 0);
    }, 4600);

    // Loop
    setTimeout(cycle, 9000);
  }

  setTimeout(cycle, 800);
})();
