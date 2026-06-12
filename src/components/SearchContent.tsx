"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { useCatalog } from "@/hooks/useCatalog";
import { formatPrice } from "@/lib/currency";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { toggleWishlist, isInWishlist } = useStore();
  const { t, locale } = useLocale();
  const { searchProducts } = useCatalog();
  const results = searchProducts(query);

  return (
    <div className="site-container py-8 lg:py-12">
      <h1 className="text-2xl font-black uppercase lg:text-3xl">
        {query ? t("shop.resultsFor", { query }) : t("shop.searchTitle")}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {results.length}{" "}
        {results.length === 1 ? t("shop.product") : t("shop.products")}{" "}
        {t("shop.found")}
      </p>

      {results.length === 0 ? (
        <div className="mt-16 text-center">
          <i className="bi bi-search mb-4 text-4xl text-gray-300" />
          <p className="text-gray-500">{t("shop.noResults")}</p>
          <Link href="/" className="mt-6 inline-block font-semibold underline">
            {t("shop.browseAll")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {results.map((product) => (
            <article key={product.id}>
              <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-gray-100">
                <Link href={`/product/${product.id}`}>
                  <CatalogImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition hover:scale-105"
                    sizes="300px"
                  />
                </Link>
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
              <p className="text-xs font-bold uppercase text-gray-500">{product.brand}</p>
              <Link href={`/product/${product.id}`} className="mt-1 block text-sm hover:underline">
                {product.name}
              </Link>
              <p className="mt-2 text-sm font-bold">
                {formatPrice(product.price, locale)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
