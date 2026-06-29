import React from "react";
import { Link } from "wouter";
import { MessageCircle, Share2, Store } from "lucide-react";

const WHATSAPP_NUMBER = "256742448635";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function Footer() {
  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      await navigator.share({ title: "West Pulse", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <footer className="bg-card border-t border-primary/20 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-2xl text-primary mb-6 uppercase tracking-widest">West Pulse</h2>
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Curating the finest authentic goods from Western Uganda. We celebrate the rich culture, natural abundance, and master craftsmanship of the region.
            </p>

            {/* WhatsApp Link */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-whatsapp"
              className="inline-flex items-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 text-primary px-5 py-3 transition-all duration-300 group"
            >
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide text-sm">Chat on WhatsApp</span>
            </a>
          </div>

          <div>
            <h3 className="font-sans font-bold text-foreground mb-4 uppercase tracking-widest text-sm">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/sell" data-testid="link-footer-sell" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
                  <Store className="h-4 w-4" /> Sell With Us
                </Link>
              </li>
              <li>
                <Link href="/track-application" data-testid="link-footer-track" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Application
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-bold text-foreground mb-4 uppercase tracking-widest text-sm">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-whatsapp-contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <button
                  onClick={handleShare}
                  data-testid="button-share"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Share this Shop
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} West Pulse. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
