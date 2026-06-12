"use client";

import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/i18n/translations";

interface LanguageSwitcherProps {
  variant?: "mobile" | "desktop" | "sidebar" | "sidebar-dark";
}

export default function LanguageSwitcher({ variant = "mobile" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const toggle = () => setLocale(locale === "ar" ? "en" : "ar");

  if (variant === "sidebar" || variant === "sidebar-dark") {
    const isDark = variant === "sidebar-dark";
    return (
      <div
        className={`lang-switcher ${isDark ? "lang-switcher--dark" : "lang-switcher--light"}`}
        role="group"
        aria-label={t("lang.switch")}
      >
        {(["ar", "en"] as Locale[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={`lang-switcher__btn ${
              locale === l ? "lang-switcher__btn--active" : ""
            }`}
          >
            {l === "ar" ? t("lang.ar") : t("lang.en")}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={toggle}
        className="header-icon-btn"
        aria-label={t("lang.switch")}
        title={locale === "ar" ? "English" : "العربية"}
      >
        <i className="bi bi-globe2 text-[17px]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-sm border border-white/20 px-3 py-1.5 text-xs font-bold transition hover:bg-white/10"
      aria-label={t("lang.switch")}
    >
      <i className="bi bi-globe2 text-sm" />
      <span>{locale === "ar" ? "EN" : "عربي"}</span>
    </button>
  );
}
