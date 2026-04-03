"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { Locale, t as translate, TranslationKey } from "./i18n";
import { getSetting, setSetting } from "@/lib/storage";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  toggleLocale: () => {},
  t: (key) => key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => getSetting<Locale>("locale", "en"));

  const toggleLocale = useCallback(() => {
    setLocale((l) => {
      const next = l === "en" ? "km" : "en";
      setSetting("locale", next);
      return next;
    });
  }, []);

  // Sync locale class to body so CSS vars cascade to body background
  useEffect(() => {
    document.body.classList.toggle("locale-km", locale === "km");
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey) => translate(locale, key),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
