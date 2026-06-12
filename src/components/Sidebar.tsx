"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SIDEBAR_ANIM_MS = 380;
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { useMounted } from "@/hooks/useMounted";
import type { NavItem } from "@/data/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteLogo from "./SiteLogo";

export default function Sidebar() {
  const mounted = useMounted();
  const { sidebarOpen, closeSidebar, cartCount, wishlistCount, isHydrated } =
    useStore();
  const { menuItems, t, isRtl } = useLocale();
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null);
  const [present, setPresent] = useState(false);
  const [openAnim, setOpenAnim] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sidebarOpen) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setPresent(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpenAnim(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setOpenAnim(false);
    closeTimer.current = setTimeout(() => {
      setPresent(false);
      setActiveSubmenu(null);
    }, SIDEBAR_ANIM_MS);

    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (present) {
      root.classList.add("sidebar-scroll-lock");
    } else {
      root.classList.remove("sidebar-scroll-lock");
    }
    return () => root.classList.remove("sidebar-scroll-lock");
  }, [present, mounted]);

  const handleClose = () => {
    closeSidebar();
  };

  const openSubmenu = (item: NavItem) => {
    if (item.children) setActiveSubmenu(item);
  };

  if (!mounted || !present) return null;

  const panelClass = [
    "sidebar-panel flex flex-col bg-white",
    openAnim ? "is-open" : !sidebarOpen ? "is-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const accountLinks: {
    label: string;
    href: string;
    icon: string;
    primary?: boolean;
    badge?: number;
  }[] = [
    {
      label: t("sidebar.myAccount"),
      href: "/account",
      icon: "bi-person",
      primary: true,
    },
    {
      label: t("sidebar.savedItems"),
      href: "/wishlist",
      icon: "bi-heart",
      badge: isHydrated ? wishlistCount : 0,
    },
    {
      label: t("sidebar.myBag"),
      href: "/bag",
      icon: "bi-bag",
      badge: isHydrated ? cartCount : 0,
    },
    {
      label: t("sidebar.helpFaq"),
      href: "/account",
      icon: "bi-question-circle",
    },
  ];

  return createPortal(
    <>
      <div
        className={[
          "sidebar-backdrop",
          openAnim ? "is-open" : !sidebarOpen ? "is-closing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleClose}
        aria-hidden={!openAnim}
      />

      <aside
        id="mobile-sidebar"
        className={panelClass}
        aria-hidden={!openAnim}
        role="dialog"
        aria-modal={openAnim}
      >
        <div className="sidebar-top-header shrink-0">
          <div className="sidebar-top-header__row">
            <Link
              href="/"
              onClick={handleClose}
              className="text-[20px] font-black tracking-tighter text-white lg:text-[22px]"
            >
              <SiteLogo />
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="sidebar-close-btn sidebar-close-btn--light"
              aria-label={t("sidebar.closeMenu")}
            >
              ×
            </button>
          </div>

          <div className="sidebar-top-header__meta">
            <p className="sidebar-top-header__tagline">
              {t("sidebar.menStore")}
            </p>
            <LanguageSwitcher variant="sidebar-dark" />
          </div>
        </div>

        <div className="sidebar-body relative min-h-0 flex-1 overflow-hidden">
          <nav
            className={`sidebar-submenu-panel sidebar-submenu-panel--main ${
              activeSubmenu ? "is-hidden" : ""
            }`}
          >
            <p className="sidebar-nav-section-title">{t("sidebar.shop")}</p>

            <ul className="m-0 list-none p-0">
              {menuItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <button
                      type="button"
                      onClick={() => openSubmenu(item)}
                      className={`sidebar-nav-item w-full ${
                        item.highlight ? "sidebar-nav-item--sale" : ""
                      }`}
                    >
                      <span
                        className={
                          item.highlight ? "font-bold text-[#d01345]" : ""
                        }
                      >
                        {item.label}
                      </span>
                      <span className="sidebar-nav-item__chevron">
                        {isRtl ? "‹" : "›"}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleClose}
                      className={`sidebar-nav-item ${
                        item.highlight ? "sidebar-nav-item--sale" : ""
                      }`}
                    >
                      <span
                        className={
                          item.highlight ? "font-bold text-[#d01345]" : ""
                        }
                      >
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className={`sidebar-submenu-panel sidebar-submenu-panel--sub flex flex-col bg-white ${
              activeSubmenu ? "is-active" : ""
            }`}
          >
            {activeSubmenu && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSubmenu(null)}
                  className="sidebar-submenu-back shrink-0"
                >
                  <span className="text-gray-400">{isRtl ? "›" : "‹"}</span>
                  <span>{activeSubmenu.label}</span>
                </button>

                <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain p-0">
                  {activeSubmenu.children?.map((child) => {
                    const isViewAll = child.href === activeSubmenu.href;
                    return (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={handleClose}
                          className={`sidebar-submenu-item ${
                            isViewAll ? "sidebar-submenu-item--view-all" : ""
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>
        </div>

        <div className="sidebar-footer shrink-0 border-t-2 border-gray-200 bg-white">
          <ul className="m-0 list-none p-0">
            {accountLinks.map((link) => (
              <li key={link.label} className="border-b border-gray-100">
                <Link
                  href={link.href}
                  onClick={handleClose}
                  className={`sidebar-account-link ${
                    link.primary ? "sidebar-account-link--primary" : ""
                  }`}
                >
                  <span className="sidebar-account-link__inner">
                    <i className={`bi ${link.icon} sidebar-account-link__icon`} />
                    <span>{link.label}</span>
                  </span>
                  {(link.badge ?? 0) > 0 && (
                    <span className="sidebar-quick-badge">{link.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>,
    document.body
  );
}
