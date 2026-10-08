const scenarios = [...document.querySelectorAll('.scenario')];

function activateScenario(next) {
  scenarios.forEach((scenario) => {
    const active = scenario === next;
    scenario.classList.toggle('is-active', active);
    scenario.querySelector('.scenario-toggle').setAttribute('aria-expanded', String(active));
  });
}

scenarios.forEach((scenario) => {
  scenario.querySelector('.scenario-toggle').addEventListener('click', () => activateScenario(scenario));
});

const feedTabs = [...document.querySelectorAll('[data-feed]')];
const filters = [...document.querySelectorAll('[data-filter]')];
const posts = [...document.querySelectorAll('.post')];
const emptyState = document.querySelector('.feed-empty');
let currentFeed = 'all';
let currentFilter = 'all';

function renderFeed() {
  let visible = 0;
  posts.forEach((post) => {
    const inFeed = currentFeed === 'all' || post.dataset.followed === 'true';
    const inCategory = currentFilter === 'all' || post.dataset.kind === currentFilter;
    const show = inFeed && inCategory;
    post.hidden = !show;
    if (show) visible += 1;
  });
  emptyState.hidden = visible !== 0;
}

feedTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    currentFeed = tab.dataset.feed;
    feedTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    renderFeed();
  });
});

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    currentFilter = filter.dataset.filter;
    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderFeed();
  });
});

document.querySelectorAll('.follow').forEach((button) => {
  button.addEventListener('click', () => {
    const post = button.closest('.post');
    const followed = post.dataset.followed !== 'true';
    post.dataset.followed = String(followed);
    button.classList.toggle('is-followed', followed);
    button.setAttribute('aria-pressed', String(followed));
    button.textContent = followed ? 'В подписках' : 'Подписаться';
    renderFeed();
  });
});

const shareButton = document.querySelector('.share-button');
const shareStatus = document.querySelector('.share-status');

shareButton.addEventListener('click', async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(window.location.href);
    } else {
      const fallback = document.createElement('textarea');
      fallback.value = window.location.href;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.append(fallback);
      fallback.select();
      const copied = document.execCommand('copy');
      fallback.remove();
      if (!copied) throw new Error('Copy unavailable');
    }
    shareStatus.textContent = 'Ссылка скопирована.';
    shareButton.querySelector('span').textContent = 'Готово';
  } catch {
    shareStatus.textContent = 'Скопируй адрес из строки браузера.';
  }
  window.setTimeout(() => {
    shareStatus.textContent = '';
    shareButton.querySelector('span').textContent = 'Скопировать ссылку';
  }, 2600);
});

// The page after the first block is shown for one audience at a time: a resident or a business.
const roleButtons = [...document.querySelectorAll('[data-role-choice]')];

function setRole(role, remember = true) {
  document.body.dataset.role = role;
  roleButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.roleChoice === role)));
  if (remember) {
    const url = new URL(window.location.href);
    if (role === 'business') url.searchParams.set('for', 'business'); else url.searchParams.delete('for');
    window.history.replaceState(null, '', url);
  }
  // Scroll-driven animations measured the page with the other audience's sections in it.
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
}

roleButtons.forEach((button) => button.addEventListener('click', () => setRole(button.dataset.roleChoice)));
if (new URLSearchParams(window.location.search).get('for') === 'business') setRole('business', false);

// A link into a section of one audience switches to that audience first, so it never lands on a hidden block.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const target = document.querySelector(link.getAttribute('href'));
  const role = target?.closest('[data-for]')?.dataset.for ?? (target?.id === 'launch' ? 'user' : null);
  if (role) link.addEventListener('click', () => setRole(role));
});

// Store, connection and donation links come from the page's meta tags; an empty one stays a "coming soon" label.
document.querySelectorAll('[data-link]').forEach((link) => {
  const url = document.querySelector(`meta[name="${link.dataset.link}"]`)?.content.trim();
  if (!url) return;
  link.href = url;
  link.removeAttribute('aria-disabled');
  const note = link.querySelector('small');
  if (link.dataset.liveNote) note.textContent = link.dataset.liveNote; else note?.remove();
  if (link.classList.contains('store-link') || 'newTab' in link.dataset) { link.target = '_blank'; link.rel = 'noopener'; }
});

// Theme choice: light, dark, or follow the system (nothing stored, no data-theme on <html>; the stylesheet decides).
const themeSwitch = document.querySelector('.theme-switch');

function setTheme(choice, remember = true) {
  if (choice === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = choice;
  themeSwitch.dataset.choice = choice;
  themeSwitch.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice)));
  paintBrowserBar();
  if (!remember) return;
  try {
    if (choice === 'system') localStorage.removeItem('okolo-theme'); else localStorage.setItem('okolo-theme', choice);
  } catch { /* private mode: the choice lasts until the page is closed */ }
}

// The browser's own bar takes the page colour of whichever theme is showing.
function paintBrowserBar() {
  const page = getComputedStyle(document.documentElement).getPropertyValue('--pearl').trim();
  document.querySelector('meta[name="theme-color"]').content = page;
}

themeSwitch.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintBrowserBar);
setTheme(document.documentElement.dataset.theme ?? 'system', false);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // With the opening screen on, the page comes in as that screen closes, and the wordmark is left to it.
  const opening = document.documentElement.classList.contains('intro-on');
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, paused: opening });
  if (opening) {
    if (window.okoloRevealed) intro.play();
    else window.addEventListener('okolo:reveal', () => intro.play(), { once: true });
  }
  intro
    .from(opening ? '.site-header > :not(.wordmark)' : '.site-header > *', { y: -18, opacity: 0, duration: .7, stagger: .08 })
    .from('.hero h1 > span', { yPercent: 115, opacity: 0, duration: .9, stagger: .1 }, '-=.42')
    .from('.hero-art', { scale: .82, rotate: -6, opacity: 0, duration: 1.25 }, '-=.92')
    .from('.hero-offer, .scroll-cue', { y: 22, opacity: 0, duration: .7, stagger: .1 }, '-=.52');

  gsap.to('.hero-art', {
    yPercent: 14,
    rotate: 5,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.from('.possibilities .section-head > *', {
    y: 80,
    opacity: 0,
    duration: .9,
    stagger: .14,
    scrollTrigger: { trigger: '.possibilities .section-head', start: 'top 78%' }
  });

  gsap.from('.possibilities .scenario', {
    y: 90,
    opacity: 0,
    duration: .85,
    stagger: .12,
    scrollTrigger: { trigger: '.scenario-rail', start: 'top 78%' }
  });

  gsap.from('#product .steps li', {
    x: -55,
    opacity: 0,
    duration: .7,
    stagger: .18,
    scrollTrigger: { trigger: '#product .steps', start: 'top 74%' }
  });

  gsap.from('.phone', {
    scale: .82,
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: '.phone-stage', start: 'top 78%' }
  });

  gsap.to('.phone', {
    y: -55,
    ease: 'none',
    scrollTrigger: { trigger: '.product', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
  });

  gsap.utils.toArray('.screens').forEach((section) => {
    gsap.from(section.querySelectorAll('figure'), {
      y: 70,
      opacity: 0,
      duration: .8,
      stagger: .1,
      scrollTrigger: { trigger: section.querySelector('figure'), start: 'top 82%' }
    });
  });

  gsap.from('.launch h2, .launch-card', {
    y: 90,
    opacity: 0,
    duration: .9,
    stagger: .13,
    scrollTrigger: { trigger: '.launch', start: 'top 68%' }
  });
}
