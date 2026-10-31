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
  // ── Gerak: scroll halus, munculan, judul besar, pita berjalan ──
  var motion = root.classList.contains('motion');
  var fine = window.matchMedia('(pointer: fine)').matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var maxScroll = function () { return document.documentElement.scrollHeight - window.innerHeight; };

  // Scroll halus untuk roda mouse/trackpad (layar sentuh tetap bawaan)
  var smooth = { on: motion && fine, target: window.scrollY, current: window.scrollY, moving: false };
  if (smooth.on) {
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target.closest && e.target.closest('pre, .reader-panel')) return;
      e.preventDefault();
      var d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!smooth.moving) smooth.target = smooth.current = window.scrollY;
      smooth.target = Math.max(0, Math.min(maxScroll(), smooth.target + d));
      smooth.moving = true;
    }, { passive: false });
    // Keyboard, scrollbar, atau tautan jangkar: ikut posisi aslinya
    ['keydown', 'mousedown', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, function () { smooth.moving = false; }, { passive: true });
    });
  }

  // Munculan saat masuk layar
  var split = function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span></span>';
    }).join(' ');
    el.classList.add('split');
  };
  if (motion && 'IntersectionObserver' in window) {
    document.querySelectorAll('.post-title-big, .page-title, .intro-hello').forEach(split);
    var targets = document.querySelectorAll('.section-label, .post-item, .mini-shelf li, .book, .intro-text, .intro-more, .see-all, .post-subtitle, .post-header .post-meta, .prose > *, .post-end, .post-nav, .page-lead, .filters, .year-group');
    targets.forEach(function (el) { el.classList.add('reveal'); });
    // Elemen yang bersebelahan muncul bergantian
    document.querySelectorAll('.mini-shelf li').forEach(function (el, i) { el.style.setProperty('--delay', (i * 0.08) + 's'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .split').forEach(function (el) { io.observe(el); });
    document.querySelectorAll('.mini-shelf a').forEach(function (el, i) { el.dataset.speed = [0.06, -0.04, 0.09, -0.02][i % 4]; });
  }

  var hero = document.querySelector('.hero');
  // Blok kuning beranda naik ke belakang kepala situs
  var header = document.querySelector('.site-header');
  if (hero && header) {
    var fit = function () { hero.style.setProperty('--header-h', header.offsetHeight + 'px'); };
    window.addEventListener('resize', fit);
    fit();
  }
  var track = document.querySelector('.marquee-track');
  var parallax = document.querySelectorAll('[data-speed]');
  var marquee = { x: 0, dir: 1 };

  // Kursor planet
  var cursor = document.querySelector('.cursor');
  var mouse = { x: -100, y: -100 }, pos = { x: -100, y: -100 };
  if (cursor && fine) {
    root.classList.add('has-cursor');
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
      cursor.classList.remove('is-hidden');
      cursor.classList.toggle('is-hover', !!(e.target.closest && e.target.closest('a, button, .chip, label')));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
    window.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
    window.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });
  }

  var lastY = window.scrollY;
  var tick = function () {
    if (smooth.on && smooth.moving) {
      smooth.current = lerp(smooth.current, smooth.target, 0.09);
      if (Math.abs(smooth.target - smooth.current) < 0.5) { smooth.current = smooth.target; smooth.moving = false; }
      window.scrollTo(0, smooth.current);
    }
    var y = window.scrollY, v = y - lastY;
    lastY = y;

    if (hero) {
      var p = Math.max(0, Math.min(1, y / hero.offsetHeight));
      hero.style.setProperty('--p', p.toFixed(4));
    }
    if (track) {
      if (Math.abs(v) > 0.5) marquee.dir = v > 0 ? 1 : -1;
      var speed = motion ? 0.6 + Math.min(Math.abs(v), 60) * 0.25 : 0;
      marquee.x -= speed * marquee.dir;
      var half = track.scrollWidth / 2;
      if (half) marquee.x = ((marquee.x % half) - half) % half;
      track.style.transform = 'translate3d(' + marquee.x + 'px,0,0)';
    }
    if (motion) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var off = (r.top - (el._off || 0) + r.height / 2 - window.innerHeight / 2) * Number(el.dataset.speed);
        el._off = off;
        var spin = el.dataset.spin ? ' rotate(' + (y * Number(el.dataset.spin)).toFixed(1) + 'deg)' : '';
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)' + spin;
      });
    }
    if (cursor && fine) {
      var t = motion ? 0.22 : 1;
      var dx = mouse.x - pos.x;
      pos.x = lerp(pos.x, mouse.x, t); pos.y = lerp(pos.y, mouse.y, t);
      var tilt = Math.max(-25, Math.min(25, dx * 0.6));
      cursor.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0) rotate(' + tilt.toFixed(1) + 'deg)';
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
