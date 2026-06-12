"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function StyleFeed() {
  const { t } = useLocale();

  return (
    <section className="bg-[#2d2d2d] py-12 text-white lg:py-16 xl:py-20">
      <div className="site-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="max-w-lg">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight lg:text-3xl xl:text-4xl">
              {t("home.waitMore")}
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-white/80 lg:text-base">
              {t("home.waitMoreText")}
            </p>
            <Link
              href="/shop/new-in"
              className="inline-block border-2 border-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition hover:bg-white hover:text-[#2d2d2d] lg:text-sm"
            >
              {t("home.exploreFeed")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                alt="Style"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden lg:mt-12">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"
                alt="Style"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
