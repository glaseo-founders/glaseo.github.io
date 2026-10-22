// Two languages of the page. The Russian text stays in the HTML and is the key: the table below gives its English.
// Text that has no line here simply stays Russian, so a hand edit of the page never breaks — it only waits for a translation.
// The choice is kept in localStorage ("glaseo-lang"); without one the language of the browser decides (Russian, or English
// for any other). `?lang=en` or `?lang=ru` in the address sets it too. The page in <head> marks <html data-lang> before paint.
const EN = {
  "К": "B",
  "В": "E",
  "Чаты": "Chats",
  "гласео": "glaseo",
  "Язык": "Language",
  "К содержанию": "Skip to content",
  "Что внутри": "What's inside",
  "Как работает": "How it works",
  "Вопросы и ответы для бизнеса, обзор кабинета": "Questions and answers for businesses, a tour of the cabinet",
  "Светлая": "Light",
  "Темная": "Dark",
  "Системная": "System",
  "Жду гласео": "I'm waiting for glaseo",
  "рядом": "nearby",
  "Твой город": "Your city",
  "Твой выбор": "Your choice",
  "Места, события и предложения твоего города в одной ленте. Находи новое и оставайся на связи с теми, кого выбираешь сам.": "Places, events and offers of your city in one feed. Find something new and stay in touch with those you choose yourself.",
  "Посмотреть, что внутри": "See what's inside",
  "Готовимся к запуску в Иннополисе. Для жителей бесплатно.": "Getting ready to launch in Innopolis. Free for residents.",
  "Город сквозь призму честности.": "The city through the lens of honesty.",
  "гласео — для кого?": "glaseo — who is it for?",
  "Для жителей": "For residents",
  "Жителю города": "For people of the city",
  "Для бизнеса": "For business",
  "Заведению и сервису": "For places and services",
  "Все, ради чего": "Everything worth",
  "стоит выйти": "going out for",
  "Новости мест, события и предложения рядом. Собери свой город в одной ленте.": "News from places, events and offers nearby. Put your city together in one feed.",
  "Найти место": "Find a place",
  "Каталог и карта подскажут, что рядом.": "The catalogue and the map tell you what's nearby.",
  "Выбрать событие": "Pick an event",
  "Сегодня": "Today",
  "Встречи, выставки и другие поводы выйти.": "Meetups, exhibitions and other reasons to go out.",
  "Быть на связи": "Stay in touch",
  "Подпишись на место и следи за его новостями.": "Follow a place and keep up with its news.",
  "Места и события выбираешь ты. Платного приоритета в ленте нет.": "You choose the places and events. There is no paid priority in the feed.",
  "Меньше поиска.": "Less searching.",
  "Больше своего.": "More of your own.",
  "Найди место": "Find a place",
  "Останься на связи": "Stay in touch",
  "Иннополис": "Innopolis",
  "Подписки": "Following",
  "Кофе": "Coffee",
  "в городе": "in the city",
  "Рядом": "Nearby",
  "Так выглядит": "This is what",
  "Лента": "Feed",
  "Места": "Places",
  "Карточка места": "Place card",
  "Карта": "Map",
  "Экраны демо-версии гласео. Заведения и публикации — примеры.": "Screens of the glaseo demo. The places and posts are examples.",
  "Есть": "Got a",
  "вопрос?": "question?",
  "Когда можно скачать?": "When can I download it?",
  "гласео готовится к запуску. Для Android планируем выпуск в RuStore, для iPhone — веб-приложение в браузере. Ссылки появятся здесь, когда можно будет присоединиться.": "glaseo is getting ready to launch. For Android we plan a release in RuStore, for iPhone — a web app in the browser. The links will appear here when you can join.",
  "Это бесплатно?": "Is it free?",
  "Да. Для жителей приложение будет бесплатным. Ты сам выбираешь места и подписки, а бизнес не может купить приоритет в ленте.": "Yes. The app will be free for residents. You choose the places and follows yourself, and a business cannot buy priority in the feed.",
  "В каком городе будет работать?": "Which city will it work in?",
  "Начинаем с Иннополиса. Позже планируем подключать другие города.": "We start with Innopolis. Later we plan to add other cities.",
  "Внимание": "Attention",
  "не продается": "is not for sale",
  "Новости, акции и события": "News, promos and events",
  "заведения": "of a place",
  "Публикация": "Post",
  "Три шага": "Three steps",
  "до кабинета.": "to the cabinet.",
  "Заявка": "Application",
  "Проверка": "Check",
  "Кто может подключиться?": "Who can join?",
  "Кто видит публикации?": "Who sees the posts?",
  "Можно заплатить за место выше других?": "Can I pay to be placed above others?",
  "Нет. Ни тариф, ни дополнительные инструменты не дают приоритета в ленте. Внимание нельзя купить — его можно только заслужить. Люди сами решают, кого выбрать.": "No. Neither a plan nor extra tools give priority in the feed. Attention can't be bought — it can only be earned. People decide for themselves whom to choose.",
  "Увидимся": "See you",
  "Готовимся к запуску": "Getting ready to launch",
  "Первый город — Иннополис.": "The first city is Innopolis.",
  "Для жителей — бесплатно.": "Free for residents.",
  "Для Android · готовим запуск": "For Android · launch in preparation",
  "Для iPhone · скоро": "For iPhone · soon",
  "Новости проекта — в Telegram": "Project news — on Telegram",
  "Скопировать ссылку": "Copy the link",
  "Подключение бизнеса": "Connecting a business",
  "Готовим прием заявок.": "Applications will open soon.",
  "Подключить свой бизнес": "Connect your business",
  "Скоро": "Soon",
  "Поддержать гласео": "Support glaseo",
  "Для жителей приложение бесплатно. Помочь запуску можно пожертвованием — любой суммой.": "The app is free for residents. You can help the launch with a donation — of any amount.",
  "Пожертвовать через ЮMoney": "Donate via YooMoney",
  "Поддержать проект": "Support the project",
  "Это не реклама. Нас выбирают люди.": "This is not an ad. People choose us.",
  "Наверх": "To the top",
  "гласео — места, события и предложения города. Открытый выбор для жителей и инструменты для локального бизнеса. Без платного приоритета. Начинаем с Иннополиса.": "glaseo — places, events and offers of the city. An open choice for residents and tools for local business. No paid priority. Starting with Innopolis.",
  "Городская лента, карта и любимые места. Люди выбирают сами, бизнес работает с клиентами напрямую.": "A city feed, a map and favourite places. People choose for themselves, businesses work with customers directly.",
  "гласео — наверх": "glaseo — to the top",
  "Основная навигация": "Main navigation",
  "Тема оформления": "Colour theme",
  "Для кого показать страницу": "Who to show the page for",
  "Возможности приложения": "What the app can do",
  "Экраны приложения": "App screens",
  "Для Android": "For Android",
  "Для iPhone · веб-приложение": "For iPhone · web app",
  "Страница не найдена — гласео": "Page not found — glaseo",
  "Здесь": "Nothing",
  "пусто": "here",
  "Такой страницы нет. Возможно, адрес изменился или в нем опечатка.": "There is no such page. The address may have changed or has a typo in it.",
  "На главную": "To the home page",
  "гласео — на главную": "glaseo — to the home page",
  "Ссылка скопирована.": "Link copied.",
  "Готово": "Done",
  "Скопируй адрес из строки браузера.": "Copy the address from the browser bar.",
  "Не только": "Not just",
  "лента": "a feed",
  "Узнал о месте? Сразу закажи, запишись или приходи с бонусами.": "Found a place? Order, book or come over with your bonuses right away.",
  "Доставка из меню": "Delivery from the menu",
  "Собери заказ в карточке места и следи за ним в чате. Платишь заведению напрямую, без наценки.": "Put an order together on the place's page and follow it in the chat. You pay the place directly, with no markup.",
  "Запись к мастеру": "Book a specialist",
  "Выбери мастера, день и время. Перенести визит можно только с твоего согласия.": "Pick a master, a day and a time. A visit can be moved only with your consent.",
  "Бонусы в одном QR": "Bonuses in one QR",
  "Баллы, штампы и скидки разных мест в одной карте гостя. Покажи код на кассе.": "Points, stamps and discounts of different places on one guest card. Show the code at the till.",
  "Знаешь, что ешь": "Know what you eat",
  "Вес порции и КБЖУ у блюд, фильтр «С КБЖУ» в списке мест.": "Portion weight, calories and macros for dishes, and a \"With nutrition\" filter in the list of places.",
  "Рядом — значит рядом": "Nearby means nearby",
  "Места по расстоянию пешком, фильтр «Открыто сейчас» и своя карта города с маршрутом.": "Places by walking distance, an \"Open now\" filter and the app's own city map with a route.",
  "Уведомления по делу": "Notifications that matter",
  "Приходят, когда место из подписок публикует новость. Их можно выключить для любого места.": "They come when a place you follow posts news. You can turn them off for any place.",
  "Найди место. Закажи или запишись. Приходи.": "Find a place. Order or book. Come over.",
  "Новости мест строго по времени. Анонсы в блоке «Скоро».": "News from places, strictly by time. Announcements in the «Soon» block.",
  "Места рядом": "Places nearby",
  "Сначала ближайшие. Фильтры «Открыто сейчас», «Доставка», «Запись», «С КБЖУ».": "Closest first. Filters \"Open now\", \"Delivery\", \"Booking\", \"With nutrition\".",
  "Подписка, сообщение, звонок, маршрут и бонусы заведения.": "Follow, message, call, route and the place's bonuses.",
  "Меню и доставка": "Menu and delivery",
  "Цены, вес и КБЖУ. Оплата заведению напрямую.": "Prices, weight and nutrition facts. You pay the place directly.",
  "Запись": "Booking",
  "Мастер, день и время — в три шага.": "Specialist, day and time — in three steps.",
  "Своя карта города: места рядом и пеший маршрут.": "The app's own city map: places nearby and a walking route.",
  "Можно заказать доставку или записаться?": "Can I order delivery or book a visit?",
  "Да, если место это предлагает. Заказ собирается из меню, а оплачиваешь его заведению напрямую — по ссылке, QR или при получении. Для записи выбери мастера, день и время.": "Yes, if the place offers it. You put the order together from the menu and pay the place directly — by link, QR or on delivery. To book, pick a specialist, a day and a time.",
  "Лента идет по времени. Место в ней не купить. Вы говорите напрямую с теми, кому интересны.": "The feed goes by time. A spot in it cannot be bought. You talk directly to the people who care about you.",
  "оплаты остаются у вас. Гость платит напрямую, без комиссии гласео.": "of every payment stays with you. The guest pays you directly, glaseo takes no commission.",
  "8 в 1": "8 in 1",
  "восемь инструментов в одном кабинете. На компьютере и телефоне, для всей команды.": "eight tools in one cabinet. On a computer and a phone, for the whole team.",
  "каждая ваша публикация приходит подписчикам уведомлением.": "every post you publish reaches your followers as a notification.",
  "Карточка, которая продает": "A page that sells",
  "Фото, меню с ценами и КБЖУ, часы работы и точка на карте. Вас находят в каталоге, на карте и по фильтрам.": "Photos, a menu with prices and nutrition facts, opening hours and a point on the map. People find you in the catalogue, on the map and through filters.",
  "Новости, акции, события": "News, offers, events",
  "Публикация выходит в ленте города и у подписчиков. Ее можно запланировать заранее.": "A post appears in the city feed and with your followers. You can schedule it in advance.",
  "Доставка без агрегатора": "Delivery without an aggregator",
  "Гость собирает заказ из вашего меню. Вы ведете его по шагам до двери. Для курьеров есть приложение «Гласео Курьер».": "A guest puts an order together from your menu. You take it step by step to the door. Couriers have the «Glaseo Courier» app.",
  "Запись к мастерам": "Bookings with specialists",
  "Гость самостоятельно выбирает свободное время. Запись сразу видна вам и мастеру.": "A guest picks a free time on their own. The booking is seen by you and the master at once.",
  "Чаты с гостями": "Chats with guests",
  "Вопросы по заказам и записям в одном окне. Личный номер раздавать не нужно.": "Questions about orders and bookings in one window. No need to hand out a personal number.",
  "Своя программа лояльности": "Your own loyalty programme",
  "Баллы, штампы, скидки, подарки и промокоды. Гость показывает QR, вы сканируете его телефоном.": "Points, stamps, discounts, gifts and promo codes. The guest shows a QR code and you scan it with a phone.",
  "Статистика и PRO": "Statistics and PRO",
  "Подписчики, просмотры, звонки и маршруты. В PRO ИИ-маркетолог подскажет, когда публиковать. Часть отчетов PRO пока на демо-данных.": "Followers, views, calls and routes. In PRO an AI marketer suggests when to post. Some PRO reports still run on demo data.",
  "Команда и роли": "Team and roles",
  "Администратор, модератор, оператор заказов и мастер. Каждый видит свое. Публикации сотрудников выходят после вашего одобрения.": "Administrator, moderator, order operator and master. Each sees their own part. Staff posts go out after your approval.",
  "Попробуйте": "Try the",
  "кабинет": "cabinet",
  "Все как в настоящем кабинете. Ответьте гостю, проведите заказ, начислите баллы.": "Just like the real cabinet. Answer a guest, take an order through, add points.",
  "Компьютер": "Computer",
  "Телефон": "Phone",
  "А": "A",
  "Главная": "Home",
  "Заказы": "Orders",
  "Публикации": "Posts",
  "Статистика": "Statistics",
  "Подписчики": "Followers",
  "Готовим": "Cooking",
  "Готов": "Ready",
  "Курьер": "Courier",
  "ИИ-маркетолог": "AI marketer",
  "Пример кабинета. Заведение, гости, заказы и цифры выдуманы.": "An example of the cabinet. The place, guests, orders and figures are made up.",
  "PRO": "PRO",
  "Название, адрес, точка на карте и рабочий контакт — несколько минут.": "Name, address, a point on the map and a work contact — a few minutes.",
  "Проверяем, что заявку подал представитель заведения. Если чего-то не хватит, попросим уточнить.": "We check that the application comes from someone at the place. If something is missing, we will ask.",
  "Запуск": "Launch",
  "Получаете вход в кабинет, заполняете карточку и выходите в ленту города.": "You get a sign-in to the cabinet, fill in your page and go out into the city feed.",
  "Заведения и сервисы Иннополиса: кафе, магазины, мастерские, салоны, студии. Перед подключением проверяем данные организации и полномочия ее представителя.": "Places and services of Innopolis: cafés, shops, workshops, salons, studios. Before connecting we check the organisation's details and its representative's authority.",
  "Гласео берет процент с заказов?": "Does glaseo take a cut of orders?",
  "Нет. Гость платит вам напрямую — по вашей ссылке, QR или при получении. Деньги не проходят через гласео.": "No. Guests pay you directly — by your link, QR or on delivery. The money never passes through glaseo.",
  "Жители города в общей ленте и подписчики заведения — в своей, с уведомлением. Каждую публикацию перед выходом читает команда гласео.": "Residents in the city feed, and your followers in theirs, with a notification. The glaseo team reads every post before it goes out.",
  "Нужен свой сайт или приложение?": "Do I need my own website or app?",
  "Нет. Карточка, меню, заказы, запись и лояльность работают внутри гласео, а кабинет открывается в браузере на компьютере и телефоне.": "No. Your page, menu, orders, bookings and loyalty all work inside glaseo, and the cabinet opens in a browser on a computer and a phone.",
  "Для бизнеса / для жителей": "For business / for residents",
  "Политика обработки данных": "Personal data policy",
  "Пользовательское соглашение": "Terms of use",
  "Оферта для бизнеса": "Business offer",
  "Русский": "Russian",
  "Экран «Лента»: анонсы и публикации мест города": "The Feed screen: announcements and posts of city places",
  "Экран «Места рядом»: места по расстоянию пешком и фильтры": "The Places nearby screen: places by walking distance and filters",
  "Карточка места: подписка, сообщение, звонок, маршрут и бонусы": "A place's page: follow, message, call, route and bonuses",
  "Меню места с КБЖУ и собранным заказом": "A place's menu with nutrition and an order in progress",
  "Запись к мастеру: выбор дня и времени": "Booking a specialist: choosing a day and time",
  "Карта Иннополиса с местами": "The Innopolis map with places",
  "Вид кабинета": "Cabinet view",
  "Интерактивный пример кабинета бизнеса гласео": "An interactive example of the glaseo business cabinet",
  "День": "Day",
  "Лента города, места рядом с расстоянием пешком и своя карта.": "The city feed, places nearby by walking distance and the app's own map.",
  "Закажи или запишись": "Order or book",
  "Меню с КБЖУ, доставка и запись к мастеру. Платишь месту напрямую.": "A menu with nutrition facts, delivery and booking a master. You pay the place directly.",
  "Подписки, чат с местом и карта гостя с бонусами. Все в профиле.": "Subscriptions, a chat with the place and a guest card with bonuses. All in your profile.",
  "Пример приложения. Места, цены и люди выдуманы": "An example of the app. Places, prices and people are made up",
  "Интерактивный пример приложения гласео": "An interactive example of the glaseo app"
};

(() => {
  const root = document.documentElement, ATTRS = ["aria-label", "alt", "content", "data-live-note", "value"];
  const squeeze = (text) => text.replace(/\s+/g, " ").trim();
  // What each node and attribute said in Russian, to put it back.
  const texts = new Map(), attrs = new Map();
  let lang = "ru", busy = false;

  const english = (text) => {
    const key = squeeze(text);
    return key && Object.hasOwn(EN, key) ? text.replace(/^(\s*)[\s\S]*?(\s*)$/, `$1${EN[key]}$2`) : null;
  };
  function sayText(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,[translate=no]")) return;
    const said = english(node.nodeValue);
    if (said === null) return;
    texts.set(node, node.nodeValue);
    node.nodeValue = said;
  }
  function sayAttrs(el) {
    for (const name of ATTRS) {
      const value = el.getAttribute?.(name);
      if (!value) continue;
      const said = english(value);
      if (said === null) continue;
      if (!attrs.has(el)) attrs.set(el, {});
      attrs.get(el)[name] = value;
      el.setAttribute(name, said);
    }
  }
  function say(top) {
    if (top.nodeType === Node.TEXT_NODE) return sayText(top);
    if (top.nodeType !== Node.ELEMENT_NODE) return;
    sayAttrs(top);
    top.querySelectorAll("*").forEach(sayAttrs);
    const walk = document.createTreeWalker(top, NodeFilter.SHOW_TEXT);
    for (let node = walk.nextNode(); node; node = walk.nextNode()) sayText(node);
  }
  function apply(next) {
    busy = true;
    // Back to Russian first: every change starts from what the page itself says.
    for (const [node, text] of texts) node.nodeValue = text;
    for (const [el, saved] of attrs) for (const name in saved) el.setAttribute(name, saved[name]);
    texts.clear(); attrs.clear();
    lang = next;
    root.lang = next; root.dataset.lang = next;
    if (next === "en") say(root);
    document.querySelector("meta[property=\"og:locale\"]")?.setAttribute("content", next === "en" ? "en_US" : "ru_RU");
    document.querySelectorAll("[data-lang-choice]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.langChoice === next)));
    const group = document.querySelector(".lang-switch");
    if (group) group.dataset.choice = next;
    root.classList.add("i18n-ready");
    queueMicrotask(() => { observer.takeRecords(); busy = false; });
  }
  // The page writes its own Russian later too (a copied link, a follow button): that is translated as it appears.
  const observer = new MutationObserver((records) => {
    if (busy || lang !== "en") return;
    busy = true;
    for (const record of records) {
      if (record.type === "characterData") sayText(record.target);
      else if (record.type === "attributes") sayAttrs(record.target);
      else record.addedNodes.forEach(say);
    }
    queueMicrotask(() => { observer.takeRecords(); busy = false; });
  });
  observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });

  let chosen = null;
  try {
    const asked = new URLSearchParams(location.search).get("lang");
    if (asked === "en" || asked === "ru") localStorage.setItem("glaseo-lang", asked);
    chosen = localStorage.getItem("glaseo-lang");
  } catch { /* private mode: the language of the browser decides */ }
  apply(chosen === "en" || chosen === "ru" ? chosen : /^ru\b/i.test(navigator.language || "ru") ? "ru" : "en");
  document.querySelectorAll("[data-lang-choice]").forEach((button) => button.addEventListener("click", () => {
    try { localStorage.setItem("glaseo-lang", button.dataset.langChoice); } catch { /* not kept, still switched */ }
    apply(button.dataset.langChoice);
  }));
})();
