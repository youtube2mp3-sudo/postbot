(function () {
  var overlay = document.getElementById('page-transition-overlay');
  if (!overlay) return;

  function fadeIn(cb) {
    overlay.style.transition = 'none';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'opacity 0.22s ease';
        if (cb) setTimeout(cb, 220);
      });
    });
  }

  function fadeOut() {
    overlay.style.transition = 'opacity 0.32s ease';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }

  window.addEventListener('DOMContentLoaded', function () {
    fadeOut();
  });

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a');
    if (!anchor) return;
    var href = anchor.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('javascript') || href === '') return;
    if (anchor.getAttribute('target') === '_blank') return;
    var isSameSite = (
      href.startsWith('./') ||
      href.startsWith('/') ||
      (!href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel'))
    );
    if (!isSameSite) return;

    e.preventDefault();
    overlay.style.transition = 'none';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'opacity 0.22s ease';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
        setTimeout(function () {
          window.location.href = href;
        }, 220);
      });
    });
  });
})();
