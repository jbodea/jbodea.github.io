// scripts/animations.js — Scroll-triggered entrance animations
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  });
})();

// Hover-driven autoscroll for card images wider than their container.
(function () {
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function setupAutoScroll(container) {
    var raf = null;
    var startTime = 0;
    var startScroll = 0;
    var targetScroll = 0;
    var duration = 0;

    function step(now) {
      if (!startTime) startTime = now;
      var t = Math.min((now - startTime) / duration, 1);
      container.scrollLeft = startScroll + (targetScroll - startScroll) * smoothstep(t);
      if (t < 1) raf = requestAnimationFrame(step);
    }

    function animateTo(target) {
      var maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      cancelAnimationFrame(raf);
      startTime = 0;
      startScroll = container.scrollLeft;
      targetScroll = Math.max(0, Math.min(target, maxScroll));
      var dist = Math.abs(targetScroll - startScroll);
      duration = Math.max(900, Math.min(dist * 16, 7000));
      raf = requestAnimationFrame(step);
    }

    container.addEventListener('mouseenter', function () {
      animateTo(container.scrollWidth - container.clientWidth);
    });
    container.addEventListener('mouseleave', function () {
      animateTo(0);
    });
  }

  function init() {
    document.querySelectorAll('.paper-tile-image').forEach(setupAutoScroll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

function toggleBibtex(id) {
  var el = document.getElementById('bibtex-' + id);
  if (el) el.classList.toggle('is-open');
}

function copyBibtex(id) {
  var pre = document.getElementById('bibtex-text-' + id);
  var btn = document.querySelector('#bibtex-' + id + ' .tile-copy-btn');
  if (!pre || !btn) return;
  var text = pre.textContent;
  var done = function () {
    var prev = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = prev; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, function () {});
  } else {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
}
