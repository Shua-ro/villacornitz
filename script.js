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

/* ── HERO VIDEO PRELOAD + FADE SWAP ── */
const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');
let preloading = false;

// Slow down the hero background videos to reduce dizziness
bg1.playbackRate = 1;
bg2.playbackRate = 1;

bg1.play();
bg2.play(); // starts hidden, stays decoded from the start

// 1s before bg1 ends, reset bg2 to the beginning
bg1.addEventListener('timeupdate', function preloadNext() {
  if (!preloading && bg1.currentTime >= bg1.duration - 0.5) {
    preloading = true;
    bg2.currentTime = 0;
    bg2.play();
  }
});

// When bg1 ends, fade it out and show bg2
bg1.addEventListener('ended', () => {
  preloading = false;
  bg1.classList.remove('active');
  bg2.classList.add('active');
});

// Same for bg2 → bg1: 1s before bg2 ends, start playing bg1
bg2.addEventListener('timeupdate', function preloadNext() {
  if (!preloading && bg2.currentTime >= bg2.duration - 0.3) {
    preloading = true;
    bg1.currentTime = 0;
    bg1.play();
  }
});

bg2.addEventListener('ended', () => {
  preloading = false;
  bg2.classList.remove('active');
  bg1.classList.add('active');
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



