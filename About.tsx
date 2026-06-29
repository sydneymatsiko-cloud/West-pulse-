import React from "react";
import maskImg from "@assets/mask.png";

export function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary uppercase tracking-[0.2em] mb-4 block">Our Heritage</span>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-8">The Soul of Western Uganda</h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              West Pulse was born from a desire to share the unparalleled beauty, craftsmanship, and rich flavors of Western Uganda with the world.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div className="relative aspect-[4/3] w-full border border-primary/20 p-2">
              <img src={maskImg} alt="Craftsmanship" className="w-full h-full object-cover grayscale-[20%] sepia-[10%] brightness-90" />
            </div>
            <div>
              <h2 className="font-serif text-4xl text-foreground mb-6">Master Craftsmanship</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                For generations, the artisans of Western Uganda have perfected their trades. From intricately woven baskets to commanding wooden carvings, each piece in our collection is a testament to skills passed down through centuries.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                By partnering directly with these creators, we ensure that traditional techniques are preserved while providing fair, sustainable income to local communities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
            <div className="order-1 md:order-2 relative aspect-[4/3] w-full border border-primary/20 p-2">
              <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop" alt="Natural Abundance" className="w-full h-full object-cover grayscale-[20%] sepia-[10%] brightness-90" />
            </div>
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-4xl text-foreground mb-6">Natural Abundance</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The rich soils and unique climate of Western Uganda produce some of the finest natural goods in the world. Our artisan honey, rich Arabica coffee, and robust tea blends are sourced from small-holder farms committed to organic practices.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every jar of honey and bag of tea carries the distinct character of Western Uganda — wild, pure, and unforgettable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-card border-y border-border text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <span className="text-primary text-6xl font-serif leading-none opacity-50 block mb-4">"</span>
            <p className="font-serif text-2xl md:text-4xl text-foreground leading-snug mb-8">
              We do not just sell products; we share the heartbeat of Western Uganda.
            </p>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
