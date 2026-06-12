/**
 * Brand config — update here when selling to a new client.
 */
export const siteConfig = {
  name: "a3mal watad",
  nameAr: "a3mal watad",
  logoBold: "a3mal",
  logoLight: "watad",
  logoBoldAr: "a3mal",
  logoLightAr: "watad",
  description: "Fashion e-commerce store",
  descriptionAr: "متجر أزياء إلكتروني",
  year: 2026,
} as const;

export function getSiteTitle(locale: "ar" | "en" = "ar") {
  return locale === "ar" ? siteConfig.nameAr : siteConfig.name;
}
