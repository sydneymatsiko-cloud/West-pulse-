import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingCart, Menu, X, Store, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "Our Story" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl tracking-widest text-primary font-bold group-hover:text-primary/80 transition-colors uppercase" data-testid="link-home-logo">
            West Pulse
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest uppercase transition-colors hover:text-primary ${location === link.href ? "text-primary border-b border-primary pb-1" : "text-foreground"}`}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}

          {/* Sell With Us — highlighted */}
          <Link
            href="/sell"
            data-testid="link-nav-sell"
            className={`flex items-center gap-1.5 text-sm tracking-widest uppercase border px-4 py-1.5 transition-all duration-200 ${
              location === "/sell"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/50 text-primary hover:bg-primary/10"
            }`}
          >
            <Store className="h-3.5 w-3.5" /> Sell With Us
          </Link>
        </div>

        {/* Wishlist + Cart Icons */}
        <div className="flex items-center gap-1">
          <Link href="/wishlist" className="relative group p-2 transition-transform hover:scale-105" data-testid="link-wishlist">
            <Heart className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
            {wishCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                {wishCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative group p-2 transition-transform hover:scale-105" data-testid="link-cart">
            <ShoppingCart className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm tracking-widest uppercase transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sell"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-2 text-sm tracking-widest uppercase text-primary font-medium"
          >
            <Store className="h-4 w-4" /> Sell With Us
          </Link>
        </div>
      )}
    </nav>
  );
}
