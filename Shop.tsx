import React, { useState } from "react";
import { Category } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import { Search, X, ArrowUpDown } from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "default": "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export function Shop() {
  const { allProducts } = useProducts();
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const categories: (Category | "All")[] = ["All", "Crafts", "Food & Honey", "Fashion", "Tea & Coffee", "Jewelry"];

  const filteredProducts = allProducts
    .filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl text-foreground mb-6">The Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of premium goods, directly from the artisans and farmers of Western Uganda — all on West Pulse.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            data-testid="input-search"
            className="w-full h-12 pl-12 pr-10 bg-card border border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground text-sm tracking-wide transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              data-testid="button-clear-search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort + Results row */}
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto mb-8">
          <p className="text-muted-foreground text-sm">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            {activeCategory !== "All" && <span> in <span className="text-primary">{activeCategory}</span></span>}
            {searchQuery && <span> for <span className="text-primary">"{searchQuery}"</span></span>}
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex border border-border overflow-hidden">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  data-testid={`btn-sort-${opt}`}
                  onClick={() => setSortBy(opt)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors border-r border-border last:border-r-0 ${
                    sortBy === opt
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border text-sm uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary border-primary text-primary-foreground gold-glow"
                  : "bg-transparent border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
              data-testid={`btn-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count when searching */}
        {searchQuery && (
          <p className="text-muted-foreground text-sm text-center mb-8">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for{" "}
            <span className="text-primary">"{searchQuery}"</span>
          </p>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            {searchQuery
              ? `No products found for "${searchQuery}".`
              : "No products found in this category."}
          </div>
        )}
      </div>
    </div>
  );
}
