import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import maskImg from "@assets/mask.png";

export function Home() {
  const { allProducts } = useProducts();
  const bestsellers = allProducts.filter((p) => p.isBestseller).slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={maskImg}
            alt="Hero Background"
            className="w-full h-full object-cover object-center opacity-40 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <span className="text-primary uppercase tracking-[0.3em] font-medium text-sm md:text-base mb-6 block fade-in animate-in duration-1000">
            Discover the Heart of Uganda
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 max-w-5xl mx-auto leading-tight gold-gradient-text fade-in animate-in duration-1000 delay-300">
            West Pulse
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed fade-in animate-in duration-1000 delay-500">
            A curated marketplace celebrating the masterful craftsmanship and natural abundance of Western Uganda.
          </p>
          <div className="fade-in animate-in duration-1000 delay-700">
            <Link href="/shop" data-testid="link-hero-shop">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-12 py-7 text-lg uppercase tracking-widest font-medium gold-glow transition-all duration-300">
                Explore the Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-foreground mb-4">Curated by Nature & Hand</h2>
            <div className="w-24 h-1 bg-primary mx-auto opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Artisan Crafts", count: "Fine Weaves & Carvings", link: "/shop?category=Crafts" },
              { title: "Pure Honey & Tea", count: "From Mountain Estates", link: "/shop?category=Food" },
              { title: "Heritage Jewelry", count: "Metals & Beadwork", link: "/shop?category=Jewelry" }
            ].map((cat, i) => (
              <Link href={cat.link} key={i} className="group relative h-80 overflow-hidden bg-card border border-border hover:border-primary transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20 z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                  <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest">{cat.count}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
        <section className="py-24 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-primary uppercase tracking-widest text-sm mb-2 block">Signature Pieces</span>
                <h2 className="font-serif text-4xl text-foreground">Our Bestsellers</h2>
              </div>
              <Link href="/shop" className="hidden md:inline-flex items-center text-primary uppercase tracking-widest text-sm hover:text-primary/80 transition-colors border-b border-transparent hover:border-primary pb-1">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestsellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/shop">
                <Button variant="outline" className="border-primary text-primary w-full tracking-widest uppercase">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Story Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8 leading-tight">
              Rooted in <span className="text-primary">Western Uganda</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Every piece in our collection tells a story of the rich culture and natural abundance of Western Uganda. We partner directly with local artisans and farmers to bring you authentic, premium goods that preserve heritage and support communities.
            </p>
            <Link href="/about">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-10 py-6 tracking-widest uppercase transition-all duration-300">
                Discover Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
