import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  wishlist: string[];
  toggle: (id: string) => void;
  isWished: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "wu-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggle = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    );
  };

  const isWished = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWished, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
