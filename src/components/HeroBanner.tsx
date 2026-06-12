"use client";

import Link from "next/link";
import CatalogImage from "@/components/CatalogImage";
import { useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const { heroSlides: slides } = useCatalog();

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section className="relative h-[42vh] min-h-[260px] w-full overflow-hidden sm:h-[55vh] sm:min-h-[380px] lg:h-[65vh] lg:max-h-[720px]">
      {slides.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <CatalogImage
            src={s.image}
            alt={s.title}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-end">
        <div className="site-container w-full pb-6 sm:pb-10 lg:pb-16">
          <h1 className="mb-1.5 max-w-xl text-xl font-black uppercase tracking-tight text-white sm:mb-2 sm:text-4xl lg:text-5xl xl:text-6xl">
            {slide.title}
          </h1>
          <p className="mb-4 max-w-md text-sm text-white/90 sm:mb-6 sm:text-base lg:text-lg xl:text-xl">
            {slide.subtitle}
          </p>
          <Link
            href={slide.href}
            className="inline-block bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#2d2d2d] transition hover:bg-white/90 sm:px-8 sm:py-3.5 sm:text-xs lg:px-10 lg:text-sm"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 end-4 flex gap-1.5 sm:bottom-6 sm:end-6 sm:gap-2 lg:end-12 xl:end-16">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
