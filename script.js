/* ── HEADER SCROLL ── */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── SCROLL REVEAL (fires once when element enters view) ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ── HERO VIDEO TWO-FILE LOOP ── */
const heroVideo = document.querySelector('.hero-video-wrap video');
let showReverse = false;

heroVideo.addEventListener('ended', () => {
  showReverse = !showReverse;
  heroVideo.src = showReverse ? 'herobg3.mp4' : 'herobg.mp4';
  heroVideo.play();
});

/* ── HAMBURGER MENU ── */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('header nav a');

hamburger.addEventListener('click', () => {
  header.classList.toggle('nav-open');
});

/* Close menu when a nav link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
  });
});

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
  if (header.classList.contains('nav-open')) {
    if (!header.contains(e.target)) {
      header.classList.remove('nav-open');
    }
  }
});