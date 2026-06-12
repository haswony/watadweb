import type { Product } from "@/data/products";

export type AdminLinkType = "home" | "category" | "sale" | "all";

export interface CatalogProduct extends Product {
  nameAr: string;
  categoryId: string;
}

export interface AdminSettings {
  name: string;
  nameAr: string;
  logoBold: string;
  logoLight: string;
  logoBoldAr: string;
  logoLightAr: string;
  description: string;
  descriptionAr: string;
  year: number;
  promoEn: string;
  promoAr: string;
  promoSpendEn: string;
  promoSpendAr: string;
  promoCode: string;
  freeDeliveryMin: number;
  deliveryFee: number;
  adminPassword: string;
  brandSectionTitleAr: string;
  brandSectionTitleEn: string;
  brandSectionEnabled: boolean;
}

export type AdminCategoryKind = "main" | "sub";

export interface AdminCategory {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  parentId?: string | null;
  kind: AdminCategoryKind;
}

export interface AdminBrand {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  visible: boolean;
}

export interface AdminNavChild {
  id: string;
  labelEn: string;
  labelAr: string;
  linkType: AdminLinkType;
  categoryId?: string;
}

export interface AdminNavItem {
  id: string;
  labelEn: string;
  labelAr: string;
  linkType: AdminLinkType;
  categoryId?: string;
  highlight?: boolean;
  children?: AdminNavChild[];
}

export interface AdminHeroSlide {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  ctaEn: string;
  ctaAr: string;
  linkType: AdminLinkType;
  categoryId?: string;
  image: string;
}

export interface AdminState {
  settings: AdminSettings;
  products: CatalogProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
  navigation: AdminNavItem[];
  heroSlides: AdminHeroSlide[];
}

export type AdminTab =
  | "overview"
  | "products"
  | "categories"
  | "brands"
  | "hero"
  | "settings";
