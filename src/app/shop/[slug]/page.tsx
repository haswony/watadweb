import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopPageContent from "@/components/ShopPageContent";
import { createDefaultAdminState } from "@/lib/admin-defaults";
import { FIXED_SHOP_PAGES } from "@/lib/admin-links";

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const defaults = createDefaultAdminState();
  const slugs = new Set([
    ...Object.keys(FIXED_SHOP_PAGES),
    ...defaults.categories.map((c) => c.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
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
