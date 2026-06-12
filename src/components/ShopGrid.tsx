"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import type { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/currency";

interface ShopGridProps {
  title: string;
  products: Product[];
}

export default function ShopGrid({ title, products }: ShopGridProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const { t, locale } = useLocale();

  return (
    <div className="site-container py-5 lg:py-12 xl:py-16">
      <nav className="mb-3 text-xs text-gray-500 sm:mb-4 sm:text-sm">
        <Link href="/" className="hover:underline">
          {t("product.home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#2d2d2d]">{title}</span>
      </nav>

      <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-black uppercase sm:text-3xl">{title}</h1>
          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            {products.length} {t("shop.products")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <button className="border border-gray-300 px-3 py-2.5 text-xs font-semibold transition hover:border-[#2d2d2d] sm:px-4 sm:py-2 sm:text-sm">
            {t("shop.sort")}
          </button>
          <button className="border border-gray-300 px-3 py-2.5 text-xs font-semibold transition hover:border-[#2d2d2d] sm:px-4 sm:py-2 sm:text-sm">
            {t("shop.filter")}
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          {t("shop.noProducts")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-6">
          {products.map((product) => (
            <article key={product.id} className="product-card">
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
                      product.imageFit === "contain" ? "object-contain p-4" : "object-cover"
                    }`}
                    sizes="300px"
                  />
                </Link>
                {product.badge && (
                  <span className="absolute start-2 top-2 bg-[#2d2d2d] px-2 py-1 text-[10px] font-bold uppercase text-white">
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
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
              <p className="text-[10px] font-bold uppercase text-gray-500 sm:text-xs">
                {product.brand}
              </p>
              <Link
                href={`/product/${product.id}`}
                className="mt-0.5 block text-[13px] hover:underline sm:mt-1 sm:text-sm"
              >
                {product.name}
              </Link>
              <p className="mt-1 text-[13px] font-bold sm:mt-2 sm:text-sm">
                {formatPrice(product.price, locale)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
