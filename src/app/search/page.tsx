import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchContent from "@/components/SearchContent";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Search | ${siteConfig.name}`,
};

export default function SearchPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="px-4 py-20 text-center text-gray-500">
              Searching...
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
