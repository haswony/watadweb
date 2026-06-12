"use client";

import ShopGrid from "./ShopGrid";
import { useCatalog } from "@/hooks/useCatalog";

export default function ShopPageContent({ slug }: { slug: string }) {
  const { filterProductsBySlug, getShopTitle } = useCatalog();
  const title = getShopTitle(slug);
  const products = filterProductsBySlug(slug);

  return <ShopGrid title={title} products={products} />;
}
