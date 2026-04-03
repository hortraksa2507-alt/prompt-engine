"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { ThemeId, DEFAULT_THEME, getTheme } from "./themes";
import { getSetting, setSetting } from "@/lib/storage";
import { Locale } from "./i18n";

interface ThemeContextValue {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: "ocean",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  // Start with default (SSR-safe), then hydrate from localStorage on client
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME[locale]);

  useEffect(() => {
    const stored = getSetting<ThemeId>("theme", DEFAULT_THEME[locale]);
    setThemeId(stored);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    setSetting("theme", id);
  }, []);

  // When locale switches, auto-apply the default theme for that locale
  // but only if the current theme belongs to the other locale
  useEffect(() => {
    const current = getTheme(themeId);
    if (current.locale !== locale) {
      const next = DEFAULT_THEME[locale];
      setThemeId(next);
      setSetting("theme", next);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Apply theme class to body
  useEffect(() => {
    const allThemeClasses = [
      "theme-aba-gold", "theme-angkor", "theme-mekong", "theme-lotus", "theme-night-sky",
      "theme-ocean", "theme-forest", "theme-aurora", "theme-sunset", "theme-midnight",
    ];
    document.body.classList.remove(...allThemeClasses);
    document.body.classList.add(`theme-${themeId}`);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
