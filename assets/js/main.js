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

  // Pengaturan huruf: jenis & ukuran, disimpan di perangkat pembaca
  var readerBtn = document.querySelector('.reader-toggle');
  var panel = document.getElementById('reader-panel');
  if (readerBtn && panel) {
    var sizes = [90, 100, 110, 120, 130];
    var fontBtns = panel.querySelectorAll('[data-font]');
    var out = panel.querySelector('.size-value');
    var down = panel.querySelector('[data-size="-1"]');
    var up = panel.querySelector('[data-size="1"]');
    var save = function (k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
    var currentSize = function () { return Math.round(parseFloat(getComputedStyle(root).getPropertyValue('--scale')) * 100) || 100; };

    var render = function () {
      fontBtns.forEach(function (b) { b.setAttribute('aria-checked', b.dataset.font === root.dataset.font); });
      var s = currentSize();
      out.textContent = s + '%';
      down.disabled = s <= sizes[0];
      up.disabled = s >= sizes[sizes.length - 1];
    };
    var setFont = function (f) { root.dataset.font = f; save('font', f); render(); };
    var setSize = function (s) { root.style.setProperty('--scale', s / 100); save('ukuran', s); render(); };

    var open = function (yes) { panel.hidden = !yes; readerBtn.setAttribute('aria-expanded', yes); };
    readerBtn.addEventListener('click', function (e) { e.stopPropagation(); open(panel.hidden); });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { open(false); readerBtn.focus(); } });

    fontBtns.forEach(function (b) { b.addEventListener('click', function () { setFont(b.dataset.font); }); });
    [down, up].forEach(function (b) {
      b.addEventListener('click', function () {
        var i = sizes.indexOf(currentSize());
        if (i < 0) i = 1;
        setSize(sizes[Math.max(0, Math.min(sizes.length - 1, i + Number(b.dataset.size)))]);
      });
    });
    panel.querySelector('.reader-reset').addEventListener('click', function () {
      root.dataset.font = panel.dataset.defaultFont;
      root.style.setProperty('--scale', panel.dataset.defaultSize / 100);
      save('font', null); save('ukuran', null);
      render();
    });
    render();
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
