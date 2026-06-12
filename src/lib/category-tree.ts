import type { AdminCategory, CatalogProduct } from "@/types/admin";
import type { NavItem } from "@/data/navigation";
import { categoryHref, makeSlug } from "@/lib/admin-links";

export function getRootCategories(categories: AdminCategory[]) {
  return categories.filter((c) => !c.parentId);
}

export function getChildCategories(
  categories: AdminCategory[],
  parentId: string
) {
  return categories.filter((c) => c.parentId === parentId);
}

export function getCategoryAndDescendantIds(
  categoryId: string,
  categories: AdminCategory[]
) {
  const ids = [categoryId];
  const children = getChildCategories(categories, categoryId);
  for (const child of children) {
    ids.push(...getCategoryAndDescendantIds(child.id, categories));
  }
  return ids;
}

export function buildMenuItemsFromCategories(
  categories: AdminCategory[],
  locale: "ar" | "en"
): NavItem[] {
  const roots = getRootCategories(categories);
  const label = (c: AdminCategory) =>
    locale === "ar" ? c.nameAr : c.nameEn;

  const items: NavItem[] = [
    {
      label: locale === "ar" ? "الرئيسية" : "Home",
      href: "/",
    },
    ...roots.map((root) => {
      const children = getChildCategories(categories, root.id);
      return {
        label: label(root),
        href: categoryHref(root.slug),
        children:
          children.length > 0
            ? [
                ...children.map((child) => ({
                  label: label(child),
                  href: categoryHref(child.slug),
                })),
                {
                  label:
                    locale === "ar"
                      ? `كل ${root.nameAr}`
                      : `All ${root.nameEn}`,
                  href: categoryHref(root.slug),
                },
              ]
            : undefined,
      };
    }),
    {
      label: locale === "ar" ? "تخفيضات" : "Sale",
      href: "/shop/sale",
      highlight: true,
    },
  ];

  return items;
}

export function filterProductsByCategorySlug(
  slug: string,
  products: CatalogProduct[],
  categories: AdminCategory[]
): CatalogProduct[] {
  if (slug === "sale") {
    return products.filter((p) => p.originalPrice);
  }
  if (slug === "new-in") {
    return products.filter((p) => p.badge === "New in");
  }
  if (slug === "all") {
    return products;
  }

  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return [];

  const ids = getCategoryAndDescendantIds(cat.id, categories);
  return products.filter((p) => ids.includes(p.categoryId));
}

export function makeChildSlug(
  parent: AdminCategory,
  nameEn: string,
  nameAr: string,
  existing: string[]
) {
  const parentSlug = parent.slug;
  const base = makeSlug(nameEn, nameAr, [], undefined);
  let slug = `${parentSlug}-${base}`;
  let n = 1;
  while (existing.includes(slug)) {
    slug = `${parentSlug}-${base}-${n++}`;
  }
  return slug;
}

export function formatCategoryOption(
  cat: AdminCategory,
  categories: AdminCategory[],
  locale: "ar" | "en"
): string {
  if (!cat.parentId) {
    return locale === "ar" ? cat.nameAr : cat.nameEn;
  }
  const parent = categories.find((c) => c.id === cat.parentId);
  const prefix = parent
    ? locale === "ar"
      ? `${parent.nameAr} › `
      : `${parent.nameEn} › `
    : "";
  return `${prefix}${locale === "ar" ? cat.nameAr : cat.nameEn}`;
}
