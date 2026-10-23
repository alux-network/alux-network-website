// Inlined at the start of each generated head; no runtime download is needed.
(function () {
  const languages = window.ALUX_LOCALES.map(locale => locale.code);
  function browserLanguage(value) {
    const normalized = String(value).toLowerCase().replace(/_/g, "-");
    if (/^zh(?:-|$)/.test(normalized)) {
      if (/-hans(?:-|$)/.test(normalized)) return "zh";
      if (/-hant(?:-|$)|-(?:tw|hk|mo)(?:-|$)/.test(normalized)) return "zh-hant";
      return "zh";
    }
    return languages.includes(normalized) ? normalized : normalized.split("-")[0];
  }
  const slugs = ["", "for-ai-agents", "glvm", "alux-vs-others", "runtime-lab", "team", "roadmap"];
  const current = new URL(window.location.href);
  function languageUrl(value, language) {
    const url = new URL(value, current);
    if (url.origin !== current.origin) return url.href;
    const parts = url.pathname.replace(/\.html$/, "").split("/").filter(Boolean);
    if (languages.includes(parts[0])) parts.shift();
    const slug = parts.join("/") === "index" ? "" : parts.join("/");
    if (!slugs.includes(slug)) return url.href;
    url.pathname = (language === "en" ? "" : "/" + language) + (slug ? "/" + slug : language === "en" ? "/" : "");
    url.searchParams.delete("lang");
    return url.href;
  }
  const prefix = current.pathname.split("/")[1];
  const queryLanguage = current.searchParams.get("lang");
  const explicit = languages.includes(queryLanguage) ? queryLanguage : languages.includes(prefix) ? prefix : null;
  let language = explicit || "en";
  const homeEntry = current.pathname === "/" || current.pathname === "/index" || current.pathname === "/index.html";
  if (!explicit && homeEntry) {
    let saved;
    try { saved = localStorage.getItem("alux-lang"); } catch {}
    if (!languages.includes(saved)) {
      try { saved = sessionStorage.getItem("alux-lang"); } catch {}
      if (languages.includes(saved)) {
        try { localStorage.setItem("alux-lang", saved); } catch {}
      }
    }
    const preferred = (navigator.languages || [navigator.language || "en"])
      .map(browserLanguage).find(value => languages.includes(value));
    language = languages.includes(saved) ? saved : preferred || "en";
  }
  window.ALUX_LANGUAGE = { language, urlFor: languageUrl };
  const destination = languageUrl(current.href, language);
  if ((homeEntry || explicit) && destination !== current.href) {
    // Keep the wrong-language document from painting during entry negotiation.
    document.documentElement.style.visibility = "hidden";
    window.location.replace(destination);
  }
})();
