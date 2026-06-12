"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { useLocale } from "@/context/LocaleContext";
import { localizeProduct } from "@/i18n/products-i18n";
import { formatPrice } from "@/lib/currency";

interface ProductDetailProps {
  product: Product;
}

const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["6", "7", "8", "9", "10", "11", "12"];

export default function ProductDetail({ product: raw }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const { t, locale } = useLocale();
  const product = localizeProduct(raw, locale);
  const isTrainer = raw.category === "trainers";
  const images = product.images ?? [product.image];
  const sizes =
    product.sizes ?? (isTrainer ? shoeSizes : defaultSizes);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const description = product.description ?? `${product.brand} — ${product.name}`;

  const handleAddToBag = () => {
    if (!selectedSize) return;
    addToCart(product.id, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addToCart(product.id, selectedSize);
    router.push("/bag");
  };

  return (
    <div className="site-container py-5 lg:py-12 xl:py-16">
      <nav className="mb-4 text-xs text-gray-500 sm:mb-6 sm:text-sm">
        <Link href="/" className="hover:text-[#2d2d2d] hover:underline">
          {t("product.home")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={isTrainer ? "/shop/trainers" : "/shop/clothing"}
          className="hover:text-[#2d2d2d] hover:underline"
        >
          {isTrainer ? t("product.shoes") : t("product.men")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#2d2d2d]">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            className={`relative mb-3 aspect-[3/4] max-h-[70vh] overflow-hidden sm:mb-4 sm:max-h-[80vh] lg:max-h-none ${
              product.imageFit === "contain" ? "bg-[#c41e3a]" : "bg-gray-100"
            }`}
          >
            <CatalogImage
              src={images[activeImage]}
              alt={product.name}
              fill
              className={
                product.imageFit === "contain"
                  ? "object-contain p-6"
                  : "object-cover"
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute left-4 top-4 bg-[#2d2d2d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-24 w-20 shrink-0 overflow-hidden border-2 transition ${
                    i === activeImage
                      ? "border-[#2d2d2d]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <CatalogImage
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:pt-4 xl:max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 lg:text-sm">
            {product.brand}
          </p>
          <h1 className="mt-1.5 text-xl font-bold leading-tight sm:mt-2 sm:text-2xl lg:text-3xl xl:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">
              {formatPrice(product.price, locale)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice, locale)}
                </span>
                <span className="text-sm font-bold text-[#d01345]">
                  {t("product.save")}{" "}
                  {formatPrice(product.originalPrice - product.price, locale)}
                </span>
              </>
            )}
          </div>

          {product.color && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">
                {t("product.colour")}: <span className="font-normal">{product.color}</span>
              </p>
              <div className="h-8 w-8 rounded-full border-2 border-[#2d2d2d] bg-gray-200" />
            </div>
          )}

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">{t("product.selectSize")}</p>
              <button className="text-sm text-gray-500 underline hover:text-[#2d2d2d]">
                {t("product.sizeGuide")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[52px] border px-4 py-3 text-sm font-semibold transition ${
                    selectedSize === size
                      ? "border-[#2d2d2d] bg-[#2d2d2d] text-white"
                      : "border-gray-300 hover:border-[#2d2d2d]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="mt-2 text-sm text-gray-500">
                {t("product.pleaseSelectSize")}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleAddToBag}
              disabled={!selectedSize}
              className={`py-3.5 text-sm font-bold uppercase tracking-wider transition sm:py-4 ${
                selectedSize
                  ? "bg-[#2d8c3c] text-white hover:bg-[#247a33]"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              {added ? t("product.addedToBag") : t("product.addToBag")}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className={`border py-3.5 text-sm font-bold uppercase tracking-wider transition sm:py-4 ${
                selectedSize
                  ? "border-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-white"
                  : "cursor-not-allowed border-gray-200 text-gray-400"
              }`}
            >
              {t("product.buyNow")}
            </button>
          </div>

          <button
            onClick={() => toggleWishlist(product.id)}
            className={`mt-3 flex w-full items-center justify-center gap-2 border py-4 text-sm font-semibold transition ${
              inWishlist
                ? "border-[#d01345] text-[#d01345]"
                : "border-gray-300 hover:border-[#2d2d2d]"
            }`}
          >
            <i className={`bi ${inWishlist ? "bi-heart-fill" : "bi-heart"}`} />
            {inWishlist ? t("product.savedToWishlist") : t("product.addToWishlist")}
          </button>

          <div className="mt-8 space-y-3 border-t border-gray-200 pt-8 text-sm">
            <div className="flex items-start gap-3">
              <i className="bi bi-truck text-lg" />
              <div>
                <p className="font-semibold">{t("product.freeDelivery")}</p>
                <p className="text-gray-500">{t("product.freeDeliveryText")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="bi bi-arrow-repeat text-lg" />
              <div>
                <p className="font-semibold">{t("product.freeReturns")}</p>
                <p className="text-gray-500">{t("product.freeReturnsText")}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">
              {t("product.productDetails")}
            </h2>
            <p className="leading-relaxed text-gray-600">{description}</p>
            <ul className="mt-4 space-y-1 text-sm text-gray-600">
              <li>• {product.brand}</li>
              {product.color && <li>• {t("product.colour")}: {product.color}</li>}
              {product.category && <li>• {t("product.category")}: {product.category}</li>}
              <li>• {t("product.productCode")}: SH-{product.id.toString().padStart(5, "0")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
