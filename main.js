/* ============================================================
   SANSKRITI MALVIYA — PORTFOLIO
   main.js  |  GSAP + ScrollTrigger + Locomotive Scroll
   ============================================================ */

'use strict';

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══ 1. LOCOMOTIVE + SCROLLTRIGGER BRIDGE ═══ */
gsap.registerPlugin(ScrollTrigger);

const scrollContainer = document.querySelector('[data-scroll-container]');

const locoScroll = new LocomotiveScroll({
  el: scrollContainer,
  smooth: !reduceMotion,
  multiplier: 0.85,
  lerp: 0.075,
  smartphone: { smooth: false },
  tablet: { smooth: false }
});

locoScroll.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy(scrollContainer, {
  scrollTop(value) {
    if (arguments.length) {
      locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
    } else {
      return locoScroll.scroll.instance.scroll.y;
    }
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
});

ScrollTrigger.addEventListener('refresh', () => locoScroll.update());

/* Shared helper so every trigger uses the same scroller */
const st = (extra) => Object.assign({ scroller: scrollContainer }, extra);


/* ═══ 2. CUSTOM CURSOR (desktop only) ═══ */
if (!isTouch) {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = 'a, button, .skill-card, .ach-item, .phil-item, .process-pill, .id-stat, .tool-chip, .akss-mood, .exp-block, .pv-frame, .proj-cta-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; ring.style.opacity = '1'; });
}


/* ═══ 3. NAVBAR + PROGRESS BAR + BACK-TO-TOP ═══ */
const navbar = document.getElementById('navbar');
const progressFill = document.getElementById('progress-fill');
const toTop = document.getElementById('to-top');

locoScroll.on('scroll', ({ scroll, limit }) => {
  navbar.classList.toggle('scrolled', scroll.y > 60);
  progressFill.style.transform = `scaleX(${limit.y ? scroll.y / limit.y : 0})`;
  toTop.classList.toggle('show', scroll.y > 700);
});


/* ═══ 4. SMOOTH ANCHOR LINKS ═══ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    locoScroll.scrollTo(target);
  });
});


/* ═══ 5. PRELOADER → HERO INTRO ═══ */
gsap.set('.hero-name-first, .hero-name-last', { clipPath: 'inset(0 100% 0 0)' });
gsap.set(['.hero-eyebrow', '.hero-name', '.hero-role', '.hero-bio', '.hero-actions', '.hero-right'], { y: 30 });

function playHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9 })
    .to('.hero-name', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.hero-name-first', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.out' }, '<')
    .to('.hero-name-last', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.out' }, '<0.1')
    .to('.hero-role', { opacity: 1, y: 0, duration: 0.8, onStart: scrambleRole }, '-=0.6')
    .to('.hero-bio', { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.hero-right', { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.7');
  startTyping();
}

/* Typing effect for the eyebrow */
function startTyping() {
  const eyebrow = document.querySelector('.hero-eyebrow-label');
  if (!eyebrow) return;
  const full = eyebrow.textContent.trim();
  eyebrow.textContent = '';
  let i = 0;
  (function type() {
    if (i < full.length) { eyebrow.textContent += full[i++]; setTimeout(type, 45); }
  })();
}

/* Text scramble for the hero role line */
function scrambleRole() {
  const el = document.getElementById('hero-role');
  if (!el || reduceMotion) return;
  const finalText = el.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let frame = 0;
  const total = 28;
  const timer = setInterval(() => {
    const progress = frame / total;
    el.textContent = finalText.split('').map((ch, idx) => {
      if (ch === ' ' || idx < finalText.length * progress) return ch;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (++frame > total) { clearInterval(timer); el.textContent = finalText; }
  }, 32);
}

(function preloader() {
  const pre = document.getElementById('preloader');
  const num = document.getElementById('pre-num');
  const fill = document.getElementById('pre-fill');
  const counter = { v: 0 };

  gsap.to(counter, {
    v: 100,
    duration: reduceMotion ? 0.1 : 1.4,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(counter.v);
      num.textContent = v;
      fill.style.width = v + '%';
    },
    onComplete() {
      gsap.to(pre, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete() { pre.remove(); playHero(); locoScroll.update(); ScrollTrigger.refresh(); }
      });
    }
  });
})();


/* ═══ 6. SCROLL REVEAL ═══ */
document.querySelectorAll('.gs-reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 55 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: st({ trigger: el, start: 'top 88%', toggleActions: 'play none none none' }) }
  );
});

/* ═══ 7. STAGGERED GROUPS ═══ */
function stagger(selector, triggerSel, from, opts = {}) {
  gsap.fromTo(selector,
    Object.assign({ opacity: 0 }, from),
    Object.assign({ opacity: 1, x: 0, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: st({ trigger: triggerSel, start: 'top 82%' }) }, opts)
  );
}
stagger('.phil-item', '.philosophy-list', { x: -30 });
stagger('.skill-card', '.skills-grid', { y: 40 });
stagger('.ach-item', '.ach-list', { x: 30 }, { duration: 0.7, stagger: 0.1 });
stagger('.edu-item', '.edu-items', { x: -30 }, { duration: 0.7 });
stagger('.tool-chip', '.tools-row', { scale: 0.85 }, { scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.5)' });


/* ═══ 8. SKILL BARS ═══ */
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  gsap.set(bar, { width: '0%' });
  ScrollTrigger.create(st({
    trigger: bar, start: 'top 90%', once: true,
    onEnter: () => gsap.to(bar, { width: bar.dataset.width + '%', duration: 1.6, ease: 'power3.out', delay: 0.2 })
  }));
});


/* ═══ 9. COUNTERS ═══ */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / 1600, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  })(start);
}
document.querySelectorAll('[data-target]').forEach(el => {
  ScrollTrigger.create(st({ trigger: el, start: 'top 90%', once: true, onEnter: () => animateCounter(el) }));
});


/* ═══ 10. PROJECT BLOCKS ═══ */
document.querySelectorAll('.project-block').forEach(block => {
  const flipped = block.classList.contains('flipped');
  const trigger = st({ trigger: block, start: 'top 78%' });

  gsap.fromTo(block.querySelector('.project-info'),
    { opacity: 0, x: flipped ? 60 : -60 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: trigger });

  gsap.fromTo(block.querySelector('.project-visual'),
    { opacity: 0, x: flipped ? -60 : 60 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.15, scrollTrigger: trigger });

  gsap.fromTo(block.querySelector('.project-idx'),
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: trigger });
});


/* ═══ 11. SECTION HEADINGS — WORD BY WORD ═══ */
document.querySelectorAll('.section-heading').forEach(heading => {
  const words = heading.innerHTML.split(/\s+/);
  heading.innerHTML = words.map(w =>
    `<span class="sh-word" style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span style="display:inline-block;">${w}</span></span>`
  ).join(' ');

  gsap.fromTo(heading.querySelectorAll('.sh-word > span'),
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power4.out',
      scrollTrigger: st({ trigger: heading, start: 'top 90%' }) }
  );
});

gsap.utils.toArray('.section-tag').forEach(tag => {
  gsap.fromTo(tag, { opacity: 0, x: -24 },
    { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: st({ trigger: tag, start: 'top 90%' }) });
});


/* ═══ 12. HERO PARALLAX ═══ */
gsap.to('.hero-bg-grid', {
  y: '25%', ease: 'none',
  scrollTrigger: st({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 })
});
gsap.to('.hero-orb', {
  y: '-30%', ease: 'none',
  scrollTrigger: st({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 })
});


/* ═══ 13. TILT (id card + project frames) ═══ */
function addTilt(el, maxX, maxY) {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const rotX = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -maxX;
    const rotY = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * maxY;
    gsap.to(el, { rotateX: rotX, rotateY: rotY, scale: 1.015, duration: 0.4, transformPerspective: 900, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
  });
}
if (!isTouch && !reduceMotion) {
  document.querySelectorAll('.id-card').forEach(el => addTilt(el, 6, 8));
  document.querySelectorAll('.pv-frame.tilt').forEach(el => addTilt(el, 4, 6));
}


/* ═══ 14. SPOTLIGHT GLOW ON CARDS ═══ */
if (!isTouch) {
  document.querySelectorAll('.spot').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}


/* ═══ 15. MAGNETIC BUTTONS ═══ */
if (!isTouch) {
  document.querySelectorAll('.btn, .proj-cta-btn, .nav-linkedin, #to-top').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.25,
        y: (e.clientY - (r.top + r.height / 2)) * 0.25,
        duration: 0.35, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' }));
  });
}


/* ═══ 16. MARQUEE (pause on hover + speed on scroll) ═══ */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
  marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
  locoScroll.on('scroll', ({ speed }) => {
    const s = Math.abs(speed || 0);
    marqueeTrack.style.animationDuration = Math.max(8, 28 - s * 2) + 's';
  });
}


/* ═══ 17. ACTIVE NAV LINK ═══ */
const navLinks = document.querySelectorAll('.nav-links a');
function highlightNav(id) {
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
}
document.querySelectorAll('section[id]').forEach(section => {
  ScrollTrigger.create(st({
    trigger: section, start: 'top 55%', end: 'bottom 55%',
    onEnter: () => highlightNav(section.id),
    onEnterBack: () => highlightNav(section.id)
  }));
});


/* ═══ 18. CONTACT, CERT, FOOTER, AVAIL PILL ═══ */
gsap.fromTo('.contact-big', { opacity: 0, scale: 0.95, y: 30 },
  { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: st({ trigger: '.contact-big', start: 'top 82%' }) });

gsap.fromTo('a.cert-box', { opacity: 0, scale: 0.92, y: 20 },
  { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)', scrollTrigger: st({ trigger: 'a.cert-box', start: 'top 88%' }) });

gsap.fromTo('footer', { opacity: 0 },
  { opacity: 1, duration: 1, ease: 'power2.out', scrollTrigger: st({ trigger: 'footer', start: 'top 98%' }) });

gsap.fromTo('.avail-pill', { opacity: 0, scale: 0.9 },
  { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: st({ trigger: '.avail-pill', start: 'top 90%' }) });

gsap.to('.avail-pill', { boxShadow: '0 0 22px rgba(107,203,119,0.18)', repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut', delay: 1 });

/* Footer year */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ═══ 19. REFRESH AFTER ASSETS LOAD ═══ */
window.addEventListener('load', () => { locoScroll.update(); ScrollTrigger.refresh(); });
setTimeout(() => { locoScroll.update(); ScrollTrigger.refresh(); }, 800);
