import type { Locale } from "@/i18n/translations";

/** Free delivery threshold in Iraqi Dinar */
export const FREE_DELIVERY_MIN = 60_000;

/** Standard delivery fee in Iraqi Dinar (all governorates) */
export const DELIVERY_FEE = 5_000;

export function formatPrice(amount: number, locale: Locale = "ar"): string {
  const value = Math.round(amount);
  const formatted = new Intl.NumberFormat(
    locale === "ar" ? "ar-IQ" : "en-IQ",
    { maximumFractionDigits: 0 }
  ).format(value);

  return locale === "ar" ? `${formatted} د.ع` : `${formatted} IQD`;
}
