import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, MessageCircle, Clock, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "256742448635";
const RV_KEY = "wu-recently-viewed";
const MAX_RECENT = 8;

function useRecentlyViewed(currentId: string) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(RV_KEY) ?? "[]");
      const updated = [currentId, ...stored.filter((id) => id !== currentId)].slice(0, MAX_RECENT);
      localStorage.setItem(RV_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch {
      setHistory([currentId]);
    }
  }, [currentId]);

  return history.filter((id) => id !== currentId);
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { allProducts } = useProducts();
  const product = allProducts.find((p) => p.id === id);
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const wished = product ? isWished(product.id) : false;

  const recentIds = useRecentlyViewed(id ?? "");
  const recentProducts = recentIds
    .map((rid) => allProducts.find((p) => p.id === rid))
    .filter(Boolean)
    .slice(0, 4) as typeof allProducts;

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h2>
          <p className="text-muted-foreground">The item you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart.`,
      className: "bg-card border-primary text-foreground",
    });
    setQuantity(1);
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello! I'd like to order:\n\n*${product.name}*\nQty: ${quantity}\nPrice: UGX ${(product.price * quantity).toLocaleString()}\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Product Image */}
          <div className="relative aspect-[4/5] md:aspect-square bg-card rounded-md overflow-hidden border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800"; }}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="text-primary uppercase tracking-widest text-sm mb-4">
              {product.category}
            </div>
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground">
                {product.name}
              </h1>
              <button
                onClick={() => toggle(product.id)}
                data-testid="btn-detail-wishlist"
                title={wished ? "Remove from wishlist" : "Save to wishlist"}
                className={`flex-shrink-0 mt-2 w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  wished
                    ? "bg-primary border-primary text-primary-foreground scale-105"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Heart className={`h-5 w-5 ${wished ? "fill-primary-foreground" : ""}`} />
              </button>
            </div>
            <div className="text-2xl text-primary font-medium mb-8">
              UGX {product.price.toLocaleString()}
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              {product.description}
            </p>

            <div className="space-y-5 border-t border-border pt-8">
              {/* Quantity selector */}
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-qty-minus"
                    className="p-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-foreground font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-qty-plus"
                    className="p-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base rounded-none uppercase tracking-widest font-medium gold-glow transition-all"
                  data-testid="btn-detail-add-to-cart"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                data-testid="button-whatsapp-order"
                className="w-full flex items-center justify-center gap-3 border border-primary/50 bg-primary/5 hover:bg-primary/15 text-primary h-14 text-base uppercase tracking-widest font-medium transition-all duration-300 group"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Order via WhatsApp
              </button>

              <div className="text-sm text-muted-foreground space-y-2 pt-2">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/50" /> Authentic Western Uganda Product
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/50" /> Directly Supports Local Artisans
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/50" /> Premium Quality Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-16 mt-16">
            <h2 className="font-serif text-3xl text-foreground mb-10 text-center">Similar Discoveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id} className="group relative block aspect-square bg-card border border-border hover:border-primary transition-all duration-300">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="font-serif text-xl text-foreground mb-1">{p.name}</h3>
                    <p className="text-primary">UGX {p.price.toLocaleString()}</p>
                  </div>
                  <a href={`/product/${p.id}`} className="absolute inset-0 z-10"><span className="sr-only">View</span></a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <div className="border-t border-border pt-16 mt-16" data-testid="section-recently-viewed">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl text-foreground flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" /> Recently Viewed
              </h2>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} data-testid={`recent-product-${p.id}`}>
                  <div className="group border border-border hover:border-primary transition-all duration-300 bg-card overflow-hidden cursor-pointer">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800"; }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{p.category}</p>
                      <h3 className="font-serif text-sm text-foreground truncate mb-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-primary text-sm font-medium">UGX {p.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
