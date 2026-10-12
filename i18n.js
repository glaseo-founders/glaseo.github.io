// Two languages of the page. The Russian text stays in the HTML and is the key: the table below gives its English.
// Text that has no line here simply stays Russian, so a hand edit of the page never breaks — it only waits for a translation.
// The choice is kept in localStorage ("glaseo-lang"); without one the language of the browser decides (Russian, or English
// for any other). `?lang=en` or `?lang=ru` in the address sets it too. The page in <head> marks <html data-lang> before paint.
const EN = {
  "гласео": "glaseo",
  "Язык": "Language",
  "К содержанию": "Skip to content",
  "Что внутри": "What's inside",
  "Как работает": "How it works",
  "Светлая": "Light",
  "Тёмная": "Dark",
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
  "Всё, ради чего": "Everything worth",
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
  "Открой ленту, каталог или карту своего города.": "Open the feed, the catalogue or the map of your city.",
  "Посмотри, что внутри": "See what's inside",
  "Меню, часы работы, новости и способы связаться с местом.": "Menu, opening hours, news and ways to contact the place.",
  "Останься на связи": "Stay in touch",
  "Подпишись — новости выбранных мест соберутся в твоей ленте.": "Follow — the news of the places you chose will gather in your feed.",
  "Иннополис": "Innopolis",
  "Что нового?": "What's new?",
  "Общая": "All",
  "Подписки": "Following",
  "Все": "All",
  "Кофе": "Coffee",
  "Досуг": "Leisure",
  "Сегодня / Иннополис": "Today / Innopolis",
  "Вечер": "An evening",
  "в городе": "in the city",
  "Планы на этот вечер": "Plans for this evening",
  "Музыка, встречи и новые поводы выйти.": "Music, meetups and new reasons to go out.",
  "Подписаться": "Follow",
  "Рядом": "Nearby",
  "Кофе.": "Coffee.",
  "И пауза.": "And a pause.",
  "Новости любимого места": "News from a favourite place",
  "Новое меню уже в ленте.": "The new menu is already in the feed.",
  "В подписках": "Following",
  "Пока здесь тихо. Подпишись на место из общей ленты.": "It's quiet here for now. Follow a place from the main feed.",
  "Интерактивный пример ленты": "An interactive example of the feed",
  "Так выглядит": "This is what",
  "Найти место, узнать о нём и решить, куда пойти.": "Find a place, learn about it and decide where to go.",
  "Лента": "Feed",
  "Общая лента города и новости мест, на которые ты подписан.": "The city's main feed and the news of the places you follow.",
  "Места": "Places",
  "Каталог заведений с поиском и фильтрами.": "A catalogue of places with search and filters.",
  "Карточка места": "Place card",
  "Меню, часы работы, подписка, сообщения, звонок и маршрут.": "Menu, opening hours, follow, messages, a call and a route.",
  "Карта": "Map",
  "Места рядом и их расположение на карте города.": "Places nearby and where they are on the city map.",
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
  "не продаётся": "is not for sale",
  "В гласео у всех заведений одинаковые правила. Бизнес получает свою страницу и инструменты для работы с людьми, которым он интересен.": "In glaseo the rules are the same for every place. A business gets its own page and tools for working with the people who are interested in it.",
  "Карточка заведения": "Place card",
  "Описание, адрес, часы работы, меню и услуги. Всё, что помогает человеку выбрать ваше место.": "Description, address, opening hours, menu and services. Everything that helps a person choose your place.",
  "Новости, акции и события": "News, promos and events",
  "Расскажите, что у вас нового. Публикации увидят в городской ленте и у подписчиков. Выберите время выхода и анонсируйте заранее.": "Tell people what's new with you. Posts are seen in the city feed and by your followers. Choose when a post goes out and announce it ahead.",
  "Записи и общение": "Bookings and conversation",
  "Отвечайте на сообщения, работайте с заказами и принимайте записи. Помогайте человеку перейти от интереса к визиту.": "Answer messages, work with orders and take bookings. Help a person get from interest to a visit.",
  "Аналитика и PRO": "Analytics and PRO",
  "Смотрите подписки, просмотры и действия. В PRO развиваем карту спроса, рекомендации и интеграции. Эти возможности пока работают на демо-данных.": "Watch follows, views and actions. In PRO we are building a demand map, recommendations and integrations. These features run on demo data for now.",
  "Кабинет": "The cabinet",
  "заведения": "of a place",
  "Публикации, обращения и показатели. Один кабинет на компьютере и телефоне.": "Posts, requests and figures. One cabinet on the computer and the phone.",
  "Показатели": "Figures",
  "Просмотры, подписки, целевые действия и динамика за период.": "Views, follows, target actions and the trend over a period.",
  "На телефоне": "On the phone",
  "Главная, обращения и задачи заведения на телефоне.": "The home page, requests and tasks of the place on the phone.",
  "Заказы и чаты": "Orders and chats",
  "Сообщения и заказы со статусами. Рядом — переход к записям.": "Messages and orders with statuses. Next to them — the way to bookings.",
  "Публикация": "Post",
  "Подготовьте новость, акцию или событие. Сохраните черновик или отправьте на проверку.": "Prepare a news item, a promo or an event. Save a draft or send it for review.",
  "Экраны демо-версии гласео. Все показатели и обращения приведены для примера.": "Screens of the glaseo demo. All figures and requests are given as examples.",
  "Три шага": "Three steps",
  "до кабинета.": "to the cabinet.",
  "Заявка": "Application",
  "После открытия приёма заявок представитель заведения оставляет заявку.": "Once applications open, a representative of the place leaves one.",
  "Проверка": "Check",
  "Мы убеждаемся, что заявку подал представитель заведения.": "We make sure the application was sent by a representative of the place.",
  "Доступ": "Access",
  "Владелец заполняет карточку и назначает сотрудникам роли и доступы.": "The owner fills in the card and gives the staff their roles and access.",
  "Кто может подключиться?": "Who can join?",
  "Заведения и сервисы Иннополиса. Перед подключением проверяем данные организации и полномочия её представителя.": "Places and services of Innopolis. Before connecting we check the details of the organisation and the authority of its representative.",
  "Кто видит публикации?": "Who sees the posts?",
  "Жители города в общей ленте и подписчики заведения — в своей. Каждую публикацию перед выходом читает команда гласео.": "Residents of the city in the main feed, and the followers of the place in theirs. Every post is read by the glaseo team before it goes out.",
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
  "Готовим приём заявок.": "Applications will open soon.",
  "Подключить свой бизнес": "Connect your business",
  "Скоро": "Soon",
  "Поддержать гласео": "Support glaseo",
  "Для жителей приложение бесплатно. Помочь запуску можно пожертвованием — любой суммой.": "The app is free for residents. You can help the launch with a donation — of any amount.",
  "Пожертвовать через ЮMoney": "Donate via YooMoney",
  "Поддержать проект": "Support the project",
  "Это не реклама. Нас выбирают люди.": "This is not an ad. People choose us.",
  "Для жителей / для бизнеса": "For residents / for business",
  "Наверх": "To the top",
  "гласео — места, события и предложения города. Открытый выбор для жителей и инструменты для локального бизнеса. Без платного приоритета. Начинаем с Иннополиса.": "glaseo — places, events and offers of the city. An open choice for residents and tools for local business. No paid priority. Starting with Innopolis.",
  "Городская лента, карта и любимые места. Люди выбирают сами, бизнес работает с клиентами напрямую.": "A city feed, a map and favourite places. People choose for themselves, businesses work with customers directly.",
  "гласео — наверх": "glaseo — to the top",
  "Основная навигация": "Main navigation",
  "Тема оформления": "Colour theme",
  "Для кого показать страницу": "Who to show the page for",
  "Возможности приложения": "What the app can do",
  "Интерактивная концепция приложения гласео": "An interactive concept of the glaseo app",
  "Ленты": "Feeds",
  "Категории ленты": "Feed categories",
  "Экраны приложения": "App screens",
  "Экран «Лента»: категории, ближайшие события и публикации заведений": "The “Feed” screen: categories, upcoming events and posts of places",
  "Экран «Места»: поиск и список заведений с часами работы": "The “Places” screen: search and a list of places with opening hours",
  "Карточка заведения: подписка, связь, новости и меню": "A place card: follow, contact, news and menu",
  "Экран «Карта»: заведения на карте Иннополиса": "The “Map” screen: places on the map of Innopolis",
  "Дашборд организации: подписчики, просмотры, действия клиентов и динамика интереса": "The organisation's dashboard: followers, views, customer actions and the trend of interest",
  "Экраны кабинета на телефоне": "Cabinet screens on the phone",
  "Главная страница кабинета на телефоне": "The home page of the cabinet on the phone",
  "Раздел «Заказы и чаты» в кабинете": "The “Orders and chats” section of the cabinet",
  "Форма новой публикации в кабинете": "The form of a new post in the cabinet",
  "Для Android": "For Android",
  "Для iPhone · веб-приложение": "For iPhone · web app",
  "Страница не найдена — гласео": "Page not found — glaseo",
  "Здесь": "Nothing",
  "пусто": "here",
  "Такой страницы нет. Возможно, адрес изменился или в нём опечатка.": "There is no such page. The address may have changed or has a typo in it.",
  "На главную": "To the home page",
  "гласео — на главную": "glaseo — to the home page",
  "Ссылка скопирована.": "Link copied.",
  "Готово": "Done",
  "Скопируй адрес из строки браузера.": "Copy the address from the browser bar.",
};

(() => {
  const root = document.documentElement, ATTRS = ["aria-label", "alt", "content", "data-live-note"];
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
