"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useLocale } from "@/context/LocaleContext";
import { useCatalog } from "@/hooks/useCatalog";

export default function CategoryGrid() {
  const { t } = useLocale();
  const { categories } = useCatalog();

  return (
    <section className="py-4 sm:py-8 lg:py-12 xl:py-14">
      <div className="site-container">
        <h2 className="mobile-section-title mb-4 text-base font-black uppercase tracking-tight sm:mb-6 sm:text-xl lg:mb-8 lg:text-2xl xl:text-3xl">
          {t("home.topCategories")}
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:gap-4 xl:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name + cat.href}
              href={cat.href}
              className="group relative aspect-[4/5] overflow-hidden lg:aspect-[3/4]"
            >
              {cat.image ? (
                <CatalogImage
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[#2d2d2d]" />
              )}
              <div className="hero-overlay absolute inset-0" />
              <div className="absolute inset-0 flex items-end p-4 lg:p-6">
                <span className="text-sm font-bold text-white lg:text-base xl:text-lg">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
