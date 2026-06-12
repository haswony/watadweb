"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { localizeProducts } from "@/i18n/products-i18n";
import { formatPrice } from "@/lib/currency";

export default function WishlistContent() {
  const { getWishlistProducts, toggleWishlist } = useStore();
  const { t, locale } = useLocale();
  const products = localizeProducts(getWishlistProducts(), locale);

  const countLabel =
    products.length === 1
      ? t("wishlist.itemSaved")
      : t("wishlist.itemsSaved", { count: products.length });

  if (products.length === 0) {
    return (
      <div className="saved-page">
        <div className="saved-page__empty">
          <h1 className="saved-page__title">{t("wishlist.empty")}</h1>
          <p className="saved-page__subtitle">{t("wishlist.emptyText")}</p>
          <Link href="/" className="saved-page__cta">
            {t("wishlist.startShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="site-container saved-page__inner">
        <nav className="saved-page__breadcrumb">
          <Link href="/">{t("wishlist.home")}</Link>
          <span>/</span>
          <span>{t("wishlist.title")}</span>
        </nav>

        <header className="saved-page__header">
          <h1 className="saved-page__title">{t("wishlist.title")}</h1>
          <p className="saved-page__subtitle">{countLabel}</p>
        </header>

        <div className="saved-page__grid">
          {products.map((product) => (
            <article key={product.id} className="saved-card">
              <div
                className={`saved-card__image-wrap ${
                  product.imageFit === "contain" ? "bg-[#c41e3a]" : ""
                }`}
              >
                <Link href={`/product/${product.id}`} className="saved-card__image-link">
                  <CatalogImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className={
                      product.imageFit === "contain"
                        ? "object-contain p-3"
                        : "object-cover"
                    }
                    sizes="(max-width: 640px) 50vw, 280px"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="saved-card__remove"
                  aria-label={t("wishlist.remove")}
                >
                  <i className="bi bi-heart-fill" />
                </button>
              </div>

              <div className="saved-card__body">
                <p className="saved-card__brand">{product.brand}</p>
                <Link href={`/product/${product.id}`} className="saved-card__name">
                  {product.name}
                </Link>
                <div className="saved-card__price-row">
                  <span className="saved-card__price">
                    {formatPrice(product.price, locale)}
                  </span>
                  {product.originalPrice && (
                    <span className="saved-card__was">
                      {formatPrice(product.originalPrice, locale)}
                    </span>
                  )}
                </div>

                <Link href={`/product/${product.id}`} className="saved-card__bag-btn">
                  {t("wishlist.moveToBag")}
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="saved-card__remove-text"
                >
                  {t("wishlist.remove")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
