import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WishlistContent from "@/components/WishlistContent";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Saved Items | ${siteConfig.name}`,
};

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main>
        <WishlistContent />
      </main>
      <Footer />
    </>
  );
}
