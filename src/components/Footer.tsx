"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-[#f8f8f8] pt-8 text-[#2d2d2d] lg:pt-12">
      <div className="site-container">
        <div className="mb-8 max-w-md">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest lg:text-sm">
            {t("footer.about")}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {t("footer.aboutText")}
          </p>
          <Link
            href="/account"
            className="text-sm font-semibold text-[#2d2d2d] underline transition hover:no-underline"
          >
            {t("footer.aboutLink")}
          </Link>
        </div>

        <div className="border-t border-gray-200 py-6 lg:py-8">
          <p className="text-center text-xs text-gray-500 lg:text-start">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
