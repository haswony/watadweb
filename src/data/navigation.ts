export interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  children?: { label: string; href: string }[];
}

export const sidebarMenu: NavItem[] = [
  { label: "New in", href: "/shop/new-in" },
  {
    label: "Clothing",
    href: "/shop/clothing",
    children: [
      { label: "T-Shirts & Vests", href: "/shop/t-shirts" },
      { label: "Jeans", href: "/shop/jeans" },
      { label: "Hoodies & Sweatshirts", href: "/shop/hoodies" },
      { label: "Jackets & Coats", href: "/shop/jackets" },
      { label: "Shorts", href: "/shop/shorts" },
      { label: "View all clothing", href: "/shop/clothing" },
    ],
  },
  {
    label: "Shoes",
    href: "/shop/shoes",
    children: [
      { label: "Trainers", href: "/shop/trainers" },
      { label: "Boots", href: "/shop/boots" },
      { label: "Sandals", href: "/shop/sandals" },
      { label: "View all shoes", href: "/shop/shoes" },
    ],
  },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Brands", href: "/shop/brands" },
  { label: "Activewear", href: "/shop/activewear" },
  { label: "Sale", href: "/shop/sale", highlight: true },
];

export const topNavLinks: NavItem[] = sidebarMenu;

export const shopSlugs: Record<string, { title: string; filter?: string }> = {
  "new-in": { title: "New in", filter: "new" },
  clothing: { title: "Clothing", filter: "clothing" },
  "t-shirts": { title: "T-Shirts & Vests", filter: "clothing" },
  jeans: { title: "Jeans", filter: "clothing" },
  hoodies: { title: "Hoodies & Sweatshirts", filter: "clothing" },
  jackets: { title: "Jackets & Coats", filter: "clothing" },
  shorts: { title: "Shorts", filter: "clothing" },
  shoes: { title: "Shoes", filter: "trainers" },
  trainers: { title: "Trainers", filter: "trainers" },
  boots: { title: "Boots", filter: "trainers" },
  sandals: { title: "Sandals", filter: "trainers" },
  accessories: { title: "Accessories" },
  brands: { title: "Brands" },
  activewear: { title: "Activewear", filter: "clothing" },
  sale: { title: "Sale" },
};
