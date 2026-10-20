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

// The page after the first block is shown for one audience at a time: a business (the default, so a place owner
// never misses its part) or a resident (`?for=user`).
const roleButtons = [...document.querySelectorAll('[data-role-choice]')];

function setRole(role, remember = true) {
  document.body.dataset.role = role;
  roleButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.roleChoice === role)));
  // The header and hero links lead into the chosen audience's own sections.
  document.querySelectorAll('[data-href-user]').forEach((link) => { link.href = link.dataset[role === 'user' ? 'hrefUser' : 'hrefBusiness']; });
  if (remember) {
    const url = new URL(window.location.href);
    if (role === 'user') url.searchParams.set('for', 'user'); else url.searchParams.delete('for');
    window.history.replaceState(null, '', url);
  }
  // Scroll-driven animations measured the page with the other audience's sections in it.
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
}

roleButtons.forEach((button) => button.addEventListener('click', () => setRole(button.dataset.roleChoice)));
if (new URLSearchParams(window.location.search).get('for') === 'user') setRole('user', false);

// A link into a section of one audience switches to that audience first, so it never lands on a hidden block.
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => {
  const role = document.querySelector(link.getAttribute('href'))?.closest('[data-for]')?.dataset.for;
  if (role && role !== document.body.dataset.role) setRole(role);
}));

// The cabinet example for a business. Everything happens in the page: made-up data, nothing is sent anywhere.
// It opens as a computer or a phone after the visitor's own screen; the switch above it shows the other one.
const cabStage = document.querySelector('.cab-stage');
if (cabStage) {
  const frame = cabStage.querySelector('.cab-frame');
  const viewSwitch = document.querySelector('.cab-view');
  const DESK_WIDTH = 1100, DESK_HEIGHT = 680;

  // The computer view keeps its real proportions and shrinks to the column it sits in.
  function fitDesk() {
    if (cabStage.dataset.view !== 'desk') { frame.style.transform = ''; cabStage.style.height = ''; return; }
    const scale = Math.min(1, cabStage.clientWidth / DESK_WIDTH);
    frame.style.transform = scale < 1 ? `scale(${scale})` : '';
    frame.style.marginInline = scale < 1 ? '0' : 'auto';
    cabStage.style.height = `${Math.ceil(DESK_HEIGHT * scale) + 2}px`;
  }
  function setView(view) {
    cabStage.dataset.view = view;
    viewSwitch.dataset.choice = view;
    viewSwitch.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.cabView === view)));
    fitDesk();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  viewSwitch.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => setView(button.dataset.cabView)));
  setView(window.matchMedia('(max-width: 760px), (pointer: coarse) and (max-width: 1024px)').matches ? 'phone' : 'desk');
  new ResizeObserver(fitDesk).observe(cabStage);

  const main = frame.querySelector('.cab-main');
  const navButtons = [...frame.querySelectorAll('[data-cab]')];
  function openPane(name) {
    navButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.cab === name)));
    frame.querySelectorAll('[data-pane]').forEach((pane) => { pane.hidden = pane.dataset.pane !== name; });
    main.scrollTop = 0;
  }
  navButtons.forEach((button) => button.addEventListener('click', () => openPane(button.dataset.cab)));

  // «Ждут вас» on the home screen: each task done leaves a short note in its place.
  const waiting = frame.querySelector('[data-waiting]');
  function finishTask(name) {
    const row = frame.querySelector(`[data-task="${name}"]`);
    if (!row || row.classList.contains('is-done')) return;
    row.classList.add('is-done');
    const left = frame.querySelectorAll('[data-task]:not(.is-done)').length;
    waiting.textContent = String(left);
    waiting.hidden = left === 0;
    frame.querySelector('.cab-empty').hidden = left !== 0;
  }

  // Orders move step by step; the button always names the next step.
  const NEXT = ['Начать готовить', 'Готово к выдаче', 'Передать курьеру', 'Отметить доставленным'];
  const ordersBadge = frame.querySelector('[data-orders-badge]');
  function renderOrder(order) {
    const step = Number(order.dataset.step);
    order.querySelectorAll('.cab-steps li').forEach((li, index) => {
      li.classList.toggle('is-past', index < step);
      li.classList.toggle('is-now', index === step);
    });
    const button = order.querySelector('[data-do="advance"]');
    if (step >= 4) { button.textContent = 'Доставлен'; button.disabled = true; button.classList.remove('cab-btn-red'); }
    else if (step >= 0 && order.dataset.accepted) button.textContent = NEXT[step];
  }
  function advance(order) {
    if (!order.dataset.accepted) { order.dataset.accepted = 'true'; order.dataset.step = '0'; ordersBadge.hidden = true; finishTask('order'); }
    else order.dataset.step = String(Math.min(4, Number(order.dataset.step) + 1));
    renderOrder(order);
  }
  frame.querySelectorAll('.cab-order').forEach((order) => {
    if (order.dataset.order !== '24') order.dataset.accepted = 'true';
    renderOrder(order);
  });
  const newOrder = frame.querySelector('[data-order="24"]');

  // Bookings by day; the new booking from the home screen is tomorrow at 12:30.
  const DAYS = [
    [['10:00', 'Вера', 'Каппинг: кофе трёх стран', 'Елена'], ['13:00', 'Вера', 'Мастер-класс по латте-арту', 'Игорь'], ['17:00', null]],
    [['10:00', 'Вера', 'Каппинг: кофе трёх стран', 'Дина'], ['12:30', 'Вера', 'Мастер-класс по латте-арту', 'Марат', true], ['15:00', null], ['18:00', 'Илья', 'Мастер-класс по альтернативе', 'Ксения']],
    [['11:00', null], ['14:00', 'Илья', 'Мастер-класс по альтернативе', 'Тимур'], ['16:30', null]],
  ];
  const slots = frame.querySelector('[data-slots]');
  function renderDay(day) {
    slots.replaceChildren(...DAYS[day].map(([time, master, service, guest, fresh]) => {
      const li = document.createElement('li');
      if (!master) {
        li.className = 'is-free';
        li.innerHTML = `<time>${time}</time><div><strong>Свободно</strong><small>Гости видят это время в приложении</small></div>`;
      } else {
        if (fresh) li.className = 'is-new';
        li.innerHTML = `<time>${time}</time><div><strong>${guest}</strong><small>${service} · мастер ${master}</small></div>${fresh ? '<em class="cab-tag cab-tag-review">Новая</em>' : ''}`;
      }
      return li;
    }));
  }
  frame.querySelectorAll('[data-day]').forEach((button) => button.addEventListener('click', () => {
    frame.querySelectorAll('[data-day]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    renderDay(Number(button.dataset.day));
  }));
  renderDay(1);

  // Statistics: the period changes the figures and the bars.
  const PERIODS = {
    7: { kpi: ['3 887', '336', '82'], bars: [42, 55, 48, 61, 70, 92, 77] },
    30: { kpi: ['16 210', '1 402', '348'], bars: [30, 38, 35, 44, 40, 52, 47, 58, 50, 62, 57, 66, 60, 71, 64, 70, 76, 68, 74, 81, 72, 79, 86, 77, 83, 90, 82, 88, 94, 99] },
    90: { kpi: ['44 980', '3 911', '1 006'], bars: [22, 26, 31, 29, 35, 40, 38, 46, 52, 49, 58, 63, 71] },
  };
  const bars = frame.querySelector('.cab-bars');
  function renderPeriod(period) {
    const data = PERIODS[period];
    frame.querySelectorAll('[data-kpi]').forEach((cell) => { cell.textContent = data.kpi[cell.dataset.kpi]; });
    bars.replaceChildren(...data.bars.map((value) => { const bar = document.createElement('i'); bar.style.height = `${value}%`; return bar; }));
  }
  frame.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => {
    frame.querySelectorAll('[data-period]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    renderPeriod(button.dataset.period);
  }));
  renderPeriod(7);

  const TIPS = [
    'Лучшее время для следующей публикации — суббота, 08:30–09:30: тогда ваши подписчики активнее всего.',
    'Публикации со скидкой дают на 23 % больше маршрутов и звонков. Попробуйте акцию на будни до 10:00.',
    'Меню открывают чаще, чем две недели назад. Добавьте фото к трём самым популярным позициям.',
  ];
  let tip = 0;
  const tipText = frame.querySelector('[data-tip]');

  // Posts: a short composer that adds the new post to the list as «На проверке гласео».
  const composer = frame.querySelector('.cab-compose');
  const postList = frame.querySelector('[data-post-list]');
  composer.querySelectorAll('.cab-chips button').forEach((button) => button.addEventListener('click', () => {
    composer.querySelectorAll('.cab-chips button').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
  }));
  function addPost(title, kind) {
    const li = document.createElement('li');
    li.className = 'is-new';
    li.innerHTML = '<em class="cab-tag cab-tag-review">На проверке гласео</em><strong></strong><small></small>';
    li.querySelector('strong').textContent = title;
    li.querySelector('small').textContent = `${kind} · только что`;
    postList.prepend(li);
  }

  frame.addEventListener('click', (event) => {
    const action = event.target.closest('[data-do]')?.dataset.do;
    if (action === 'accept') { advance(newOrder); }
    else if (action === 'advance') advance(event.target.closest('.cab-order'));
    else if (action === 'open-bookings') { finishTask('booking'); openPane('bookings'); }
    else if (action === 'release') { finishTask('post'); addPost('Тыквенный латте вернулся', 'Новость'); }
    else if (action === 'compose') { composer.hidden = false; composer.querySelector('input').focus(); }
    else if (action === 'compose-cancel') composer.hidden = true;
    else if (action === 'compose-send') {
      const title = composer.querySelector('[data-compose-title]').value.trim() || 'Без заголовка';
      addPost(title, composer.querySelector('.cab-chips [aria-pressed="true"]').dataset.kind);
      composer.hidden = true;
    } else if (action === 'tip') { tip = (tip + 1) % TIPS.length; tipText.textContent = TIPS[tip]; }
  });
}

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
