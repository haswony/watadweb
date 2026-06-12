"use client";

import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import PromoTiles from "@/components/PromoTiles";
import ProductCarousel from "@/components/ProductCarousel";
import BrandGrid from "@/components/BrandGrid";
import CategoryGrid from "@/components/CategoryGrid";
import StyleFeed from "@/components/StyleFeed";
import Footer from "@/components/Footer";
import { useLocale } from "@/context/LocaleContext";
import { useCatalog } from "@/hooks/useCatalog";

export default function Home() {
  const { t } = useLocale();
  const { allProducts, productsByCategory } = useCatalog();

  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <PromoTiles />

        <CategoryGrid />

        {allProducts.length > 0 && (
          <ProductCarousel
            title={t("home.newIn")}
            subtitle={t("home.latestDrops")}
            products={allProducts.slice(0, 12)}
            viewAllHref="/shop/all"
          />
        )}

        {productsByCategory
          .filter((block) => block.products.length > 0)
          .map((block) => (
            <ProductCarousel
              key={block.category.id}
              title={block.title}
              products={block.products}
              viewAllHref={block.href}
            />
          ))}

        <BrandGrid />

        <StyleFeed />
      </main>
      <Footer />
    </>
  );
}
