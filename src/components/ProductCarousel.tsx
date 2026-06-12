"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useRef } from "react";
import type { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { localizeProducts } from "@/i18n/products-i18n";
import { formatPrice } from "@/lib/currency";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  tabs?: string[];
  viewAllHref?: string;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  tabs,
  viewAllHref = "/shop/new-in",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toggleWishlist, isInWishlist } = useStore();
  const { t, locale, isRtl } = useLocale();
  const items = localizeProducts(products, locale);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    const delta =
      direction === "left"
        ? isRtl
          ? amount
          : -amount
        : isRtl
          ? -amount
          : amount;
    scrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="py-4 sm:py-8 lg:py-12 xl:py-14">
      <div className="site-container">
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5 lg:mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="mobile-section-title text-base font-black uppercase tracking-tight sm:text-xl lg:text-2xl xl:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">{subtitle}</p>
            )}
            <Link
              href={viewAllHref}
              className="mt-1.5 inline-block text-[11px] font-bold uppercase tracking-wider text-[#2d2d2d] underline lg:hidden"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:gap-3 lg:flex">
            <Link
              href={viewAllHref}
              className="text-xs font-bold uppercase tracking-wider text-[#2d2d2d] underline transition hover:no-underline"
            >
              {t("common.viewAll")}
            </Link>
            <div className="flex gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="flex h-9 w-9 items-center justify-center border border-gray-300 text-sm transition hover:border-[#2d2d2d] hover:bg-gray-50 lg:h-10 lg:w-10"
                aria-label={t("common.scrollLeft")}
              >
                <i className={`bi ${isRtl ? "bi-chevron-right" : "bi-chevron-left"}`} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-9 w-9 items-center justify-center border border-gray-300 text-sm transition hover:border-[#2d2d2d] hover:bg-gray-50 lg:h-10 lg:w-10"
                aria-label={t("common.scrollRight")}
              >
                <i className={`bi ${isRtl ? "bi-chevron-left" : "bi-chevron-right"}`} />
              </button>
            </div>
          </div>
        </div>

        {tabs && (
          <div className="mb-3 flex gap-5 overflow-x-auto border-b border-gray-200 scrollbar-hide sm:mb-5 sm:gap-8 lg:mb-6">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`shrink-0 border-b-2 pb-2.5 text-xs font-semibold transition-colors sm:pb-3 sm:text-sm ${
                  i === 0
                    ? "border-[#2d2d2d] text-[#2d2d2d]"
                    : "border-transparent text-gray-400 hover:text-[#2d2d2d]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pe-4 ps-4 scrollbar-hide sm:gap-3 lg:gap-4 lg:px-8 xl:gap-5 xl:px-12"
      >
        {items.map((product) => (
          <div
            key={product.id}
            className="product-card mobile-product-card w-[156px] shrink-0 sm:w-[190px] md:w-[220px] lg:w-[240px] xl:w-[280px]"
          >
            <div
              className={`relative mb-2 aspect-[3/4] overflow-hidden sm:mb-3 ${
                product.imageFit === "contain" ? "bg-[#c41e3a]" : "bg-gray-100"
              }`}
            >
              <Link href={`/product/${product.id}`} className="relative block h-full">
                <CatalogImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className={`product-image ${
                    product.imageFit === "contain" ? "object-contain p-3" : "object-cover"
                  }`}
                  sizes="280px"
                />
              </Link>
              {product.badge && (
                <span className="absolute start-2 top-2 bg-[#2d2d2d] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm transition hover:bg-white lg:h-9 lg:w-9"
                aria-label={t("common.toggleWishlist")}
              >
                <i
                  className={`bi ${
                    isInWishlist(product.id)
                      ? "bi-heart-fill text-[#d01345]"
                      : "bi-heart"
                  }`}
                />
              </button>
            </div>
            <Link href={`/product/${product.id}`}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 lg:text-xs">
                {product.brand}
              </p>
              <h3 className="mt-0.5 line-clamp-2 text-[13px] leading-snug hover:underline sm:mt-1 sm:text-sm lg:text-[15px]">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-bold lg:text-base">
                  {formatPrice(product.price, locale)}
                </span>
              </div>
            </Link>
          </div>
        ))}
        <div className="w-4 shrink-0 lg:w-8" aria-hidden />
      </div>
    </section>
  );
}
