"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function DesktopNav() {
  const { menuItems } = useLocale();
  const links = menuItems;

  return (
    <nav className="hidden border-t border-white/10 lg:block">
      <div className="site-container">
        <ul className="flex items-center justify-center gap-1 py-0">
          {links.map((link) => (
            <li key={link.label} className="nav-item group relative">
              <Link
                href={link.href}
                className={`block px-5 py-3.5 text-[13px] font-semibold tracking-wide transition-colors hover:bg-white/5 ${
                  link.highlight ? "text-[#ff6b8a]" : "text-white"
                }`}
              >
                {link.label}
              </Link>

              {link.children && (
                <div className="nav-dropdown pointer-events-none absolute start-0 top-full z-50 min-w-[220px] border border-gray-100 bg-white py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-5 py-2.5 text-[13px] font-medium text-[#2d2d2d] transition hover:bg-gray-50"
                    >
                      {child.label}
                    </Link>
                  ))}
                  <Link
                    href={link.href}
                    className="mt-1 block border-t border-gray-100 px-5 py-2.5 text-[13px] font-bold text-[#2d2d2d] transition hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
