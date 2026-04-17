/* =========================================================
   Happy Anniversary — interactive layer
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- AOS init ---------- */
  function initAOS() {
    if (window.AOS) {
      AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: prefersReduced ? true : false,
      });
    }
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const pre = $('#preloader');
    if (!pre) return;
    const hide = () => {
      setTimeout(() => pre.classList.add('is-hidden'), 600);
    };
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  /* ---------- Nav scroll state ---------- */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Floating hearts ---------- */
  function initFloatingHearts() {
    if (prefersReduced) return;
    const layer = $('#floatingHearts');
    if (!layer) return;
    const symbols = ['❤', '❤', '💗', '💞', '✨', '💖'];

    const spawn = () => {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      const startX = Math.random() * 100;
      const drift  = (Math.random() * 200 - 100) + 'px';
      const dur    = (8 + Math.random() * 8) + 's';
      const size   = (12 + Math.random() * 18) + 'px';

      heart.style.left = startX + 'vw';
      heart.style.fontSize = size;
      heart.style.animationDuration = dur;
      heart.style.setProperty('--drift', drift);
      heart.style.opacity = (0.4 + Math.random() * 0.5).toString();

      layer.appendChild(heart);
      setTimeout(() => heart.remove(), 17000);
    };

    for (let i = 0; i < 4; i++) setTimeout(spawn, i * 800);
    setInterval(spawn, 1600);
  }

  /* ---------- Sparkle canvas ---------- */
  function initSparkles() {
    if (prefersReduced) return;
    const canvas = $('#sparkleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    const resize = () => {
      w = canvas.width  = window.innerWidth  * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const palette = ['#e9c87a', '#ffb3c7', '#fff1d6', '#ff7aa2'];
    const COUNT = Math.min(80, Math.floor(window.innerWidth / 18));

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.4 + 0.3) * window.devicePixelRatio,
        a: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.3 + 0.05) * window.devicePixelRatio,
        twinkle: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.twinkle += 0.02;
        p.y -= p.speed;
        p.x += Math.cos(p.a) * 0.15 * window.devicePixelRatio;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }

        const alpha = 0.35 + Math.sin(p.twinkle) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  /* ---------- Music: scroll/click/key starts the song, button toggles it ----------
     Strategy:
       - On the FIRST real user input of any kind (wheel, scroll, click,
         pointerdown, key, touch) we call audio.play() unmuted. Doing this
         from inside the input handler counts as a user gesture, so the
         browser allows audible playback.
       - We DO NOT remove the gesture listeners until play() ACTUALLY
         resolves successfully. Otherwise a failed first attempt would leave
         us with no way to retry. */
  function initMusic() {
    const audio = $('#bgMusic');
    const btn   = $('#musicBtn');
    const icon  = $('#musicIcon');
    const label = $('#musicLabel');
    if (!audio) return;

    const TARGET_VOL = 0.6;
    const ICON_PLAY  = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

    const log = (...args) => console.log('%c[music]', 'color:#e9c87a;font-weight:bold', ...args);

    audio.loop = true;
    audio.volume = TARGET_VOL;
    audio.muted = false; // start unmuted; play() may be blocked but that's fine

    let userPaused = false;
    let started   = false;
    let inFlight  = false;

    audio.addEventListener('error', () => console.error('[music] LOAD ERROR', audio.error));
    audio.addEventListener('loadeddata',  () => log('loaded ✓'));
    audio.addEventListener('canplay',     () => log('canplay ✓'));
    audio.addEventListener('playing',     () => log('PLAYING ✓ (muted=' + audio.muted + ', vol=' + audio.volume.toFixed(2) + ')'));
    audio.addEventListener('pause',       () => log('paused'));

    const setUI = (playing) => {
      if (!btn) return;
      if (playing) {
        btn.classList.add('is-playing');
        btn.setAttribute('aria-label', 'Pause music');
        btn.title = 'Pause music';
        if (icon)  icon.innerHTML  = ICON_PAUSE;
        if (label) label.textContent = 'Pause';
      } else {
        btn.classList.remove('is-playing');
        btn.setAttribute('aria-label', 'Play music');
        btn.title = 'Play music';
        if (icon)  icon.innerHTML  = ICON_PLAY;
        if (label) label.textContent = 'Play';
      }
    };

    const fadeTo = (target, ms = 800) => {
      const start = performance.now();
      const from  = audio.volume;
      const step  = (now) => {
        const t = Math.min(1, (now - start) / ms);
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    /* Attempt to start audible playback. Returns a promise so callers know
       whether it actually worked. We only mark `started` and remove the
       gesture listeners after play() truly resolves. */
    const startAudible = () => {
      if (started || userPaused || inFlight) return Promise.resolve(started);
      inFlight = true;
      audio.muted = false;
      const p = audio.play();
      if (!p || !p.then) { inFlight = false; started = true; setUI(true); return Promise.resolve(true); }
      return p.then(() => {
        inFlight = false;
        started = true;
        log('audible start ✓');
        setUI(true);
      }).catch(err => {
        inFlight = false;
        log('play blocked:', err && err.name, '— will retry on next user gesture');
      });
    };

    /* Try once on init (will likely be blocked, that's fine — we'll retry
       on the first real interaction). */
    startAudible();

    /* These all qualify as user input. We attempt startAudible() each time
       and only stop listening after success. */
    const events = ['wheel', 'scroll', 'click', 'pointerdown', 'mousedown',
                    'touchstart', 'touchmove', 'keydown', 'keyup'];
    const handleGesture = () => {
      startAudible().then(() => {
        if (started) {
          events.forEach(evt => window.removeEventListener(evt, handleGesture, true));
        }
      });
    };
    events.forEach(evt =>
      window.addEventListener(evt, handleGesture, { capture: true, passive: true })
    );

    /* Music button: explicit play / pause toggle. */
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused || !started) {
          userPaused = false;
          audio.muted = false;
          startAudible();
        } else {
          userPaused = true;
          fadeTo(0, 220);
          setTimeout(() => { audio.pause(); setUI(false); }, 250);
        }
      });
    }

    audio.addEventListener('ended', () => { if (!userPaused) audio.play().catch(() => {}); });

    setUI(false);
  }

  /* ---------- QR Code generation ---------- */
  function initQRCode() {
    const el = document.getElementById('qrcode');
    if (!el || !window.QRCode) return;
    el.innerHTML = '';
    new window.QRCode(el, {
      text: 'https://sandhyanooj.life',
      width: 220,
      height: 220,
      colorDark:  '#1a0d22',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const items   = $$('.masonry__item img');
    const lb      = $('#lightbox');
    const lbImg   = $('#lbImg');
    const closeBt = $('#lbClose');
    const prevBt  = $('#lbPrev');
    const nextBt  = $('#lbNext');
    if (!lb || items.length === 0) return;

    const sources = items.map(img => ({ src: img.src, alt: img.alt }));
    let idx = 0;

    const open = (i) => {
      idx = i;
      lbImg.src = sources[idx].src;
      lbImg.alt = sources[idx].alt;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const step = (delta) => {
      idx = (idx + delta + sources.length) % sources.length;
      lbImg.style.opacity = '0';
      setTimeout(() => {
        lbImg.src = sources[idx].src;
        lbImg.alt = sources[idx].alt;
        lbImg.style.opacity = '1';
      }, 120);
    };

    items.forEach((img, i) => img.parentElement.addEventListener('click', () => open(i)));
    closeBt.addEventListener('click', close);
    prevBt.addEventListener('click', () => step(-1));
    nextBt.addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft')  step(-1);
    });

    lbImg.style.transition = 'opacity 0.18s ease';
    lbImg.style.opacity = '1';
  }

  /* ---------- Typing effect for the message ---------- */
  function initTyping() {
    const el = $('#typedText');
    if (!el) return;

    const lines = [
      'Aap sirf teacher nahi ho,',
      'aap meri life ke guide, mentor aur ek strong support ho.',
      '',
      'Aaj jo bhi hu, usme aapka bohot bada role hai.',
      '',
      'Aap dono ki jodi hamesha aise hi khush rahe \u2764',
      '',
      'Happy Anniversary once again!'
    ];
    const fullText = lines.join('\n');

    if (prefersReduced) { el.textContent = fullText; return; }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      let i = 0;
      el.innerHTML = '<span class="caret"></span>';
      const caret = el.querySelector('.caret');

      const tick = () => {
        if (i >= fullText.length) return;
        const ch = fullText[i++];
        const node = ch === '\n'
          ? document.createElement('br')
          : document.createTextNode(ch);
        el.insertBefore(node, caret);
        const delay = ch === '\n' ? 220 : (ch === ',' || ch === '.' ? 120 : 32 + Math.random() * 30);
        setTimeout(tick, delay);
      };
      tick();
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) start(); });
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ---------- Confetti ---------- */
  function fireConfetti() {
    if (!window.confetti) return;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#e9c87a', '#f4d98c', '#ffb3c7', '#ff7aa2', '#ffffff'],
      scalar: 1.0,
      ticks: 220,
    };
    const fire = (ratio, opts) => {
      window.confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(220 * ratio),
      }));
    };
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2,  { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1,  { spread: 120, startVelocity: 45 });
  }

  function initEnding() {
    const btn = $('#celebrateBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      fireConfetti();
      setTimeout(fireConfetti, 600);
      setTimeout(fireConfetti, 1200);
    });

    // Auto-celebrate when scrolled into view (once)
    const ending = $('#ending');
    if (ending) {
      let fired = false;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting && !fired) {
            fired = true;
            setTimeout(fireConfetti, 400);
          }
        });
      }, { threshold: 0.5 });
      io.observe(ending);
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initAOS();
    initNav();
    initFloatingHearts();
    initSparkles();
    initMusic();
    initLightbox();
    initTyping();
    initQRCode();
    initEnding();
  });
})();
