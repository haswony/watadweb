"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useCatalog } from "@/hooks/useCatalog";

export default function BrandGrid() {
  const { brands, brandSectionTitle, brandSectionEnabled } = useCatalog();
  const visibleBrands = brands.filter((b) => b.image);

  if (!brandSectionEnabled || visibleBrands.length === 0) {
    return null;
  }

  return (
    <section
      id="brands"
      className="bg-[#f5f5f5] py-4 sm:py-8 lg:py-12 xl:py-14"
    >
      <div className="site-container">
        <h2 className="mobile-section-title mb-4 text-base font-black uppercase tracking-tight sm:mb-6 sm:text-xl lg:mb-8 lg:text-2xl xl:text-3xl">
          {brandSectionTitle}
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
          {visibleBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/search?q=${encodeURIComponent(brand.searchName)}`}
              className="group relative aspect-square overflow-hidden bg-white"
            >
              <CatalogImage
                src={brand.image}
                alt={brand.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="200px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/45">
                <span className="text-sm font-black uppercase tracking-wider text-white lg:text-base xl:text-lg">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
