"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NavItem } from "@/data/navigation";
import { useAdmin } from "@/context/AdminContext";
import { resolveLink } from "@/lib/admin-links";
import { translations, type Locale } from "@/i18n/translations";

export type TKey = string;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  menuItems: NavItem[];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_KEY = "stylehub-locale";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof current === "string") return current;
  return path;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { state: adminState } = useAdmin();
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved === "en" || saved === "ar") {
      setLocaleState(saved);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale, hydrated]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const { settings } = adminState;
      const overrides: Record<string, string> = {
        "promo.freeDelivery": locale === "ar" ? settings.promoAr : settings.promoEn,
        "promo.whenSpendShort":
          locale === "ar" ? settings.promoSpendAr : settings.promoSpendEn,
        "footer.aboutText":
          locale === "ar" ? settings.descriptionAr : settings.description,
        "footer.copyright": `© ${settings.year} ${locale === "ar" ? settings.nameAr : settings.name}`,
      };

      let value =
        overrides[key] ??
        getNestedValue(
          translations[locale] as unknown as Record<string, unknown>,
          key
        );
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale, adminState]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";
  const menuItems = useMemo(
    () =>
      adminState.navigation.map(
        (item): NavItem => ({
          label: locale === "ar" ? item.labelAr : item.labelEn,
          href: resolveLink(
            item.linkType,
            item.categoryId,
            adminState.categories
          ),
          highlight: item.highlight,
          children: item.children?.map((child) => ({
            label: locale === "ar" ? child.labelAr : child.labelEn,
            href: resolveLink(
              child.linkType,
              child.categoryId,
              adminState.categories
            ),
          })),
        })
      ),
    [adminState.navigation, adminState.categories, locale]
  );

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t, dir, isRtl: dir === "rtl", menuItems }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
