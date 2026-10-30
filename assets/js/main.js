(function () {
  var root = document.documentElement;

  // Tema terang/gelap
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      var next = dark ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('tema', next); } catch (e) {}
    });
  }

  // Bilah progres membaca
  var bar = document.querySelector('.progress span');
  if (bar) {
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Saring kategori di halaman arsip
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    var apply = function (key) {
      chips.forEach(function (c) { c.classList.toggle('is-active', c.dataset.filter === key); });
      document.querySelectorAll('.year-group').forEach(function (group) {
        var shown = 0;
        group.querySelectorAll('.post-item').forEach(function (li) {
          var ok = key === 'semua' || li.dataset.cat === key;
          li.hidden = !ok;
          if (ok) shown++;
        });
        group.hidden = shown === 0;
      });
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        apply(c.dataset.filter);
        history.replaceState(null, '', c.dataset.filter === 'semua' ? location.pathname : '#' + c.dataset.filter);
      });
    });
    var hash = location.hash.slice(1);
    if (hash && document.querySelector('.chip[data-filter="' + hash + '"]')) apply(hash);
  }
})();
