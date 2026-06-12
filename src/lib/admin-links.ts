import type { AdminCategory, AdminLinkType } from "@/types/admin";
import { getChildCategories, getRootCategories } from "@/lib/category-tree";

const AR_SLUG_MAP: Record<string, string> = {
  تيشيرات: "t-shirts",
  بناطير: "pants",
  جينز: "jeans",
  أحذية: "shoes",
  هوديز: "hoodies",
  جاكيتات: "jackets",
  شورتات: "shorts",
  قمصان: "shirts",
  إكسسوارات: "accessories",
};

export function categoryHref(slug: string) {
  return `/shop/${slug}`;
}

export function makeSlug(
  nameEn: string,
  nameAr: string,
  existing: string[],
  currentSlug?: string
): string {
  const trimmedAr = nameAr.trim();
  const fromAr = AR_SLUG_MAP[trimmedAr];

  let base =
    fromAr ||
    nameEn
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  if (!base) {
    base = `cat-${Date.now().toString(36)}`;
  }

  if (currentSlug === base) return base;

  let slug = base;
  let n = 1;
  while (existing.includes(slug) && slug !== currentSlug) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function resolveLink(
  linkType: AdminLinkType,
  categoryId: string | undefined,
  categories: AdminCategory[]
): string {
  switch (linkType) {
    case "home":
      return "/";
    case "sale":
      return "/shop/sale";
    case "all":
      return "/shop/all";
    case "category": {
      const cat =
        categories.find((c) => c.id === categoryId) ?? categories[0];
      return cat ? categoryHref(cat.slug) : "/shop/all";
    }
    default:
      return "/";
  }
}

export const LINK_TYPE_LABELS: Record<
  AdminLinkType,
  { ar: string; en: string }
> = {
  home: { ar: "الرئيسية", en: "Home" },
  category: { ar: "تصنيف", en: "Category" },
  sale: { ar: "تخفيضات", en: "Sale" },
  all: { ar: "كل المنتجات", en: "All products" },
};

export const FIXED_SHOP_PAGES: Record<
  string,
  { titleAr: string; titleEn: string }
> = {
  sale: { titleAr: "تخفيضات", titleEn: "Sale" },
  "new-in": { titleAr: "وصل حديثاً", titleEn: "New in" },
  all: { titleAr: "كل المنتجات", titleEn: "All products" },
};

export function buildNavigationFromCategories(categories: AdminCategory[]) {
  const roots = getRootCategories(categories);

  return [
    {
      id: "nav-home",
      labelAr: "الرئيسية",
      labelEn: "Home",
      linkType: "home" as const,
    },
    ...roots.map((root) => {
      const children = getChildCategories(categories, root.id);
      return {
        id: `nav-${root.id}`,
        labelAr: root.nameAr,
        labelEn: root.nameEn,
        linkType: "category" as const,
        categoryId: root.id,
        children:
          children.length > 0
            ? [
                ...children.map((child) => ({
                  id: `nav-${child.id}`,
                  labelAr: child.nameAr,
                  labelEn: child.nameEn,
                  linkType: "category" as const,
                  categoryId: child.id,
                })),
                {
                  id: `nav-${root.id}-all`,
                  labelAr: `كل ${root.nameAr}`,
                  labelEn: `All ${root.nameEn}`,
                  linkType: "category" as const,
                  categoryId: root.id,
                },
              ]
            : undefined,
      };
    }),
    {
      id: "nav-sale",
      labelAr: "تخفيضات",
      labelEn: "Sale",
      linkType: "sale" as const,
      highlight: true,
    },
  ];
}
