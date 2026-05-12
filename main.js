/* ============================================================
   SANSKRITI MALVIYA — PORTFOLIO
   main.js  |  GSAP + ScrollTrigger + Locomotive Scroll
   ============================================================ */

'use strict';

/* ═══════════════════════════════════════════════
   1. LOCOMOTIVE SCROLL + GSAP SCROLLTRIGGER SETUP
   ═══════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

const scrollContainer = document.querySelector('[data-scroll-container]');

const locoScroll = new LocomotiveScroll({
  el: scrollContainer,
  smooth: true,
  multiplier: 0.85,
  lerp: 0.075,
  smartphone: { smooth: true },
  tablet: { smooth: true }
});

// Bridge Locomotive ↔ GSAP ScrollTrigger
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


/* ═══════════════════════════════════════════════
   2. CUSTOM CURSOR
   ═══════════════════════════════════════════════ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

const hoverTargets = 'a, button, .skill-card, .ach-item, .phil-item, .process-pill, .id-stat, .tool-chip, .quiz-option, .akss-mood, .exp-block, .pv-frame, .proj-cta-btn';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorRing.style.opacity = '1';
});


/* ═══════════════════════════════════════════════
   3. NAVBAR SCROLL STATE
   ═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
locoScroll.on('scroll', ({ scroll }) => {
  navbar.classList.toggle('scrolled', scroll.y > 60);
});


/* ═══════════════════════════════════════════════
   4. SMOOTH SCROLL FOR NAV LINKS
   ═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    locoScroll.scrollTo(target);
  });
});


/* ═══════════════════════════════════════════════
   5. HERO ENTRANCE ANIMATIONS
   ═══════════════════════════════════════════════ */
const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

heroTL
  .to('.hero-eyebrow',  { opacity: 1, y: 0, duration: 0.9, delay: 0.2 })
  .to('.hero-name',     { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
  .to('.hero-name-first', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.1,
    ease: 'expo.out'
  }, '<')
  .to('.hero-name-last', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.1,
    ease: 'expo.out'
  }, '<0.1')
  .to('.hero-role',     { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('.hero-bio',      { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
  .to('.hero-actions',  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('.hero-right',    { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.7');

// Set initial clip-path for name reveal
gsap.set('.hero-name-first, .hero-name-last', {
  clipPath: 'inset(0 100% 0 0)'
});


/* ═══════════════════════════════════════════════
   6. TYPING EFFECT — HERO EYEBROW
   ═══════════════════════════════════════════════ */
const eyebrow     = document.querySelector('.hero-eyebrow-label');
const eyebrowText = eyebrow ? eyebrow.textContent.trim() : '';
if (eyebrow) {
  eyebrow.textContent = '';
  let i = 0;
  const type = () => {
    if (i < eyebrowText.length) {
      eyebrow.textContent += eyebrowText[i++];
      setTimeout(type, 48);
    }
  };
  setTimeout(type, 900);
}


/* ═══════════════════════════════════════════════
   7. SCROLL REVEAL — all .gs-reveal elements
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.gs-reveal').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 55 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        scroller: scrollContainer,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
      }
    }
  );
});


/* ═══════════════════════════════════════════════
   8. PHILOSOPHY ITEMS STAGGER
   ═══════════════════════════════════════════════ */
gsap.fromTo('.phil-item',
  { opacity: 0, x: -30 },
  {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.philosophy-list',
      scroller: scrollContainer,
      start: 'top 80%'
    }
  }
);


/* ═══════════════════════════════════════════════
   9. SKILL BARS ANIMATION
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  const targetWidth = bar.dataset.width + '%';
  gsap.set(bar, { width: '0%' });

  ScrollTrigger.create({
    trigger: bar,
    scroller: scrollContainer,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(bar, {
        width: targetWidth,
        duration: 1.6,
        ease: 'power3.out',
        delay: 0.2
      });
    }
  });
});


/* ═══════════════════════════════════════════════
   10. COUNTER ANIMATION
   ═══════════════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const isFloat  = target % 1 !== 0;
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    const value    = eased * target;
    el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('[data-target]').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    scroller: scrollContainer,
    start: 'top 80%',
    onEnter: () => animateCounter(el)
  });
});


/* ═══════════════════════════════════════════════
   11. PROJECT BLOCKS — HORIZONTAL SLIDE-IN
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.project-block').forEach((block, i) => {
  const isFlipped = block.classList.contains('flipped');

  gsap.fromTo(block.querySelector('.project-info'),
    { opacity: 0, x: isFlipped ? 60 : -60 },
    {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: block,
        scroller: scrollContainer,
        start: 'top 75%'
      }
    }
  );

  gsap.fromTo(block.querySelector('.project-visual'),
    { opacity: 0, x: isFlipped ? -60 : 60 },
    {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.15,
      scrollTrigger: {
        trigger: block,
        scroller: scrollContainer,
        start: 'top 75%'
      }
    }
  );
});


/* ═══════════════════════════════════════════════
   12. SKILL CARDS STAGGER
   ═══════════════════════════════════════════════ */
gsap.fromTo('.skill-card',
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.skills-grid',
      scroller: scrollContainer,
      start: 'top 80%'
    }
  }
);


/* ═══════════════════════════════════════════════
   13. ACHIEVEMENT ITEMS STAGGER
   ═══════════════════════════════════════════════ */
gsap.fromTo('.ach-item',
  { opacity: 0, x: 30 },
  {
    opacity: 1,
    x: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.ach-list',
      scroller: scrollContainer,
      start: 'top 80%'
    }
  }
);


/* ═══════════════════════════════════════════════
   14. EDUCATION ITEMS STAGGER
   ═══════════════════════════════════════════════ */
gsap.fromTo('.edu-item',
  { opacity: 0, x: -30 },
  {
    opacity: 1,
    x: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.edu-items',
      scroller: scrollContainer,
      start: 'top 80%'
    }
  }
);


/* ═══════════════════════════════════════════════
   15. SECTION HEADINGS — WORD BY WORD
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.section-heading').forEach(heading => {
  // Split into words and wrap
  const words = heading.innerHTML.split(/\s+/);
  heading.innerHTML = words.map(w => `<span class="sh-word" style="display:inline-block;overflow:hidden;"><span style="display:inline-block;">${w}</span></span>`).join(' ');

  const spans = heading.querySelectorAll('.sh-word > span');

  gsap.fromTo(spans,
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: heading,
        scroller: scrollContainer,
        start: 'top 88%'
      }
    }
  );
});


/* ═══════════════════════════════════════════════
   16. PARALLAX ON HERO BG GRID
   ═══════════════════════════════════════════════ */
gsap.to('.hero-bg-grid', {
  y: '25%',
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    scroller: scrollContainer,
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5
  }
});


/* ═══════════════════════════════════════════════
   17. ID CARD TILT EFFECT
   ═══════════════════════════════════════════════ */
const idCard = document.querySelector('.id-card');
if (idCard) {
  idCard.addEventListener('mousemove', e => {
    const rect = idCard.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rotX =  ((e.clientY - cy) / (rect.height / 2)) * -6;
    const rotY =  ((e.clientX - cx) / (rect.width  / 2)) * 8;
    gsap.to(idCard, {
      rotateX: rotX,
      rotateY: rotY,
      scale: 1.015,
      duration: 0.4,
      transformPerspective: 900,
      ease: 'power2.out'
    });
  });
  idCard.addEventListener('mouseleave', () => {
    gsap.to(idCard, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    });
  });
}


/* ═══════════════════════════════════════════════
   18. MARQUEE PAUSE ON HOVER
   ═══════════════════════════════════════════════ */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}


/* ═══════════════════════════════════════════════
   19. ACTIVE NAV LINK ON SCROLL
   ═══════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    scroller: scrollContainer,
    start: 'top 55%',
    end: 'bottom 55%',
    onEnter: () => highlightNav(section.id),
    onEnterBack: () => highlightNav(section.id)
  });
});

function highlightNav(id) {
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${id}`) {
      a.style.color = 'var(--rose)';
    }
  });
}


/* ═══════════════════════════════════════════════
   20. CONTACT SECTION — BIG TEXT REVEAL
   ═══════════════════════════════════════════════ */
gsap.fromTo('.contact-big',
  { opacity: 0, scale: 0.95, y: 30 },
  {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.contact-big',
      scroller: scrollContainer,
      start: 'top 80%'
    }
  }
);


/* ═══════════════════════════════════════════════
   21. TOOL CHIPS STAGGER
   ═══════════════════════════════════════════════ */
gsap.fromTo('.tool-chip',
  { opacity: 0, scale: 0.85 },
  {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    stagger: 0.06,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.tools-row',
      scroller: scrollContainer,
      start: 'top 85%'
    }
  }
);


/* ═══════════════════════════════════════════════
   22. FINAL SCROLLTRIGGER REFRESH
   ═══════════════════════════════════════════════ */
// Delay to let fonts + images load, then refresh
window.addEventListener('load', () => {
  locoScroll.update();
  ScrollTrigger.refresh();
});

setTimeout(() => {
  locoScroll.update();
  ScrollTrigger.refresh();
}, 500);


/* ═══════════════════════════════════════════════
   23. MAGNETIC BUTTONS
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.btn, .proj-cta-btn, .nav-linkedin').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
  });
});


/* ═══════════════════════════════════════════════
   24. SECTION TAGS SLIDE IN
   ═══════════════════════════════════════════════ */
gsap.utils.toArray('.section-tag').forEach(tag => {
  gsap.fromTo(tag,
    { opacity: 0, x: -24 },
    {
      opacity: 1, x: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: tag,
        scroller: scrollContainer,
        start: 'top 88%'
      }
    }
  );
});


/* ═══════════════════════════════════════════════
   25. CERT BOX POP-IN
   ═══════════════════════════════════════════════ */
gsap.fromTo('a.cert-box',
  { opacity: 0, scale: 0.92, y: 20 },
  {
    opacity: 1, scale: 1, y: 0,
    duration: 0.9,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: 'a.cert-box',
      scroller: scrollContainer,
      start: 'top 85%'
    }
  }
);


/* ═══════════════════════════════════════════════
   26. PROJECT IDX COUNTER FLOAT
   ═══════════════════════════════════════════════ */
gsap.utils.toArray('.project-idx').forEach(idx => {
  gsap.fromTo(idx,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: idx.closest('.project-block'),
        scroller: scrollContainer,
        start: 'top 80%'
      }
    }
  );
});


/* ═══════════════════════════════════════════════
   27. EXP BLOCK SLIDE UP
   ═══════════════════════════════════════════════ */
gsap.fromTo('.exp-block',
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.exp-block',
      scroller: scrollContainer,
      start: 'top 82%'
    }
  }
);


/* ═══════════════════════════════════════════════
   28. FOOTER FADE IN
   ═══════════════════════════════════════════════ */
gsap.fromTo('footer',
  { opacity: 0 },
  {
    opacity: 1,
    duration: 1.0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: 'footer',
      scroller: scrollContainer,
      start: 'top 95%'
    }
  }
);


/* ═══════════════════════════════════════════════
   29. MARQUEE SPEED ON SCROLL
   ═══════════════════════════════════════════════ */
locoScroll.on('scroll', ({ speed }) => {
  if (!marqueeTrack) return;
  const s = Math.abs(speed || 0);
  const duration = Math.max(8, 28 - s * 2);
  marqueeTrack.style.animationDuration = duration + 's';
});


/* ═══════════════════════════════════════════════
   30. AVAIL PILL PULSE GLOW
   ═══════════════════════════════════════════════ */
gsap.fromTo('.avail-pill',
  { opacity: 0, scale: 0.9 },
  {
    opacity: 1, scale: 1,
    duration: 0.8,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.avail-pill',
      scroller: scrollContainer,
      start: 'top 88%'
    }
  }
);

gsap.to('.avail-pill', {
  boxShadow: '0 0 22px rgba(107,203,119,0.18)',
  repeat: -1,
  yoyo: true,
  duration: 1.8,
  ease: 'sine.inOut',
  delay: 1
});