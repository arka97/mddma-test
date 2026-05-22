/**
 * Lightweight translation dictionary for English / Hindi / Marathi.
 * Covers the highest-traffic surfaces: nav, CTAs, common labels.
 * Full i18n is a phase-2 effort — for now we ship the words traders
 * see most often, in their language.
 */
export type Lang = "en" | "hi" | "mr";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

type Dict = Record<string, Record<Lang, string>>;

export const T: Dict = {
  // Navigation
  nav_home: { en: "Home", hi: "होम", mr: "होम" },
  nav_find: { en: "Find", hi: "खोजें", mr: "शोधा" },
  nav_cart: { en: "Cart", hi: "कार्ट", mr: "कार्ट" },
  nav_help: { en: "Help", hi: "मदद", mr: "मदत" },
  nav_directory: { en: "Directory", hi: "विक्रेता", mr: "विक्रेते" },
  nav_products: { en: "Products", hi: "उत्पाद", mr: "उत्पादने" },
  nav_market: { en: "Market", hi: "बाज़ार", mr: "बाजार" },
  nav_community: { en: "Community", hi: "समुदाय", mr: "समुदाय" },
  nav_membership: { en: "Membership", hi: "सदस्यता", mr: "सदस्यत्व" },
  nav_about: { en: "About", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },

  // CTAs
  cta_login: { en: "Login", hi: "लॉगिन", mr: "लॉगिन" },
  cta_search: { en: "Search", hi: "खोजें", mr: "शोधा" },
  cta_send_request: { en: "Send request", hi: "अनुरोध भेजें", mr: "विनंती पाठवा" },
  cta_ask_price: { en: "Ask for price", hi: "कीमत पूछें", mr: "किंमत विचारा" },
  cta_add_request: { en: "Add to request", hi: "अनुरोध में जोड़ें", mr: "विनंतीत जोडा" },
  cta_view_all: { en: "View all", hi: "सभी देखें", mr: "सर्व पहा" },
  cta_filters: { en: "Filters", hi: "फ़िल्टर", mr: "फिल्टर्स" },
  cta_clear_all: { en: "Clear all", hi: "सब हटाएं", mr: "सर्व साफ करा" },
  cta_apply: { en: "Apply", hi: "लागू करें", mr: "लागू करा" },
  cta_undo: { en: "Undo", hi: "वापस लाओ", mr: "पूर्ववत करा" },
  cta_get_help: { en: "Need help?", hi: "मदद चाहिए?", mr: "मदत हवी?" },

  // Generic
  loading: { en: "Loading…", hi: "लोड हो रहा है…", mr: "लोड होत आहे…" },
  language: { en: "Language", hi: "भाषा", mr: "भाषा" },
  removed: { en: "Removed", hi: "हटाया गया", mr: "काढले" },
};

export function translate(key: string, lang: Lang): string {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}
