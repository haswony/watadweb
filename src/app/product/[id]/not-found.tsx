"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale } from "@/context/LocaleContext";

export default function ProductNotFound() {
  const { t } = useLocale();

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-black uppercase">{t("product.notFound")}</h1>
        <p className="mt-4 text-gray-500">{t("product.notFoundText")}</p>
        <Link
          href="/"
          className="mt-8 bg-[#2d2d2d] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#1a1a1a]"
        >
          {t("product.backToShop")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
