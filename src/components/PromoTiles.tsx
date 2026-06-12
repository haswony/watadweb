"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function PromoTiles() {
  const { t } = useLocale();

  const tiles = [
    {
      title: t("home.promoSummer"),
      href: "/shop/clothing",
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80",
    },
    {
      title: t("home.promoTrainers"),
      href: "/shop/trainers",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    },
    {
      title: t("home.promoSale"),
      href: "/shop/sale",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80",
      highlight: true,
    },
  ];

  return (
    <section className="hidden py-6 lg:block">
      <div className="site-container">
        <div className="grid grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative aspect-[16/9] overflow-hidden"
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="33vw"
              />
              <div className="hero-overlay absolute inset-0" />
              <div className="absolute inset-0 flex items-end p-6">
                <span
                  className={`text-lg font-black uppercase tracking-wide text-white xl:text-xl ${
                    tile.highlight ? "text-[#ff6b8a]" : ""
                  }`}
                >
                  {tile.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
