import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useSellers, type SellerProduct } from "@/context/SellerContext";
import { type Category } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone, MapPin, FileText, ImagePlus, Plus, Trash2,
  CheckCircle2, X as XIcon, Store,
} from "lucide-react";

const CATEGORIES: Category[] = ["Crafts", "Food & Honey", "Fashion", "Tea & Coffee", "Jewelry"];

const emptyProduct = (): SellerProduct => ({
  name: "",
  category: "Crafts",
  price: "",
  image: "",
});

export function BecomeSeller() {
  const { submitApplication } = useSellers();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    whatsapp: "",
    location: "",
    businessDescription: "",
  });
  const [products, setProducts] = useState<SellerProduct[]>([emptyProduct()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...p, image: ev.target?.result as string } : p))
      );
    };
    reader.readAsDataURL(file);
  };

  const addProduct = () => setProducts((prev) => [...prev, emptyProduct()]);

  const removeProduct = (index: number) =>
    setProducts((prev) => prev.filter((_, i) => i !== index));

  const updateProduct = (index: number, field: keyof SellerProduct, value: string) =>
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.businessDescription.trim()) e.businessDescription = "Tell us about your business";
    products.forEach((p, i) => {
      if (!p.name.trim()) e[`product-name-${i}`] = "Product name required";
      if (!p.price || isNaN(Number(p.price)) || Number(p.price) <= 0)
        e[`product-price-${i}`] = "Enter a valid price";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const id = submitApplication({
        whatsapp: form.whatsapp.trim(),
        location: form.location.trim(),
        businessDescription: form.businessDescription.trim(),
        products,
      });
      setApplicationId(id);
      setLoading(false);
    }, 800);
  };

  if (applicationId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="border border-primary/30 bg-card p-12 max-w-md w-full">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-foreground mb-3">Application Received!</h1>
          <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-2 mb-6">
            <span className="text-primary font-mono font-bold tracking-widest text-lg">{applicationId}</span>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Thank you for applying to sell on West Pulse. We will review your application and reach out to you on your WhatsApp number shortly.
          </p>
          <p className="text-muted-foreground text-xs border-t border-border pt-6 mb-8">
            Keep your reference number safe: <span className="text-primary font-mono">{applicationId}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setLocation("/track-application")}
              className="w-full bg-primary text-primary-foreground rounded-none px-10 py-5 uppercase tracking-widest hover:bg-primary/90 gold-glow"
            >
              Track My Application
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="w-full rounded-none text-muted-foreground hover:text-foreground uppercase tracking-widest text-sm"
            >
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <p className="text-primary uppercase tracking-widest text-sm mb-3">Join the Marketplace</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Create a Seller Account</h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Sell your handcrafted goods, local produce, and authentic products to customers across Uganda and beyond on West Pulse. Fill in the form below and we will get back to you on WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Contact & Location */}
          <div className="bg-card border border-primary/20 p-8 space-y-6">
            <h2 className="font-serif text-xl text-foreground flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" /> Your Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">
                  WhatsApp Number *
                </label>
                <Input
                  data-testid="input-seller-whatsapp"
                  placeholder="e.g. 0772123456"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="bg-background border-border focus:border-primary rounded-none h-12"
                />
                {errors.whatsapp && <p className="text-red-400 text-xs">{errors.whatsapp}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Location *
                </label>
                <Input
                  data-testid="input-seller-location"
                  placeholder="e.g. Mbarara, Kabale, Bushenyi, Ibanda..."
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="bg-background border-border focus:border-primary rounded-none h-12"
                />
                {errors.location && <p className="text-red-400 text-xs">{errors.location}</p>}
              </div>
            </div>

            {/* Business description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> About Your Business *
              </label>
              <Textarea
                data-testid="input-seller-description"
                placeholder="Describe what you sell, how long you have been doing it, and what makes your products special..."
                value={form.businessDescription}
                onChange={(e) => setForm({ ...form, businessDescription: e.target.value })}
                rows={4}
                className="bg-background border-border focus:border-primary rounded-none resize-none"
              />
              {errors.businessDescription && (
                <p className="text-red-400 text-xs">{errors.businessDescription}</p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="bg-card border border-primary/20 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground flex items-center gap-3">
                <ImagePlus className="h-5 w-5 text-primary" /> Your Products
              </h2>
              <button
                type="button"
                onClick={addProduct}
                data-testid="button-add-product-row"
                className="flex items-center gap-2 text-primary border border-primary/40 hover:bg-primary/10 px-4 py-2 text-sm uppercase tracking-widest transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            <div className="space-y-8">
              {products.map((product, index) => (
                <div
                  key={index}
                  data-testid={`product-row-${index}`}
                  className="border border-border p-6 space-y-5 relative"
                >
                  {/* Remove button */}
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      data-testid={`button-remove-product-${index}`}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <p className="text-primary text-xs uppercase tracking-widest font-medium">
                    Product {index + 1}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Name */}
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-xs font-medium text-foreground uppercase tracking-widest">
                        Product Name *
                      </label>
                      <Input
                        data-testid={`input-product-name-${index}`}
                        placeholder="e.g. Organic Honey"
                        value={product.name}
                        onChange={(e) => updateProduct(index, "name", e.target.value)}
                        className="bg-background border-border focus:border-primary rounded-none"
                      />
                      {errors[`product-name-${index}`] && (
                        <p className="text-red-400 text-xs">{errors[`product-name-${index}`]}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground uppercase tracking-widest">
                        Category *
                      </label>
                      <select
                        data-testid={`select-product-category-${index}`}
                        value={product.category}
                        onChange={(e) => updateProduct(index, "category", e.target.value)}
                        className="w-full h-10 px-3 bg-background border border-border text-foreground focus:border-primary focus:outline-none rounded-none text-sm"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground uppercase tracking-widest">
                        Price (UGX) *
                      </label>
                      <Input
                        data-testid={`input-product-price-${index}`}
                        type="number"
                        placeholder="e.g. 25000"
                        value={product.price}
                        onChange={(e) => updateProduct(index, "price", e.target.value)}
                        className="bg-background border-border focus:border-primary rounded-none"
                      />
                      {errors[`product-price-${index}`] && (
                        <p className="text-red-400 text-xs">{errors[`product-price-${index}`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Image upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground uppercase tracking-widest">
                      Product Photo
                    </label>
                    {product.image ? (
                      <div className="relative w-full max-w-xs aspect-square bg-card border border-primary/30 overflow-hidden">
                        <img
                          src={product.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => updateProduct(index, "image", "")}
                          data-testid={`button-remove-image-${index}`}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 transition-colors"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label
                        data-testid={`label-image-upload-${index}`}
                        className="flex flex-col items-center justify-center w-full max-w-xs h-36 border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors bg-background group"
                      >
                        <ImagePlus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          Tap to upload photo
                        </span>
                        <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG or WEBP</span>
                        <input
                          ref={(el) => { fileRefs.current[index] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          data-testid={`input-image-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addProduct}
              className="w-full border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary py-4 text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Another Product
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            data-testid="button-submit-seller"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-16 text-base rounded-none uppercase tracking-widest font-medium gold-glow transition-all disabled:opacity-60"
          >
            {loading ? "Submitting Application..." : "Submit Seller Application"}
          </Button>
          <p className="text-center text-muted-foreground text-xs">
            We will review your application and contact you on WhatsApp within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
