import React, { createContext, useContext, useState, useEffect } from "react";
import { type Category } from "@/data/products";

export interface SellerProduct {
  name: string;
  category: Category;
  price: string;
  image: string;
}

export interface SellerApplication {
  id: string;
  submittedAt: string;
  whatsapp: string;
  location: string;
  businessDescription: string;
  products: SellerProduct[];
  status: "pending" | "approved" | "rejected";
}

interface SellerContextType {
  applications: SellerApplication[];
  submitApplication: (data: Omit<SellerApplication, "id" | "submittedAt" | "status">) => string;
  updateStatus: (id: string, status: SellerApplication["status"]) => void;
}

const SellerContext = createContext<SellerContextType | null>(null);
const STORAGE_KEY = "wu-seller-applications";

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<SellerApplication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const submitApplication = (data: Omit<SellerApplication, "id" | "submittedAt" | "status">) => {
    const id = `SEL-${Date.now().toString().slice(-6)}`;
    const app: SellerApplication = {
      ...data,
      id,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    setApplications((prev) => [app, ...prev]);
    return id;
  };

  const updateStatus = (id: string, status: SellerApplication["status"]) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <SellerContext.Provider value={{ applications, submitApplication, updateStatus }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSellers() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSellers must be inside SellerProvider");
  return ctx;
}
