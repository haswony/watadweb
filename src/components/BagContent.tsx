"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { localizeProduct } from "@/i18n/products-i18n";
import { useCatalog } from "@/hooks/useCatalog";
import { formatPrice } from "@/lib/currency";

export default function BagContent() {
  const { t, locale } = useLocale();
  const { settings } = useCatalog();
  const { freeDeliveryMin, deliveryFee } = settings;
  const {
    getCartProducts,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart,
  } = useStore();
  const items = getCartProducts();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
        <i className="bi bi-bag mb-4 text-5xl text-gray-300" />
        <h1 className="text-2xl font-black uppercase">{t("bag.empty")}</h1>
        <p className="mt-3 max-w-md text-gray-500">{t("bag.emptyText")}</p>
        <Link
          href="/"
          className="mt-8 bg-[#2d2d2d] px-10 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#1a1a1a]"
        >
          {t("bag.continueShopping")}
        </Link>
      </div>
    );
  }

  const deliveryFree = cartTotal >= freeDeliveryMin;
  const orderTotal = deliveryFree ? cartTotal : cartTotal + deliveryFee;

  return (
    <div className="site-container py-8 lg:py-12 xl:py-16">
      <h1 className="mb-8 text-3xl font-black uppercase">
        {t("bag.title")} ({cartCount})
      </h1>

      <div className="grid gap-10 lg:grid-cols-3 xl:gap-16">
        <div className="lg:col-span-2 xl:pr-8">
          <ul className="divide-y divide-gray-200">
            {items.map(({ item, product: raw }) => {
              const product = localizeProduct(raw, locale);
              return (
              <li
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 py-6 sm:gap-6"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="relative h-32 w-24 shrink-0 overflow-hidden bg-gray-100 sm:h-40 sm:w-32"
                >
                  <CatalogImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        {product.brand}
                      </p>
                      <Link
                        href={`/product/${product.id}`}
                        className="mt-1 block text-sm font-semibold hover:underline sm:text-base"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {t("bag.size")}: {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-bold sm:text-base">
                      {formatPrice(product.price * item.quantity, locale)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-gray-100"
                        aria-label={t("bag.decreaseQty")}
                      >
                        <i className="bi bi-dash" />
                      </button>
                      <span className="flex h-9 w-10 items-center justify-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-gray-100"
                        aria-label={t("bag.increaseQty")}
                      >
                        <i className="bi bi-plus" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.size)
                      }
                      className="text-sm text-gray-500 underline transition hover:text-[#d01345]"
                    >
                      {t("bag.remove")}
                    </button>
                  </div>
                </div>
              </li>
            );
            })}
          </ul>
        </div>

        <div className="h-fit border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
            {t("bag.orderSummary")}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("bag.subtotal")}</span>
              <span className="font-semibold">
                {formatPrice(cartTotal, locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("bag.delivery")}</span>
              <span className="font-semibold">
                {deliveryFree
                  ? t("bag.free")
                  : formatPrice(deliveryFee, locale)}
              </span>
            </div>
          </div>
          {!deliveryFree && (
            <p className="mt-3 text-xs text-gray-500">
              {t("bag.spendMore", {
                amount: formatPrice(
                  Math.max(0, freeDeliveryMin - cartTotal),
                  locale
                ),
              })}
            </p>
          )}
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-bold">
            <span>{t("bag.total")}</span>
            <span>{formatPrice(orderTotal, locale)}</span>
          </div>

          <button className="mt-6 w-full bg-[#2d8c3c] py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#247a33]">
            {t("bag.checkout")}
          </button>
          <button
            onClick={clearCart}
            className="mt-3 w-full border border-gray-300 py-3 text-sm font-semibold transition hover:border-[#2d2d2d]"
          >
            {t("bag.clearBag")}
          </button>
          <Link
            href="/"
            className="mt-4 block text-center text-sm font-semibold underline"
          >
            {t("bag.continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
