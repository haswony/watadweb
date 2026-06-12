import { siteConfig } from "@/config/site";
import { buildNavigationFromCategories } from "@/lib/admin-links";
import type {
  AdminBrand,
  AdminCategory,
  AdminHeroSlide,
  AdminSettings,
  AdminState,
} from "@/types/admin";

export function createDefaultAdminState(): AdminState {
  const settings: AdminSettings = {
    name: siteConfig.name,
    nameAr: siteConfig.nameAr,
    logoBold: siteConfig.logoBold,
    logoLight: siteConfig.logoLight,
    logoBoldAr: siteConfig.logoBoldAr,
    logoLightAr: siteConfig.logoLightAr,
    description: siteConfig.description,
    descriptionAr: siteConfig.descriptionAr,
    year: siteConfig.year,
    promoEn: "5,000 IQD delivery to all Iraqi governorates",
    promoAr: "توصيل 5,000 د.ع لجميع المحافظات",
    promoSpendEn: "free delivery over 60,000 IQD —",
    promoSpendAr: "توصيل مجاني فوق 60,000 د.ع —",
    promoCode: "WATAD",
    freeDeliveryMin: 60_000,
    deliveryFee: 5_000,
    adminPassword: "watad2026",
    brandSectionTitleAr: "تسوق حسب الماركة",
    brandSectionTitleEn: "Shop by brand",
    brandSectionEnabled: true,
  };

  const categories: AdminCategory[] = [
    {
      id: "cat-1",
      slug: "t-shirts",
      nameAr: "تيشيرات",
      nameEn: "T-Shirts",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      parentId: null,
      kind: "main",
    },
    {
      id: "cat-2",
      slug: "pants",
      nameAr: "بناطير",
      nameEn: "Pants",
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b279a04?w=600&q=80",
      parentId: null,
      kind: "main",
    },
    {
      id: "cat-2a",
      slug: "pants-nike",
      nameAr: "نايكي",
      nameEn: "Nike",
      image: "",
      parentId: "cat-2",
      kind: "sub",
    },
    {
      id: "cat-2b",
      slug: "pants-adidas",
      nameAr: "أديداس",
      nameEn: "Adidas",
      image: "",
      parentId: "cat-2",
      kind: "sub",
    },
    {
      id: "cat-3",
      slug: "jeans",
      nameAr: "جينز",
      nameEn: "Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      parentId: null,
      kind: "main",
    },
    {
      id: "cat-4",
      slug: "shoes",
      nameAr: "أحذية",
      nameEn: "Shoes",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
      parentId: null,
      kind: "main",
    },
    {
      id: "cat-5",
      slug: "hoodies",
      nameAr: "هوديز",
      nameEn: "Hoodies",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
      parentId: null,
      kind: "main",
    },
    {
      id: "cat-6",
      slug: "jackets",
      nameAr: "جاكيتات",
      nameEn: "Jackets",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      parentId: null,
      kind: "main",
    },
  ];

  const brands: AdminBrand[] = [
    {
      id: "brand-1",
      name: "a3mal watad",
      nameAr: "أعمال وتد",
      image: "/images/watad-logo.png",
      visible: true,
    },
  ];

  const navigation = buildNavigationFromCategories(categories);

  const heroSlides: AdminHeroSlide[] = [
    {
      id: "hero-1",
      titleEn: "Shop the collection",
      titleAr: "تسوق التشكيلة",
      subtitleEn: "Fresh styles for every day",
      subtitleAr: "إطلالات جديدة كل يوم",
      ctaEn: "Shop now",
      ctaAr: "تسوق الآن",
      linkType: "category",
      categoryId: categories[0]?.id,
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80",
    },
  ];

  return {
    settings,
    products: [],
    categories,
    brands,
    navigation,
    heroSlides,
  };
}
