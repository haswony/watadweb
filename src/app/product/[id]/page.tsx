import ProductPageClient from "@/components/ProductPageClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={params} />;
}
