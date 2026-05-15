(function () {
  var overlay = document.getElementById('page-transition-overlay');
  if (!overlay) return;

  // Immediately make the page interactive regardless of load timing
  overlay.style.pointerEvents = 'none';

  // Fade the overlay out as soon as rendering is ready
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.transition = 'opacity 0.32s ease';
      overlay.style.opacity = '0';
    });
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
    overlay.style.transition = 'opacity 0.22s ease';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(function () {
      window.location.href = href;
    }, 220);
  });
})();
