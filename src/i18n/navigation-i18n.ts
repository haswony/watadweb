import type { Locale } from "./translations";
import { translations } from "./translations";
import type { NavItem } from "@/data/navigation";

const navStructure = [
  { key: "newIn", href: "/shop/new-in" },
  {
    key: "clothing",
    href: "/shop/clothing",
    children: [
      { key: "tShirts", href: "/shop/t-shirts" },
      { key: "jeans", href: "/shop/jeans" },
      { key: "hoodies", href: "/shop/hoodies" },
      { key: "jackets", href: "/shop/jackets" },
      { key: "shorts", href: "/shop/shorts" },
      { key: "viewAllClothing", href: "/shop/clothing" },
    ],
  },
  {
    key: "shoes",
    href: "/shop/shoes",
    children: [
      { key: "trainers", href: "/shop/trainers" },
      { key: "boots", href: "/shop/boots" },
      { key: "sandals", href: "/shop/sandals" },
      { key: "viewAllShoes", href: "/shop/shoes" },
    ],
  },
  { key: "accessories", href: "/shop/accessories" },
  { key: "brands", href: "/shop/brands" },
  { key: "activewear", href: "/shop/activewear" },
  { key: "sale", href: "/shop/sale", highlight: true },
] as const;

function getLabel(locale: Locale, key: string): string {
  const labels = translations[locale].nav as Record<string, string>;
  return labels[key] ?? key;
}

export function getLocalizedNavigation(locale: Locale): NavItem[] {
  return navStructure.map((item) => ({
    label: getLabel(locale, item.key),
    href: item.href,
    highlight: "highlight" in item ? item.highlight : undefined,
    children: "children" in item
      ? item.children.map((c) => ({
          label: getLabel(locale, c.key),
          href: c.href,
        }))
      : undefined,
  }));
}
