"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import RelatedProducts from "@/components/RelatedProducts";
import { useCatalog } from "@/hooks/useCatalog";

export default function ProductPageClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const catalog = useCatalog();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (catalog.hydrated) setReady(true);
  }, [catalog.hydrated]);

  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    notFound();
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">...</p>
      </div>
    );
  }

  const product = catalog.getProductById(productId);

  if (!product) {
    notFound();
  }

  const related = catalog.getRelatedProducts(product);

  return (
    <>
      <Header />
      <main>
        <ProductDetail product={product} />
        <RelatedProducts products={related} />
      </main>
      <Footer />
    </>
  );
}
