(() => {
  'use strict';

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  let reduceMotion = false;
  let lenis;
  let cursorRafId = null;
  let lenisRafId = null;
  let cursorInitialized = false;

  // ─── LOADER ───
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;
    requestAnimationFrame(() => loader.classList.add('done'));
    setTimeout(() => {
      loader.classList.add('hidden');
      initHeroAnimation();
    }, 1400);
  }

  // ─── LENIS SMOOTH SCROLL ───
  function initLenis() {
    if (reduceMotion || lenis) return;
    lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ─── CUSTOM CURSOR ───
  function initCursor() {
    if (cursorInitialized) return;
    const cursor = $('#cursor');
    const trail = $('#cursorTrail');
    if (!cursor || !trail || window.innerWidth < 769) return;
    cursorInitialized = true;

    let mx = -100, my = -100;
    let tx = -100, ty = -100;
    let trailX = -100, trailY = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const interactives = $$('[data-cursor-hover]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const mode = el.dataset.cursorHover;
        cursor.classList.add(`is-${mode}`);
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-link', 'is-text');
      });
    });

    const textEls = $$('p, h1, h2, h3, li, span:not(.stats__number):not(.work__number):not(.manifesto__num)');
    textEls.forEach((el) => {
      if (el.closest('[data-cursor-hover]')) return;
      el.addEventListener('mouseenter', () => cursor.classList.add('is-text'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-text'));
    });

    function animateCursor() {
      if (reduceMotion) {
        cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        trail.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      } else {
        tx += (mx - tx) * 0.15;
        ty += (my - ty) * 0.15;
        trailX += (mx - trailX) * 0.08;
        trailY += (my - trailY) * 0.08;
        cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
        trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
      }
      cursorRafId = requestAnimationFrame(animateCursor);
    }
    cursorRafId = requestAnimationFrame(animateCursor);
  }

  // ─── MOUSE SPOTLIGHT ───
  function initSpotlight() {
    const spot = $('#spotlight');
    if (!spot || window.innerWidth < 769) return;
    document.addEventListener('mousemove', (e) => {
      spot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  // ─── HERO KINETIC SCRAMBLE ───
  function initHeroAnimation() {
    if (reduceMotion) {
      $$('.hero__line').forEach((l) => l.classList.add('is-visible'));
      $$('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&';
    const lines = $$('.hero__line[data-scramble]');

    lines.forEach((line, i) => {
      const original = line.textContent.trim();
      line.innerHTML = `<span>${original}</span>`;
      const span = line.querySelector('span');

      setTimeout(() => {
        line.classList.add('is-visible');
        let iteration = 0;
        const interval = setInterval(() => {
          span.textContent = original
            .split('')
            .map((char, idx) => {
              if (idx < iteration) return original[idx];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
          if (iteration >= original.length) clearInterval(interval);
          iteration += 1 / 2;
        }, 30);
      }, i * 200 + 200);
    });

    gsap.from('.hero__sub', {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 1.2,
      ease: 'power3.out',
    });

    gsap.from('.hero__scroll-cue', {
      opacity: 0,
      x: -20,
      duration: 0.8,
      delay: 1.6,
      ease: 'power3.out',
    });
  }

  // ─── SCROLL REVEALS ───
  function initReveals() {
    if (reduceMotion) {
      $$('[data-reveal], [data-reveal-stagger]').forEach((el) => el.classList.add('is-visible'));
      $$('.section-label').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    $$('[data-reveal]').forEach((el) => revealObs.observe(el));
    $$('.section-label').forEach((el) => revealObs.observe(el));

    const staggerItems = $$('[data-reveal-stagger]');
    if (staggerItems.length) {
      const staggerObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const parent = entry.target.parentElement;
              const siblings = parent ? [...parent.querySelectorAll('[data-reveal-stagger]')] : staggerItems;
              const pending = siblings.filter((it) => !it.classList.contains('is-visible'));
              pending.forEach((item, i) => {
                setTimeout(() => item.classList.add('is-visible'), i * 100);
              });
              staggerObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      staggerItems.forEach((el) => staggerObs.observe(el));
    }
  }

  // ─── HORIZONTAL SCROLL (WORK) ───
  function initHorizontalScroll() {
    const track = $('[data-horizontal-scroll]');
    if (!track) return;

    const workSection = $('.work');
    if (reduceMotion) {
      if (workSection) workSection.classList.add('is-static');
      return;
    }
    if (workSection) workSection.classList.remove('is-static');

    if (window.innerWidth < 769) {
      initSwipeHint();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const panels = $$('.work__panel', track);
    const lastPanel = panels[panels.length - 1];
    const buffer = 150;

    gsap.to(track, {
      x: () => -(lastPanel.offsetLeft + lastPanel.offsetWidth - window.innerWidth + buffer),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        pin: true,
        scrub: 1,
        end: () => `+=${lastPanel.offsetLeft + lastPanel.offsetWidth - window.innerWidth + buffer}`,
        invalidateOnRefresh: true,
      },
    });
  }

  function initSwipeHint() {
    const hint = $('.swipe-hint');
    const workSection = $('.work');
    if (!hint || !workSection) return;

    let hasInteracted = false;
    hint.style.display = 'none';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (hasInteracted) return;
          if (entry.isIntersecting) {
            hint.style.display = 'flex';
            hint.classList.remove('is-hidden');
          } else {
            hint.classList.add('is-hidden');
            setTimeout(() => {
              if (!entry.isIntersecting && !hasInteracted) hint.style.display = 'none';
            }, 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(workSection);

    const hideHint = () => {
      hasInteracted = true;
      hint.classList.add('is-hidden');
      setTimeout(() => { hint.style.display = 'none'; }, 500);
    };

    workSection.addEventListener('touchstart', hideHint, { once: true });
    workSection.addEventListener('scroll', hideHint, { once: true });
  }

  // ─── NUMBER COUNTERS ───
  function initCounters() {
    const counters = $$('[data-count-to]');
    if (!counters.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const target = parseInt(entry.target.dataset.countTo, 10);
            if (reduceMotion) {
              entry.target.textContent = target;
              return;
            }
            gsap.to(entry.target, {
              innerText: target,
              duration: 2,
              snap: { innerText: 1 },
              ease: 'power2.out',
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => obs.observe(c));
  }

  let tickerGlowInterval = null;

  function startTickerGlow() {
    stopTickerGlow();
    const spans = $$('.ticker__inner span');
    if (!spans.length) return;
    let idx = 0;
    spans.forEach((s) => s.classList.remove('glow'));
    spans[0].classList.add('glow');
    tickerGlowInterval = setInterval(() => {
      spans[idx].classList.remove('glow');
      idx = (idx + 1) % spans.length;
      spans[idx].classList.add('glow');
    }, 600);
  }

  function stopTickerGlow() {
    if (tickerGlowInterval) { clearInterval(tickerGlowInterval); tickerGlowInterval = null; }
    $$('.ticker__inner span').forEach((s) => s.classList.remove('glow'));
  }

  // ─── MOTION TOGGLE ───
  function initMotionToggle() {
    const btn = $('#motionToggle');
    if (!btn) return;

    if (reduceMotion) {
      btn.classList.add('reduced');
      $('.motion-toggle__label', btn).textContent = 'MOTION: OFF';
      startTickerGlow();
    }

    btn.addEventListener('click', () => {
      reduceMotion = !reduceMotion;
      document.body.classList.toggle('reduce-motion', reduceMotion);
      btn.classList.toggle('reduced', reduceMotion);
      $('.motion-toggle__label', btn).textContent = reduceMotion ? 'MOTION: OFF' : 'MOTION: ON';

      if (reduceMotion) {
        $$('[data-reveal], [data-reveal-stagger]').forEach((el) => el.classList.add('is-visible'));
        $$('.section-label').forEach((el) => el.classList.add('is-visible'));
        $$('.hero__line').forEach((l) => l.classList.add('is-visible'));
        if (lenis) { lenis.destroy(); lenis = null; }
        ScrollTrigger.getAll().forEach((t) => t.kill());
        const workSection = $('.work');
        if (workSection) workSection.classList.add('is-static');
        startTickerGlow();
      } else {
        stopTickerGlow();
        const workSection = $('.work');
        if (workSection) workSection.classList.remove('is-static');
        initLenis();
        initHorizontalScroll();
        ScrollTrigger.refresh();
      }
    });
  }

  // ─── PAGE WIPE ON LINK CLICKS ───
  function initPageWipe() {
    const wipe = $('#pageWipe');
    if (!wipe || reduceMotion) return;

    $$('a[href^="mailto:"], a[href^="tel:"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(wipe, {
          scaleY: 1,
          duration: 0.5,
          ease: 'power4.inOut',
          onComplete: () => {
            window.location.href = link.href;
          },
        });
      });
    });
  }

  // ─── ABOUT PARALLAX ───
  function initParallax() {
    const photo = $('[data-parallax]');
    if (!photo || reduceMotion) return;

    gsap.to(photo, {
      y: -60,
      rotation: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // ─── LEADERSHIP TOGGLE ───
  function initLeadershipToggle() {
    const toggle = $('#leadershipToggle');
    if (!toggle) return;
    const hiddenItems = $$('.cocurricular__item--hidden');
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', isExpanded);
      $('.cocurricular__toggle-text', toggle).textContent = isExpanded ? 'See Less' : 'See More';
      hiddenItems.forEach((item, i) => {
        if (isExpanded) {
          item.style.display = 'flex';
          setTimeout(() => item.classList.add('is-visible'), i * 80);
        } else {
          item.classList.remove('is-visible');
          item.style.display = 'none';
        }
      });
    });
  }

  // ─── MOBILE MENU ───
  function initMobileMenu() {
    const burger = $('#burgerBtn');
    const menu = $('#mobileMenu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('[data-mobile-link]').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── SMOOTH ANCHOR SCROLL ───
  function initAnchorScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = $(targetId);
        if (!target) return;
        e.preventDefault();
        if (lenis && !reduceMotion) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ─── HEADER SCROLL STATE ───
  function initHeaderScroll() {
    const header = $('#header');
    if (!header) return;
    let lastY = 0;
    function updateHeader() {
      const y = lenis && !reduceMotion ? lenis.scroll : window.scrollY;
      header.classList.toggle('is-scrolled', y > 100);
      header.classList.toggle('is-hidden', y > 400 && y > lastY);
      lastY = y;
      requestAnimationFrame(updateHeader);
    }
    requestAnimationFrame(updateHeader);
  }

  // ─── INIT ───
  function init() {
    gsap.registerPlugin(ScrollTrigger);
    initLoader();
    initLenis();
    initCursor();
    initSpotlight();
    initReveals();
    initHorizontalScroll();
    initCounters();
    initMotionToggle();
    initPageWipe();
    initParallax();
    initLeadershipToggle();
    initMobileMenu();
    initAnchorScroll();
    initHeaderScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
