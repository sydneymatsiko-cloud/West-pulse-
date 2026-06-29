import React from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="font-serif text-4xl text-foreground mb-6">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Discover the exquisite craftsmanship and natural treasures on West Pulse.
        </p>
        <Link href="/shop">
          <Button className="bg-primary text-primary-foreground rounded-none px-8 py-6 uppercase tracking-widest hover:bg-primary/90 gold-glow">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl text-foreground mb-12">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-card border border-border rounded-md relative" data-testid={`cart-item-${item.id}`}>
                <div className="w-full sm:w-32 h-32 shrink-0 bg-black/50 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">{item.name}</h3>
                    <p className="text-primary font-medium">UGX {item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex items-center border border-border rounded-md bg-background">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-foreground text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                      <p className="text-foreground font-medium">UGX {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-destructive transition-colors p-2"
                  title="Remove item"
                  data-testid={`btn-remove-${item.id}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-primary/30 p-8 rounded-md sticky top-28 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
              <h2 className="font-serif text-2xl text-foreground mb-6 border-b border-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">UGX {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-xl text-foreground">Total</span>
                  <span className="text-2xl text-primary font-medium">UGX {subtotal.toLocaleString()}</span>
                </div>
              </div>
              
              <Button
                onClick={() => setLocation("/checkout")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg rounded-none uppercase tracking-widest font-medium gold-glow transition-all flex items-center justify-center"
                data-testid="btn-checkout"
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
