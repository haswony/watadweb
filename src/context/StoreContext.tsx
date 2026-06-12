"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";
import { useAdmin } from "@/context/AdminContext";

export interface CartItem {
  productId: number;
  size: string;
  quantity: number;
}

interface StoreContextValue {
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: number, size: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: number[];
  wishlistCount: number;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getCartProducts: () => { item: CartItem; product: Product }[];
  getWishlistProducts: () => Product[];
  isHydrated: boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "stylehub-cart";
const WISHLIST_KEY = "stylehub-wishlist";

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { state: adminState } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(loadStorage(CART_KEY, []));
    setWishlist(loadStorage(WISHLIST_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((productId: number, size: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, size, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, size: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId, size);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const findProduct = useCallback(
    (id: number) => adminState.products.find((p) => p.id === id),
    [adminState.products]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = findProduct(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [cart, findProduct]
  );

  const getCartProducts = useCallback(() => {
    return cart
      .map((item) => {
        const product = findProduct(item.productId);
        return product ? { item, product: product as Product } : null;
      })
      .filter(Boolean) as { item: CartItem; product: Product }[];
  }, [cart, findProduct]);

  const getWishlistProducts = useCallback(() => {
    return wishlist
      .map((id) => findProduct(id))
      .filter(Boolean) as Product[];
  }, [wishlist, findProduct]);

  const value: StoreContextValue = {
    sidebarOpen,
    openSidebar: () => setSidebarOpen(true),
    closeSidebar: () => setSidebarOpen(false),
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    searchOpen,
    setSearchOpen,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    isInWishlist,
    getCartProducts,
    getWishlistProducts,
    isHydrated: hydrated,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
