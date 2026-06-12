import type { Locale } from "./translations";
import type { Product } from "@/data/products";

const productNames: Record<number, { en: string; ar: string }> = {
  1: { en: "England home jersey in white", ar: "قميص إنجلترا الرسمي أبيض" },
  2: { en: "Crest logo t-shirt in white", ar: "تيشيرت بشعار الكأس أبيض" },
  3: { en: "Training polo in blue", ar: "بولو تدريب أزرق" },
  4: { en: "Netherlands home jersey in orange", ar: "قميص هولندا الرسمي برتقالي" },
  5: { en: "Brazil home jersey in yellow", ar: "قميص البرازيل الرسمي أصفر" },
  6: { en: "Nigeria home jersey in green", ar: "قميص نيجيريا الرسمي أخضر" },
  7: { en: "USA home jersey in red and white", ar: "قميص أمريكا الرسمي أحمر وأبيض" },
  8: { en: "Training shorts in blue", ar: "شورت تدريب أزرق" },
  9: { en: "740 trainers in grey", ar: "حذاء 740 رمادي" },
  10: { en: "Adistar Control 5 in silver and cream", ar: "أديداس أديستار فضي وكريمي" },
  11: { en: "Handball Spezial in light blue", ar: "هاندبول سبيشال أزرق فاتح" },
  12: { en: "Samba OG trainers in black", ar: "سامبا OG أسود" },
  13: { en: "P-6000 in off white suede", ar: "نايكي P-6000 أبيض سويدي" },
  14: { en: "680 trainers in white", ar: "حذاء 680 أبيض" },
  15: { en: "Gazelle indoor in brown", ar: "غازيل إندور بني" },
  16: { en: "Superstar II in black and white", ar: "سوبرستار II أسود وأبيض" },
  17: { en: "Watad essential logo tee", ar: "تيشيرت وتد الأساسي بشعار الشركة" },
  18: { en: "Watad premium hoodie", ar: "هودي وتد الفاخر" },
  19: { en: "Watad classic polo shirt", ar: "بولو وتد الكلاسيكي" },
  20: { en: "Watad urban jacket", ar: "جاكيت وتد الحضري" },
  21: { en: "Watad sport trainers", ar: "حذاء وتد الرياضي" },
  22: { en: "Watad logo cap", ar: "قبعة وتد بشعار الشركة" },
};

const brandMap: Record<string, { en: string; ar: string }> = {
  Watad: { en: "Watad", ar: "شركة وتد" },
};

const badgeMap: Record<string, { en: string; ar: string }> = {
  "New in": { en: "New in", ar: "وصل حديثاً" },
  "Selling fast": { en: "Selling fast", ar: "يُباع بسرعة" },
  Portfolio: { en: "Portfolio", ar: "عرض عمل" },
};

const watadDescriptions: Record<number, { en: string; ar: string }> = {
  17: {
    en: "Demo product from Watad — replace with your real items when you launch.",
    ar: "منتج تجريبي من شركة وتد — استبدله بمنتجاتك الحقيقية عند الإطلاق.",
  },
  18: {
    en: "Portfolio sample built by Watad. Showcase your brand with this template.",
    ar: "عينة من أعمال شركة وتد. اعرض علامتك باستخدام هذا القالب.",
  },
};

export function localizeProduct(
  product: Product & { nameAr?: string },
  locale: Locale
): Product {
  const names = productNames[product.id];
  const badge = product.badge ? badgeMap[product.badge]?.[locale] : undefined;

  const brandLabel = brandMap[product.brand]?.[locale] ?? product.brand;
  const watadDesc = watadDescriptions[product.id];

  return {
    ...product,
    name:
      locale === "ar"
        ? product.nameAr ?? names?.ar ?? product.name
        : names?.en ?? product.name,
    brand: brandLabel,
    badge,
    description: watadDesc
      ? watadDesc[locale]
      : locale === "ar"
        ? `${brandLabel} — ${names?.ar ?? product.name}. خامة عالية الجودة بقصة عصرية. مثالي للاستخدام اليومي.`
        : product.description,
    color:
      locale === "ar"
        ? translateColor(product.color)
        : product.color,
    category:
      locale === "ar"
        ? product.category === "trainers"
          ? "أحذية"
          : product.category === "clothing"
            ? "ملابس"
            : product.category
        : product.category,
  };
}

function translateColor(color?: string): string | undefined {
  if (!color) return undefined;
  const map: Record<string, string> = {
    White: "أبيض",
    Grey: "رمادي",
    Blue: "أزرق",
    Red: "أحمر",
  };
  return map[color] ?? color;
}

export function localizeProducts(products: Product[], locale: Locale): Product[] {
  return products.map((p) => localizeProduct(p, locale));
}
