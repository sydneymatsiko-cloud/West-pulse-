import React from "react";
import { Link } from "wouter";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();
  const wished = isWished(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block h-full" data-testid={`link-product-${product.id}`}>
      <div className="flex flex-col h-full bg-card rounded-md border border-card-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <div className="relative aspect-square overflow-hidden bg-black/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

          {/* Wishlist heart button */}
          <button
            onClick={handleWishlist}
            data-testid={`btn-wish-${product.id}`}
            title={wished ? "Remove from wishlist" : "Save to wishlist"}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow ${
              wished
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-background/70 backdrop-blur text-muted-foreground hover:text-primary hover:bg-background/90"
            }`}
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-primary-foreground" : ""}`} />
          </button>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="text-xs uppercase tracking-widest text-primary mb-2 font-medium">
            {product.category}
          </div>
          <h3 className="font-serif text-xl mb-2 text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg text-primary font-medium">
              UGX {product.price.toLocaleString()}
            </span>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-sans tracking-wide gap-2"
              data-testid={`btn-add-to-cart-${product.id}`}
            >
              Add to Cart 🛒
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
