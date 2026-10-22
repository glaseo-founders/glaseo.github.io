// The resident app in the phone of «Как работает» (#app-demo). Drawn after the real app — its screens, tab bar and
// wording — but not its code: places, posts, prices and people are made up, and nothing leaves the page.
// Like the cabinet example it speaks both languages itself (t(ru, en)) and redraws when <html lang> changes.
(() => {
  const root = document.getElementById('app-demo');
  if (!root) return;
  root.setAttribute('translate', 'no');

  let lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const t = (ru, en) => (lang === 'en' ? en : ru);
  const T = (pair) => t(pair[0], pair[1]);
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => `${n.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU')} ₽`;

  const ICON = {
    feed: 'M4 6h16 M4 12h16 M4 18h10', places: 'M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z M12 7.3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4',
    map: 'M9 5 4 7v12l5-2 6 2 5-2V5l-5 2-6-2Z M9 5v12 M15 7v12', chats: 'M4 5h16v11H9l-5 4z M8 9h8 M8 12h5', profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M4 21v-2a8 8 0 0 1 16 0v2',
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z', down: 'M7 4h10v9l-4 7a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2.3L5 6a2 2 0 0 1 2-2Z M17 4h3v9h-3',
    eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 19 2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6', walk: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3 M10 21l2-6 3 3v4 M9 9l3-2 3 3 3 1 M12 7l-2 6',
    car: 'M5 15V11l2-5h10l2 5v4 M4 15h16v3H4z M7 18v2 M17 18v2', bag: 'M5 8h14l-1.5 12h-11z M9 8V6a3 3 0 0 1 6 0v2', calendar: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
    chat: 'M4 5h16v11H9l-5 4z', phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1', route: 'M6 19V9a4 4 0 0 1 4-4h8 M14 1l4 4-4 4',
    more: 'M5 12h.01 M12 12h.01 M19 12h.01', gift: 'M4 8h16v11H4z M4 12h16 M12 8v11 M12 8c-1.5-3-5-3-5-1s3 1 5 1c1.5-3 5-3 5-1s-3 1-5 1', chev: 'M9 6l6 6-6 6',
    back: 'M15 6l-6 6 6 6', down2: 'M6 9l6 6 6-6', plus: 'M12 5v14 M5 12h14', minus: 'M5 12h14', list: 'M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 21h4', filter: 'M4 6h16 M7 12h10 M10 18h4', sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v2 M12 20v2 M4 12H2 M22 12h-2 M5 5l1.5 1.5 M17.5 17.5 19 19 M5 19l1.5-1.5 M17.5 6.5 19 5',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18 M3 12h18 M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9', help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18 M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17h.01',
    pin: 'M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Z', send: 'M4 12 20 4l-6 16-3-7z M11 13l9-9', support: 'M4 5h16v11H9l-5 4z M9 10h6',
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[n]}"/></svg>`;

  // ---------- Made-up places ----------
  const NOW = 12 * 60 + 10; // 12:10 in the example
  const CATS = [['all', ['Все', 'All']], ['food', ['Еда и напитки', 'Food and drinks']], ['culture', ['Культура', 'Culture']], ['books', ['Книги', 'Books']], ['goods', ['Товары', 'Goods']], ['services', ['Услуги', 'Services']]];
  const CAT_NAME = Object.fromEntries(CATS);
  const PLACES = {
    art: { name: ['Выставочный зал', 'Exhibition hall'], logo: ['В', 'E'], cats: ['culture'], hours: [10, 20], walk: [2, '150 м', '150 m'], car: 1, xy: [34, 26], addr: ['Университетская, 1', 'Universitetskaya 1'], about: ['Графика, фотография и лекции по выходным. Вход на выставки свободный.', 'Graphic art, photography and weekend lectures. Free entry to exhibitions.'] },
    cafe: { name: ['Кофейня у воды', 'Café by the water'], logo: ['≈', '≈'], cats: ['food'], hours: [8, 21], walk: [6, '450 м', '450 m'], car: 1, xy: [62, 22], delivery: true, kbju: true, addr: ['Университетская, 5', 'Universitetskaya 5'], about: ['Кофейня у набережной: свежая обжарка, завтраки весь день и мастер-классы по выходным.', 'A café by the embankment: fresh roast, breakfast all day and weekend workshops.'], bonus: ['Кешбэк 5 % баллами и до 7 % на следующих уровнях; баллами можно оплатить до 30 % чека, каждый 8-й кофе — в подарок.', '5% cashback in points, up to 7% on higher levels; points pay up to 30% of a bill, every 8th coffee is free.'] },
    bakery: { name: ['Пекарня «Колос»', 'Kolos bakery'], logo: ['К', 'K'], cats: ['food'], hours: [7.5, 20], walk: [9, '700 м', '700 m'], car: 2, xy: [24, 58], delivery: true, kbju: true, addr: ['Спортивная, 106', 'Sportivnaya 106'], about: ['Хлеб на закваске и выпечка с утра. Привозим по Иннополису.', 'Sourdough bread and morning pastries. We deliver around Innopolis.'], bonus: ['Третья выпечка — в подарок.', 'The third pastry is free.'] },
    workshop: { name: ['Мастерская «Винтик»', 'Vintik workshop'], logo: ['М', 'V'], cats: ['services'], hours: [11, 19], walk: [11, '900 м', '900 m'], car: 2, xy: [52, 70], booking: true, addr: ['Квантовый бульвар, 3', 'Kvantovy Boulevard 3'], about: ['Ремонт и настройка велосипедов, самокатов и ноутбуков. Запись — в приложении.', 'Repair and tuning of bikes, scooters and laptops. Book in the app.'] },
    books: { name: ['Книжный', 'Bookshop'], logo: ['Б', 'B'], cats: ['culture', 'books'], hours: [13, 22], walk: [13, '1,1 км', '1.1 km'], car: 2, xy: [80, 52], addr: ['Спортивная, 114', 'Sportivnaya 114'], about: ['Нон-фикшн, комиксы и детские книги. По четвергам — книжный клуб.', 'Non-fiction, comics and children\'s books. Book club on Thursdays.'] },
    flowers: { name: ['Цветы на Спортивной', 'Flowers on Sportivnaya'], logo: ['Ц', 'F'], cats: ['goods'], hours: [9, 19], walk: [14, '1,2 км', '1.2 km'], car: 3, xy: [70, 84], addr: ['Спортивная, 120', 'Sportivnaya 120'], about: ['Букеты, комнатные растения и керамика.', 'Bouquets, house plants and ceramics.'] },
  };
  const ORDER = ['art', 'cafe', 'bakery', 'workshop', 'books', 'flowers'];
  const hoursText = (p) => p.hours.map((h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`).join('–');
  const isOpen = (p) => NOW >= p.hours[0] * 60 && NOW < p.hours[1] * 60;
  const MENUS = {
    cafe: [
      { id: 'c1', n: ['Фильтр-кофе', 'Filter coffee'], d: ['Зерно недели', 'Bean of the week'], k: '5 · 0,3 · 0 · 0,5', s: ['300 мл', '300 ml'], p: 250 },
      { id: 'c2', n: ['Капучино', 'Cappuccino'], d: ['Двойной эспрессо и молоко', 'Double espresso and milk'], k: '120 · 6 · 6,5 · 9', s: ['300 мл', '300 ml'], p: 290 },
      { id: 'c3', n: ['Матча с жасмином', 'Jasmine matcha'], d: ['Горячая или со льдом', 'Hot or iced'], k: '180 · 6,5 · 7 · 22', s: ['350 мл', '350 ml'], p: 390 },
      { id: 'c4', n: ['Сырники', 'Syrniki'], d: ['Со сметаной и сезонным вареньем', 'With sour cream and seasonal jam'], k: '410 · 24 · 18,5 · 37', s: ['180 г', '180 g'], p: 450 },
      { id: 'c5', n: ['Тыквенный пирог', 'Pumpkin pie'], d: ['С корицей и грецким орехом', 'With cinnamon and walnut'], k: '320 · 5 · 14 · 44', s: ['140 г', '140 g'], p: 280 },
    ],
    bakery: [
      { id: 'b1', n: ['Багет на закваске', 'Sourdough baguette'], d: ['Печем к 8 утра', 'Out of the oven by 8 am'], k: '250 · 8 · 1 · 50', s: ['250 г', '250 g'], p: 120 },
      { id: 'b2', n: ['Круассан', 'Croissant'], d: ['Сливочный', 'Butter'], k: '290 · 6 · 16 · 31', s: ['70 г', '70 g'], p: 150 },
      { id: 'b3', n: ['Ватрушка с творогом', 'Curd bun'], d: ['Теплая до обеда', 'Warm until lunch'], k: '260 · 10 · 9 · 34', s: ['100 г', '100 g'], p: 110 },
    ],
  };
  const DISH = Object.fromEntries(Object.values(MENUS).flat().map((d) => [d.id, d]));

  const POSTS = [
    { id: 1, place: 'cafe', kind: 'news', ago: ['1 ч назад', '1 h ago'], title: ['Новое сезонное меню', 'New seasonal menu'], text: ['Этой осенью пробуем яркие вкусы: матча с жасмином, клубника-базилик и холодный тоник с цитрусами.', 'This autumn we try bright flavours: jasmine matcha, strawberry-basil and a cold citrus tonic.'], more: ['Все напитки — на спешелти-зерне, с сезонными ингредиентами. Заходите пробовать или закажите домой.', 'All drinks are on specialty beans with seasonal ingredients. Come and try them or order home.'], img: 'matcha', views: 148 },
    { id: 2, place: 'books', kind: 'event', until: ['до 23 октября', 'until 23 October'], ago: ['3 ч назад', '3 h ago'], title: ['Встреча книжного клуба в четверг', 'Book club meets on Thursday'], text: ['В четверг в 19:00 обсуждаем «Пикник на обочине». Приходите, даже если не дочитали.', 'On Thursday at 19:00 we discuss "Roadside Picnic". Come even if you have not finished it.'], views: 96 },
    { id: 3, place: 'art', kind: 'news', ago: ['5 ч назад', '5 h ago'], title: ['Открываем новую выставку', 'A new exhibition opens'], text: ['С пятницы в большом зале — графика и скульптура молодых художников. Вход свободный.', 'From Friday the main hall shows graphic art and sculpture by young artists. Free entry.'], img: 'gallery', views: 212 },
    { id: 4, place: 'cafe', kind: 'offer', until: ['до 24 октября', 'until 24 October'], ago: ['8 ч назад', '8 h ago'], title: ['Второй кофе в подарок до 10:00', 'Second coffee free before 10:00'], text: ['По будням до десяти утра к любому завтраку — второй фильтр-кофе бесплатно.', 'Weekdays before ten — a second filter coffee free with any breakfast.'], views: 187 },
    { id: 5, place: 'flowers', kind: 'offer', until: ['до 26 октября', 'until 26 October'], ago: ['20 ч назад', '20 h ago'], title: ['Скидка 20 % на кашпо', '20% off planters'], text: ['До конца недели все керамические кашпо — на пятую часть дешевле.', 'Until the end of the week all ceramic planters are a fifth cheaper.'], views: 73 },
    { id: 6, place: 'workshop', kind: 'news', ago: ['вчера', 'yesterday'], title: ['Готовим велосипеды к зиме', 'Getting bikes ready for winter'], text: ['Чистка, смазка и проверка тормозов за час. Запишитесь на удобное время в приложении.', 'Cleaning, oiling and a brake check in an hour. Book a time that suits you in the app.'], views: 54 },
  ];
  const SOON = [
    { place: 'art', kind: 'event', when: ['23 окт., 19:00', '23 Oct, 19:00'], title: ['Лекция «Как смотреть современное искусство»', 'Lecture "How to look at contemporary art"'] },
    { place: 'cafe', kind: 'offer', when: ['24 окт., 08:00', '24 Oct, 08:00'], title: ['Подробности появятся в момент выхода', 'Details appear when it goes out'] },
  ];
  const KIND = { news: null, offer: ['Акция', 'Offer'], event: ['Событие', 'Event'] };

  // ---------- State ----------
  const S = {
    tab: 'feed', stack: [], feed: 'all', cat: 'all', pcat: 'all', pf: new Set(), q: '', place: null, ptab: 'news',
    follows: new Set(), liked: new Set(), disliked: new Set(), sheet: null, cart: {}, addr: '', note: false,
    chats: [], chat: null, pin: null, route: null, notify: true, wallet: {}, saved: [],
    book: { step: 1, master: null, day: 2, time: null },
  };
  const placeOf = (id) => PLACES[id];
  const cartFor = (pid) => Object.entries(S.cart).filter(([id, n]) => n > 0 && MENUS[pid]?.some((d) => d.id === id));
  const cartSum = (pid) => cartFor(pid).reduce((sum, [id, n]) => sum + DISH[id].p * n, 0);
  const cartCount = (pid) => cartFor(pid).reduce((sum, [, n]) => sum + n, 0);

  function toast(text) {
    const el = root.querySelector('.rd-toast');
    el.textContent = text; el.classList.add('is-on');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('is-on'), 2400);
  }

  // ---------- Screens ----------
  const tabHead = (title, extra = '') => `<header class="rd-head"><span class="rd-logo">гласео<i>.</i></span>${title ? `<span class="rd-title">${title}</span>` : ''}${extra}${extra ? `<button type="button" class="rd-city-pin" data-act="city" aria-label="${t('Город: Иннополис', 'City: Innopolis')}" title="${t('Город: Иннополис', 'City: Innopolis')}">${icon('pin')}<i></i></button>` : `<button type="button" class="rd-city" data-act="city">${t('Иннополис', 'Innopolis')} ${icon('down2').replace('<svg', '<svg style="width:12px;height:12px"')}</button>`}</header>`;
  const backHead = (label, title = '') => `<header class="rd-head"><button type="button" class="rd-back" data-act="back">${icon('back').replace('<svg', '<svg style="width:16px;height:16px"')}${label}</button>${title ? `<span class="rd-title">${title}</span>` : ''}</header>`;
  const chips = (act, list, current) => `<div class="rd-chips">${list.map(([v, l]) => `<button type="button" data-act="${act}" data-v="${v}" aria-pressed="${String(current instanceof Set ? current.has(v) : current === v)}">${T(l)}</button>`).join('')}</div>`;

  function postCard(p) {
    const pl = placeOf(p.place);
    const kicker = KIND[p.kind] ? `<p class="rd-kicker">${T(KIND[p.kind])}${p.until ? ` · ${T(p.until)}` : ''}</p>` : '';
    return `<article class="rd-post"><div class="rd-post-head"><span class="rd-ava ${p.place === 'cafe' ? '' : 'rd-ava-line'}">${T(pl.logo)}</span><div><b>${T(pl.name)}</b><small>${T(p.ago)}</small></div><button type="button" class="rd-more" data-act="post" data-v="${p.id}" aria-label="${t('Еще', 'More')}">···</button></div>
      ${kicker}<div class="rd-post-body"><div><h3>${T(p.title)}</h3><p>${T(p.text)}</p></div>${p.img ? `<img class="rd-thumb" src="assets/proto/${p.img}.jpg" alt="" loading="lazy">` : ''}</div>
      <div class="rd-post-foot"><u data-act="post" data-v="${p.id}">${t('Подробнее', 'More')}</u>${p.kind !== 'news' ? `<button type="button" class="rd-icon-btn" data-act="like" data-v="${p.id}" aria-pressed="${S.liked.has(p.id)}" aria-label="${t('Интересно', 'Interested')}">${icon('heart')}</button><button type="button" class="rd-icon-btn" data-act="dislike" data-v="${p.id}" aria-pressed="${S.disliked.has(p.id)}" aria-label="${t('Не интересно', 'Not interested')}">${icon('down')}</button>` : ''}<span class="rd-views">${icon('eye')}${p.views + (S.liked.has(p.id) ? 1 : 0)}</span></div></article>`;
  }

  function screenFeed() {
    const seg = `<div class="rd-seg"><button type="button" data-act="feedtab" data-v="all" aria-pressed="${S.feed === 'all'}">${t('Все', 'All')}</button><button type="button" data-act="feedtab" data-v="subs" aria-pressed="${S.feed === 'subs'}">${t('Подписки', 'Following')}</button></div>`;
    const inCat = (pid) => S.cat === 'all' || placeOf(pid).cats.includes(S.cat);
    let body;
    if (S.feed === 'subs') {
      const list = POSTS.filter((p) => S.follows.has(p.place));
      body = list.length ? list.map(postCard).join('') : `<div class="rd-pad"><div class="rd-empty"><i></i><h3>${t('Подпишись на любимые места', 'Follow your favourite places')}</h3><p>${t('Новости мест, на которые ты подписан, собираются здесь.', 'News from the places you follow gathers here.')}</p><button type="button" class="rd-btn rd-btn-red rd-btn-wide" data-act="tab" data-v="places">${t('Открыть места', 'Open places')}</button></div></div>`;
    } else {
      const soon = SOON.filter((s) => inCat(s.place));
      const list = POSTS.filter((p) => inCat(p.place));
      body = `${chips('cat', CATS, S.cat)}${soon.length ? `<div class="rd-pad" style="padding-bottom:0"><p class="rd-label">${t('Скоро', 'Soon')}</p></div><div class="rd-soon">${soon.map((s, i) => `<article><p class="rd-kicker">${T(KIND[s.kind])} · ${T(s.when)}</p><b>${T(placeOf(s.place).name)}</b><small>${T(s.title)}</small><span class="rd-acts"><button type="button" class="rd-round" data-act="soonlike" data-v="${i}" aria-pressed="${S.liked.has(`s${i}`)}" aria-label="${t('Интересно', 'Interested')}">${icon('heart')}</button><button type="button" class="rd-round" data-act="toast" data-v="less" aria-label="${t('Не интересно', 'Not interested')}">${icon('down')}</button></span></article>`).join('')}</div>` : ''}
        ${list.map(postCard).join('') || `<div class="rd-pad"><div class="rd-empty"><i></i><h3>${t('Пока тихо', 'Quiet for now')}</h3><p>${t('В этой категории сегодня нет публикаций.', 'No posts in this category today.')}</p></div></div>`}`;
    }
    return { head: tabHead('', seg), body };
  }

  function screenPlaces() {
    const FILTERS = [['open', ['Открыто сейчас', 'Open now']], ['delivery', ['Доставка', 'Delivery']], ['booking', ['Запись', 'Booking']], ['kbju', ['С КБЖУ', 'With nutrition']], ['mine', ['Мои', 'Mine']]];
    const q = S.q.trim().toLowerCase();
    const list = ORDER.filter((id) => {
      const p = placeOf(id);
      if (S.pcat !== 'all' && !p.cats.includes(S.pcat)) return false;
      if (q && !`${p.name[0]} ${p.name[1]}`.toLowerCase().includes(q)) return false;
      if (S.pf.has('open') && !isOpen(p)) return false;
      if (S.pf.has('delivery') && !p.delivery) return false;
      if (S.pf.has('booking') && !p.booking) return false;
      if (S.pf.has('kbju') && !p.kbju) return false;
      if (S.pf.has('mine') && !S.follows.has(id)) return false;
      return true;
    });
    const row = (id) => { const p = placeOf(id); return `<button type="button" class="rd-place-row" data-act="place" data-v="${id}"><span class="rd-ava rd-ava-line">${T(p.logo)}</span><span><b>${T(p.name)}</b><small>${icon('walk')}<strong>${p.walk[0]} ${t('мин', 'min')} · ${t(p.walk[1], p.walk[2])}</strong>${icon('car')}${p.car} ${t('мин', 'min')}</small><small>${isOpen(p) ? `<span class="rd-open-now">${hoursText(p)}</span>` : `${t('Закрыто · откроется в', 'Closed · opens at')} ${hoursText(p).split('–')[0]}`} · ${p.cats.map((c) => T(CAT_NAME[c])).join(' · ')}</small></span><span>${p.delivery ? icon('bag') : ''}${p.booking ? icon('calendar') : ''}${icon('chev')}</span></button>`; };
    return {
      head: tabHead(t('Места рядом', 'Places nearby')),
      body: `<div class="rd-search"><input class="rd-input" data-input="q" value="${esc(S.q)}" placeholder="${t('Поиск по названию', 'Search by name')}"><button type="button" class="rd-ibtn" data-act="tab" data-v="map" aria-label="${t('На карте', 'On the map')}" title="${t('На карте', 'On the map')}">${icon('map')}</button></div>
        ${chips('pcat', CATS, S.pcat)}<div style="margin-top:-8px">${chips('pf', FILTERS, S.pf)}</div>
        <div class="rd-pad"><p class="rd-label">${t('Сначала ближайшие · пешком', 'Closest first · on foot')}</p>${list.map(row).join('') || `<div class="rd-empty"><i></i><h3>${t('Ничего не нашлось', 'Nothing found')}</h3><p>${t('Попробуй убрать часть фильтров.', 'Try removing some filters.')}</p></div>`}</div>`,
    };
  }

  function screenPlace() {
    const id = S.place; const p = placeOf(id);
    const followed = S.follows.has(id);
    const tabs = [['news', ['Новости', 'News']], ...(MENUS[id] ? [['menu', ['Меню', 'Menu']]] : []), ['about', ['О месте', 'About']]];
    let content = '';
    if (S.ptab === 'menu' && MENUS[id]) {
      content = `<p class="rd-note" style="margin:2px 0 6px">${t('Доставляем по городу за 40–60 минут. Оплата — заведению напрямую.', 'We deliver around town in 40–60 minutes. You pay the place directly.')}</p>${MENUS[id].map((d) => { const n = S.cart[d.id] || 0; const [kc, b, f, c] = d.k.split(' · ');
        return `<div class="rd-dish"><div><b>${T(d.n)}</b><small>${T(d.d)}</small><small class="rd-kbju">${kc} ${t('ккал', 'kcal')} · ${t('Б', 'P')} ${b} · ${t('Ж', 'F')} ${f} · ${t('У', 'C')} ${c} · ${t('на порцию', 'per portion')}</small><strong>${money(d.p)} · ${T(d.s)}</strong></div>
          <div class="rd-qty">${n ? `<button type="button" data-act="dec" data-v="${d.id}" aria-label="−">${icon('minus')}</button><b>${n}</b>` : ''}<button type="button" class="${n ? 'rd-plus' : ''}" data-act="inc" data-v="${d.id}" aria-label="+">${icon('plus')}</button></div></div>`; }).join('')}`;
    } else if (S.ptab === 'about') {
      content = `<div class="rd-about"><p>${T(p.about)}</p><p><b>${T(p.addr)}</b></p></div><div class="rd-hours">${[['Пн–Пт', 'Mon–Fri'], ['Сб', 'Sat'], ['Вс', 'Sun']].map((d) => `<div><span>${T(d)}</span><span>${hoursText(p)}</span></div>`).join('')}</div>`;
    } else {
      const list = POSTS.filter((x) => x.place === id);
      content = list.length ? `<div style="margin:0 -16px">${list.map(postCard).join('')}</div>` : `<p class="rd-note">${t('Пока без публикаций.', 'No posts yet.')}</p>`;
    }
    const n = cartCount(id);
    const bar = p.delivery ? (n ? `<div class="rd-cartbar"><div><b>${n} ${t('поз.', 'items')} · ${money(cartSum(id))}</b><small>${t('Доставку посчитаем на следующем шаге', 'Delivery is counted at the next step')}</small></div><button type="button" class="rd-btn rd-btn-red" data-act="checkout">${t('Оформить', 'Check out')}</button></div>`
      : `<div class="rd-cartbar"><b>${t('Доставка из меню', 'Delivery from the menu')}</b><button type="button" class="rd-btn rd-btn-red" data-act="ptab" data-v="menu">${t('Заказать', 'Order')}</button></div>`)
      : p.booking ? `<div class="rd-cartbar"><b>${t('Запись к специалисту', 'Book a specialist')}</b><button type="button" class="rd-btn rd-btn-red" data-act="booking">${t('Записаться', 'Book')}</button></div>` : '';
    return {
      head: backHead(t('Места', 'Places')),
      body: `<div class="rd-pad"><div class="rd-place-top"><span class="rd-ava">${T(p.logo)}</span><div><h2>${T(p.name)}</h2><small>${p.cats.map((c) => T(CAT_NAME[c])).join(' · ')}</small><b>${hoursText(p)}</b></div></div>
        <button type="button" class="rd-btn ${followed ? 'rd-btn-line' : 'rd-btn-ink'} rd-btn-wide" data-act="follow" data-v="${id}">${followed ? t('Вы подписаны', 'Following') : t('Подписаться', 'Follow')}</button>
        <div class="rd-actions"><button type="button" data-act="write" data-v="${id}">${icon('chat')}${t('Чат', 'Chat')}</button><button type="button" data-act="toast" data-v="call">${icon('phone')}${t('Звонок', 'Call')}</button><button type="button" data-act="route" data-v="${id}">${icon('route')}${t('Маршрут', 'Route')}</button><button type="button" data-act="toast" data-v="more">${icon('more')}${t('Еще', 'More')}</button></div>
        ${p.bonus ? `<div class="rd-bonus"><i>${icon('gift')}</i><div><b>${t('Бонусы заведения', 'The place\'s bonuses')}</b><small>${T(p.bonus)}</small></div><span data-act="tab" data-v="profile" style="cursor:pointer" aria-label="${t('Карта гостя', 'Guest card')}">${icon('chev')}</span></div>` : ''}
        <div class="rd-tabrow">${tabs.map(([v, l]) => `<button type="button" data-act="ptab" data-v="${v}" aria-pressed="${S.ptab === v}">${T(l)}</button>`).join('')}</div>${content}</div>`,
      foot: bar,
    };
  }

  function screenCheckout() {
    const id = S.place; const items = cartFor(id); const sum = cartSum(id); const n = cartCount(id);
    const ADDR = [['Университетская, 7', 'Universitetskaya 7'], ['Спортивная, 114', 'Sportivnaya 114'], ['Квантовый бульвар, 3', 'Kvantovy Boulevard 3']];
    return {
      head: backHead(T(placeOf(id).name), t('Оформление заказа', 'Checkout')),
      body: `<div class="rd-pad"><p class="rd-sec">${t('Состав', 'Items')}</p>${items.map(([did, k]) => `<div class="rd-dish"><div><b>${T(DISH[did].n)}</b><strong>${money(DISH[did].p)}</strong></div><div class="rd-qty"><button type="button" data-act="dec" data-v="${did}" aria-label="−">${icon('minus')}</button><b>${k}</b><button type="button" class="rd-plus" data-act="inc" data-v="${did}" aria-label="+">${icon('plus')}</button></div></div>`).join('') || `<p class="rd-note" style="padding:10px 0">${t('Корзина пуста.', 'The cart is empty.')}</p>`}
        <p style="margin:10px 0 4px"><u data-act="back" style="cursor:pointer;font-weight:800;font-size:13px">${t('Добавить из меню', 'Add from the menu')}</u></p>
        ${placeOf(id).bonus ? `<p class="rd-sec">${t('Бонусы и скидки', 'Bonuses and discounts')}</p><p class="rd-note">${t(`За заказ начислится ${Math.round(sum * 0.05)} баллов — после оплаты`, `${Math.round(sum * 0.05)} points for this order — after payment`)}</p>` : ''}
        <p class="rd-sec">${t('Куда привезти', 'Where to deliver')}</p><input class="rd-input rd-input-box" data-input="addr" value="${esc(S.addr)}" placeholder="${t('Улица и дом', 'Street and house')}">
        <div class="rd-addr">${ADDR.map((a) => `<button type="button" data-act="addr" data-v="${esc(T(a))}" aria-pressed="${S.addr === T(a)}">${T(a)}</button>`).join('')}</div>
        <p class="rd-note" style="margin-top:10px">${t('Цена доставки зависит от адреса.', 'The delivery price depends on the address.')}</p>
        <p class="rd-note" style="margin-top:12px">${t('Заведение проверит заказ и пришлет в чат счет со ссылкой или QR для оплаты. Гласео деньги не принимает.', 'The place checks the order and sends an invoice with a link or QR to the chat. Glaseo takes no money.')}</p></div>`,
      foot: `<div class="rd-cartbar"><div><b>${n} ${t('поз.', 'items')} · ${money(sum)}</b>${S.addr.trim() ? `<small>${esc(S.addr)}</small>` : `<small class="rd-down">${t('Укажи адрес доставки', 'Enter a delivery address')}</small>`}</div><button type="button" class="rd-btn rd-btn-red" data-act="send-order" ${S.addr.trim() && n ? '' : 'disabled'}>${t('Отправить', 'Send')}</button></div>`,
    };
  }

  const MASTERS = [['any', ['Любой мастер', 'Any specialist'], ['', '']], ['ilya', ['Илья', 'Ilya'], ['Велосипеды и самокаты', 'Bikes and scooters']], ['vera', ['Вера', 'Vera'], ['Ноутбуки и телефоны', 'Laptops and phones']]];
  const DAYS = [['Вт', 'Tue', 21], ['Ср', 'Wed', 22], ['Чт', 'Thu', 23], ['Пт', 'Fri', 24], ['Сб', 'Sat', 25], ['Пн', 'Mon', 27], ['Вт', 'Tue', 28]];
  const TIMES = ['11:00', '12:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:00'];
  const busy = (d, i) => (d * 3 + i * 5) % 7 === 0;
  function screenBooking() {
    const b = S.book;
    const progress = `<div class="rd-progress">${[1, 2, 3].map((i) => `<i class="${i <= b.step ? 'is-on' : ''}"></i>`).join('')}</div><p class="rd-step">${t(`Шаг ${b.step} из 3`, `Step ${b.step} of 3`)}</p>`;
    let body = '';
    if (b.step === 1) body = `<h2 class="rd-h2">${t('Выбери мастера', 'Pick a specialist')}</h2>${MASTERS.map(([v, n, d]) => `<button type="button" class="rd-master" data-act="master" data-v="${v}"><span class="rd-ava rd-ava-line">${v === 'any' ? '✦' : T(n)[0]}</span><span style="flex:1"><b>${T(n)}</b><small>${d[0] ? `${T(d)} · ` : ''}${t('ближайшее: завтра в 11:00', 'next: tomorrow at 11:00')}</small></span>${icon('chev')}</button>`).join('')}`;
    else if (b.step === 2) body = `<h2 class="rd-h2">${t('Выбери день и время', 'Pick a day and time')}</h2><span class="rd-badge">${T(MASTERS.find((m) => m[0] === b.master)[1])}</span><p class="rd-label">${t('Октябрь', 'October')}</p>
      <div class="rd-days">${DAYS.map(([ru, en, n], i) => `<button type="button" data-act="day" data-v="${i}" aria-pressed="${b.day === i}">${t(ru, en)}<b>${n}</b></button>`).join('')}</div>
      <div class="rd-times">${TIMES.map((tm, i) => `<button type="button" data-act="time" data-v="${tm}" aria-pressed="${b.time === tm}" ${busy(b.day, i) ? 'disabled' : ''}>${tm}</button>`).join('')}</div><p class="rd-note">${t('Время московское. Визит длится 1 ч.', 'Moscow time. The visit takes 1 h.')}</p>`;
    else { const d = DAYS[b.day]; body = `<h2 class="rd-h2">${t('Проверь и запишись', 'Check and book')}</h2><div class="rd-summary"><b>${t(d[0], d[1])}, ${d[2]} ${t('октября', 'October')}, ${b.time}</b><span>${t('Подготовка велосипеда к зиме · 1 ч', 'Winter bike service · 1 h')}</span><span>${T(MASTERS.find((m) => m[0] === b.master)[1])} · ${money(1500)}</span><span class="rd-note">${T(PLACES.workshop.addr)}</span></div><p class="rd-note">${t('Запись откроется сразу. Если месту понадобится перенести визит, без твоего согласия ничего не изменится.', 'The booking opens at once. If the place needs to move the visit, nothing changes without your consent.')}</p>`; }
    const foot = b.step === 2 ? `<div class="rd-cartbar"><div><b>${b.time ? `${t(DAYS[b.day][0], DAYS[b.day][1])} ${DAYS[b.day][2]}, ${b.time}` : t('Выбери время', 'Pick a time')}</b></div><button type="button" class="rd-btn rd-btn-red" data-act="bstep" data-v="3" ${b.time ? '' : 'disabled'}>${t('Дальше', 'Next')}</button></div>`
      : b.step === 3 ? `<div class="rd-cartbar" style="justify-content:stretch"><button type="button" class="rd-btn rd-btn-red rd-btn-wide" data-act="book">${t('Записаться', 'Book')}</button></div>` : '';
    return { head: backHead(T(PLACES.workshop.name), t('Запись', 'Booking')), body: `<div class="rd-pad">${progress}${body}</div>`, foot };
  }

  function screenMap() {
    const pins = ORDER.map((id) => { const p = placeOf(id); return `<button type="button" class="rd-pin" style="left:${p.xy[0]}%;top:${p.xy[1]}%" data-act="pin" data-v="${id}" aria-pressed="${S.pin === id}"><i></i>${T(p.name)}</button>`; }).join('');
    const sel = S.pin && placeOf(S.pin);
    const route = S.route ? `<svg class="rd-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M46 46 L46 ${placeOf(S.route).xy[1]} L${placeOf(S.route).xy[0]} ${placeOf(S.route).xy[1]}" style="fill:none;stroke:#2a6be0;stroke-width:1.2;stroke-dasharray:2 1.4;vector-effect:none"/></svg>` : '';
    return {
      head: tabHead(t('Карта', 'Map')),
      body: null,
      map: `<div class="rd-map">${chips('mcat', CATS.slice(0, 4), 'all').replace('class="rd-chips"', 'class="rd-chips" style="position:absolute;z-index:2;left:0;right:0;top:0;padding-top:10px"')}
        <svg class="rd-map-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect width="100" height="100" fill="#ecebe5"/><path d="M0 70 Q30 62 48 75 T100 66 V100 H0Z" fill="#dfe8d6"/><path d="M70 0 Q78 20 100 24 V0Z" fill="#d6e2ea"/>
          <g fill="#e0dfd8">${Array.from({ length: 22 }, (_, i) => `<rect x="${(i * 37) % 92 + 2}" y="${(i * 23) % 88 + 4}" width="${5 + (i % 3) * 2}" height="${4 + (i % 4)}" rx=".6"/>`).join('')}</g>
          <g stroke="#fff" stroke-linecap="round" fill="none"><path d="M0 46 H100" stroke-width="3"/><path d="M46 0 V100" stroke-width="3"/><path d="M10 0 Q28 40 18 100" stroke-width="1.6"/><path d="M0 20 Q50 30 100 12" stroke-width="1.6"/><path d="M60 46 Q75 70 100 80" stroke-width="1.6"/></g>
          <g font-size="2.3" fill="#9a9a93" font-family="Geist,Arial"><text x="60" y="44.5">${t('Университетская', 'Universitetskaya')}</text><text x="47.5" y="92" transform="rotate(-90 47.5 92)">${t('Спортивная', 'Sportivnaya')}</text></g></svg>
        ${route}<span class="rd-me" style="left:46%;top:46%"></span>${pins}
        <div class="rd-map-ctl" style="top:58px"><button type="button" data-act="toast" data-v="zoom">+</button><button type="button" data-act="toast" data-v="zoom">−</button></div>
        <button type="button" class="rd-map-list" style="top:58px" data-act="tab" data-v="places">${icon('list').replace('<svg', '<svg style="width:15px;height:15px"')}${t('Списком', 'As a list')}</button>
        ${sel ? `<div class="rd-map-card"><b>${T(sel.name)}</b><small>${sel.walk[0]} ${t('мин пешком', 'min on foot')} · ${hoursText(sel)}</small><button type="button" class="rd-btn rd-btn-ink" data-act="place" data-v="${S.pin}">${t('Открыть', 'Open')}</button></div>` : `<span class="rd-map-note">${t(`Мест на карте: ${ORDER.length}. Нажми на точку.`, `${ORDER.length} places on the map. Tap a point.`)}</span>`}</div>`,
    };
  }

  function chatState(c) {
    if (c.kind === 'order') return c.state === 'sent' ? ['warn', t('Заказ отправлен', 'Order sent')] : c.state === 'invoice' ? ['wait', t('Ждет оплаты', 'Awaiting payment')] : c.state === 'done' ? ['good', t('Доставлен', 'Delivered')] : ['good', t('Оплачен', 'Paid')];
    if (c.kind === 'booking') return ['good', t('Записан', 'Booked')];
    return ['', t('Прочитано', 'Read')];
  }
  function screenChats() {
    const support = `<button type="button" class="rd-chat-row" data-act="toast" data-v="support"><span class="rd-ava">${icon('support').replace('<svg', '<svg style="width:16px;height:16px"')}</span><span><b>${t('Поддержка Гласео', 'Glaseo support')}</b><small>${t('Вопросы команде и твои жалобы', 'Questions to the team and your complaints')}</small></span>${icon('chev')}</button>`;
    const rows = S.chats.map((c, i) => { const [tone, label] = chatState(c); const last = c.msgs[c.msgs.length - 1]; return `<button type="button" class="rd-chat-row ${c.fresh ? 'rd-new' : ''}" data-act="chat" data-v="${i}"><span class="rd-ava rd-ava-line">${T(placeOf(c.place).logo)}</span><span style="min-width:0"><b>${T(placeOf(c.place).name)}</b><small>${esc(T(last.text))}</small><span class="rd-badge rd-${tone}">${label}</span></span>${icon('chev')}</button>`; }).join('');
    return {
      head: tabHead(t('Чаты', 'Chats')),
      body: `<div class="rd-pad">${support}${rows || `<div class="rd-empty"><i></i><h3>${t('Пока ни одного чата', 'No chats yet')}</h3><p>${t('Здесь появятся заказы, записи и переписка с заведениями.', 'Orders, bookings and messages with places will appear here.')}</p><button type="button" class="rd-btn rd-btn-line rd-btn-wide" data-act="delivery-places">${t('Найти места', 'Find places')}</button></div>`}</div>`,
    };
  }
  function screenChat() {
    const c = S.chats[S.chat]; const [tone, label] = chatState(c);
    const strip = c.kind === 'order' ? `<div class="rd-order-strip"><span>${t('Заказ', 'Order')} · ${money(c.sum)}</span><span class="rd-badge rd-${tone}">${label}</span></div>` : '';
    const msgs = c.msgs.map((m, i) => `<div class="rd-msg rd-msg-${m.k}">${esc(T(m.text))}${m.pay && c.state === 'invoice' ? `<br><button type="button" class="rd-btn rd-btn-red" data-act="pay" data-v="${S.chat}">${t('Оплатить', 'Pay')} ${money(c.sum)}</button>` : ''}${m.k === 'sys' ? '' : `<time>${m.at}</time>`}</div>`).join('');
    return { head: backHead(t('Чаты', 'Chats'), T(placeOf(c.place).name)), strip, body: `<div class="rd-thread">${msgs}</div>`, foot: `<div class="rd-say"><input class="rd-input" data-input="say" placeholder="${t('Сообщение', 'Message')}"><button type="button" class="rd-ibtn rd-ibtn-ink" data-act="say" aria-label="${t('Отправить', 'Send')}" title="${t('Отправить', 'Send')}">${icon('send')}</button></div>` };
  }

  function screenProfile() {
    const subs = S.follows.size;
    const row = (act, v, ic, title, note, right) => `<button type="button" data-act="${act}" data-v="${v}">${icon(ic)}<span><b>${title}</b>${note ? `<small>${note}</small>` : ''}</span><em>${right || ''}</em>${icon('chev')}</button>`;
    return {
      head: tabHead(t('Твой профиль', 'Your profile')),
      body: `<div class="rd-pad"><div class="rd-me-top"><span class="rd-ava">${t('А', 'A')}</span><div><h2>${t('Алексей', 'Alexey')}</h2><small>+7 999 123-45-67</small></div></div>
        <p class="rd-label">${t('Мое', 'Mine')}</p><div class="rd-group">${row('card', '', 'gift', t('Карта гостя и бонусы', 'Guest card and bonuses'), t('Код для кассы, баллы и штампы заведений', 'Code for the till, points and stamps of places'))}${row('subs', '', 'heart', t('Мои подписки', 'Following'), '', subs || t('нет', 'none'))}${row('toast', 'addr', 'pin', t('Адреса доставки', 'Delivery addresses'), '', S.saved.length || t('нет', 'none'))}</div>
        <p class="rd-label">${t('Настройки', 'Settings')}</p><div class="rd-group">${row('notify', '', 'bell', t('Уведомления', 'Notifications'), '', S.notify ? t('Включены', 'On') : t('Выключены', 'Off'))}${row('city', '', 'filter', t('Город и любимые категории', 'City and favourite categories'), '', t('Иннополис', 'Innopolis'))}${row('theme', '', 'sun', t('Оформление', 'Appearance'), '', t('Системная', 'System'))}${row('lang', '', 'globe', t('Язык', 'Language'), '', t('Русский', 'English'))}</div>
        <p class="rd-label">${t('Помощь', 'Help')}</p><div class="rd-group">${row('toast', 'guide', 'help', t('Как все устроено', 'How it all works'), t('Лента, места, заказы, адреса и чаты', 'Feed, places, orders, addresses and chats'))}${row('toast', 'support', 'support', t('Поддержка', 'Support'), t('Вопросы команде Гласео и твои жалобы', 'Questions to the Glaseo team and your complaints'))}</div></div>`,
    };
  }
  // A QR-looking pattern: three finder squares and a fixed scatter, enough to look like a code without being one.
  const QR = (() => { let r = ''; const n = 25; const finder = (x, y) => `<path d="M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z" fill-rule="evenodd"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) { const inF = (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16); if (!inF && ((x * 7 + y * 13 + x * y) % 5 < 2)) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
    return `<svg viewBox="0 0 25 25" aria-hidden="true" style="fill:#0d0d0c">${finder(0, 0)}${finder(18, 0)}${finder(0, 18)}${r}</svg>`; })();
  function screenCard() {
    const w = Object.entries(S.wallet);
    return {
      head: backHead(t('Профиль', 'Profile'), t('Карта гостя', 'Guest card')),
      body: `<div class="rd-pad" style="padding-top:12px"><div class="rd-card"><p class="rd-label">${t('Карта гостя', 'Guest card')}</p><div class="rd-qr">${QR}</div><div class="rd-code">9412 7082</div><p>${t('Покажи QR на кассе — его отсканируют камерой. Если не выйдет, назови цифры.', 'Show the QR at the till — it is scanned with a camera. If that fails, read out the digits.')}</p></div>
        <p class="rd-note" style="margin:12px 0">${t('Одна карта для всех заведений Гласео. Скидки, баллы и штампы у каждого заведения свои — их правила в карточке места.', 'One card for every Glaseo place. Each place has its own discounts, points and stamps — the rules are on its page.')}</p>
        <p class="rd-label">${t('Мои бонусы', 'My bonuses')}</p>${w.length ? w.map(([pid, v]) => `<div class="rd-wallet"><span class="rd-ava">${T(placeOf(pid).logo)}</span><div><b>${T(placeOf(pid).name)}</b><small>${t('Базовый уровень · кешбэк 5 %', 'Basic level · 5% cashback')}</small><div class="rd-stamps">${Array.from({ length: 8 }, (_, i) => `<i class="${i < v.stamps ? 'is-on' : ''}"></i>`).join('')}</div></div><strong>${v.points} ${t('б.', 'pts')}</strong></div>`).join('')
        : `<div class="rd-empty" style="padding-top:10px"><i></i><h3>${t('Пока пусто', 'Empty for now')}</h3><p>${t('После первой покупки по карте гостя или заказа здесь появятся баллы и штампы заведения.', 'After your first purchase with the guest card or an order, the place\'s points and stamps appear here.')}</p></div>`}</div>`,
    };
  }
  function screenSubs() {
    const list = [...S.follows];
    return { head: backHead(t('Профиль', 'Profile'), t('Мои подписки', 'Following')), body: `<div class="rd-pad">${list.length ? list.map((id) => `<button type="button" class="rd-place-row" data-act="place" data-v="${id}"><span class="rd-ava rd-ava-line">${T(placeOf(id).logo)}</span><span><b>${T(placeOf(id).name)}</b><small>${hoursText(placeOf(id))}</small></span><span>${icon('chev')}</span></button>`).join('') : `<div class="rd-empty"><i></i><h3>${t('Подписок пока нет', 'Not following anyone yet')}</h3><p>${t('Подпишись на место — его новости придут в ленту «Подписки» и уведомлением.', 'Follow a place — its news arrives in the Following feed and as a notification.')}</p><button type="button" class="rd-btn rd-btn-red rd-btn-wide" data-act="tab" data-v="places">${t('Открыть места', 'Open places')}</button></div>`}</div>` };
  }

  const SCREENS = { feed: screenFeed, places: screenPlaces, place: screenPlace, checkout: screenCheckout, booking: screenBooking, map: screenMap, chats: screenChats, chat: screenChat, profile: screenProfile, card: screenCard, subs: screenSubs };
  const TAB_OF = { place: 'places', checkout: 'places', booking: 'places', chat: 'chats', card: 'profile', subs: 'profile' };
  const current = () => S.stack[S.stack.length - 1] || S.tab;

  function sheet() {
    if (!S.sheet) return '';
    const p = POSTS.find((x) => x.id === S.sheet); const pl = placeOf(p.place); const followed = S.follows.has(p.place);
    return `<div class="rd-shade" data-act="close"></div><div class="rd-sheet" role="dialog"><button type="button" class="rd-close" data-act="close" aria-label="${t('Закрыть', 'Close')}">×</button>
      <div class="rd-post-head"><span class="rd-ava">${T(pl.logo)}</span><div><b>${T(pl.name)}</b><small>${T(p.ago)}</small></div></div>
      ${KIND[p.kind] ? `<p class="rd-kicker">${T(KIND[p.kind])}${p.until ? ` · ${T(p.until)}` : ''}</p>` : ''}<h3>${T(p.title)}</h3>${p.img ? `<img src="assets/proto/${p.img}.jpg" alt="">` : ''}<p>${T(p.text)}</p>${p.more ? `<p>${T(p.more)}</p>` : ''}
      <p class="rd-views" style="font-size:12px;margin:4px 0 6px">${icon('eye')}${p.views} · ${T(pl.addr)}</p>
      <div class="rd-pair">${pl.delivery ? `<button type="button" class="rd-btn rd-btn-red" data-act="order-from" data-v="${p.place}">${t('Заказать', 'Order')}</button>` : pl.booking ? `<button type="button" class="rd-btn rd-btn-red" data-act="book-from">${t('Записаться', 'Book')}</button>` : ''}<button type="button" class="rd-btn rd-btn-line" data-act="place" data-v="${p.place}">${t('Открыть место', 'Open place')}</button></div>
      <p style="text-align:center;margin-top:14px"><u data-act="follow" data-v="${p.place}" style="cursor:pointer;font-weight:800;font-size:13px">${followed ? t(`Вы подписаны на «${pl.name[0]}»`, `You follow ${pl.name[1]}`) : t(`Подписаться на «${pl.name[0]}»`, `Follow ${pl.name[1]}`)}</u></p></div>`;
  }

  function render(keep) {
    const old = root.querySelector('.rd-body');
    const top = keep && old ? old.scrollTop : 0;
    const screen = SCREENS[current()]();
    const tab = TAB_OF[current()] || current();
    const unread = S.chats.filter((c) => c.unread).length;
    root.innerHTML = `<div class="rd-status" aria-hidden="true"><span>12:10</span><span>● ▴ ▰</span></div>${screen.head}${screen.strip || ''}
      ${screen.map || `<div class="rd-body">${screen.body}</div>`}${screen.foot || ''}
      <nav class="rd-tabs" aria-label="${t('Разделы приложения', 'App sections')}">${[['feed', ['Лента', 'Feed']], ['places', ['Места', 'Places']], ['map', ['Карта', 'Map']], ['chats', ['Чаты', 'Chats']], ['profile', ['Профиль', 'Profile']]].map(([v, l]) => `<button type="button" data-act="tab" data-v="${v}" ${tab === v ? 'aria-current="page"' : ''}>${icon(v)}${T(l)}${v === 'chats' && unread ? `<i class="rd-dot">${unread}</i>` : ''}</button>`).join('')}</nav>
      ${sheet()}<div class="rd-toast" role="status" aria-live="polite"></div>`;
    const body = root.querySelector('.rd-body');
    if (body) body.scrollTop = current() === 'chat' ? body.scrollHeight : top;
  }
  const open = (screen) => { S.stack.push(screen); S.sheet = null; render(); };

  const TOASTS = () => ({
    call: t('Здесь откроется звонок в заведение.', 'This opens a call to the place.'), more: t('Поделиться, адрес и сообщить о проблеме.', 'Share, address and report a problem.'),
    less: t('Покажем меньше похожего.', 'We will show less like this.'), zoom: t('На настоящей карте — весь Иннополис.', 'The real map covers all of Innopolis.'),
    support: t('Поддержка отвечает в чате и на support@glaseo.tech.', 'Support answers in the chat and at support@glaseo.tech.'), guide: t('Короткая справка по каждому экрану.', 'A short guide to each screen.'),
    addr: t('Адреса сохраняются после первого заказа.', 'Addresses are saved after the first order.'), theme: t('Светлая, темная или как в системе — и размер текста.', 'Light, dark or system — and text size.'),
  });

  // ---------- Life of an order and a booking ----------
  const clock = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  function addMsg(c, k, text, extra) { c.msgs.push({ k, text, at: clock(), ...extra }); if (S.chats[S.chat] !== c || current() !== 'chat') c.unread = true; }
  const later = (ms, fn) => setTimeout(() => { fn(); render(true); }, ms);
  function runOrder(c) {
    later(1500, () => { addMsg(c, 'in', ['Здравствуйте! Заказ проверили, все есть. Доставка — 100 ₽.', 'Hello! We checked the order, everything is in stock. Delivery is 100 ₽.']); c.sum += 100; c.state = 'invoice';
      addMsg(c, 'sys', ['Счет на оплату: ссылка банка заведения или QR', 'Invoice: the place\'s bank link or QR'], { pay: true }); });
  }
  function afterPay(c) {
    addMsg(c, 'sys', ['Оплачено — деньги ушли заведению напрямую', 'Paid — the money went straight to the place']); c.state = 'paid';
    const w = S.wallet[c.place] || { points: 0, stamps: 0 }; w.points += Math.round(c.sum * 0.05); w.stamps = Math.min(8, w.stamps + 1); S.wallet[c.place] = w;
    later(1800, () => addMsg(c, 'sys', ['Готовим ваш заказ', 'Cooking your order']));
    later(3800, () => addMsg(c, 'sys', ['Курьер в пути · будет через 15 минут', 'The courier is on the way · 15 minutes']));
    later(6200, () => { addMsg(c, 'sys', ['Заказ доставлен. Приятного аппетита!', 'Order delivered. Enjoy!']); c.state = 'done'; toast(t('Баллы за заказ — в карте гостя.', 'Points for the order are on your guest card.')); });
  }

  root.addEventListener('click', (event) => {
    const el = event.target.closest('[data-act]');
    if (!el || !root.contains(el)) return;
    const act = el.dataset.act, v = el.dataset.v;
    switch (act) {
      case 'tab': S.tab = v; S.stack = []; S.sheet = null; S.route = v === 'map' ? S.route : null; render(); return;
      case 'back': S.stack.pop(); render(); return;
      case 'close': S.sheet = null; render(true); return;
      case 'toast': toast(TOASTS()[v]); return;
      case 'city': toast(t('Пока работаем в Иннополисе. Другие города — позже.', 'We work in Innopolis for now. Other cities later.')); return;
      case 'feedtab': S.feed = v; render(); return;
      case 'cat': S.cat = v; render(true); return;
      case 'pcat': S.pcat = v; render(true); return;
      case 'mcat': return;
      case 'pf': if (S.pf.has(v)) S.pf.delete(v); else S.pf.add(v); render(true); return;
      case 'post': S.sheet = Number(v); render(true); return;
      case 'like': { const id = Number(v); if (S.liked.has(id)) S.liked.delete(id); else { S.liked.add(id); S.disliked.delete(id); toast(t('Напомним, когда событие начнется.', 'We will remind you when it starts.')); } render(true); return; }
      case 'dislike': { const id = Number(v); if (S.disliked.has(id)) S.disliked.delete(id); else { S.disliked.add(id); S.liked.delete(id); toast(TOASTS().less); } render(true); return; }
      case 'soonlike': { const k = `s${v}`; if (S.liked.has(k)) S.liked.delete(k); else { S.liked.add(k); toast(t('Напомним в день выхода.', 'We will remind you on the day.')); } render(true); return; }
      case 'place': S.place = v; S.ptab = 'news'; S.pin = null; if (current() === 'place') S.stack.pop(); open('place'); return;
      case 'follow': if (S.follows.has(v)) S.follows.delete(v); else { S.follows.add(v); toast(t('Новости места придут в «Подписки» и уведомлением.', 'The place\'s news arrives in Following and as a notification.')); } render(true); return;
      case 'ptab': S.ptab = v; render(true); return;
      case 'inc': S.cart[v] = (S.cart[v] || 0) + 1; render(true); return;
      case 'dec': S.cart[v] = Math.max(0, (S.cart[v] || 0) - 1); render(true); return;
      case 'checkout': open('checkout'); return;
      case 'addr': S.addr = v; render(true); return;
      case 'send-order': {
        const c = { place: S.place, kind: 'order', state: 'sent', sum: cartSum(S.place), msgs: [], fresh: true };
        addMsg(c, 'out', [`Заказ: ${cartFor(S.place).map(([id, n]) => `${DISH[id].n[0]} × ${n}`).join(', ')}. Адрес: ${S.addr}`, `Order: ${cartFor(S.place).map(([id, n]) => `${DISH[id].n[1]} × ${n}`).join(', ')}. Address: ${S.addr}`]);
        if (!S.saved.includes(S.addr)) S.saved.push(S.addr);
        cartFor(S.place).forEach(([id]) => { S.cart[id] = 0; });
        S.chats.unshift(c); S.chat = 0; c.unread = false; S.tab = 'chats'; S.stack = ['chat']; render(); runOrder(c); return;
      }
      case 'pay': { const c = S.chats[Number(v)]; afterPay(c); render(true); return; }
      case 'booking': case 'book-from': S.place = 'workshop'; S.book = { step: 1, master: null, day: 2, time: null }; if (act === 'book-from') { S.tab = 'places'; S.stack = ['place']; } open('booking'); return;
      case 'order-from': S.place = v; S.ptab = 'menu'; S.tab = 'places'; S.stack = []; open('place'); return;
      case 'master': S.book.master = v; S.book.step = 2; render(); return;
      case 'day': S.book.day = Number(v); S.book.time = null; render(true); return;
      case 'time': S.book.time = v; render(true); return;
      case 'bstep': S.book.step = Number(v); render(); return;
      case 'book': {
        const d = DAYS[S.book.day]; const m = MASTERS.find((x) => x[0] === S.book.master)[1];
        const c = { place: 'workshop', kind: 'booking', msgs: [], fresh: true };
        addMsg(c, 'sys', [`Запись: ${d[0].toLowerCase()}, ${d[2]} октября, ${S.book.time} · ${m[0]} · Подготовка велосипеда к зиме`, `Booking: ${d[1]}, ${d[2]} October, ${S.book.time} · ${m[1]} · Winter bike service`]);
        S.chats.unshift(c); S.chat = 0; S.tab = 'chats'; S.stack = ['chat']; render();
        later(1500, () => addMsg(c, 'in', ['Ждем вас! Если планы поменяются — напишите здесь.', 'See you! If your plans change, write here.']));
        toast(t('Ты записан — запись уже у мастера.', 'You are booked — the specialist already has it.')); return;
      }
      case 'write': { let i = S.chats.findIndex((c) => c.place === v && c.kind === 'talk'); if (i < 0) { S.chats.unshift({ place: v, kind: 'talk', msgs: [{ k: 'sys', text: ['Напиши месту — ответит сотрудник', 'Write to the place — a staff member answers'] }] }); i = 0; } S.chat = i; S.tab = 'chats'; S.stack = ['chat']; render(); root.querySelector('[data-input="say"]')?.focus(); return; }
      case 'route': S.route = v; S.pin = v; S.tab = 'map'; S.stack = []; render(); toast(t(`Пешком ${placeOf(v).walk[0]} мин — маршрут на карте.`, `${placeOf(v).walk[0]} min on foot — the route is on the map.`)); return;
      case 'pin': S.pin = S.pin === v ? null : v; render(true); return;
      case 'chat': S.chat = Number(v); S.chats[S.chat].unread = false; S.chats[S.chat].fresh = false; open('chat'); return;
      case 'say': {
        const input = root.querySelector('[data-input="say"]'); const text = input.value.trim(); if (!text) { input.focus(); return; }
        const c = S.chats[S.chat]; addMsg(c, 'out', [text, text]); render(true);
        later(1400, () => addMsg(c, 'in', ['Спасибо! Сейчас ответим подробнее.', 'Thank you! We will answer in a moment.'])); return;
      }
      case 'delivery-places': S.tab = 'places'; S.stack = []; S.pf = new Set(['delivery']); render(); return;
      case 'card': open('card'); return;
      case 'subs': open('subs'); return;
      case 'notify': S.notify = !S.notify; render(true); return;
      case 'lang': document.querySelector(`.lang-switch [data-lang-choice="${lang === 'en' ? 'ru' : 'en'}"]`)?.click(); return;
      case 'theme': toast(TOASTS().theme); return;
      default:
    }
  });
  root.addEventListener('input', (event) => {
    const key = event.target.dataset.input;
    if (key === 'q') { S.q = event.target.value; const pos = event.target.selectionStart; render(true); const again = root.querySelector('[data-input="q"]'); again.focus(); again.setSelectionRange(pos, pos); }
    if (key === 'addr') { S.addr = event.target.value; const bar = root.querySelector('[data-act="send-order"]'); if (bar) bar.disabled = !S.addr.trim() || !cartCount(S.place); }
  });
  root.addEventListener('change', (event) => { if (event.target.dataset.input === 'addr') render(true); });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.dataset.input === 'say') { event.preventDefault(); root.querySelector('[data-act="say"]').click(); }
  });
  new MutationObserver(() => {
    const next = document.documentElement.lang === 'en' ? 'en' : 'ru';
    if (next !== lang) { lang = next; render(true); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  render();
})();
