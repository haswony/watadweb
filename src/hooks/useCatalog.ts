"use client";

import { useMemo } from "react";
import type { Product } from "@/data/products";
import type { NavItem } from "@/data/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useLocale } from "@/context/LocaleContext";
import {
  categoryHref,
  FIXED_SHOP_PAGES,
  resolveLink,
} from "@/lib/admin-links";
import {
  filterProductsByCategorySlug,
  getRootCategories,
} from "@/lib/category-tree";
import type { AdminCategory, CatalogProduct } from "@/types/admin";
import { localizeProduct as i18nLocalize } from "@/i18n/products-i18n";

export function useCatalog() {
  const { state, hydrated } = useAdmin();
  const { locale } = useLocale();

  return useMemo(() => {
    const { products, categories, brands, navigation, heroSlides, settings } =
      state;

    const localize = (p: CatalogProduct): Product => {
      const cat = categories.find((c) => c.id === p.categoryId);
      const base = i18nLocalize(p, locale);
      return {
        ...base,
        name: locale === "ar" ? p.nameAr || base.name : p.name,
        category:
          locale === "ar"
            ? cat?.nameAr ?? base.category
            : cat?.nameEn ?? base.category,
      };
    };

    const localizeAll = (list: CatalogProduct[]) => list.map(localize);

    const menuItems: NavItem[] = navigation.map((item) => ({
      label: locale === "ar" ? item.labelAr : item.labelEn,
      href: resolveLink(item.linkType, item.categoryId, categories),
      highlight: item.highlight,
      children: item.children?.map((child) => ({
        label: locale === "ar" ? child.labelAr : child.labelEn,
        href: resolveLink(child.linkType, child.categoryId, categories),
      })),
    }));

    const getShopTitle = (slug: string) => {
      const fixed = FIXED_SHOP_PAGES[slug];
      if (fixed) return locale === "ar" ? fixed.titleAr : fixed.titleEn;
      const cat = categories.find((c) => c.slug === slug);
      if (cat) return locale === "ar" ? cat.nameAr : cat.nameEn;
      return slug.replace(/-/g, " ");
    };

    const rootCategories = getRootCategories(categories);

    const displayCategories = rootCategories.map((c) => ({
      name: locale === "ar" ? c.nameAr : c.nameEn,
      image: c.image,
      href: categoryHref(c.slug),
    }));

    const displayBrands = brands
      .filter((b) => b.visible)
      .map((b) => ({
        id: b.id,
        name: locale === "ar" ? b.nameAr || b.name : b.name,
        searchName: b.name,
        image: b.image,
      }));

    const displayHero = heroSlides.map((h) => ({
      title: locale === "ar" ? h.titleAr : h.titleEn,
      subtitle: locale === "ar" ? h.subtitleAr : h.subtitleEn,
      cta: locale === "ar" ? h.ctaAr : h.ctaEn,
      href: resolveLink(h.linkType, h.categoryId, categories),
      image: h.image,
    }));

    const productsByCategory = rootCategories.map((cat) => ({
      category: cat,
      title: locale === "ar" ? cat.nameAr : cat.nameEn,
      href: categoryHref(cat.slug),
      products: localizeAll(
        filterProductsByCategorySlug(cat.slug, products, categories).slice(0, 12)
      ),
    }));

    return {
      hydrated,
      settings,
      products,
      categories: displayCategories,
      adminCategories: categories,
      brands: displayBrands,
      brandSectionTitle:
        locale === "ar"
          ? settings.brandSectionTitleAr
          : settings.brandSectionTitleEn,
      brandSectionEnabled: settings.brandSectionEnabled,
      menuItems,
      heroSlides: displayHero,
      productsByCategory,
      allProducts: localizeAll(products),
      getProductById: (id: number) => {
        const p = products.find((x) => x.id === id);
        return p ? localize(p) : undefined;
      },
      getRelatedProducts: (product: Product, limit = 8) => {
        const source = products.find((p) => p.id === product.id);
        const sameCategory = products.filter(
          (p) =>
            p.id !== product.id &&
            p.categoryId === source?.categoryId
        );
        const others = products.filter(
          (p) =>
            p.id !== product.id &&
            p.categoryId !== source?.categoryId
        );
        return localizeAll([...sameCategory, ...others].slice(0, limit));
      },
      searchProducts: (query: string) => {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        return localizeAll(
          products.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.nameAr.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.color?.toLowerCase().includes(q) ||
              categories.some(
                (c) =>
                  (c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q)) &&
                  p.categoryId === c.id
              )
          )
        );
      },
      filterProductsBySlug: (slug: string) =>
        localizeAll(filterProductsByCategorySlug(slug, products, categories)),
      getShopTitle,
      siteName: locale === "ar" ? settings.nameAr : settings.name,
      logoBold: locale === "ar" ? settings.logoBoldAr : settings.logoBold,
      logoLight: locale === "ar" ? settings.logoLightAr : settings.logoLight,
      promoText: locale === "ar" ? settings.promoAr : settings.promoEn,
      promoSpendText:
        locale === "ar" ? settings.promoSpendAr : settings.promoSpendEn,
      promoCode: settings.promoCode,
      aboutText:
        locale === "ar" ? settings.descriptionAr : settings.description,
      copyright: `© ${settings.year} ${locale === "ar" ? settings.nameAr : settings.name}`,
    };
  }, [state, locale, hydrated]);
}
