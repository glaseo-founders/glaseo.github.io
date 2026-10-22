// Russian typesetting for the whole page and for what the scripts write later (the app and cabinet examples, English
// included: the rules touch only Russian words, dashes and numbers). A copy of `typography.ts` of the cabinet and the app.
(() => {
/**
   * Russian typesetting for text on screen: a line never ends with a preposition, a conjunction or «не», never starts
   * with a dash, a number stays with its unit and «№» with its number, a time range is not split. Done with no-break
   * spaces and word joiners, so it works at any width; a hyphenated word («договор-оферта») is not split at its hyphen,
   * and syllable hyphenation is not used.
   */
  const SHORT = "а|в|во|и|й|к|ко|о|об|обо|от|ото|с|со|у|я|не|ни|но|да|по|за|из|изо|до|на|над|под|при|про|для|без|или|как|что|это|где|из-за|из-под|перед|через|между|после|около|вокруг";
  const UNITS = "₽|%|г|кг|мл|л|ч|мин|сек|км|м|шт|ккал|руб|поз|дн|дня|дней|день|раз|чел|баллов|балла|балл";
  const hang = new RegExp(`(?<=^|[\\s(«„"\\[—–/])(${SHORT})[ \\t]+(?=\\S)`, "giu");
  const particle = /(?<=\S)[ \t]+(же|ли|ль|бы|б)(?=[\s.,:;!?»)]|$)/giu;
  const unit = new RegExp(`(\\d)[ \\t]+(${UNITS})(?=[\\s.,:;!?»)/]|$)`, "gu");
  
  function typeset(text) {
    if (!text || !/\s|\d[–-]\d|\p{L}-\p{L}/u.test(text)) return text;
    return text
      .replace(hang, "$1\u00a0")
      .replace(particle, "\u00a0$1")
      .replace(/[ \t]+(?=[—–][ \t\u00a0])/g, "\u00a0")
      .replace(unit, "$1\u00a0$2")
      .replace(/№[ \t]*(?=\d)/g, "№\u00a0")
      .replace(/(\d)[ \t](?=\d{3}(?!\d))/g, "$1\u00a0")
      .replace(/(\d)([–-])(?=\d)/g, "$1\u2060$2\u2060")
      .replace(/(\p{L})-(?=\p{L})/gu, "$1-\u2060");
  }
  
  /** A heading also keeps a short last word with the one before it, so it never stands alone on the last line. */
  function typesetHeading(text) {
    return typeset(text).replace(/[ \t]+([^\s]{1,8})\s*$/u, "\u00a0$1");
  }
  
  const SKIP = "script,style,textarea,input,code,pre,[contenteditable=true],[data-typeset=off]";
  const HEADINGS = "h1,h2,h3,h4,legend";
  
  function fix(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) return;
    const last = parent.matches(HEADINGS) && node === parent.lastChild;
    const value = node.nodeValue || "", next = last ? typesetHeading(value) : typeset(value);
    if (next !== value) node.nodeValue = next;
  }
  
  function walk(top) {
    if (top.nodeType === Node.TEXT_NODE) return fix(top);
    const walker = document.createTreeWalker(top, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) fix(node);
  }
  
  /** Typesets the page and everything written into it later. The changes are idempotent, so the observer settles. */
  function typesetPage(root = document.body) {
    walk(root);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") fix(record.target);
        else record.addedNodes.forEach(walk);
      }
    });
    observer.observe(root, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }

  typesetPage();
})();
