import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/context/CartContext";

export interface Order {
  id: string;
  placedAt: string;
  contact: string;
  location: string;
  notes: string;
  items: CartItem[];
  subtotal: number;
  status: "pending" | "confirmed" | "delivered";
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (data: Omit<Order, "id" | "placedAt" | "status">) => string;
  updateStatus: (id: string, status: Order["status"]) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);
const STORAGE_KEY = "wu-orders";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (data: Omit<Order, "id" | "placedAt" | "status">) => {
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      ...data,
      id,
      placedAt: new Date().toISOString(),
      status: "pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return id;
  };

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be inside OrderProvider");
  return ctx;
}
