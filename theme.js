/* ── THEME TOGGLE (Dark / Light Mode) ── */

const moonSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">' +
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const sunSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">' +
  '<circle cx="12" cy="12" r="5"/>' +
  '<g stroke="currentColor">' +
  '<line x1="12" y1="1" x2="12" y2="3"/>' +
  '<line x1="12" y1="21" x2="12" y2="23"/>' +
  '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>' +
  '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
  '<line x1="1" y1="12" x2="3" y2="12"/>' +
  '<line x1="21" y1="12" x2="23" y2="12"/>' +
  '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>' +
  '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' +
  '</g></svg>';

/* ── HERO VIDEO SWAP ── */
const heroVideos = [
  { id: 'bg1', light: 'bg.webm', dark: 'Herobg1.webm' },
  { id: 'bg2', light: 'bg1.webm', dark: 'Herobg2.webm' },
];

function swapHeroVideos(theme) {
  heroVideos.forEach(({ id, light, dark }) => {
    const vid = document.getElementById(id);
    if (!vid) return;
    const source = vid.querySelector('source');
    if (!source) return;
    const newSrc = theme === 'dark' ? dark : light;
    if (source.getAttribute('src') !== newSrc) {
      source.setAttribute('src', newSrc);
      vid.load();
      vid.play().catch(() => {});
    }
  });
}

/* ── THEME LOGIC ── */
function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light'; // default to light mode; user can toggle to dark
}

function applyTheme(theme) {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const messenger = document.querySelector('.fab img');

  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    if (btn) btn.innerHTML = sunSVG;
    if (messenger) messenger.style.filter = 'brightness(0)';
  } else {
    html.removeAttribute('data-theme');
    if (btn) btn.innerHTML = moonSVG;
    if (messenger) messenger.style.filter = 'brightness(0) invert(1)';
  }

  swapHeroVideos(theme);
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

// Init on load
applyTheme(getPreferredTheme());

// Listen for clicks
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#theme-toggle');
  if (btn) toggleTheme();
});
