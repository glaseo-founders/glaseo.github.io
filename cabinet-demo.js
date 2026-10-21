// The business cabinet example (#cabinet-demo). Hand-made after the real cabinet — its sections, icons and wording —
// but not its code: the café, guests, orders and figures are made up, and nothing leaves the page.
// It speaks both languages itself (t(ru, en)) and redraws when i18n.js switches <html lang>, so it needs no lines in EN.
(() => {
  const root = document.getElementById('cab-demo');
  if (!root) return;
  const stage = root.closest('.cab-stage');
  const viewSwitch = document.querySelector('.cab-view');
  root.setAttribute('translate', 'no');

  let lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const t = (ru, en) => (lang === 'en' ? en : ru);
  const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => `${n.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU').replace(/,/g, lang === 'en' ? ',' : ' ')} ₽`;
  const num = (n) => n.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU');

  // The cabinet's own icons (24×24, stroke).
  const ICON = {
    home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z', posts: 'M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5', chats: 'M4 4h16v12H9l-5 4z M8 8h8 M8 12h5',
    orders: 'M6 4h12v16H6z M9 8h6 M9 12h6 M9 16h3', loyalty: 'M4 8h16v11H4z M4 12h16 M12 8v11 M12 8c-1.5-3-5-3-5-1s3 1 5 1c1.5-3 5-3 5-1s-3 1-5 1',
    menu: 'M5 4v6h5V4 M7.5 10v10 M17 4c-4 5-4 8 0 8V4v16', stats: 'M4 20h16 M7 16V9 M12 16V4 M17 16v-5',
    team: 'M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M2 20v-2a6 6 0 0 1 12 0v2 M16 4a3 3 0 0 1 0 6 M17 14c3 0 5 2 5 6', settings: 'M4 7h16 M4 17h16 M9 4v6 M15 14v6',
    inbox: 'M3 13h5l1.5 3h5L16 13h5 M5 5h14l2 8v6H3v-6z', bookings: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5', billing: 'M3 6h18v12H3z M3 10h18 M7 14h4',
    guide: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18 M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17h.01', more: 'M5 12h.01 M12 12h.01 M19 12h.01',
    profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M4 21v-2a8 8 0 0 1 16 0v2', plus: 'M12 5v14 M5 12h14', out: 'M14 4h5v16h-5 M10 8l-4 4 4 4 M6 12h10',
    chat: 'M4 5h16v11H9l-5 4z M8 9h8 M8 12h5', arrow: 'M7 17 17 7 M8 7h9v9',
    camera: 'M4 8h4l2-3h4l2 3h4v11H4z M12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7', send: 'M4 12 20 4l-6 16-3-7z M11 13l9-9', pencil: 'M4 20h4L19 9l-4-4L4 16z M14 6l4 4',
    trash: 'M5 7h14 M9 7V4h6v3 M7 7l1 13h8l1-13', gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M12 3v2 M12 19v2 M4.2 7.5l1.7 1 M18.1 15.5l1.7 1 M4.2 16.5l1.7-1 M18.1 8.5l1.7-1',
    truck: 'M3 6h11v10H3z M14 10h4l3 3v3h-7 M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4', store: 'M4 9l1-5h14l1 5 M4 9h16v11H4z M9 20v-6h6v6', close: 'M6 6l12 12 M18 6 6 18', check: 'M5 12l5 5 9-10',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[name]}"/></svg>`;
  // An icon-only button: the label is read aloud and shown as a tooltip.
  const ibtn = (name, label, attrs = '', cls = '') => `<button type="button" class="cd-ibtn ${cls}" aria-label="${label}" title="${label}" ${attrs}>${icon(name)}</button>`;

  // ---------- The made-up place and everything in it ----------
  const S = {
    view: 'home', place: 0, placeMenu: false, sheet: false, period: 30, statsTab: 'kpi', proTab: 'main', tip: 0,
    postFilter: 'all', post: null, chat: 'anna', chatFilter: 'all', orderFilter: 'active', courierFor: null,
    day: 4, slot: null, loyTab: 'till', guest: null, spend: false, menuFilter: 'all', menuQuery: '', editing: null,
    teamQuery: '', teamRole: 'all', teamOpen: null, adding: false, inboxTab: 'approve', set: null,
  };
  const PLACES = [
    { ru: 'Кофейня у воды', en: 'Café by the water' },
    { ru: 'Пекарня «Колос»', en: 'Kolos bakery' },
  ];
  const placeName = () => t(PLACES[S.place].ru, PLACES[S.place].en);
  const org = () => t('ИП Смирнова', 'Smirnova, sole trader');

  let tasks = ['order', 'pay', 'marat', 'post'];

  const posts = [
    { id: 1, st: 'owner', ru: 'Тыквенный латте вернулся', en: 'Pumpkin latte is back', kind: 'news', when: ['сегодня', 'today'], text: ['С понедельника снова варим тыквенный латте — с корицей и мускатом.', 'From Monday we brew pumpkin latte again — with cinnamon and nutmeg.'], views: 0 },
    { id: 2, st: 'review', ru: 'Книжный вечер у воды', en: 'Book evening by the water', kind: 'event', when: ['24 октября', '24 October'], text: ['Читаем вслух и пьём какао. Вход свободный, места у окна — первым.', 'Reading aloud with cocoa. Free entry, window seats go first.'], views: 0 },
    { id: 3, st: 'scheduled', ru: 'Завтраки до 12:00', en: 'Breakfast until 12:00', kind: 'offer', when: ['выйдет 22 октября в 08:00', 'goes out 22 October at 08:00'], text: ['Сырники, каша и яйца по-турецки — по будням до полудня.', 'Syrniki, porridge and Turkish eggs — weekdays until noon.'], views: 0 },
    { id: 4, st: 'published', ru: 'Новое сезонное меню', en: 'New seasonal menu', kind: 'news', when: ['18 октября', '18 October'], text: ['Матча с жасмином, клубника-базилик и холодный тоник с цитрусами.', 'Jasmine matcha, strawberry-basil and a cold citrus tonic.'], views: 1480, opens: 312, likes: 96 },
    { id: 5, st: 'published', ru: 'Второй кофе в подарок до 10:00', en: 'Second coffee free before 10:00', kind: 'offer', when: ['15 октября', '15 October'], text: ['По будням до десяти утра к любому завтраку — второй фильтр-кофе бесплатно.', 'Weekdays before ten — a second filter coffee free with any breakfast.'], views: 2112, opens: 498, likes: 171 },
    { id: 6, st: 'draft', ru: 'Осенние десерты', en: 'Autumn desserts', kind: 'news', when: ['12 октября', '12 October'], text: ['Тыквенный пирог и яблочный крамбл.', 'Pumpkin pie and apple crumble.'], views: 0 },
    { id: 7, st: 'archived', ru: 'Летняя веранда открыта', en: 'The summer terrace is open', kind: 'news', when: ['20 сентября', '20 September'], text: ['Ждём вас на веранде до конца сентября.', 'See you on the terrace until the end of September.'], views: 3904, opens: 640, likes: 233 },
  ];
  const POST_ST = {
    owner: ['Ждёт решения владельца', 'Awaiting owner', 'wait'], review: ['На проверке гласео', 'In glaseo review', 'wait'],
    scheduled: ['Запланирована', 'Scheduled', ''], published: ['Опубликовано', 'Published', 'good'], draft: ['Черновик', 'Draft', ''],
    archived: ['В архиве', 'Archived', ''],
  };
  const KIND = { news: ['Новость', 'News'], offer: ['Акция', 'Offer'], event: ['Событие', 'Event'] };
  const badge = (label, tone) => `<span class="cd-badge ${tone ? `cd-${tone}` : ''}">${esc(label)}</span>`;
  const postBadge = (p) => badge(t(POST_ST[p.st][0], POST_ST[p.st][1]), POST_ST[p.st][2]);
  const postMeta = (p) => [t(...KIND[p.kind]), t(...p.when), p.views ? t(`${num(p.views)} просмотров`, `${num(p.views)} views`) : null].filter(Boolean).join(' · ');

  const chats = [
    { id: 'anna', ru: 'Анна', en: 'Anna', addr: ['Университетская, 7, кв. 12', 'Universitetskaya 7, apt 12'], at: '12:04', order: 24, msgs: [
      ['sys', 'Заказ № 24: Капучино 0,3 — 250 ₽, Сырники со сметаной — 390 ₽', 'Order No. 24: Cappuccino 0.3 — 250 ₽, Syrniki with sour cream — 390 ₽'],
      ['in', 'Здравствуйте! Сырники можно со сгущёнкой вместо сметаны?', 'Hello! Could I have the syrniki with condensed milk instead of sour cream?'],
    ], replies: [['Спасибо! Оплатила 🙌', 'Thank you! Paid 🙌']] },
    { id: 'olga', ru: 'Ольга', en: 'Olga', addr: ['Квантовый бульвар, 3', 'Kvantovy Boulevard 3'], at: '11:40', order: 23, msgs: [
      ['sys', 'Заказ № 23: Матча с жасмином ×2, Круассан, Тыквенный пирог', 'Order No. 23: Jasmine matcha ×2, Croissant, Pumpkin pie'],
      ['sys', 'Счёт выставлен: 1 120 ₽', 'Invoice sent: 1,120 ₽'],
      ['in', 'Сейчас оплачу, через 20 минут буду дома', 'Paying now, I will be home in 20 minutes'],
    ], replies: [] },
    { id: 'marat', ru: 'Марат', en: 'Marat', addr: ['Спортивная, 114', 'Sportivnaya 114'], at: '10:12', order: null, msgs: [
      ['in', 'Добрый день! Можно записаться на мастер-класс по латте-арту в субботу?', 'Good afternoon! Can I sign up for the latte art workshop on Saturday?'],
    ], replies: [['Отлично, тогда записался на 12:30. До субботы!', 'Great, booked 12:30 then. See you Saturday!']], waiting: true },
    { id: 'dina', ru: 'Дина', en: 'Dina', addr: ['Университетская, 1', 'Universitetskaya 1'], at: '19.10', order: 19, msgs: [
      ['sys', 'Заказ № 19 доставлен', 'Order No. 19 delivered'],
      ['in', 'Всё очень вкусно, спасибо курьеру!', 'Everything was delicious, thanks to the courier!'],
    ], replies: [] },
  ];
  const orders = [
    { n: 24, count: 2, chat: 'anna', who: ['Анна', 'Anna'], at: '12:04', addr: ['Университетская, 7', 'Universitetskaya 7'], sum: 640, items: ['Капучино 0,3 · Сырники со сметаной', 'Cappuccino 0.3 · Syrniki with sour cream'], step: 0, pay: 'new' },
    { n: 23, count: 4, chat: 'olga', who: ['Ольга', 'Olga'], at: '11:40', addr: ['Квантовый бульвар, 3', 'Kvantovy Boulevard 3'], sum: 1120, items: ['Матча с жасмином ×2 · Круассан · Тыквенный пирог', 'Jasmine matcha ×2 · Croissant · Pumpkin pie'], step: 0, pay: 'wait' },
    { n: 21, count: 3, chat: null, who: ['Тимур', 'Timur'], at: '10:55', addr: ['Спортивная, 114', 'Sportivnaya 114'], sum: 860, items: ['Фильтр-кофе ×2 · Сырники со сметаной', 'Filter coffee ×2 · Syrniki with sour cream'], step: 2, pay: 'paid' },
    { n: 19, count: 2, chat: 'dina', who: ['Дина', 'Dina'], at: '09:20', addr: ['Университетская, 1', 'Universitetskaya 1'], sum: 450, items: ['Капучино 0,3 · Круассан', 'Cappuccino 0.3 · Croissant'], step: 4, pay: 'paid' },
  ];
  const STEPS = [['Оплата', 'Payment'], ['Готовим', 'Cooking'], ['Готов', 'Ready'], ['Курьер', 'Courier'], ['Доставлен', 'Delivered']];
  const NEXT = [['Готовим', 'Cooking'], ['Готово', 'Ready'], ['Курьер', 'Courier'], ['Доставлен', 'Delivered']];
  const orderBadge = (o) => (o.step >= 4 ? badge(t('Доставлен', 'Delivered'), 'good')
    : o.pay === 'new' ? badge(t('Новый заказ', 'New order'), 'warn') : o.pay === 'wait' ? badge(t('Ждёт оплаты', 'Awaiting payment'), 'wait') : badge(t('Оплачен', 'Paid'), 'good'));
  const chatState = (c) => {
    const o = orders.find((x) => x.n === c.order);
    if (c.waiting) return ['warn', t('Ждёт ответа', 'Awaiting reply')];
    if (!o) return ['', t('Прочитано', 'Read')];
    if (o.step >= 4) return ['good', t('Доставлен', 'Delivered')];
    if (o.pay === 'new') return ['warn', t('Новый заказ', 'New order')];
    if (o.pay === 'wait') return ['wait', t('Ждёт оплаты', 'Awaiting payment')];
    return ['good', t('Оплачен', 'Paid')];
  };
  const needs = () => chats.filter((c) => ['warn', 'wait'].includes(chatState(c)[0])).length;

  // Bookings of the week: [day][master] → { time: booking }.
  const DAYS = [['Вт', 'Tue', 20], ['Ср', 'Wed', 21], ['Чт', 'Thu', 22], ['Пт', 'Fri', 23], ['Сб', 'Sat', 24], ['Вс', 'Sun', 25], ['Пн', 'Mon', 26]];
  const MASTERS = [['Вера', 'Vera'], ['Илья', 'Ilya']];
  const HOURS = ['10:00', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];
  const SERVICES = { art: ['Мастер-класс по латте-арту', 'Latte art workshop', 1500], cup: ['Каппинг: кофе трёх стран', 'Cupping: coffee from three countries', 1200], alt: ['Альтернативное заваривание', 'Alternative brewing', 1300] };
  const bookings = {
    '0-0-10:00': ['Елена', 'Elena', 'cup'], '0-1-14:00': ['Игорь', 'Igor', 'alt'], '1-0-11:00': ['Дина', 'Dina', 'art'], '2-1-17:00': ['Ксения', 'Ksenia', 'alt'],
    '3-0-15:30': ['Тимур', 'Timur', 'cup'], '4-0-10:00': ['Ольга', 'Olga', 'cup'], '4-1-11:00': ['Рената', 'Renata', 'alt'], '4-0-15:30': ['Алексей', 'Alexey', 'art'],
    '4-1-17:00': ['Софья', 'Sofya', 'cup'], '5-0-12:30': ['Камила', 'Kamila', 'art'],
  };

  const programs = [
    { id: 'cash', on: true, ru: ['Кешбэк баллами', '5 % с покупки, 6–7 % на уровнях «Серебро» и «Золото». Баллами — до 30 % чека.'], en: ['Points cashback', '5% of a purchase, 6–7% on the Silver and Gold levels. Points cover up to 30% of a bill.'] },
    { id: 'stamps', on: true, ru: ['Штампы', 'Каждый 8-й кофе — в подарок.'], en: ['Stamps', 'Every 8th coffee is free.'] },
    { id: 'break', on: false, ru: ['Скидка 10 % на завтраки', 'По будням до 11:00.'], en: ['10% off breakfast', 'Weekdays until 11:00.'] },
    { id: 'nm', on: false, ru: ['2 + 1 на выпечку', 'Третья выпечка — в подарок.'], en: ['2 + 1 on pastries', 'The third pastry is free.'] },
    { id: 'promo', on: false, ru: ['Промокод ОСЕНЬ', '−15 % на первый заказ доставки.'], en: ['Promo code AUTUMN', '−15% on the first delivery order.'] },
  ];
  const guest = { ru: 'Анна Петрова', en: 'Anna Petrova', card: '4821 0937', balance: 340, stamps: 6 };
  const buys = [
    { ru: 'Марат Х.', en: 'Marat Kh.', sum: 520, plus: 26, at: '11:02' },
    { ru: 'Ольга В.', en: 'Olga V.', sum: 1120, plus: 67, at: '09:47' },
  ];
  const GUESTS = [['Анна Петрова', 'Anna Petrova', 'Серебро', 'Silver', 340, 14, '20.10'], ['Марат Хабибуллин', 'Marat Khabibullin', 'Золото', 'Gold', 1210, 31, '20.10'], ['Ольга Васильева', 'Olga Vasilyeva', 'Серебро', 'Silver', 655, 18, '19.10'], ['Тимур Ахметов', 'Timur Akhmetov', 'Базовый', 'Basic', 90, 4, '17.10'], ['Дина Ли', 'Dina Li', 'Базовый', 'Basic', 145, 6, '15.10']];

  let menuId = 10;
  const menu = [
    { id: 1, type: 'menu', ru: ['Фильтр-кофе', 'Зерно недели, 300 мл'], en: ['Filter coffee', 'Bean of the week, 300 ml'], kbju: [5, '0,3', 0, '0,5'], size: ['300 мл', '300 ml'], price: 250 },
    { id: 2, type: 'menu', ru: ['Капучино', 'Двойной эспрессо и молоко'], en: ['Cappuccino', 'Double espresso and milk'], kbju: [120, 6, '6,5', 9], size: ['300 мл', '300 ml'], price: 290 },
    { id: 3, type: 'menu', ru: ['Матча с жасмином', 'Горячая или со льдом'], en: ['Jasmine matcha', 'Hot or iced'], kbju: [180, '6,5', 7, 22], size: ['350 мл', '350 ml'], price: 390 },
    { id: 4, type: 'menu', ru: ['Сырники со сметаной', 'И сезонное варенье'], en: ['Syrniki with sour cream', 'And seasonal jam'], kbju: [410, 24, '18,5', 37], size: ['180 г', '180 g'], price: 390 },
    { id: 5, type: 'menu', ru: ['Круассан', 'Сливочный, печём утром'], en: ['Croissant', 'Butter, baked in the morning'], kbju: null, size: null, price: 210 },
    { id: 6, type: 'menu', ru: ['Тыквенный пирог', 'С корицей и грецким орехом'], en: ['Pumpkin pie', 'With cinnamon and walnut'], kbju: [320, 5, 14, 44], size: ['140 г', '140 g'], price: 280 },
    { id: 7, type: 'service', ru: ['Мастер-класс по латте-арту', 'Сердце, тюльпан и розетта'], en: ['Latte art workshop', 'Heart, tulip and rosetta'], dur: 60, price: 1500 },
    { id: 8, type: 'service', ru: ['Каппинг: кофе трёх стран', 'Эфиопия, Колумбия, Бразилия'], en: ['Cupping: coffee from three countries', 'Ethiopia, Colombia, Brazil'], dur: 90, price: 1200 },
  ];

  const team = [
    { ru: 'Алина Смирнова', en: 'Alina Smirnova', login: 'alina', last: ['сегодня', 'today'], role: 'owner', places: 'all', me: true },
    { ru: 'Рустам Галиев', en: 'Rustam Galiev', login: 'rustam', last: ['вчера', 'yesterday'], role: 'admin', places: 0 },
    { ru: 'Вера Ким', en: 'Vera Kim', login: 'vera', last: ['сегодня', 'today'], role: 'master', places: 0 },
    { ru: 'Илья Орлов', en: 'Ilya Orlov', login: 'ilya', last: ['сегодня', 'today'], role: 'operator', places: 0 },
    { ru: 'Дарья Лис', en: 'Darya Lis', login: 'darya', last: ['3 дня назад', '3 days ago'], role: 'moder', places: 1 },
  ];
  const ROLES = { owner: ['Владелец', 'Owner'], admin: ['Администратор', 'Administrator'], moder: ['Модератор', 'Moderator'], operator: ['Оператор заказов', 'Order operator'], master: ['Мастер', 'Specialist'] };
  const RIGHTS = [['Публикации', 'Posts'], ['Заказы и чаты', 'Orders and chats'], ['Меню и услуги', 'Menu and services'], ['Карточка места', 'Place page'], ['Статистика', 'Statistics'], ['Лояльность', 'Loyalty']];
  const ROLE_RIGHTS = { owner: [0, 1, 2, 3, 4, 5], admin: [0, 1, 2, 3, 4, 5], moder: [0], operator: [1], master: [] };

  const hours = [['Пн', 'Mon', '08:00', '21:00', true], ['Вт', 'Tue', '08:00', '21:00', true], ['Ср', 'Wed', '08:00', '21:00', true], ['Чт', 'Thu', '08:00', '21:00', true], ['Пт', 'Fri', '08:00', '22:00', true], ['Сб', 'Sat', '09:00', '22:00', true], ['Вс', 'Sun', '10:00', '18:00', true]];
  const pay = { link: true, qr: true, cash: true, cardCourier: false, delivery: true, zone: 'city', min: 500 };
  const integrations = { iiko: false, rk: false };

  // ---------- Small parts ----------
  const NAV = [['home', ['Главная', 'Home']], ['posts', ['Публикации', 'Posts']], ['chats', ['Чаты', 'Chats']], ['orders', ['Заказы', 'Orders']], ['loyalty', ['Лояльность', 'Loyalty']], ['menu', ['Меню и услуги', 'Menu and services']], ['stats', ['Статистика', 'Statistics']], ['team', ['Сотрудники', 'Staff']], ['settings', ['Настройки', 'Settings']]];
  const NAV_OF = { compose: 'posts', post: 'posts', bookings: 'chats', inbox: null };
  const chips = (act, items, current) => `<div class="cd-chips">${items.map(([value, label, count]) => `<button type="button" data-act="${act}" data-v="${value}" aria-pressed="${String(String(current) === String(value))}">${esc(label)}${count ? ` <i class="cd-count">${count}</i>` : ''}</button>`).join('')}</div>`;
  const rowBtn = (act, value, top, title, meta) => `<button type="button" class="cd-row-btn" data-act="${act}" data-v="${value}"><span>${top || ''}<strong>${esc(title)}</strong><small>${esc(meta)}</small></span><i aria-hidden="true">›</i></button>`;

  function toast(text) {
    const el = root.querySelector('.cd-toast');
    el.textContent = text;
    el.classList.add('is-on');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  // ---------- Panes ----------
  const KPI = () => ({
    7: [[t('Подписчики', 'Followers'), '1 284', t('+31 за неделю', '+31 this week'), 'up'], [t('Просмотры публикаций', 'Post views'), '2 940', '+12 %', 'up'], [t('Открытия карточки', 'Page opens'), '806', '+9 %', 'up'], [t('Вышло публикаций', 'Posts out'), '3', t('в ленте 2 · ждут вас 1', '2 in the feed · 1 waiting for you'), '']],
    30: [[t('Подписчики', 'Followers'), '1 284', t('+96 за месяц', '+96 this month'), 'up'], [t('Просмотры публикаций', 'Post views'), '11 870', '+18 %', 'up'], [t('Открытия карточки', 'Page opens'), '3 215', '+14 %', 'up'], [t('Вышло публикаций', 'Posts out'), '12', t('в ленте 4 · на проверке 1', '4 in the feed · 1 in review'), '']],
    90: [[t('Подписчики', 'Followers'), '1 284', t('+402 за 3 месяца', '+402 in 3 months'), 'up'], [t('Просмотры публикаций', 'Post views'), '30 410', '+41 %', 'up'], [t('Открытия карточки', 'Page opens'), '8 960', '+33 %', 'up'], [t('Вышло публикаций', 'Posts out'), '31', t('в среднем 2–3 в неделю', '2–3 a week on average'), '']],
  });
  const kpis = () => `<div class="cd-kpis">${KPI()[S.period].map(([label, value, note, dir]) => `<div><small>${label}</small><strong>${value}</strong><span class="${dir === 'up' ? 'cd-up' : ''}">${note}</span></div>`).join('')}</div>`;
  const periodChips = () => chips('period', [[7, t('7 дн', '7 d')], [30, t('30 дн', '30 d')], [90, t('90 дн', '90 d')]], S.period);

  const INSIGHTS = () => [
    ['→', t('Лучшее время для следующей публикации — суббота, 08:30–09:30', 'The best time for your next post is Saturday, 08:30–09:30'), t('Через час после этого ваша аудитория активнее всего: публикация успеет подняться в ленте.', 'An hour later your audience is at its most active: the post has time to rise in the feed.')],
    ['▲', t('Акции со скидкой дают на 23 % больше целевых действий', 'Discount offers bring 23% more key actions'), t('Маршрутов, звонков и открытий меню на одну публикацию больше, чем у новостей.', 'More routes, calls and menu opens per post than news brings.')],
    ['▼', t('Меню открывают, но до заказа доходят реже', 'People open the menu but order less often'), t('У трёх позиций нет фото и веса — добавьте их, это поднимает заказы.', 'Three items have no photo or weight — add them, it lifts orders.'), 'down'],
  ];
  const insights = (list) => `<ul class="cd-insights">${list.map(([mark, title, note, dir]) => `<li><i class="${dir === 'down' ? 'cd-down' : ''}">${mark}</i><div><b>${title}</b><small>${note}</small></div></li>`).join('')}</ul>`;

  const TASKS = {
    order: () => [t('Анна · новый заказ', 'Anna · new order'), t('№ 24 · 2 поз. · 640 ₽', 'No. 24 · 2 items · 640 ₽'), t('Счёт', 'Invoice'), 'chat:anna'],
    pay: () => [t('Ольга · ждёт оплаты', 'Olga · awaiting payment'), t('№ 23 · 4 поз. · 1 120 ₽', 'No. 23 · 4 items · 1,120 ₽'), t('Ответить', 'Reply'), 'chat:olga'],
    marat: () => [t('Марат', 'Marat'), t('Добрый день! Можно записаться на мастер-класс по латте-арту в субботу?', 'Good afternoon! Can I sign up for the latte art workshop on Saturday?'), t('Ответить', 'Reply'), 'chat:marat'],
    post: () => [t('Тыквенный латте вернулся', 'Pumpkin latte is back'), t('Публикация сотрудника ждёт вашего решения', 'A staff post is waiting for your decision'), t('Выпустить', 'Release'), 'release:1', true],
  };

  function paneHome() {
    const list = tasks.map((id) => { const [title, sub, btn, act, red] = TASKS[id](); const [a, v] = act.split(':'); return `<li><div><strong>${title}</strong><small>${esc(sub)}</small></div><button type="button" class="cd-btn ${red ? 'cd-btn-red' : ''}" data-act="${a}" data-v="${v}">${btn}</button></li>`; }).join('');
    const history = [
      [t('сегодня, 12:10', 'today, 12:10'), t('Выставлен счёт по заказу № 22', 'Invoice sent for order No. 22'), t('Илья Орлов · Оператор заказов', 'Ilya Orlov · Order operator')],
      [t('сегодня, 09:02', 'today, 09:02'), t('Изменено меню: «Матча с жасмином»', 'Menu changed: Jasmine matcha'), t('Рустам Галиев · Администратор', 'Rustam Galiev · Administrator')],
      [t('вчера, 18:40', 'yesterday, 18:40'), t('Запрошен совет ИИ-маркетолога', 'AI marketer tip requested'), t('Алина Смирнова · Владелец', 'Alina Smirnova · Owner')],
      [t('вчера, 16:15', 'yesterday, 16:15'), t('Новая запись: каппинг, пт 23 октября', 'New booking: cupping, Fri 23 October'), t('Вера Ким · Мастер', 'Vera Kim · Specialist')],
    ];
    return `<p class="cd-eyebrow">${t('Карточка опубликована', 'Page published')}</p><h1 class="cd-h1">${esc(placeName())}</h1>
      <section class="cd-card"><h3>${t('Ждут вас', 'Waiting for you')} <i class="cd-count">${tasks.length || ''}</i></h3>
        ${tasks.length ? `<ul class="cd-rows">${list}</ul>` : `<p class="cd-note" style="padding-top:10px">${t('Всё сделано. Новые заказы, сообщения и публикации сотрудников появятся здесь.', 'All done. New orders, messages and staff posts will appear here.')}</p>`}</section>
      <section class="cd-card"><div class="cd-head" style="margin:0"><h3 class="cd-h3">${t('Показатели', 'Figures')}</h3>${periodChips()}</div>${kpis()}</section>
      <section class="cd-card cd-pro-card"><h3><span class="cd-pro">PRO</span> ${t('Аудитория, рынок и что делать дальше', 'Audience, market and what to do next')} <span class="cd-tagline">${t('демо-данные', 'demo data')}</span></h3>
        <p class="cd-note" style="margin:6px 0 8px">${t('Выводы, лучшее время для публикаций, сравнение с похожими заведениями', 'Findings, the best time to post, a comparison with similar places')}</p>${insights(INSIGHTS())}
        <button type="button" class="cd-btn" data-act="go" data-v="stats-pro" style="margin-top:12px">${t('Открыть отчёт PRO', 'Open the PRO report')}</button></section>
      <div class="cd-grid3">
        <section><div class="cd-sec-title"><b>${t('Публикации', 'Posts')}</b><small>${t('Последние 20', 'Last 20')}</small></div>
          <button type="button" class="cd-btn cd-btn-red" data-act="go" data-v="compose">+ ${t('Пост', 'Post')}</button>
          <div class="cd-tiles"><button type="button" data-act="set" data-v="card" title="${t('Карточка места', 'Place page')}">${icon('store')}${t('Карточка', 'Page')}</button><button type="button" data-act="go" data-v="menu" title="${t('Меню и услуги', 'Menu and services')}">${icon('menu')}${t('Меню', 'Menu')}</button><button type="button" data-act="set" data-v="delivery" title="${t('Доставка и оплата', 'Delivery and payment')}">${icon('truck')}${t('Доставка', 'Delivery')}</button><button type="button" data-act="go" data-v="bookings" title="${t('Специалисты и запись', 'Specialists and booking')}">${icon('bookings')}${t('Запись', 'Booking')}</button></div>
          <div style="border-top:1px solid var(--ink);margin-top:10px">${posts.slice(0, 4).map((p) => rowBtn('post', p.id, postBadge(p), t(p.ru, p.en), postMeta(p))).join('')}</div></section>
        <section><div class="cd-sec-title"><b>${t('Команда', 'Team')}</b></div>
          <button type="button" class="cd-btn cd-btn-red" data-act="go" data-v="team" style="margin-bottom:12px">${t('Управлять командой', 'Manage the team')}</button>
          ${team.slice(1, 4).map((m) => `<div class="cd-team-row"><span class="cd-ava">${esc(t(m.ru, m.en)[0])}</span><div><b>${esc(t(m.ru, m.en))}</b><small>${t(...ROLES[m.role])} · ${t('вход', 'signed in')} ${t(...m.last)}</small></div></div>`).join('')}</section>
        <section><div class="cd-sec-title"><b>${t('История изменений', 'Change history')}</b><small>${t('Последние 100', 'Last 100')}</small></div>
          <ul class="cd-history">${history.map(([at, what, who]) => `<li><time>${at}</time><b>${what}</b><small>${who}</small></li>`).join('')}</ul></section>
      </div>`;
  }

  function panePosts() {
    const list = posts.filter((p) => S.postFilter === 'all' || p.st === S.postFilter);
    const options = [['all', t('Все', 'All')], ...Object.entries(POST_ST).map(([k, v]) => [k, t(v[0], v[1])])];
    return `<div class="cd-head"><h1 class="cd-h1">${t('Публикации', 'Posts')}</h1><button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="go" data-v="compose" title="${t('Создать публикацию', 'Create a post')}">+ ${t('Пост', 'Post')}</button></div>
      <label class="cd-field" style="max-width:260px"><span>${t('Статус', 'Status')}</span><select class="cd-input" data-input="postFilter">${options.map(([v, l]) => `<option value="${v}" ${S.postFilter === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <div class="cd-sec-title"><b>${t('Публикации', 'Posts')}</b><small>${t('Последние 20', 'Last 20')}</small></div>
      ${list.length ? list.map((p) => rowBtn('post', p.id, postBadge(p), t(p.ru, p.en), postMeta(p))).join('') : `<div class="cd-empty">${t('С таким статусом публикаций нет.', 'No posts with this status.')}</div>`}`;
  }

  function panePost() {
    const p = posts.find((x) => x.id === S.post);
    if (!p) return panePosts();
    const actions = {
      owner: `<button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="release" data-v="${p.id}">${t('Выпустить', 'Release')}</button>`,
      draft: `<button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="send" data-v="${p.id}">${t('На проверку', 'To review')}</button>`,
      published: `<button type="button" class="cd-btn cd-btn-big" data-act="unpublish" data-v="${p.id}">${t('Снять', 'Take down')}</button>`,
      review: `<p class="cd-note">${t('Публикацию читает команда гласео. Решение придёт во «Входящие».', 'The glaseo team is reading the post. The decision will arrive in the Inbox.')}</p>`,
      scheduled: `<p class="cd-note">${t('Одобрена командой гласео и выйдет сама в назначенное время.', 'Approved by the glaseo team, it goes out by itself at the set time.')}</p>`,
      archived: `<p class="cd-note">${t('Публикация в архиве места. Жители видят её в карточке, но не в ленте.', 'The post is in the place\'s archive. Residents see it on the page, not in the feed.')}</p>`,
    };
    return `<button type="button" class="cd-back" data-act="go" data-v="posts">‹ ${t('Публикации', 'Posts')}</button>${postBadge(p)}
      <h1 class="cd-h1" style="font-size:36px;margin-top:12px!important">${esc(t(p.ru, p.en))}</h1><p style="font-size:16px;max-width:640px">${esc(t(...p.text))}</p>
      <div class="cd-post-stats"><div><b>${num(p.views || 0)}</b><small>${t('просмотров в ленте', 'feed views')}</small></div><div><b>${num(p.opens || 0)}</b><small>${t('переходов в карточку', 'visits to the page')}</small></div><div><b>${num(p.likes || 0)}</b><small>${t('нажали «Интересно»', 'tapped "Interested"')}</small></div></div>
      ${actions[p.st]}`;
  }

  const draft = { kind: 'news', title: '', excerpt: '', details: '', more: false, when: 'now', soon: true };
  function paneCompose() {
    const kicker = draft.kind === 'news' ? '' : `<span class="cd-kicker">${t(...KIND[draft.kind])} · ${t('до 27 октября', 'until 27 October')}</span>`;
    return `<p class="cd-eyebrow">${t('Карточка опубликована', 'Page published')}</p>
      <div class="cd-head cd-head-line cd-head-one"><h1 class="cd-h1">${esc(placeName())}</h1><div class="cd-hide-narrow" style="border-left:1px solid var(--line);padding-left:22px"><b style="font-size:40px;font-weight:900;letter-spacing:-.05em">1 284</b><br><small class="cd-note">${t('подписчика', 'followers')}</small></div></div>
      <div class="cd-sec-title" style="margin-top:22px"><b>${t('Новая публикация', 'New post')}</b><small>${t('Покажем в ленте после проверки', 'Shown in the feed after review')}</small></div>
      <div class="cd-compose"><div>
        <div style="margin:14px 0 18px">${chips('kind', [['news', t('Новость', 'News')], ['offer', t('Акция', 'Offer')], ['event', t('Событие', 'Event')]], draft.kind)}</div>
        <label class="cd-field"><span>${t('Заголовок', 'Title')}<small data-count="title">${draft.title.length}/220</small></span><input class="cd-input" data-draft="title" maxlength="220" value="${esc(draft.title)}" placeholder="${t('Что нового у вас сегодня?', 'What is new with you today?')}"></label>
        <label class="cd-field"><span>${t('Коротко — этот текст виден в ленте', 'In short — this text shows in the feed')}<small data-count="excerpt">${draft.excerpt.length}/500</small></span><textarea class="cd-input" data-draft="excerpt" maxlength="500" placeholder="${t('Главная мысль', 'The main point')}">${esc(draft.excerpt)}</textarea></label>
        <label class="cd-field"><span>${t('Подробности — если есть что добавить', 'Details — if there is more to say')}<small data-count="details">${draft.details.length}/10000</small></span><textarea class="cd-input" data-draft="details" maxlength="10000" placeholder="${t('Детали, условия и даты. Можно оставить пустым', 'Details, terms and dates. Can stay empty')}">${esc(draft.details)}</textarea></label>
        <div class="cd-more"><button type="button" data-act="more"><span><b>${t('Дополнительно', 'More')}</b><small>${t('Картинка, время выхода, срок показа, анонс до выхода', 'Picture, release time, how long it shows, announcement before release')}</small></span><i>${draft.more ? '▴' : '▾'}</i></button>
          ${draft.more ? `<div><label class="cd-field"><span>${t('Когда выйдет', 'When it goes out')}</span><select class="cd-input" data-draft="when"><option value="now" ${draft.when === 'now' ? 'selected' : ''}>${t('Сразу после проверки', 'Right after review')}</option><option value="tomorrow" ${draft.when === 'tomorrow' ? 'selected' : ''}>${t('Завтра в 08:00', 'Tomorrow at 08:00')}</option><option value="ai" ${draft.when === 'ai' ? 'selected' : ''}>${t('Сб, 08:30 — совет ИИ-маркетолога', 'Sat, 08:30 — the AI marketer\'s tip')}</option></select></label>
            <label class="cd-check"><input type="checkbox" data-draft="soon" ${draft.soon ? 'checked' : ''}>${t('Анонс в блоке «Скоро» до выхода', 'Announce in "Soon" before release')}</label>
            <button type="button" class="cd-btn" data-act="toast" data-v="picture">+ ${t('Картинка', 'Picture')}</button></div>` : ''}</div>
        <div class="cd-pair"><button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="submit" data-v="review">${t('На проверку', 'To review')}</button><button type="button" class="cd-btn cd-btn-big" data-act="submit" data-v="draft">${t('В черновики', 'To drafts')}</button></div>
        <p class="cd-note" style="margin-top:14px">${t('Сначала публикацию и анонс проверит команда гласео. Публикацию сотрудника после этого принимает владелец или тот, кому он доверил выпуск.', 'First the glaseo team reviews the post and the announcement. After that a staff post is accepted by the owner or whoever they trusted with releases.')}</p>
      </div><div>
        <h3 class="cd-h3" style="font-size:22px">${t('Так это увидят жители', 'This is how residents will see it')}</h3>
        <p class="cd-preview-label">${t('В ленте — сразу после согласования', 'In the feed — right after approval')}</p>
        <div class="cd-preview"><div class="cd-preview-who"><i>≈</i><div><b>${esc(placeName())}</b><small>${t('только что · 0 просмотров', 'just now · 0 views')}</small></div></div>
          ${kicker}<h4 data-preview="title">${esc(draft.title) || t('Заголовок публикации', 'Post title')}</h4><p data-preview="excerpt">${esc(draft.excerpt) || t('Короткий текст, который виден в ленте.', 'A short text that shows in the feed.')}</p><u>${t('Читать полностью', 'Read in full')}</u></div>
        <p class="cd-preview-label">${t('У подписчиков — уведомлением', 'For followers — as a notification')}</p>
        <div class="cd-preview" style="display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:18px"><i style="width:34px;height:34px;border-radius:9px;background:var(--ink);color:#fff;display:grid;place-items:center;font-style:normal;font-weight:900">г</i><div style="min-width:0"><b style="font-size:13.5px">${esc(placeName())}</b><small data-preview="push" style="display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(draft.title) || t('Заголовок публикации', 'Post title')}</small></div></div>
      </div></div>`;
  }

  function paneChats() {
    const filters = { new: (c) => chatState(c)[0] === 'warn', wait: (c) => chatState(c)[0] === 'wait', work: (c) => { const o = orders.find((x) => x.n === c.order); return o && o.pay === 'paid' && o.step < 4; }, all: () => true };
    const list = chats.filter(filters[S.chatFilter]);
    const c = chats.find((x) => x.id === S.chat);
    const o = c && orders.find((x) => x.n === c.order);
    const [tone, label] = c ? chatState(c) : ['', ''];
    let act = '';
    if (o && o.step < 4 && o.pay === 'new') act = `<div class="cd-thread-act"><p>${t('Проверьте состав и цену: житель получит счёт и подсказку, как оплатить.', 'Check the items and the price: the resident gets an invoice and a hint on how to pay.')}</p><button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="invoice" data-v="${o.n}">${t('Выставить счёт', 'Send invoice')}</button></div>`;
    else if (o && o.step < 4 && o.pay === 'wait') act = `<div class="cd-thread-act"><p>${t('Счёт у жителя. Оплата приходит вам напрямую — по ссылке или QR вашего банка.', 'The resident has the invoice. Payment comes straight to you — by your bank\'s link or QR.')}</p><button type="button" class="cd-btn cd-btn-big" data-act="paid" data-v="${o.n}">${t('Отметить оплаченным', 'Mark as paid')}</button></div>`;
    const thread = c ? `<div class="cd-thread-head"><div><button type="button" class="cd-back cd-only-phone" data-act="chat-back" style="margin:0 0 4px">‹ ${t('Чаты', 'Chats')}</button><b>${esc(t(c.ru, c.en))}</b><small>${esc(t(...c.addr))}</small></div>${ibtn('more', t('Ещё: заблокировать жителя', 'More: block the resident'), 'data-act="toast" data-v="block"')}</div>
        ${o ? `<div class="cd-thread-order"><span>${t('Заказ №', 'Order No.')} ${o.n} · ${money(o.sum)}</span>${badge(label, tone)}</div>` : ''}
        <div class="cd-msgs">${c.msgs.map(([k, ru, en, at]) => `<div class="cd-msg cd-msg-${k}">${esc(t(ru, en))}${k === 'sys' ? '' : `<time>${at || c.at}</time>`}</div>`).join('')}</div>
        ${act}<div class="cd-compose-line"><input class="cd-input" data-chat-input placeholder="${t('Сообщение', 'Message')}">${ibtn('send', t('Отправить', 'Send'), `data-act="say" data-v="${c.id}"`, 'cd-ibtn-ink')}</div>`
      : `<p class="cd-thread-empty">${t('Выберите чат слева.', 'Pick a chat on the left.')}</p>`;
    const count = (key) => chats.filter(filters[key]).length;
    return `<div class="cd-chats" ${S.chatOpen ? 'data-open' : ''}><div class="cd-chat-list"><div class="cd-chat-list-head"><div><h2>${t('Чаты', 'Chats')}</h2><span class="cd-acts">${ibtn('bookings', t('Записи', 'Bookings'), 'data-act="go" data-v="bookings"')}${ibtn('settings', t('Доставка и оплата', 'Delivery and payment'), 'data-act="set" data-v="delivery"')}</span></div>
        ${chips('chatFilter', [['new', t('Новые', 'New'), count('new')], ['wait', t('Ждут оплаты', 'Awaiting payment'), count('wait')], ['work', t('В работе', 'In progress')], ['all', t('Все', 'All')]], S.chatFilter)}</div>
      <div class="cd-chat-items">${list.map((x) => { const [tn, lb] = chatState(x); const last = x.msgs[x.msgs.length - 1]; const ord = orders.find((y) => y.n === x.order); return `<button type="button" class="cd-chat-item" data-act="chat" data-v="${x.id}" aria-current="${String(x.id === S.chat)}"><b>${esc(t(x.ru, x.en))}</b><time>${x.at}</time><small>${ord && ord.pay !== 'paid' ? `${ord.count} ${t('поз.', 'items')} · ${money(ord.sum)}` : esc(t(last[1], last[2]))}</small>${badge(lb, tn)}</button>`; }).join('') || `<p class="cd-note" style="padding:16px">${t('Здесь пусто.', 'Nothing here.')}</p>`}</div></div>
      <div class="cd-thread">${thread}</div></div>`;
  }

  function paneOrders() {
    const list = orders.filter((o) => S.orderFilter === 'all' || o.step < 4);
    return `<div class="cd-chips cd-only-phone" style="margin-bottom:12px"><button type="button" aria-pressed="true">${t('Заказы и чаты', 'Orders and chats')} · ${needs()}</button><button type="button" data-act="go" data-v="bookings" aria-pressed="false">${t('Записи', 'Bookings')}</button></div>
      <div class="cd-head cd-head-line cd-head-one"><h1 class="cd-h1">${t('Заказы', 'Orders')}</h1>${ibtn('chat', t('Открыть чаты', 'Open chats'), 'data-act="go" data-v="chats"')}</div>
      <p class="cd-note" style="margin:16px 0 12px">${t('Заказы через гласео · Доставка. Оплата — напрямую вам, гласео не берёт процент.', 'Orders through glaseo · Delivery. Payment goes straight to you, glaseo takes no percentage.')}</p>
      <div style="margin-bottom:18px">${chips('orderFilter', [['active', t('Активные', 'Active')], ['all', t('Все', 'All')]], S.orderFilter)}</div>
      ${list.map((o) => {
        let button = '';
        if (o.step < 4 && o.pay === 'new') button = `<button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="chat" data-v="${o.chat}">${t('Выставить счёт', 'Send invoice')}</button>`;
        else if (o.step === 2 && S.courierFor === o.n) button = `<div class="cd-couriers"><span class="cd-note">${t('Кто везёт:', 'Who delivers:')}</span><button type="button" class="cd-btn" data-act="courier" data-v="${o.n}:0">${t('Илья · на смене', 'Ilya · on shift')}</button><button type="button" class="cd-btn" data-act="courier" data-v="${o.n}:1">${t('Рустам · на смене', 'Rustam · on shift')}</button></div>`;
        else if (o.step < 4) button = `<button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="advance" data-v="${o.n}">${t(...NEXT[o.step])}</button>`;
        return `<article class="cd-order"><div class="cd-order-head"><div><h3>${t('№', 'No.')} ${o.n}</h3><small>${esc(t(...o.who))} · ${o.at} · ${esc(t(...o.addr))}</small></div><div class="cd-order-sum"><b>${money(o.sum)}</b>${orderBadge(o)}</div></div>
          <ol class="cd-steps">${STEPS.map((s, i) => `<li class="${i < o.step || o.step >= 4 ? 'is-past' : i === o.step ? 'is-now' : ''}">${t(...s)}</li>`).join('')}</ol>
          <p class="cd-order-items">${esc(t(...o.items))}</p>${button}</article>`;
      }).join('') || `<div class="cd-empty">${t('Активных заказов нет.', 'No active orders.')}</div>`}`;
  }

  function paneBookings() {
    const cells = HOURS.map((h) => `<div class="cd-cal-t">${h}</div>${MASTERS.map((m, mi) => {
      const key = `${S.day}-${mi}-${h}`; const b = bookings[key];
      if (!b) return `<div><button type="button" class="cd-slot cd-slot-free" data-act="free">${t('Свободно', 'Free')}</button></div>`;
      const sv = SERVICES[b[2]];
      return `<div><button type="button" class="cd-slot ${b[3] ? 'cd-slot-new' : ''}" data-act="slot" data-v="${key}" aria-pressed="${String(S.slot === key)}"><b>${esc(t(b[0], b[1]))}</b><small>${esc(t(sv[0], sv[1]))}</small></button></div>`;
    }).join('')}`).join('');
    const sel = S.slot && bookings[S.slot];
    let info = '';
    if (sel) {
      const [d, mi, h] = S.slot.split('-'); const sv = SERVICES[sel[2]]; const day = DAYS[d];
      info = `<section class="cd-card cd-slot-info"><h3>${esc(t(sel[0], sel[1]))} ${sel[3] ? badge(t('Новая', 'New'), 'warn') : ''}</h3><p style="margin:6px 0 14px">${t(day[0], day[1])}, ${day[2]} ${t('октября', 'October')}, ${h} · ${esc(t(sv[0], sv[1]))} · ${t('мастер', 'with')} ${t(...MASTERS[mi])} · ${money(sv[2])}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px"><button type="button" class="cd-btn" data-act="toast" data-v="move">${t('Перенести', 'Move')}</button><button type="button" class="cd-btn" data-act="cancel-slot">${t('Отменить', 'Cancel')}</button></div></section>`;
    }
    return `<button type="button" class="cd-back" data-act="go" data-v="chats">‹ ${t('Чаты', 'Chats')}</button><h1 class="cd-h1" style="margin-bottom:4px!important">${t('Записи', 'Bookings')}</h1><p class="cd-note" style="margin-bottom:14px">${t('Неделя 20–26 октября', 'Week of 20–26 October')}</p>
      <div style="margin-bottom:16px">${chips('day', DAYS.map((d, i) => [i, i === 0 ? t('Сегодня', 'Today') : `${t(d[0], d[1])} ${d[2]}`]), S.day)}</div>
      <div class="cd-cal"><div class="cd-cal-h"></div>${MASTERS.map((m) => `<div class="cd-cal-h">${t(...m)}</div>`).join('')}${cells}</div>${info}
      <p class="cd-note" style="margin-top:14px">${t('Записи открываются сами: гость выбирает свободное время в приложении, мастер видит визит в «Моих записях». Перенос — только с согласия гостя.', 'Bookings open by themselves: the guest picks a free time in the app, the specialist sees the visit in "My bookings". Moving a visit needs the guest\'s consent.')}</p>`;
  }

  function paneLoyalty() {
    const on = programs.filter((p) => p.on);
    const tabs = chips('loyTab', [['till', t('Касса', 'Till')], ['programs', t('Программы', 'Programmes')], ['guests', t('Гости', 'Guests')]], S.loyTab);
    const head = `<div class="cd-head cd-head-line cd-head-one"><h1 class="cd-h1">${t('Лояльность', 'Loyalty')}</h1><span class="cd-note cd-hide-narrow">${on.length ? t(`Работают программы: ${on.length}`, `Programmes running: ${on.length}`) : t('Программы не работают', 'No programmes running')}</span></div><div style="margin:18px 0">${tabs}</div>`;
    if (S.loyTab === 'programs') return `${head}${programs.map((p) => `<div class="cd-program"><div><b>${t(p.ru[0], p.en[0])}</b><small>${t(p.ru[1], p.en[1])}</small></div><button type="button" class="cd-switch" role="switch" aria-checked="${p.on}" data-act="program" data-v="${p.id}" aria-label="${t(p.ru[0], p.en[0])}"></button></div>`).join('')}
      <p class="cd-note" style="margin-top:12px">${t('Скидки, «N + M», подарки, баллы с уровнями, штампы и промокоды работают на месте по карте гостя и в заказах доставки.', 'Discounts, "N + M", gifts, points with levels, stamps and promo codes work on the spot with the guest card and in delivery orders.')}</p>`;
    if (S.loyTab === 'guests') return `${head}<table class="cd-table cd-collapse"><thead><tr><th>${t('Гость', 'Guest')}</th><th>${t('Уровень', 'Level')}</th><th>${t('Баллы', 'Points')}</th><th>${t('Визиты', 'Visits')}</th><th>${t('Последняя покупка', 'Last purchase')}</th></tr></thead><tbody>
      ${GUESTS.map((g) => `<tr><td><b>${t(g[0], g[1])}</b></td><td><span class="cd-role">${t(g[2], g[3])}</span></td><td>${num(g[4])}</td><td class="cd-hide-phone">${g[5]}</td><td class="cd-hide-phone">${g[6]}</td></tr>`).join('')}</tbody></table>`;
    const stamps = Array.from({ length: 8 }, (_, i) => `<i class="${i < guest.stamps ? 'is-on' : ''}"></i>`).join('');
    const card = S.guest ? `<div class="cd-guest"><small>${t('Карта гостя', 'Guest card')} · ${guest.card}</small><h3>${t(guest.ru, guest.en)}</h3>
        <div class="cd-guest-figs"><div><b>${num(guest.balance)}</b><small>${t('баллов', 'points')}</small></div><div><b>${t('Серебро', 'Silver')}</b><small>${t('кешбэк 6 %', '6% cashback')}</small></div><div><b>${guest.stamps}/8</b><small>${t('штампов', 'stamps')}</small></div></div>
        <div class="cd-stamps">${stamps}</div>
        <label class="cd-field" style="color:#fff"><span>${t('Сумма покупки, ₽', 'Purchase amount, ₽')}</span><input class="cd-input" data-input="amount" inputmode="numeric" value="${S.amount ?? 640}"></label>
        <label class="cd-check"><input type="checkbox" data-input="spend" ${S.spend ? 'checked' : ''}>${t('Списать баллы — до 30 % чека', 'Spend points — up to 30% of the bill')}</label>
        <div class="cd-guest-act"><button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="buy">${t('Провести', 'Record')}</button>${ibtn('close', t('Закрыть карту', 'Close the card'), 'data-act="close-guest"', 'cd-ibtn-dark')}</div></div>` : '';
    return `${head}<div class="cd-loy"><div>
        <div class="cd-callout">${on.length ? `${t('Работают:', 'Running:')} ${on.map((p) => `<b>${t(p.ru[0], p.en[0])}</b>`).join(', ')}. <u data-act="loyTab" data-v="programs" style="cursor:pointer">${t('Настроить программы', 'Set up programmes')}</u>` : `${t('Ни одна программа не работает — покупка просто запишется гостю.', 'No programme is running — the purchase is simply recorded for the guest.')} <u data-act="loyTab" data-v="programs" style="cursor:pointer">${t('Настроить программы', 'Set up programmes')}</u>`}</div>
        ${card || `<button type="button" class="cd-btn cd-btn-red cd-btn-big cd-btn-icon" data-act="scan" title="${t('Сфотографировать QR-код гостя', 'Photograph the guest\'s QR code')}">${icon('camera')}${t('Сканировать', 'Scan')}</button>
        <p class="cd-note" style="margin:10px 0 24px">${t('Гость показывает QR в приложении: «Профиль → Карта гостя». Карта откроется сама.', 'The guest shows the QR in the app: Profile → Guest card. The card opens by itself.')}</p>
        <label class="cd-field"><span>${t('Или код карты вручную', 'Or type the card code')}</span><span class="cd-code-row"><input class="cd-code" data-input="code" inputmode="numeric" maxlength="9" placeholder="0000 0000">${ibtn('arrow', t('Открыть карту', 'Open the card'), 'data-act="scan"', 'cd-ibtn-ink cd-ibtn-big')}</span></label>
        <p class="cd-note" style="margin:-6px 0 12px">${t('Если камера не справилась: гость называет 8 цифр под QR-кодом.', 'If the camera fails, the guest reads out the 8 digits under the QR code.')}</p>
        `}
      </div><aside class="cd-buys"><h3>${t('Последние покупки', 'Recent purchases')}</h3><ul>${buys.map((b) => `<li class="${b.fresh ? 'cd-new' : ''}"><b>${t(b.ru, b.en)} · ${money(b.sum)}</b><small>${b.at} · +${b.plus} ${t('баллов', 'points')}${b.stamp ? ` · ${t('штамп', 'stamp')} ${b.stamp}/8` : ''}</small></li>`).join('')}</ul></aside></div>`;
  }

  function paneMenu() {
    const missing = (m) => m.type === 'menu' && (!m.kbju || !m.size);
    const tests = { all: () => true, menu: (m) => m.type === 'menu', service: (m) => m.type === 'service', missing };
    const q = S.menuQuery.trim().toLowerCase();
    const list = menu.filter(tests[S.menuFilter]).filter((m) => !q || `${m.ru.join(' ')} ${m.en.join(' ')}`.toLowerCase().includes(q));
    const count = (k) => menu.filter(tests[k]).length;
    const row = (m) => {
      const [name, desc] = [t(m.ru[0], m.en[0]), t(m.ru[1], m.en[1])];
      const facts = m.type === 'service' ? `${m.dur} ${t('мин · по записи', 'min · by booking')}` : m.kbju ? `${m.kbju[0]} ${t('ккал', 'kcal')} · ${t('Б', 'P')} ${m.kbju[1]} · ${t('Ж', 'F')} ${m.kbju[2]} · ${t('У', 'C')} ${m.kbju[3]} · ${t('на порцию', 'per portion')}` : '';
      const tag = m.type === 'service' ? `<span class="cd-tag">${t('Услуга', 'Service')}</span>` : missing(m) ? `<span class="cd-tag cd-tag-red">${t('Нужно заполнить', 'Needs filling in')}</span>` : '';
      const price = S.editing === m.id ? `<input class="cd-price-input" data-input="price" data-v="${m.id}" inputmode="numeric" value="${m.price}">` : `<b>${money(m.price)}</b>`;
      const act = S.editing === m.id ? `<button type="button" class="cd-btn cd-btn-red" data-act="save-item" data-v="${m.id}">${t('Сохранить', 'Save')}</button>` : `<span class="cd-acts">${ibtn('pencil', t('Изменить', 'Edit'), `data-act="edit-item" data-v="${m.id}"`)}${ibtn('trash', t('Убрать', 'Remove'), `data-act="drop-item" data-v="${m.id}"`)}</span>`;
      return `<tr class="${m.fresh ? 'cd-new' : ''}"><td><b>${esc(name)} ${tag}</b><small>${esc(desc)}</small>${facts ? `<small>${facts}${m.size ? ` · ${t(...m.size)}` : ''}</small>` : ''}${missing(m) ? `<small class="cd-down">${t('Не указаны вес и КБЖУ', 'No weight or nutrition yet')}</small>` : ''}</td><td>${price}</td><td style="white-space:nowrap;text-align:right">${act}</td></tr>`;
    };
    return `<div class="cd-head cd-head-one"><h1 class="cd-h1">${t('Меню и услуги', 'Menu and services')}</h1><span class="cd-acts"><button type="button" class="cd-btn cd-btn-red" data-act="add-item" data-v="service" title="${t('Услуга по записи', 'Bookable service')}">+ ${t('Услуга', 'Service')}</button><button type="button" class="cd-btn" data-act="add-item" data-v="menu" title="${t('Позиция меню', 'Menu item')}">+ ${t('Позиция', 'Item')}</button></span></div>
      <p class="cd-lead" style="margin-top:-8px!important">${t(`Позиции, которые жители видят в карточке «${PLACES[S.place].ru}». Блюда и товары заказывают, на услуги записываются. Изменения видны жителям сразу.`, `Items residents see on the ${PLACES[S.place].en} page. Dishes and goods get ordered, services get booked. Changes show to residents at once.`)}</p>
      <label class="cd-field"><span>${t('Поиск по меню и услугам', 'Search the menu and services')}</span><input class="cd-input" data-input="menuQuery" value="${esc(S.menuQuery)}" placeholder="${t('Название или описание', 'Name or description')}"></label>
      <div style="margin-bottom:12px">${chips('menuFilter', [['all', `${t('Все', 'All')} ${count('all')}`], ['menu', `${t('Меню', 'Menu')} ${count('menu')}`], ['service', `${t('Услуги', 'Services')} ${count('service')}`], ['missing', `${t('Нужно заполнить', 'Needs filling in')} ${count('missing')}`]], S.menuFilter)}</div>
      ${count('missing') ? `<div class="cd-callout">${t(`Позиций без веса или КБЖУ: ${count('missing')}. Жители с фильтром «С КБЖУ» их не увидят.`, `Items without weight or nutrition: ${count('missing')}. Residents filtering "With nutrition" will not see them.`)}</div>` : ''}
      <table class="cd-table cd-collapse"><thead><tr><th>${t('Позиция', 'Item')}</th><th>${t('Цена', 'Price')}</th><th style="text-align:right">${t('Действия', 'Actions')}</th></tr></thead><tbody>${list.map(row).join('') || `<tr><td colspan="3" class="cd-note">${t('Ничего не нашлось.', 'Nothing found.')}</td></tr>`}</tbody></table>`;
  }

  // Interest by day: two series, drawn as SVG lines.
  const SERIES = {
    7: [[42, 55, 48, 61, 70, 92, 77], [20, 26, 22, 30, 33, 45, 39]],
    30: [[30, 38, 35, 44, 40, 52, 47, 58, 50, 62, 57, 66, 60, 71, 64, 70, 76, 68, 74, 81, 72, 79, 86, 77, 83, 90, 82, 88, 94, 99], [12, 15, 14, 18, 16, 22, 20, 26, 21, 27, 24, 29, 26, 31, 28, 30, 34, 29, 33, 36, 31, 35, 39, 33, 37, 41, 36, 40, 43, 46]],
    90: [[22, 26, 31, 29, 35, 40, 38, 46, 52, 49, 58, 63, 71], [9, 11, 13, 12, 15, 18, 17, 20, 23, 22, 26, 28, 32]],
  };
  const line = (values) => values.map((v, i) => `${i ? 'L' : 'M'}${(i / (values.length - 1)) * 600},${200 - v * 1.8}`).join(' ');
  const PRO_TABS = () => [['main', t('Главное', 'Main')], ['ai', t('ИИ-маркетолог', 'AI marketer')], ['an', t('Аналитика', 'Analytics')], ['funnel', t('Воронка и действия', 'Funnel and actions')], ['aud', t('Аудитория', 'Audience')], ['market', t('Рынок и спрос', 'Market and demand')], ['ab', t('A/B-тесты', 'A/B tests')], ['pos', t('Касса и промокоды', 'Till and promo codes')]];
  const TIPS = () => [
    [t('Выпустите акцию в субботу в 08:30', 'Release an offer on Saturday at 08:30'), t('В это время подписчики активнее всего, а у похожих кофеен в ленте тихо. Предложение: «Второй кофе в подарок до 10:00».', 'Followers are most active then, and similar cafés are quiet in the feed. Suggestion: "Second coffee free before 10:00".'), t('Второй кофе в подарок до 10:00', 'Second coffee free before 10:00')],
    [t('Добавьте фото к трём позициям меню', 'Add photos to three menu items'), t('Круассан, сырники и тыквенный пирог открывают чаще всего, но без фото их реже заказывают.', 'Croissant, syrniki and pumpkin pie are opened most, but without photos they are ordered less.'), null],
    [t('Анонсируйте книжный вечер за 3 дня', 'Announce the book evening 3 days ahead'), t('События с анонсом в блоке «Скоро» собирают на 40 % больше «Интересно».', 'Events announced in "Soon" collect 40% more "Interested".'), t('Книжный вечер у воды — в пятницу', 'Book evening by the water — on Friday')],
  ];
  const bars = (items) => `<ul class="cd-bars">${items.map(([label, value, max]) => `<li><span>${label}</span><b>${num(value)}</b><i><b style="width:${Math.round((value / max) * 100)}%"></b></i></li>`).join('')}</ul>`;
  function proBody() {
    switch (S.proTab) {
      case 'ai': { const [title, text, post] = TIPS()[S.tip]; return `<section class="cd-card" style="background:var(--paper)"><p class="cd-eyebrow">${t('Совет на сегодня', 'Today\'s tip')}</p><h3 class="cd-h3" style="font-size:22px;margin:8px 0">${title}</h3><p>${text}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">${post ? `<button type="button" class="cd-btn cd-btn-red" data-act="tip-post">${t('Создать публикацию из совета', 'Create a post from the tip')}</button>` : `<button type="button" class="cd-btn cd-btn-red" data-act="go" data-v="menu">${t('Открыть меню', 'Open the menu')}</button>`}<button type="button" class="cd-btn" data-act="tip">${t('Ещё совет', 'Another tip')}</button></div></section>`; }
      case 'an': return bars([[t('Понедельник', 'Monday'), 410, 980], [t('Вторник', 'Tuesday'), 465, 980], [t('Среда', 'Wednesday'), 520, 980], [t('Четверг', 'Thursday'), 498, 980], [t('Пятница', 'Friday'), 760, 980], [t('Суббота', 'Saturday'), 980, 980], [t('Воскресенье', 'Sunday'), 702, 980]]);
      case 'funnel': return bars([[t('Показы в ленте', 'Feed impressions'), 3887, 3887], [t('Открыли публикацию', 'Opened a post'), 846, 3887], [t('Перешли в карточку', 'Went to the page'), 336, 3887], [t('Маршрут, звонок, меню', 'Route, call, menu'), 82, 3887]]);
      case 'aud': return bars([[t('Утро, 7–11', 'Morning, 7–11'), 46, 100], [t('День, 11–16', 'Day, 11–16'), 28, 100], [t('Вечер, 16–21', 'Evening, 16–21'), 22, 100], [t('Ночь', 'Night'), 4, 100]]) + `<p class="cd-note">${t('Доля подписчиков, активных в это время. 62 % подписаны больше месяца.', 'Share of followers active at that time. 62% have followed for more than a month.')}</p>`;
      case 'market': return `${bars([[t('«кофе с собой»', '"coffee to go"'), 312, 312], [t('«завтрак»', '"breakfast"'), 204, 312], [t('«без лактозы»', '"lactose-free"'), 96, 312], [t('«десерт»', '"dessert"'), 88, 312]])}<p class="cd-note">${t('Что ищут рядом с вами. CTR похожих мест — 23,7 %, ваш — 21,3 %.', 'What people search near you. Similar places\' CTR is 23.7%, yours is 21.3%.')}</p>`;
      case 'ab': return `<section class="cd-card" style="background:var(--paper)"><h3 class="cd-h3">${t('Заголовок акции', 'Offer title')}</h3><div class="cd-grid2" style="margin-top:12px"><div><span class="cd-badge">A</span><p style="margin-top:8px"><b>${t('Второй кофе в подарок', 'Second coffee free')}</b></p><p class="cd-note">CTR 19,4 %</p></div><div><span class="cd-badge cd-good">B</span><p style="margin-top:8px"><b>${t('Утро вдвоём: второй кофе — от нас', 'Morning for two: the second coffee is on us')}</b></p><p class="cd-note">CTR 22,9 % · ${t('лучше на 18 %', '18% better')}</p></div></div></section>`;
      case 'pos': return `<section class="cd-card" style="background:var(--paper)"><p>${t('Подключите кассу — тогда будет видно, сколько промокодов погашено и какие публикации привели покупателей.', 'Connect your till to see how many promo codes were redeemed and which posts brought buyers.')}</p><button type="button" class="cd-btn cd-btn-red" data-act="set" data-v="integr" style="margin-top:12px">${t('Интеграции', 'Integrations')}</button></section>`;
      default: return `<div class="cd-grid2"><div><div class="cd-sec-title"><b>${t('Коротко: что важно сейчас', 'In short: what matters now')}</b></div>${insights(INSIGHTS())}</div>
        <div><div class="cd-sec-title"><b>${t('Что изменилось за неделю', 'What changed this week')}</b></div>${insights([['▲', `+18 % · ${t('Просмотры публикаций', 'Post views')}`, t('2 940 против 2 490 неделей раньше', '2,940 against 2,490 a week earlier')], ['▲', `+9 % · ${t('Переходы в заведение', 'Visits to the place')}`, t('806 против 739', '806 against 739')], ['▼', `−6 % · ${t('Конверсия в действие', 'Conversion to action')}`, t('Меньше открывали меню — добавьте фото к позициям', 'Fewer menu opens — add photos to items'), 'down']])}</div></div>`;
    }
  }
  function paneStats() {
    const head = `<h1 class="cd-h1">${t('Статистика', 'Statistics')}</h1><div style="margin:-6px 0 20px">${chips('statsTab', [['kpi', t('Показатели', 'Figures')], ['pro', t('PRO: аудитория и рынок', 'PRO: audience and market')]], S.statsTab)}</div>`;
    if (S.statsTab === 'pro') return `${head}<section class="cd-card cd-pro-card"><div class="cd-head" style="margin-bottom:14px"><h3 class="cd-h3"><span class="cd-pro">PRO</span> ${t('Аудитория, рынок и что делать дальше', 'Audience, market and what to do next')} <span class="cd-tagline" style="padding:2px 8px;border:1px dashed var(--ink);border-radius:999px;font-size:11px;font-weight:400">${t('демо-данные', 'demo data')}</span></h3></div><div style="margin:-6px 0 12px">${periodChips()}</div>
      <div style="margin-bottom:16px">${chips('proTab', PRO_TABS(), S.proTab)}</div>${proBody()}</section>`;
    const [a, b] = SERIES[S.period];
    const read = posts.filter((p) => p.views).slice(0, 3);
    return `${head}<section class="cd-card"><div class="cd-head" style="margin:0"><h3 class="cd-h3">${t('Показатели', 'Figures')}</h3>${periodChips()}</div>${kpis()}
      <div class="cd-grid2" style="margin-top:22px"><div><h3 class="cd-h3" style="font-size:17px;margin-bottom:6px!important">${t('Интерес по дням', 'Interest by day')}</h3><div><div class="cd-legend"><span><i></i>${t('Просмотры публикаций', 'Post views')}</span><span><i class="cd-dash"></i>${t('Открытия карточки', 'Page opens')}</span></div></div>
        <svg class="cd-chart" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0,199.5H600" stroke="#cfcfc9" style="stroke-width:1"/><path d="${line(a)}" stroke="#d12d23"/><path d="${line(b)}" stroke="#0d0d0c" stroke-dasharray="6 5"/></svg></div>
        <div><h3 class="cd-h3" style="font-size:17px;margin-bottom:6px">${t('Что читали', 'What was read')}</h3>${read.map((p) => `<div style="display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)"><div><b>${esc(t(p.ru, p.en))}</b><small class="cd-note" style="display:block">${t(...KIND[p.kind])}</small></div><b style="white-space:nowrap">${num(p.views)}</b></div>`).join('')}
        <h3 class="cd-h3" style="font-size:17px;margin:18px 0 4px">${t('Что делали в карточке', 'What people did on the page')}</h3>${bars([[t('Открыли меню', 'Opened the menu'), 412, 412], [t('Нажали «Маршрут»', 'Tapped "Route"'), 128, 412], [t('Нажали «Позвонить»', 'Tapped "Call"'), 54, 412], [t('Написали в чат', 'Wrote in the chat'), 31, 412]])}</div></div></section>`;
  }

  function paneTeam() {
    const q = S.teamQuery.trim().toLowerCase();
    const list = team.filter((m) => (S.teamRole === 'all' || m.role === S.teamRole) && (!q || `${m.ru} ${m.en} ${m.login}`.toLowerCase().includes(q)));
    const placeOf = (m) => (m.places === 'all' ? t('Все заведения', 'All places') : t(PLACES[m.places].ru, PLACES[m.places].en));
    const form = S.adding ? `<section class="cd-card cd-new"><h3>${t('Новый сотрудник', 'New staff member')}</h3><div class="cd-toolbar" style="margin-top:12px"><label class="cd-field"><span>${t('Имя', 'Name')}</span><input class="cd-input" data-input="newName" placeholder="${t('Например, Камила', 'For example, Kamila')}"></label>
      <label class="cd-field"><span>${t('Роль', 'Role')}</span><select class="cd-input" data-input="newRole">${['admin', 'moder', 'operator', 'master'].map((r) => `<option value="${r}">${t(...ROLES[r])}</option>`).join('')}</select></label></div>
      <div style="display:flex;gap:8px"><button type="button" class="cd-btn cd-btn-red" data-act="add-member">${t('Создать учётную запись', 'Create the account')}</button><button type="button" class="cd-btn" data-act="adding">${t('Отмена', 'Cancel')}</button></div></section>` : '';
    return `<div class="cd-head cd-head-one"><h1 class="cd-h1">${t('Сотрудники', 'Staff')}</h1><button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="adding" title="${t('Добавить сотрудника', 'Add staff')}">+ ${t('Сотрудник', 'Staff')}</button></div>
      <p class="cd-lead">${t('Кто работает в организации и к каким заведениям имеет доступ.', 'Who works in the organisation and which places they can access.')}<br>${team.length} ${t('из 10 учётных записей', 'of 10 accounts')} · ${org()}</p>${form}
      <div class="cd-toolbar"><label class="cd-field"><span>${t('Поиск сотрудников', 'Search staff')}</span><input class="cd-input" data-input="teamQuery" value="${esc(S.teamQuery)}" placeholder="${t('Имя, логин или заведение', 'Name, login or place')}"></label>
        <label class="cd-field"><span>${t('Роль', 'Role')}</span><select class="cd-input" data-input="teamRole"><option value="all">${t('Все роли', 'All roles')}</option>${Object.keys(ROLES).map((r) => `<option value="${r}" ${S.teamRole === r ? 'selected' : ''}>${t(...ROLES[r])}</option>`).join('')}</select></label></div>
      <table class="cd-table cd-collapse"><thead><tr><th>${t('Сотрудник', 'Staff member')}</th><th>${t('Роль', 'Role')}</th><th>${t('Заведения', 'Places')}</th><th style="text-align:right">${t('Доступ', 'Access')}</th></tr></thead><tbody>
      ${list.map((m) => { const i = team.indexOf(m); const open = S.teamOpen === i; const rights = m.rights || ROLE_RIGHTS[m.role];
        return `<tr class="${m.fresh ? 'cd-new' : ''}"><td><div style="display:flex;gap:12px;align-items:center"><span class="cd-ava">${esc(t(m.ru, m.en)[0])}</span><div><b>${esc(t(m.ru, m.en))}${m.me ? ` ${t('(вы)', '(you)')}` : ''}</b><small>${m.login} · ${m.last ? `${t('последний вход', 'last sign-in')} ${t(...m.last)}` : t('ещё не входил', 'not signed in yet')}</small></div></div></td>
          <td><span class="cd-role">${t(...ROLES[m.role])}</span></td><td class="cd-hide-phone">${placeOf(m)}</td><td style="text-align:right">${m.me ? `<span class="cd-note">${t('Полный доступ', 'Full access')}</span>` : ibtn(open ? 'check' : 'gear', open ? t('Готово', 'Done') : t('Настроить права', 'Set up rights'), `data-act="team-open" data-v="${i}"`, open ? 'cd-ibtn-ink' : '')}</td></tr>
          ${open ? `<tr><td colspan="4"><div class="cd-rights">${RIGHTS.map((r, ri) => `<label class="cd-check"><input type="checkbox" data-input="right" data-v="${i}:${ri}" ${rights.includes(ri) ? 'checked' : ''}>${t(...r)}</label>`).join('')}</div><small class="cd-note">${t('Права меняются сразу. Пароль и ключ для входа выдаются здесь же.', 'Rights change at once. Password and sign-in key are issued here too.')}</small></td></tr>` : ''}`; }).join('')}</tbody></table>
      <p class="cd-note" style="margin-top:16px">▸ ${t('Доступ курьеров к доставке — в «Гласео Курьер»', 'Couriers\' delivery access — in Glaseo Courier')}</p>`;
  }

  function paneSettings() {
    const back = `<button type="button" class="cd-back" data-act="set" data-v="">‹ ${t('Настройки', 'Settings')}</button>`;
    const save = `<button type="button" class="cd-btn cd-btn-red cd-btn-big" data-act="toast" data-v="saved" style="margin-top:6px">${t('Сохранить', 'Save')}</button>`;
    if (S.set === 'card') return `${back}<h1 class="cd-h1">${t('Карточка места', 'Place page')}</h1><div class="cd-grid2"><div>
      <label class="cd-field"><span>${t('Название', 'Name')}</span><input class="cd-input" value="${esc(placeName())}"></label>
      <label class="cd-field"><span>${t('Описание', 'Description')}</span><textarea class="cd-input">${t('Кофейня у набережной: свежая обжарка, завтраки весь день и мастер-классы по выходным.', 'A café by the embankment: fresh roast, breakfast all day and workshops at weekends.')}</textarea></label>
      <div class="cd-field"><span>${t('Категории', 'Categories')}</span>${chips('noop', [['1', t('Кофейни', 'Coffee shops')], ['2', t('Кафе', 'Cafés')]], '1')}</div>
      <div class="cd-field"><span>${t('Точка на карте', 'Point on the map')}</span><span class="cd-note" style="font-weight:400">${t('Иннополис, Университетская, 5 · пеший маршрут строится от неё', 'Innopolis, Universitetskaya 5 · walking routes start from it')}</span></div>${save}</div>
      <div><div class="cd-sec-title"><b>${t('Часы работы', 'Opening hours')}</b><small>${t('жители видят «Открыто сейчас»', 'residents see "Open now"')}</small></div><table class="cd-table cd-hours"><tbody>
      ${hours.map((h, i) => `<tr><td><b>${t(h[0], h[1])}</b></td><td>${h[4] ? `<input class="cd-input" value="${h[2]}"> – <input class="cd-input" value="${h[3]}">` : `<span class="cd-note">${t('Выходной', 'Closed')}</span>`}</td><td style="text-align:right"><button type="button" class="cd-switch" role="switch" aria-checked="${h[4]}" data-act="day-open" data-v="${i}" aria-label="${t(h[0], h[1])}"></button></td></tr>`).join('')}</tbody></table></div></div>`;
    if (S.set === 'delivery') { const opt = (k, ru, en) => `<div class="cd-program"><div><b>${t(ru, en)}</b></div><button type="button" class="cd-switch" role="switch" aria-checked="${pay[k]}" data-act="pay" data-v="${k}" aria-label="${t(ru, en)}"></button></div>`;
      return `${back}<h1 class="cd-h1">${t('Доставка и оплата', 'Delivery and payment')}</h1><div class="cd-grid2"><div>${opt('delivery', 'Принимаем заказы на доставку', 'We take delivery orders')}
        <div class="cd-field" style="margin-top:14px"><span>${t('Зона доставки', 'Delivery area')}</span>${chips('zone', [['city', t('Весь Иннополис', 'All of Innopolis')], ['2km', t('До 2 км', 'Up to 2 km')]], pay.zone)}</div>
        <label class="cd-field"><span>${t('Минимальный заказ, ₽', 'Minimum order, ₽')}</span><input class="cd-input" value="${pay.min}" inputmode="numeric"></label>${save}</div>
        <div><div class="cd-sec-title"><b>${t('Как гость платит', 'How the guest pays')}</b><small>${t('деньги идут вам, мимо гласео', 'money goes to you, not through glaseo')}</small></div>${opt('link', 'Ссылка на оплату вашего банка', 'Your bank\'s payment link')}${opt('qr', 'QR по СБП', 'QR via SBP')}${opt('cash', 'Наличными курьеру', 'Cash to the courier')}${opt('cardCourier', 'Картой курьеру', 'Card to the courier')}</div></div>`; }
    if (S.set === 'integr') { const box = (k, name, note) => `<div><b>${name}</b><small>${note}</small>${integrations[k] ? badge(t('Подключено · тестовый режим', 'Connected · test mode'), 'good') : `<button type="button" class="cd-btn cd-btn-red" data-act="integr" data-v="${k}">${t('Подключить', 'Connect')}</button>`}</div>`;
      return `${back}<h1 class="cd-h1">${t('Интеграции', 'Integrations')}</h1><p class="cd-lead">${t('Касса передаёт покупки и погашенные промокоды — они появятся в статистике PRO.', 'The till passes purchases and redeemed promo codes — they show up in PRO statistics.')}</p><div class="cd-integr">${box('iiko', 'iiko', t('Меню и чеки из iiko', 'Menu and receipts from iiko'))}${box('rk', 'r_keeper', t('Чеки и промокоды из r_keeper', 'Receipts and promo codes from r_keeper'))}</div>`; }
    if (S.set === 'billing') return `${back}<h1 class="cd-h1">${t('Оплата и PRO', 'Billing and PRO')}</h1><section class="cd-card"><h3><span class="cd-pro">PRO</span> ${t('Тариф подключён', 'Plan active')}</h3><p style="margin:10px 0">${t('Оплачен до 20 ноября 2026. Следующий платёж — по счёту, который пришлёт команда гласео.', 'Paid until 20 November 2026. The next payment is by the invoice the glaseo team sends.')}</p>
      <p class="cd-note">${t('Ни тариф, ни PRO не поднимают место в ленте — они дают инструменты: отчёты, советы ИИ-маркетолога, A/B-тесты.', 'Neither the plan nor PRO lifts a place in the feed — they give tools: reports, AI marketer tips, A/B tests.')}</p><button type="button" class="cd-btn" data-act="toast" data-v="docs" style="margin-top:12px">${t('Счета и документы', 'Invoices and documents')}</button></section>`;
    const rows = [['card', t('Карточка места', 'Place page'), t('Название, описание, фотографии и часы работы', 'Name, description, photos and opening hours')], ['delivery', t('Доставка и оплата', 'Delivery and payment'), t('Зона доставки, условия и способы оплаты', 'Delivery area, terms and payment methods')], ['integr', t('Интеграции', 'Integrations'), t('iiko и r_keeper', 'iiko and r_keeper')], ['bookings', t('Специалисты и запись', 'Specialists and booking'), t('Мастера, услуги и расписание', 'Specialists, services and schedule')], ['billing', t('Оплата и PRO', 'Billing and PRO'), t('Тариф, счета и документы', 'Plan, invoices and documents')]];
    return `<h1 class="cd-h1">${t('Настройки', 'Settings')}</h1><div class="cd-set-list">${rows.map(([k, title, note]) => rowBtn(k === 'bookings' ? 'go' : 'set', k, '', title, note)).join('')}</div>`;
  }

  const inbox = { approve: [1], review: [2, 3] };
  function paneInbox() {
    const items = S.inboxTab === 'approve' ? inbox.approve.map((id) => posts.find((p) => p.id === id)).filter((p) => p && p.st === 'owner')
      : S.inboxTab === 'review' ? posts.filter((p) => ['review', 'scheduled', 'published'].includes(p.st)).slice(0, 5) : [];
    const pending = posts.filter((p) => p.st === 'owner').length;
    const line = (p) => S.inboxTab === 'approve'
      ? `<div style="padding:14px 0 14px 14px;border-bottom:1px solid var(--line);border-left:3px solid var(--red)"><small class="cd-note">${t('сегодня в 09:40', 'today at 09:40')} · ${t('Дарья Лис', 'Darya Lis')}</small><b style="display:block;font-size:20px;margin:4px 0">«${esc(t(p.ru, p.en))}»</b><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="cd-note">${t('Ждёт вашего решения', 'Waiting for your decision')}</span><button type="button" class="cd-btn cd-btn-red" data-act="release" data-v="${p.id}">${t('Выпустить', 'Release')}</button></div></div>`
      : rowBtn('post', p.id, postBadge(p), `«${t(p.ru, p.en)}»`, p.st === 'review' ? t('Читает команда гласео', 'The glaseo team is reading it') : t('Решение принято', 'Decision made'));
    return `<div style="margin-bottom:18px">${chips('inboxTab', [['approve', t('На согласование', 'To approve'), pending], ['review', t('Проверка гласео', 'glaseo review')], ['complaints', t('Жалобы', 'Complaints')]], S.inboxTab)}</div>
      <div class="cd-sec-title"><b>${S.inboxTab === 'approve' ? t('На согласование', 'To approve') : S.inboxTab === 'review' ? t('Проверка гласео', 'glaseo review') : t('Жалобы', 'Complaints')}</b><small>${t('Инбокс', 'Inbox')}</small></div>
      ${items.map(line).join('') || `<div class="cd-empty">${S.inboxTab === 'complaints' ? t('Жалоб нет. Жалобы жителей разбирает команда гласео и сообщает вам решение.', 'No complaints. The glaseo team handles residents\' complaints and tells you the decision.') : t('Здесь пусто — всё решено.', 'Nothing here — all decided.')}</div>`}`;
  }

  const PANES = { home: paneHome, posts: panePosts, post: panePost, compose: paneCompose, chats: paneChats, orders: paneOrders, bookings: paneBookings, loyalty: paneLoyalty, menu: paneMenu, stats: paneStats, team: paneTeam, settings: paneSettings, inbox: paneInbox };

  // ---------- Shell ----------
  function shell() {
    const current = S.view in NAV_OF ? NAV_OF[S.view] : S.view;
    const inboxCount = posts.filter((p) => p.st === 'owner').length;
    const sheetItems = [['posts', 'posts', t('Публикации', 'Posts')], ['chats', 'chats', t('Чаты', 'Chats')], ['loyalty', 'loyalty', t('Лояльность', 'Loyalty')], ['menu', 'menu', t('Меню и услуги', 'Menu and services')], ['stats', 'stats', t('Статистика', 'Statistics')], ['team', 'team', t('Сотрудники', 'Staff')], ['settings', 'settings', t('Настройки', 'Settings')], ['bookings', 'bookings', t('Специалисты и запись', 'Specialists and booking')], ['billing', 'billing', t('Оплата и PRO', 'Billing and PRO')], ['guide', 'guide', t('Справка', 'Help')]];
    root.innerHTML = `<div class="cd-chrome" aria-hidden="true"><i></i><i></i><i></i><span>glaseo.ru</span></div><div class="cd-status" aria-hidden="true"><span>9:41</span><span>● ▴ ▰</span></div>
      <div class="cd-app">
        <header class="cd-top"><span class="cd-brand"><b>гласео<i>.</i></b><small>${t('для бизнеса', 'for business')}</small></span>
          <div class="cd-place"><button type="button" data-act="place-menu" aria-expanded="${S.placeMenu}"><span><b>${esc(placeName())}</b><small>${org()}</small></span><i aria-hidden="true">▼</i></button>
            ${S.placeMenu ? `<div class="cd-menu">${PLACES.map((p, i) => `<button type="button" data-act="place" data-v="${i}" aria-current="${String(i === S.place)}"><b>${esc(t(p.ru, p.en))}</b><small>${org()}</small></button>`).join('')}</div>` : ''}</div>
          <div class="cd-top-right"><button type="button" class="cd-orders-btn" data-act="go" data-v="chats" aria-pressed="${String(S.view === 'chats')}">${icon('chat')}${t('Заказы', 'Orders')} <i class="cd-count">${needs() || ''}</i></button>
            <button type="button" class="cd-icon-btn" data-act="go" data-v="inbox" aria-label="${t('Входящие', 'Inbox')}">${icon('inbox')}<i class="cd-count">${inboxCount || ''}</i></button>
            <button type="button" class="cd-me" data-act="set-billing"><i>${icon('profile')}</i>${t('Алина Смирнова', 'Alina Smirnova')} <span class="cd-pro">PRO</span></button>
            <button type="button" class="cd-icon-btn" data-act="toast" data-v="logout" aria-label="${t('Выйти', 'Sign out')}">${icon('out')}</button></div></header>
        <nav class="cd-nav" aria-label="${t('Разделы бизнеса', 'Business sections')}">${NAV.map(([id, label]) => `<button type="button" data-act="go" data-v="${id}" ${current === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${t(...label)}</span></button>`).join('')}
          <div class="cd-nav-foot"><span>${t('Гласео Курьер', 'Glaseo Courier')} ${icon('arrow')}</span><small>${t('Гласео для бизнеса', 'Glaseo for business')}</small></div></nav>
        <main class="cd-main">${PANES[S.view]()}</main>
        <nav class="cd-tabbar" aria-label="${t('Разделы', 'Sections')}">
          <button type="button" data-act="go" data-v="home" ${current === 'home' ? 'aria-current="page"' : ''}>${icon('home')}${t('Главная', 'Home')}</button>
          <button type="button" data-act="go" data-v="orders" ${current === 'orders' ? 'aria-current="page"' : ''}>${icon('orders')}${t('Заказы', 'Orders')}<i class="cd-count">${needs() || ''}</i></button>
          <button type="button" class="cd-tab-add" data-act="go" data-v="compose">${icon('plus')}${t('Пост', 'Post')}</button>
          <button type="button" data-act="go" data-v="inbox" ${S.view === 'inbox' ? 'aria-current="page"' : ''}>${icon('inbox')}${t('Входящие', 'Inbox')}<i class="cd-count">${inboxCount || ''}</i></button>
          <button type="button" data-act="sheet" ${S.sheet ? 'aria-current="page"' : ''}>${icon('more')}${t('Ещё', 'More')}</button></nav>
      </div>
      <div class="cd-sheet-back ${S.sheet ? 'is-on' : ''}" data-act="sheet"></div>
      <div class="cd-sheet ${S.sheet ? 'is-on' : ''}"><div class="cd-sheet-me"><span class="cd-ava">${icon('profile')}</span><div><b>${t('Алина Смирнова', 'Alina Smirnova')}</b><small>${t('Владелец', 'Owner')} · ${org()}</small></div><span class="cd-pro">PRO</span></div>
        <div class="cd-sheet-grid">${sheetItems.map(([v, ic, label]) => `<button type="button" data-act="${v === 'billing' ? 'set-billing' : v === 'guide' ? 'toast' : 'go'}" data-v="${v}">${icon(ic)}${label}</button>`).join('')}</div>
        <div class="cd-sheet-foot"><button type="button" data-act="toast" data-v="profile">${t('Профиль', 'Profile')}</button><button type="button" data-act="toast" data-v="logout">${t('Выйти', 'Sign out')}</button><button type="button" data-act="sheet">${t('Свернуть', 'Close')}</button></div></div>
      <div class="cd-toast" role="status" aria-live="polite"></div>`;
    root.querySelectorAll('.cd-only-phone').forEach((el) => { el.hidden = stage.dataset.view !== 'phone'; });
    const msgs = root.querySelector('.cd-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }
  function render(keepScroll) {
    const main = root.querySelector('.cd-main');
    const top = keepScroll && main ? main.scrollTop : 0;
    shell();
    root.querySelector('.cd-main').scrollTop = top;
  }
  function go(view) {
    S.view = view; S.sheet = false; S.placeMenu = false;
    if (view === 'chats' && stage.dataset.view === 'phone') S.chatOpen = false;
    render();
  }

  const TOASTS = () => ({
    block: t('Житель больше не сможет писать этому месту. Это пример — никто не заблокирован.', 'The resident can no longer write to this place. It is an example — nobody is blocked.'),
    move: t('Гость получит запрос на перенос. Время изменится только после его согласия.', 'The guest gets a request to move the visit. The time changes only after they agree.'),
    picture: t('В кабинете здесь выбирают картинку с компьютера или телефона.', 'In the cabinet you pick a picture from your computer or phone here.'),
    saved: t('Сохранено — жители увидят изменения сразу.', 'Saved — residents see the changes at once.'),
    logout: t('Это пример кабинета — выходить некуда 🙂', 'This is an example of the cabinet — nowhere to sign out to 🙂'),
    profile: t('В профиле — имя, вход и код приложения для входа.', 'The profile holds your name, sign-in and app code.'),
    docs: t('Счета и закрывающие документы приходят сюда и на почту.', 'Invoices and closing documents arrive here and by e-mail.'),
    guide: t('В кабинете у каждого раздела есть короткая справка.', 'In the cabinet every section has a short help page.'),
  });

  // ---------- Actions ----------
  const later = (fn, ms) => setTimeout(() => { fn(); render(true); }, ms);
  function done(id) { tasks = tasks.filter((x) => x !== id); }

  root.addEventListener('click', (event) => {
    const el = event.target.closest('[data-act]');
    if (!el || !root.contains(el)) return;
    const act = el.dataset.act, v = el.dataset.v;
    switch (act) {
      case 'go':
        if (v === 'stats-pro') { S.statsTab = 'pro'; go('stats'); return; }
        if (v === 'settings') S.set = null;
        if (v === 'compose') Object.assign(draft, { kind: 'news', title: '', excerpt: '', details: '', more: false });
        go(v); return;
      case 'set': S.set = v || null; go('settings'); return;
      case 'set-billing': S.set = 'billing'; go('settings'); return;
      case 'place-menu': S.placeMenu = !S.placeMenu; render(true); return;
      case 'place': S.place = Number(v); S.placeMenu = false; render(true); toast(t('Активное заведение сменилось. Один владелец ведёт несколько мест из одного кабинета.', 'The active place changed. One owner runs several places from one cabinet.')); return;
      case 'sheet': S.sheet = !S.sheet; render(true); return;
      case 'toast': toast(TOASTS()[v]); return;
      case 'period': S.period = Number(v); render(true); return;
      case 'statsTab': S.statsTab = v; render(true); return;
      case 'proTab': S.proTab = v; render(true); return;
      case 'tip': S.tip = (S.tip + 1) % TIPS().length; render(true); return;
      case 'tip-post': { const tip = TIPS()[S.tip]; Object.assign(draft, { kind: 'offer', title: tip[2], excerpt: tip[1].split('. ')[0] + '.', details: '', more: true, when: 'ai' }); go('compose'); return; }
      case 'post': S.post = Number(v); go('post'); return;
      case 'release': { const p = posts.find((x) => x.id === Number(v)); p.st = 'review'; p.when = ['сегодня', 'today']; done('post'); render(true); toast(t('Выпущено — публикацию проверит команда гласео и она выйдет в ленту.', 'Released — the glaseo team reviews the post and it goes into the feed.'));
        later(() => { p.st = 'published'; p.views = 64; p.opens = 9; p.likes = 7; toast(t('Команда гласео одобрила «Тыквенный латте вернулся» — публикация в ленте.', 'The glaseo team approved "Pumpkin latte is back" — the post is in the feed.')); }, 4200); return; }
      case 'send': { const p = posts.find((x) => x.id === Number(v)); p.st = 'review'; render(true); toast(t('Отправлено на проверку команде гласео.', 'Sent to the glaseo team for review.')); return; }
      case 'unpublish': { const p = posts.find((x) => x.id === Number(v)); p.st = 'archived'; render(true); toast(t('Снято с публикации — запись осталась в архиве места.', 'Taken down — the post stays in the place\'s archive.')); return; }
      case 'kind': draft.kind = v; render(true); return;
      case 'more': draft.more = !draft.more; render(true); return;
      case 'submit': {
        if (!draft.title.trim()) { toast(t('Добавьте заголовок — без него публикацию не отправить.', 'Add a title — a post cannot go without one.')); root.querySelector('[data-draft="title"]')?.focus(); return; }
        posts.unshift({ id: Date.now(), st: v === 'draft' ? 'draft' : 'review', ru: draft.title, en: draft.title, kind: draft.kind, when: ['только что', 'just now'], text: [draft.excerpt, draft.excerpt], views: 0, fresh: true });
        go('posts'); toast(v === 'draft' ? t('Черновик сохранён.', 'Draft saved.') : t('Отправлено на проверку. Подписчики получат уведомление, когда публикация выйдет.', 'Sent for review. Followers get a notification when the post goes out.')); return;
      }
      case 'chatFilter': S.chatFilter = v; render(true); return;
      case 'chat': S.chat = v; S.view = 'chats'; S.sheet = false; S.chatOpen = true; render(); return;
      case 'chat-back': S.chatOpen = false; render(); return;
      case 'invoice': { const o = orders.find((x) => x.n === Number(v)); const ch = chats.find((x) => x.order === o.n); o.pay = 'wait'; done('order');
        ch.msgs.push(['sys', `Счёт выставлен: ${o.sum} ₽. Житель оплатит по вашей ссылке или QR.`, `Invoice sent: ${o.sum} ₽. The resident pays by your link or QR.`]); render(true);
        later(() => { o.pay = 'paid'; const r = ch.replies.shift(); if (r) ch.msgs.push(['in', r[0], r[1], '12:09']); ch.msgs.push(['sys', 'Оплата получена — можно готовить', 'Payment received — you can start cooking']); }, 2200); return; }
      case 'paid': { const o = orders.find((x) => x.n === Number(v)); const ch = chats.find((x) => x.order === o.n); o.pay = 'paid'; done('pay'); ch.msgs.push(['sys', 'Оплата получена — можно готовить', 'Payment received — you can start cooking']); render(true); return; }
      case 'say': {
        const input = root.querySelector('[data-chat-input]'); const text = input.value.trim();
        if (!text) { input.focus(); return; }
        const ch = chats.find((x) => x.id === v); ch.msgs.push(['out', text, text, '12:10']);
        if (ch.waiting) { ch.waiting = false; done('marat'); }
        render(true);
        const r = ch.replies.shift();
        if (r) later(() => { ch.msgs.push(['in', r[0], r[1], '12:11']); if (ch.id === 'marat') { bookings['4-0-12:30'] = ['Марат', 'Marat', 'art', true]; ch.msgs.push(['sys', 'Новая запись: сб, 24 октября, 12:30 · Мастер-класс по латте-арту · Вера', 'New booking: Sat, 24 October, 12:30 · Latte art workshop · Vera']); toast(t('Марат записался — запись уже в расписании Веры.', 'Marat booked — the visit is already in Vera\'s schedule.')); } }, 1500);
        return;
      }
      case 'orderFilter': S.orderFilter = v; render(true); return;
      case 'advance': { const o = orders.find((x) => x.n === Number(v)); if (o.step === 2) { S.courierFor = o.n; render(true); return; } if (o.step === 0 && o.pay === 'wait') done('pay'); o.step += 1; render(true);
        if (o.step >= 4) toast(t('Заказ доставлен. Житель увидит это в чате.', 'Order delivered. The resident sees it in the chat.')); return; }
      case 'courier': { const [n, who] = v.split(':'); const o = orders.find((x) => x.n === Number(n)); o.step = 3; S.courierFor = null; render(true);
        toast(who === '0' ? t('Илья получил заказ в «Гласео Курьер».', 'Ilya got the order in Glaseo Courier.') : t('Рустам получил заказ в «Гласео Курьер».', 'Rustam got the order in Glaseo Courier.')); return; }
      case 'day': S.day = Number(v); S.slot = null; render(true); return;
      case 'slot': S.slot = S.slot === v ? null : v; render(true); return;
      case 'free': toast(t('Это время свободно — гости видят его в приложении и записываются сами.', 'This time is free — guests see it in the app and book by themselves.')); return;
      case 'cancel-slot': delete bookings[S.slot]; S.slot = null; render(true); toast(t('Запись отменена — гость получил уведомление.', 'Booking cancelled — the guest was notified.')); return;
      case 'loyTab': S.loyTab = v; render(true); return;
      case 'program': { const p = programs.find((x) => x.id === v); p.on = !p.on; render(true); return; }
      case 'scan': S.guest = true; render(true); toast(t('Карта гостя открыта.', 'Guest card opened.')); return;
      case 'close-guest': S.guest = false; render(true); return;
      case 'buy': {
        const amount = Math.max(0, Math.round(Number(String(S.amount ?? 640).replace(/\D/g, '')) || 0));
        if (!amount) { toast(t('Введите сумму покупки.', 'Enter the purchase amount.')); return; }
        const spent = S.spend ? Math.min(guest.balance, Math.floor(amount * 0.3)) : 0;
        const plus = Math.round((amount - spent) * 0.06);
        guest.balance += plus - spent; guest.stamps += 1;
        let gift = false; if (guest.stamps >= 8) { guest.stamps = 0; gift = true; }
        buys.unshift({ ru: 'Анна П.', en: 'Anna P.', sum: amount - spent, plus, at: '12:14', stamp: gift ? 8 : guest.stamps, fresh: true });
        render(true);
        toast(gift ? t('Восьмой штамп — следующий кофе гостю в подарок!', 'Eighth stamp — the guest\'s next coffee is free!') : spent ? t(`Списано ${spent} баллов, начислено ${plus}.`, `${spent} points spent, ${plus} earned.`) : t(`Покупка проведена: +${plus} баллов и штамп.`, `Purchase recorded: +${plus} points and a stamp.`)); return;
      }
      case 'menuFilter': S.menuFilter = v; render(true); return;
      case 'edit-item': S.editing = Number(v); render(true); root.querySelector('.cd-price-input')?.focus(); return;
      case 'save-item': S.editing = null; render(true); toast(t('Цена обновлена — жители видят её сразу.', 'Price updated — residents see it at once.')); return;
      case 'drop-item': { const i = menu.findIndex((m) => m.id === Number(v)); menu.splice(i, 1); render(true); toast(t('Позиция убрана из карточки.', 'The item is removed from the page.')); return; }
      case 'add-item': { const id = ++menuId; menu.unshift(v === 'service' ? { id, type: 'service', ru: ['Новая услуга', 'Длительность и мастер'], en: ['New service', 'Duration and specialist'], dur: 60, price: 1000, fresh: true } : { id, type: 'menu', ru: ['Новая позиция', 'Описание, вес и КБЖУ'], en: ['New item', 'Description, weight and nutrition'], kbju: null, size: null, price: 300, fresh: true }); S.menuFilter = 'all'; S.editing = id; render(true); return; }
      case 'adding': S.adding = !S.adding; render(true); if (S.adding) root.querySelector('[data-input="newName"]')?.focus(); return;
      case 'add-member': {
        const name = (S.newName || '').trim();
        if (!name) { toast(t('Впишите имя сотрудника.', 'Type the staff member\'s name.')); return; }
        const login = `${name.toLowerCase().replace(/[^a-zа-яё]/gi, '').slice(0, 8) || 'staff'}${team.length + 1}`;
        team.push({ ru: name, en: name, login, last: null, role: S.newRole || 'admin', places: S.place, fresh: true });
        S.adding = false; S.newName = ''; render(true);
        toast(t('Учётная запись создана. Логин и пароль показываются один раз — передайте их сотруднику.', 'Account created. The login and password are shown once — pass them on.')); return;
      }
      case 'team-open': S.teamOpen = S.teamOpen === Number(v) ? null : Number(v); render(true); return;
      case 'day-open': hours[Number(v)][4] = !hours[Number(v)][4]; render(true); return;
      case 'pay': pay[v] = !pay[v]; render(true); return;
      case 'zone': pay.zone = v; render(true); return;
      case 'integr': integrations[v] = true; render(true); toast(t('Подключено в тестовом режиме: чеки начнут приходить в статистику.', 'Connected in test mode: receipts start arriving in statistics.')); return;
      case 'inboxTab': S.inboxTab = v; render(true); return;
      default:
    }
  });

  // Inputs keep their focus: only the bits that depend on them are redrawn.
  root.addEventListener('input', (event) => {
    const el = event.target;
    if (el.dataset.draft) {
      const key = el.dataset.draft;
      draft[key] = el.type === 'checkbox' ? el.checked : el.value;
      const count = root.querySelector(`[data-count="${key}"]`);
      if (count) count.textContent = `${el.value.length}/${el.maxLength}`;
      if (key === 'title') {
        root.querySelector('[data-preview="title"]').textContent = el.value || t('Заголовок публикации', 'Post title');
        root.querySelector('[data-preview="push"]').textContent = el.value || t('Заголовок публикации', 'Post title');
      }
      if (key === 'excerpt') root.querySelector('[data-preview="excerpt"]').textContent = el.value || t('Короткий текст, который виден в ленте.', 'A short text that shows in the feed.');
      return;
    }
    const key = el.dataset.input;
    if (!key) return;
    if (key === 'menuQuery' || key === 'teamQuery') {
      S[key] = el.value; const pos = el.selectionStart; render(true);
      const again = root.querySelector(`[data-input="${key}"]`); again.focus(); again.setSelectionRange(pos, pos); return;
    }
    if (key === 'price') { const m = menu.find((x) => x.id === Number(el.dataset.v)); m.price = Number(el.value.replace(/\D/g, '')) || 0; return; }
    if (key === 'code') { const digits = el.value.replace(/\D/g, '').slice(0, 8); el.value = digits.replace(/^(\d{4})(\d)/, '$1 $2'); if (digits.length === 8) { S.guest = true; render(true); toast(t('Карта гостя открыта.', 'Guest card opened.')); } return; }
    if (key === 'spend') { S.spend = el.checked; return; }
    if (key === 'right') { const [i, r] = el.dataset.v.split(':').map(Number); const m = team[i]; m.rights = (m.rights || [...ROLE_RIGHTS[m.role]]); if (el.checked) m.rights.push(r); else m.rights = m.rights.filter((x) => x !== r); return; }
    S[key] = el.value;
  });
  root.addEventListener('change', (event) => {
    const el = event.target;
    if (el.dataset.draft === 'when') { draft.when = el.value; return; }
    const key = el.dataset.input;
    if (key === 'postFilter' || key === 'teamRole') { S[key] = el.value; render(true); }
    if (key === 'newRole') S.newRole = el.value;
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('[data-chat-input]')) { event.preventDefault(); root.querySelector('[data-act="say"]').click(); }
  });
  document.addEventListener('click', (event) => {
    if (S.placeMenu && !event.target.closest('.cd-place')) { S.placeMenu = false; render(true); }
  });

  // ---------- Computer or phone ----------
  const DESK_W = 1280, DESK_H = 838;
  function fit() {
    if (stage.dataset.view !== 'desk') { root.style.transform = ''; stage.style.height = ''; return; }
    const scale = Math.min(1, stage.clientWidth / DESK_W);
    root.style.transform = scale < 1 ? `scale(${scale})` : '';
    root.style.marginInline = scale < 1 ? '0' : 'auto';
    stage.style.height = `${Math.ceil(DESK_H * scale) + 2}px`;
  }
  function setView(view) {
    stage.dataset.view = view;
    viewSwitch.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.cabView === view)));
    S.sheet = false;
    if (view === 'phone' && S.view === 'chats') S.chatOpen = false;
    render();
    fit();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  viewSwitch.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => setView(button.dataset.cabView)));
  new ResizeObserver(fit).observe(stage);
  new MutationObserver(() => {
    const next = document.documentElement.lang === 'en' ? 'en' : 'ru';
    if (next !== lang) { lang = next; render(true); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  setView(window.matchMedia('(max-width: 760px), (pointer: coarse) and (max-width: 1024px)').matches ? 'phone' : 'desk');
})();
