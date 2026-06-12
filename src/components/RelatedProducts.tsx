"use client";

import ProductCarousel from "./ProductCarousel";
import { useLocale } from "@/context/LocaleContext";
import type { Product } from "@/data/products";

export default function RelatedProducts({ products }: { products: Product[] }) {
  const { t } = useLocale();
  return (
    <ProductCarousel title={t("product.youMightLike")} products={products} />
  );
}
