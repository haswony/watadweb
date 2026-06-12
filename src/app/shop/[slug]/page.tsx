import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopPageContent from "@/components/ShopPageContent";
import { FIXED_SHOP_PAGES } from "@/lib/admin-links";

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return Object.keys(FIXED_SHOP_PAGES).map((slug) => ({ slug }));
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <main>
        <ShopPageContent slug={slug} />
      </main>
      <Footer />
    </>
  );
}
