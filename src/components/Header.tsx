"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { useCatalog } from "@/hooks/useCatalog";
import Sidebar from "./Sidebar";
import DesktopNav from "./DesktopNav";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteLogo from "./SiteLogo";

export default function Header() {
  const router = useRouter();
  const { t } = useLocale();
  const { promoCode } = useCatalog();
  const {
    openSidebar,
    closeSidebar,
    sidebarOpen,
    searchOpen,
    setSearchOpen,
    cartCount,
    wishlistCount,
    isHydrated,
  } = useStore();
  const [query, setQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const handleMenuClick = () => {
    setSearchOpen(false);
    if (sidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  return (
    <>
      <Sidebar />
      <header className="sticky top-0 z-[80] bg-[#2d2d2d] text-white">
        {/* Promo */}
        <div className="promo-bar border-b border-white/10 py-1 text-center text-[9px] sm:py-1.5 sm:text-[11px] lg:px-3 lg:text-xs">
          <span className="font-semibold">{t("promo.freeDelivery")}</span>
          <span className="hidden sm:inline"> {t("promo.whenSpend")} </span>
          <span className="sm:hidden"> {t("promo.whenSpendShort")} </span>
          {t("promo.code")}{" "}
          <span className="font-bold underline">{promoCode}</span>
        </div>

        {/* ===== MOBILE — dir=ltr keeps menu left / icons right in Arabic RTL pages */}
        <div className="relative lg:hidden">
          <div className="mobile-header-bar" dir="ltr">
            <div className="mobile-header-bar__start">
              <button
                type="button"
                onClick={handleMenuClick}
                onPointerDown={(e) => e.stopPropagation()}
                className="header-icon-btn mobile-menu-btn"
                aria-label={t("header.openMenu")}
                aria-expanded={sidebarOpen}
                aria-controls="mobile-sidebar"
              >
                <span className="mobile-menu-icon pointer-events-none" aria-hidden>
                  ☰
                </span>
              </button>
            </div>

            <div className="mobile-header-bar__center">
              <Link
                href="/"
                className="text-[18px] font-black tracking-tighter sm:text-[22px]"
              >
                <SiteLogo />
              </Link>
            </div>

            <div className="mobile-header-bar__end">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="header-icon-btn"
                aria-label={t("header.search")}
              >
                <i className="bi bi-search text-[18px]" />
              </button>
              <Link href="/bag" className="header-icon-btn relative" aria-label={t("header.bag")}>
                <i className="bi bi-bag text-[18px]" />
                {isHydrated && cartCount > 0 && (
                  <span className="absolute end-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#2d8c3c] px-0.5 text-[8px] font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {searchOpen && (
            <div className="mobile-search-panel">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("header.searchPlaceholderShort")}
                  className="w-full bg-white py-3 ps-3 pe-10 text-sm text-[#2d2d2d] outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-[#2d2d2d]"
                  aria-label={t("header.submitSearch")}
                >
                  <i className="bi bi-search" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ===== DESKTOP ===== */}
        <div className="site-container hidden items-center gap-8 py-4 lg:flex">
          <div className="flex shrink-0 items-center gap-5">
            <button
              type="button"
              onClick={handleMenuClick}
              className="flex h-10 w-10 items-center justify-center text-2xl transition hover:opacity-70"
              aria-label={t("header.openMenu")}
              aria-expanded={sidebarOpen}
            >
              <i className="bi bi-list" />
            </button>

            <Link href="/" className="text-[28px] font-black tracking-tighter">
              <SiteLogo />
            </Link>
          </div>

          <form onSubmit={handleSearch} className="mx-auto max-w-2xl flex-1">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                className="w-full bg-white/10 py-2.5 ps-4 pe-10 text-sm text-white placeholder:text-white/50 outline-none transition focus:bg-white focus:text-[#2d2d2d] focus:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute end-3 top-1/2 -translate-y-1/2 text-white/70"
                aria-label={t("header.search")}
              >
                <i className="bi bi-search" />
              </button>
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-1">
            <LanguageSwitcher variant="desktop" />
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-sm px-3 py-2 transition hover:bg-white/10"
            >
              <i className="bi bi-person text-lg" />
              <span className="text-xs font-semibold">{t("header.account")}</span>
            </Link>
            <Link
              href="/wishlist"
              className="relative flex items-center gap-2 rounded-sm px-3 py-2 transition hover:bg-white/10"
            >
              <i className="bi bi-heart text-lg" />
              <span className="text-xs font-semibold">{t("header.saved")}</span>
              {isHydrated && wishlistCount > 0 && (
                <span className="absolute end-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2d8c3c] px-1 text-[10px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/bag"
              className="relative flex items-center gap-2 rounded-sm px-3 py-2 transition hover:bg-white/10"
            >
              <i className="bi bi-bag text-lg" />
              <span className="text-xs font-semibold">{t("header.bag")}</span>
              {isHydrated && cartCount > 0 && (
                <span className="absolute end-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2d8c3c] px-1 text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <DesktopNav />
      </header>
    </>
  );
}
