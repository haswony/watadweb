import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BagContent from "@/components/BagContent";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `My Bag | ${siteConfig.name}`,
};

export default function BagPage() {
  return (
    <>
      <Header />
      <main>
        <BagContent />
      </main>
      <Footer />
    </>
  );
}
