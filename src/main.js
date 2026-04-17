import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- DOM ---
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// ========== LOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    if (!prefersReducedMotion) animateHero();
  }, 600);
});
setTimeout(() => loader.classList.add('hidden'), 3000);

// ========== NAVBAR SCROLL ==========
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ========== MOBILE NAV ==========
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});

// ========== HERO ANIMATION ==========
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
    .fromTo('.hero-title', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.5')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.hero-stats', { opacity: 1, y: 0, duration: 0.8, onComplete: () => animateCounters(false) }, '-=0.4');
}

// Reduced motion: show everything immediately
if (prefersReducedMotion) {
  gsap.set(['.hero-tag', '.hero-title', '.hero-sub', '.hero-actions', '.hero-stats'], { opacity: 1, y: 0 });
  gsap.set(['.truck-card', '.about-card'], { opacity: 1, y: 0 });
  animateCounters(true);
}

// ========== STAT COUNTERS ==========
function animateCounters(instant) {
  document.querySelectorAll('.stat-num').forEach(num => {
    const target = parseInt(num.dataset.target);
    if (instant || prefersReducedMotion) { num.textContent = target.toLocaleString(); return; }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      onUpdate: () => { num.textContent = Math.round(obj.val).toLocaleString(); },
    });
  });
}

// ========== SCROLL ANIMATIONS ==========
if (!prefersReducedMotion) {
  // Truck Cards
  gsap.utils.toArray('.truck-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: 'power3.out',
    });
  });

  // About Cards
  gsap.utils.toArray('.about-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
    });
  });

  // Section Headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.fromTo(header, { opacity: 0, y: 40 }, {
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  // Contact
  gsap.fromTo('.contact-info', { opacity: 0, x: -50 }, {
    scrollTrigger: { trigger: '.contact', start: 'top 75%', toggleActions: 'play none none none' },
    opacity: 1, x: 0, duration: 1, ease: 'power3.out',
  });
  gsap.fromTo('.contact-form', { opacity: 0, x: 50 }, {
    scrollTrigger: { trigger: '.contact', start: 'top 75%', toggleActions: 'play none none none' },
    opacity: 1, x: 0, duration: 1, delay: 0.2, ease: 'power3.out',
  });

  // Contact methods stagger
  gsap.utils.toArray('.contact-method').forEach((method, i) => {
    gsap.fromTo(method, { opacity: 0, x: -30 }, {
      scrollTrigger: { trigger: method, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 1, x: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
    });
  });

  // Hero parallax
  gsap.to('.hero-video', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    scale: 1.15, y: 80, ease: 'none',
  });

  // Marquee speed change on scroll
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const track = document.querySelector('.marquee-track');
      if (track) track.style.animationDuration = Math.max(8, 20 - self.progress * 10) + 's';
    },
  });

  // Navbar logo entrance
  gsap.fromTo('.nav-logo', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
}

// ========== CARD TILT (Desktop hover only) ==========
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.truck-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -3;
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 3;
      gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 800 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
    });
  });
}

// ========== HERO CURSOR GLOW ==========
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  const hero = document.querySelector('.hero');
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(229,161,0,0.07) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: '1', transform: 'translate(-50%, -50%)', opacity: '0',
    transition: 'opacity 0.4s', willChange: 'transform',
  });
  hero.appendChild(glow);
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
    glow.style.opacity = '1';
  });
  hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ========== FORM ==========
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';
    setTimeout(() => {
      submitBtn.textContent = '✓ Request Sent!';
      submitBtn.style.background = '#22c55e';
      submitBtn.style.opacity = '1';
      submitBtn.style.color = '#fff';
      setTimeout(() => {
        submitBtn.textContent = 'Send Request';
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        form.reset();
      }, 2500);
    }, 1200);
  });
}
