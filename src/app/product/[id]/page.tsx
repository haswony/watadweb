import ProductPageClient from "@/components/ProductPageClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [{ id: "0" }];
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={params} />;
}
