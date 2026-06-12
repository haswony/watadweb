export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  badge?: string;
  description?: string;
  sizes?: string[];
  color?: string;
  category?: string;
  imageFit?: "cover" | "contain";
}

export interface Brand {
  name: string;
  image: string;
}

export interface Category {
  name: string;
  image: string;
  href: string;
}

/** Legacy — storefront reads from AdminContext */
export const allProducts: Product[] = [];
export const categories: Category[] = [];
export const brands: Brand[] = [];
export const heroSlides: { image: string }[] = [];

export function getProductById(_id: number): Product | undefined {
  return undefined;
}

export function getRelatedProducts(_product: Product, _limit = 8): Product[] {
  return [];
}

export function searchProducts(_query: string): Product[] {
  return [];
}

export function filterProductsBySlug(_slug: string): Product[] {
  return [];
}
