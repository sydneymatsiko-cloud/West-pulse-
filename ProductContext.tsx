import React, { createContext, useContext, useState, useEffect } from "react";
import { products as staticProducts, type Product, type Category } from "@/data/products";

interface ProductContextType {
  allProducts: Product[];
  customProducts: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

const STORAGE_KEY = "wu-custom-products";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProducts));
  }, [customProducts]);

  const allProducts = [...staticProducts, ...customProducts];

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `custom-${Date.now()}`,
    };
    setCustomProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ allProducts, customProducts, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductProvider");
  return ctx;
}
