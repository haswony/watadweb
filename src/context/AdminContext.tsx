"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createDefaultAdminState } from "@/lib/admin-defaults";
import {
  buildNavigationFromCategories,
  makeSlug,
} from "@/lib/admin-links";
import {
  getCategoryAndDescendantIds,
  makeChildSlug,
} from "@/lib/category-tree";
import type {
  AdminBrand,
  AdminCategory,
  AdminHeroSlide,
  AdminLinkType,
  AdminNavChild,
  AdminNavItem,
  AdminSettings,
  AdminState,
  CatalogProduct,
} from "@/types/admin";

const STORAGE_KEY = "stylehub-admin-v2";
const AUTH_KEY = "stylehub-admin-auth";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nextProductId(products: CatalogProduct[]) {
  const max = products.reduce((m, p) => Math.max(m, p.id), 0);
  return max + 1;
}

function migrateState(raw: unknown): AdminState {
  const defaults = createDefaultAdminState();
  if (!raw || typeof raw !== "object") return defaults;

  const old = raw as Record<string, unknown>;
  const oldSettings = (old.settings as AdminSettings) ?? defaults.settings;

  const oldCategories = Array.isArray(old.categories)
    ? (old.categories as Array<Record<string, unknown>>).map((c, i) => {
        const parentId = c.parentId ? String(c.parentId) : null;
        return {
          id: String(c.id ?? `cat-${i + 1}`),
          slug: String(
            c.slug ??
              makeSlug(
                String(c.nameEn ?? c.name ?? "category"),
                String(c.nameAr ?? c.name ?? "تصنيف"),
                []
              )
          ),
          nameAr: String(c.nameAr ?? c.name ?? "تصنيف"),
          nameEn: String(c.nameEn ?? c.name ?? "Category"),
          image: String(c.image ?? defaults.categories[0]?.image ?? ""),
          parentId,
          kind: (c.kind as AdminCategory["kind"]) ?? (parentId ? "sub" : "main"),
        };
      })
    : defaults.categories;

  const firstCategoryId = oldCategories[0]?.id ?? "";

  return {
    settings: {
      ...defaults.settings,
      ...oldSettings,
      deliveryFee: 5_000,
      brandSectionTitleAr:
        oldSettings.brandSectionTitleAr ?? defaults.settings.brandSectionTitleAr,
      brandSectionTitleEn:
        oldSettings.brandSectionTitleEn ?? defaults.settings.brandSectionTitleEn,
      brandSectionEnabled:
        oldSettings.brandSectionEnabled ?? defaults.settings.brandSectionEnabled,
      promoAr:
        oldSettings.promoAr?.includes("5,000") ||
        oldSettings.promoAr?.includes("5000")
          ? oldSettings.promoAr
          : defaults.settings.promoAr,
    },
    products: [],
    categories: oldCategories.length ? oldCategories : defaults.categories,
    brands: Array.isArray(old.brands) && old.brands.length
      ? (old.brands as Array<Record<string, unknown>>).map((b, i) => ({
          id: String(b.id ?? `brand-${i + 1}`),
          name: String(b.name ?? "ماركة"),
          nameAr: String(b.nameAr ?? b.name ?? "ماركة"),
          image: String(b.image ?? ""),
          visible: b.visible !== false,
        }))
      : defaults.brands,
    navigation: buildNavigationFromCategories(
      oldCategories.length ? oldCategories : defaults.categories
    ),
    heroSlides: Array.isArray(old.heroSlides) && old.heroSlides.length
      ? (old.heroSlides as Array<Record<string, unknown>>).map((h, i) => ({
          id: String(h.id ?? `hero-${i + 1}`),
          titleEn: String(h.titleEn ?? h.title ?? "Shop"),
          titleAr: String(h.titleAr ?? "تسوق"),
          subtitleEn: String(h.subtitleEn ?? h.subtitle ?? ""),
          subtitleAr: String(h.subtitleAr ?? ""),
          ctaEn: String(h.ctaEn ?? h.cta ?? "Shop"),
          ctaAr: String(h.ctaAr ?? "تسوق"),
          linkType: (h.linkType as AdminLinkType) ?? "category",
          categoryId: String(h.categoryId ?? firstCategoryId),
          image: String(h.image ?? defaults.heroSlides[0]?.image ?? ""),
        }))
      : defaults.heroSlides,
  };
}

interface AdminContextValue {
  state: AdminState;
  hydrated: boolean;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  resetToDefaults: () => void;
  syncNavFromCategories: () => void;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  addProduct: (product: Omit<CatalogProduct, "id">) => void;
  updateProduct: (id: number, patch: Partial<CatalogProduct>) => void;
  deleteProduct: (id: number) => void;
  addCategory: (category: Omit<AdminCategory, "id" | "slug">) => void;
  updateCategory: (id: string, patch: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;
  addBrand: (brand: Omit<AdminBrand, "id">) => void;
  updateBrand: (id: string, patch: Partial<AdminBrand>) => void;
  deleteBrand: (id: string) => void;
  addNavItem: (item: Omit<AdminNavItem, "id">) => void;
  updateNavItem: (id: string, patch: Partial<AdminNavItem>) => void;
  deleteNavItem: (id: string) => void;
  addNavChild: (parentId: string, child: Omit<AdminNavChild, "id">) => void;
  updateNavChild: (
    parentId: string,
    childId: string,
    patch: Partial<AdminNavChild>
  ) => void;
  deleteNavChild: (parentId: string, childId: string) => void;
  addHeroSlide: (slide: Omit<AdminHeroSlide, "id">) => void;
  updateHeroSlide: (id: string, patch: Partial<AdminHeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function loadState(): AdminState {
  if (typeof window === "undefined") return createDefaultAdminState();
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) return migrateState(JSON.parse(rawV2));

    const rawV1 = localStorage.getItem("stylehub-admin-v1");
    if (rawV1) {
      const migrated = migrateState(JSON.parse(rawV1));
      localStorage.removeItem("stylehub-admin-v1");
      return migrated;
    }

    return createDefaultAdminState();
  } catch {
    return createDefaultAdminState();
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>(createDefaultAdminState);
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setIsAuthenticated(sessionStorage.getItem(AUTH_KEY) === "1");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const login = useCallback(
    (password: string) => {
      if (password === state.settings.adminPassword) {
        sessionStorage.setItem(AUTH_KEY, "1");
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [state.settings.adminPassword]
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const resetToDefaults = useCallback(() => {
    setState(createDefaultAdminState());
  }, []);

  const syncNavFromCategories = useCallback(() => {
    setState((s) => ({
      ...s,
      navigation: buildNavigationFromCategories(s.categories),
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AdminSettings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const addProduct = useCallback((product: Omit<CatalogProduct, "id">) => {
    setState((s) => ({
      ...s,
      products: [...s.products, { ...product, id: nextProductId(s.products) }],
    }));
  }, []);

  const updateProduct = useCallback(
    (id: number, patch: Partial<CatalogProduct>) => {
      setState((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === id ? { ...p, ...patch } : p
        ),
      }));
    },
    []
  );

  const deleteProduct = useCallback((id: number) => {
    setState((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
    }));
  }, []);

  const addCategory = useCallback(
    (category: Omit<AdminCategory, "id" | "slug">) => {
      setState((s) => {
        const existing = s.categories.map((c) => c.slug);
        const parent = category.parentId
          ? s.categories.find((c) => c.id === category.parentId)
          : undefined;
        const slug =
          parent && category.parentId
            ? makeChildSlug(
                parent,
                category.nameEn,
                category.nameAr,
                existing
              )
            : makeSlug(category.nameEn, category.nameAr, existing);
        const newCat: AdminCategory = {
          ...category,
          id: uid(),
          slug,
          parentId: category.parentId ?? null,
          kind: category.parentId ? "sub" : "main",
          image: category.parentId ? "" : category.image,
        };
        const categories = [...s.categories, newCat];
        return {
          ...s,
          categories,
          navigation: buildNavigationFromCategories(categories),
        };
      });
    },
    []
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<AdminCategory>) => {
      setState((s) => {
        const categories = s.categories.map((cat) => {
          if (cat.id !== id) return cat;
          const next = { ...cat, ...patch };
          if (patch.nameEn !== undefined || patch.nameAr !== undefined) {
            const parent = next.parentId
              ? s.categories.find((x) => x.id === next.parentId)
              : undefined;
            next.slug =
              parent && next.parentId
                ? makeChildSlug(
                    parent,
                    next.nameEn,
                    next.nameAr,
                    s.categories.map((x) => x.slug).filter((slug) => slug !== cat.slug)
                  )
                : makeSlug(
                    next.nameEn,
                    next.nameAr,
                    s.categories.map((x) => x.slug),
                    cat.slug
                  );
          }
          return next;
        });
        return {
          ...s,
          categories,
          navigation: buildNavigationFromCategories(categories),
        };
      });
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    setState((s) => {
      const removedIds = getCategoryAndDescendantIds(id, s.categories);
      const categories = s.categories.filter((c) => !removedIds.includes(c.id));
      const deleted = s.categories.find((c) => c.id === id);
      const fallbackId =
        (deleted?.parentId &&
          categories.find((c) => c.id === deleted.parentId)?.id) ||
        categories.find((c) => !c.parentId)?.id ||
        categories[0]?.id ||
        "";
      return {
        ...s,
        categories,
        products: s.products.map((p) =>
          removedIds.includes(p.categoryId)
            ? { ...p, categoryId: fallbackId }
            : p
        ),
        navigation: buildNavigationFromCategories(categories),
        heroSlides: s.heroSlides.map((h) =>
          h.categoryId && removedIds.includes(h.categoryId)
            ? { ...h, categoryId: fallbackId }
            : h
        ),
      };
    });
  }, []);

  const addBrand = useCallback((brand: Omit<AdminBrand, "id">) => {
    setState((s) => ({
      ...s,
      brands: [...s.brands, { ...brand, id: uid() }],
    }));
  }, []);

  const updateBrand = useCallback((id: string, patch: Partial<AdminBrand>) => {
    setState((s) => ({
      ...s,
      brands: s.brands.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      brands: s.brands.filter((b) => b.id !== id),
    }));
  }, []);

  const addNavItem = useCallback((item: Omit<AdminNavItem, "id">) => {
    setState((s) => ({
      ...s,
      navigation: [...s.navigation, { ...item, id: uid() }],
    }));
  }, []);

  const updateNavItem = useCallback(
    (id: string, patch: Partial<AdminNavItem>) => {
      setState((s) => ({
        ...s,
        navigation: s.navigation.map((n) =>
          n.id === id ? { ...n, ...patch } : n
        ),
      }));
    },
    []
  );

  const deleteNavItem = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      navigation: s.navigation.filter((n) => n.id !== id),
    }));
  }, []);

  const addNavChild = useCallback(
    (parentId: string, child: Omit<AdminNavChild, "id">) => {
      setState((s) => ({
        ...s,
        navigation: s.navigation.map((n) =>
          n.id === parentId
            ? {
                ...n,
                children: [...(n.children ?? []), { ...child, id: uid() }],
              }
            : n
        ),
      }));
    },
    []
  );

  const updateNavChild = useCallback(
    (
      parentId: string,
      childId: string,
      patch: Partial<AdminNavChild>
    ) => {
      setState((s) => ({
        ...s,
        navigation: s.navigation.map((n) =>
          n.id === parentId
            ? {
                ...n,
                children: n.children?.map((c) =>
                  c.id === childId ? { ...c, ...patch } : c
                ),
              }
            : n
        ),
      }));
    },
    []
  );

  const deleteNavChild = useCallback((parentId: string, childId: string) => {
    setState((s) => ({
      ...s,
      navigation: s.navigation.map((n) =>
        n.id === parentId
          ? {
              ...n,
              children: n.children?.filter((c) => c.id !== childId),
            }
          : n
        ),
    }));
  }, []);

  const addHeroSlide = useCallback((slide: Omit<AdminHeroSlide, "id">) => {
    setState((s) => ({
      ...s,
      heroSlides: [...s.heroSlides, { ...slide, id: uid() }],
    }));
  }, []);

  const updateHeroSlide = useCallback(
    (id: string, patch: Partial<AdminHeroSlide>) => {
      setState((s) => ({
        ...s,
        heroSlides: s.heroSlides.map((h) =>
          h.id === id ? { ...h, ...patch } : h
        ),
      }));
    },
    []
  );

  const deleteHeroSlide = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      heroSlides: s.heroSlides.filter((h) => h.id !== id),
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      isAuthenticated,
      login,
      logout,
      resetToDefaults,
      syncNavFromCategories,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addBrand,
      updateBrand,
      deleteBrand,
      addNavItem,
      updateNavItem,
      deleteNavItem,
      addNavChild,
      updateNavChild,
      deleteNavChild,
      addHeroSlide,
      updateHeroSlide,
      deleteHeroSlide,
    }),
    [
      state,
      hydrated,
      isAuthenticated,
      login,
      logout,
      resetToDefaults,
      syncNavFromCategories,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addBrand,
      updateBrand,
      deleteBrand,
      addNavItem,
      updateNavItem,
      deleteNavItem,
      addNavChild,
      updateNavChild,
      deleteNavChild,
      addHeroSlide,
      updateHeroSlide,
      deleteHeroSlide,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
