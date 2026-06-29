import React from "react";
import { Link } from "wouter";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Wishlist() {
  const { wishlist, toggle } = useWishlist();
  const { allProducts } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const wishedProducts = wishlist
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as typeof allProducts;

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart.`,
      className: "bg-card border-primary text-foreground",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-14 h-14 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <p className="text-primary uppercase tracking-widest text-sm mb-3">Saved Items</p>
          <h1 className="font-serif text-4xl text-foreground mb-3">Your Wishlist</h1>
          {wishedProducts.length > 0 && (
            <p className="text-muted-foreground">
              {wishedProducts.length} item{wishedProducts.length !== 1 ? "s" : ""} saved
            </p>
          )}
        </div>

        {/* Empty state */}
        {wishedProducts.length === 0 && (
          <div className="text-center border border-dashed border-border py-24 px-8">
            <Heart className="h-12 w-12 mx-auto mb-5 text-muted-foreground/20" />
            <p className="text-foreground font-medium mb-2">Your wishlist is empty</p>
            <p className="text-muted-foreground text-sm mb-8">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link href="/shop">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest px-8">
                Browse Products
              </Button>
            </Link>
          </div>
        )}

        {/* Product grid */}
        {wishedProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishedProducts.map((product) => (
                <div
                  key={product.id}
                  data-testid={`wishlist-item-${product.id}`}
                  className="group bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800";
                      }}
                    />
                    {/* Remove from wishlist */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                      data-testid={`btn-remove-wish-${product.id}`}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-primary hover:bg-background transition-colors shadow"
                    >
                      <Heart className="h-4 w-4 fill-primary" />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-[10px] uppercase tracking-widest text-primary mb-1">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-serif text-lg text-foreground mb-1 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>

                    <div className="flex items-center justify-between gap-3 mt-auto">
                      <span className="text-primary font-medium">UGX {product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggle(product.id)}
                          data-testid={`btn-wish-remove-icon-${product.id}`}
                          title="Remove"
                          className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          data-testid={`btn-wishlist-cart-${product.id}`}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs uppercase tracking-widest gap-1.5"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add all to cart */}
            <div className="mt-10 flex justify-center">
              <Button
                onClick={() => {
                  wishedProducts.forEach((p) => addItem(p));
                  toast({
                    title: "All items added to cart",
                    description: `${wishedProducts.length} items added.`,
                    className: "bg-card border-primary text-foreground",
                  });
                }}
                data-testid="btn-add-all-to-cart"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest px-10 h-14 gold-glow"
              >
                <ShoppingBag className="mr-2 h-5 w-5" /> Add All to Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
