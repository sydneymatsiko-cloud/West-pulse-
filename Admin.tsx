import React, { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { useOrders, type Order } from "@/context/OrderContext";
import { useSellers, type SellerApplication } from "@/context/SellerContext";
import { type Category } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle, PackagePlus, ShoppingBag, Clock, CheckCircle2, Truck, Lock, Eye, EyeOff, LogOut, ImagePlus, X as XIcon, Store, Phone, MapPin } from "lucide-react";

const ADMIN_PASSWORD = "Uganda2024";
const SESSION_KEY = "wu-admin-auth";

function AdminLogin({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-primary/30 bg-card p-10 text-center">
          <div className="w-14 h-14 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <p className="text-primary uppercase tracking-widest text-xs mb-2">Shop Owner</p>
          <h1 className="font-serif text-2xl text-foreground mb-8">Admin Access</h1>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                data-testid="input-admin-password"
                autoFocus
                className="bg-background border-border focus:border-primary rounded-none h-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <Button
              type="submit"
              data-testid="button-admin-login"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 uppercase tracking-widest gold-glow"
            >
              Unlock Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES: Category[] = ["Crafts", "Food & Honey", "Fashion", "Tea & Coffee", "Jewelry"];

const emptyForm = {
  name: "",
  category: "Crafts" as Category,
  price: "",
  description: "",
  image: "",
  isBestseller: false,
};

const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: Clock,         color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
  confirmed: { label: "Confirmed", icon: CheckCircle2,  color: "text-green-400 border-green-400/30 bg-green-400/5" },
  delivered: { label: "Delivered", icon: Truck,         color: "text-primary border-primary/30 bg-primary/5" },
};

const SELLER_STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
  approved: { label: "Approved", color: "text-green-400 border-green-400/30 bg-green-400/5" },
  rejected: { label: "Rejected", color: "text-red-400 border-red-400/30 bg-red-400/5" },
};

export function Admin() {
  const { allProducts, customProducts, addProduct, deleteProduct } = useProducts();
  const { orders, updateStatus } = useOrders();
  const { applications, updateStatus: updateSellerStatus } = useSellers();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [activeTab, setActiveTab] = useState<"orders" | "sellers" | "products">("orders");
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  if (!unlocked) {
    return <AdminLogin onUnlock={() => setUnlocked(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  const validate = () => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addProduct({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      image: form.image.trim() || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop",
      isBestseller: form.isBestseller,
    });
    toast({
      title: "Product Added",
      description: `"${form.name}" is now live in your shop.`,
      className: "bg-card border-primary text-foreground",
    });
    setForm(emptyForm);
    setErrors({});
  };

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    toast({
      title: "Product Removed",
      description: `"${name}" has been removed from your shop.`,
      className: "bg-card border-primary text-foreground",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="mb-8 border-b border-primary/20 pb-8 flex items-start justify-between gap-4">
          <div>
          <p className="text-primary uppercase tracking-widest text-sm mb-2">Shop Owner</p>
          <h1 className="font-serif text-4xl text-foreground">Dashboard</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-muted-foreground text-sm">{allProducts.length} products</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground text-sm">{orders.length} orders</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground text-sm">{applications.length} sellers</span>
            {orders.filter(o => o.status === "pending").length > 0 && (
              <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs px-2 py-0.5 uppercase tracking-wide">
                {orders.filter(o => o.status === "pending").length} pending orders
              </span>
            )}
            {applications.filter(a => a.status === "pending").length > 0 && (
              <span className="bg-primary/10 border border-primary/30 text-primary text-xs px-2 py-0.5 uppercase tracking-wide">
                {applications.filter(a => a.status === "pending").length} new sellers
              </span>
            )}
          </div>
          </div>
          <button
            onClick={handleLogout}
            data-testid="button-logout"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-widest mt-1 flex-shrink-0"
          >
            <LogOut className="h-4 w-4" /> Lock
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-10 border-b border-border overflow-x-auto">
          {(["orders", "sellers", "products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
              className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "orders" && (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> Orders
                  {orders.filter(o => o.status === "pending").length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {orders.filter(o => o.status === "pending").length}
                    </span>
                  )}
                </span>
              )}
              {tab === "sellers" && (
                <span className="flex items-center gap-2">
                  <Store className="h-4 w-4" /> Sellers
                  {applications.filter(a => a.status === "pending").length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {applications.filter(a => a.status === "pending").length}
                    </span>
                  )}
                </span>
              )}
              {tab === "products" && (
                <span className="flex items-center gap-2">
                  <PackagePlus className="h-4 w-4" /> Products
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground border border-dashed border-border">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No orders yet. They will appear here when customers place orders.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={order.id} data-testid={`order-${order.id}`} className="bg-card border border-border p-6 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono font-bold text-foreground tracking-widest">{order.id}</span>
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 border uppercase tracking-wide ${cfg.color}`}>
                              <StatusIcon className="h-3 w-3" /> {cfg.label}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {new Date(order.placedAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-primary font-medium text-lg flex-shrink-0">
                          UGX {order.subtotal.toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Contact (MoMo)</p>
                          <p className="text-foreground font-medium">{order.contact}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Delivery Location</p>
                          <p className="text-foreground">{order.location}</p>
                        </div>
                        {order.notes && (
                          <div className="sm:col-span-2">
                            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Notes</p>
                            <p className="text-foreground">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-border pt-4 mb-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                              <span className="text-primary">UGX {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {(["pending", "confirmed", "delivered"] as Order["status"][]).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            data-testid={`status-${order.id}-${s}`}
                            className={`text-xs px-3 py-1.5 border uppercase tracking-widest transition-all ${
                              order.status === s
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SELLERS TAB ── */}
        {activeTab === "sellers" && (
          <div>
            {applications.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground border border-dashed border-border">
                <Store className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="uppercase tracking-widest text-sm">No seller applications yet</p>
                <p className="text-xs mt-2 opacity-60">Applications from the "Sell With Us" form will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((app) => {
                  const sc = SELLER_STATUS_CONFIG[app.status];
                  return (
                    <div key={app.id} className="bg-card border border-border p-6 space-y-5" data-testid={`seller-card-${app.id}`}>
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{app.id}</span>
                            <span className={`text-xs border px-2 py-0.5 uppercase tracking-wide font-medium ${sc.color}`}>
                              {sc.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{new Date(app.submittedAt).toLocaleString()}</p>
                        </div>
                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              data-testid={`button-approve-${app.id}`}
                              onClick={() => {
                                updateSellerStatus(app.id, "approved");
                                toast({ title: "Seller approved", description: `${app.id} has been approved.` });
                              }}
                              className="px-4 py-1.5 text-xs uppercase tracking-widest border border-green-400/40 text-green-400 hover:bg-green-400/10 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              data-testid={`button-reject-${app.id}`}
                              onClick={() => {
                                updateSellerStatus(app.id, "rejected");
                                toast({ title: "Application rejected", description: `${app.id} has been rejected.` });
                              }}
                              className="px-4 py-1.5 text-xs uppercase tracking-widest border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <a
                            href={`https://wa.me/${app.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {app.whatsapp}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{app.location}</span>
                        </div>
                      </div>

                      {/* Business description */}
                      <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                        {app.businessDescription}
                      </p>

                      {/* Products */}
                      {app.products.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-primary mb-3 font-medium">
                            Products ({app.products.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {app.products.map((product, i) => (
                              <div key={i} className="border border-border bg-background p-3 space-y-2">
                                {product.image ? (
                                  <div className="aspect-square overflow-hidden bg-card">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                  </div>
                                ) : (
                                  <div className="aspect-square bg-card flex items-center justify-center">
                                    <ImagePlus className="h-6 w-6 text-muted-foreground/30" />
                                  </div>
                                )}
                                <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                <p className="text-xs text-primary font-medium">UGX {Number(product.price).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div>
        {/* Add Product Form */}
        <div className="bg-card border border-primary/20 p-8 mb-16">
          <h2 className="font-serif text-2xl text-foreground mb-8 flex items-center gap-3">
            <PackagePlus className="h-6 w-6 text-primary" />
            Add a New Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-add-product">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">Product Name *</label>
                <Input
                  data-testid="input-product-name"
                  placeholder="e.g. Organic Honey, Sisal Basket..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-background border-border focus:border-primary rounded-none"
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">Category *</label>
                <select
                  data-testid="select-product-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="w-full h-10 px-3 bg-background border border-border text-foreground focus:border-primary focus:outline-none rounded-none text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">Price (UGX) *</label>
                <Input
                  data-testid="input-product-price"
                  type="number"
                  placeholder="e.g. 25000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="bg-background border-border focus:border-primary rounded-none"
                />
                {errors.price && <p className="text-red-400 text-xs">{errors.price}</p>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">Product Photo</label>
                {form.image ? (
                  <div className="relative w-full aspect-video bg-card border border-primary/30 overflow-hidden">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800"; }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      data-testid="button-remove-image"
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 transition-colors"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    data-testid="label-image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors bg-background group"
                  >
                    <ImagePlus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Tap to choose a photo</span>
                    <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG or WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-testid="input-product-image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setForm((prev) => ({ ...prev, image: ev.target?.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                )}
                <p className="text-muted-foreground text-xs">Leave empty to use a default image.</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-widest">Description *</label>
              <Textarea
                data-testid="input-product-description"
                placeholder="Describe the product — its origin, materials, and what makes it special..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="bg-background border-border focus:border-primary rounded-none resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
            </div>

            {/* Bestseller toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="bestseller"
                data-testid="checkbox-bestseller"
                checked={form.isBestseller}
                onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                className="w-4 h-4 accent-yellow-500"
              />
              <label htmlFor="bestseller" className="text-sm text-muted-foreground cursor-pointer">
                Mark as Bestseller (shows on homepage)
              </label>
            </div>

            <Button
              type="submit"
              data-testid="button-submit-product"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-10 py-6 text-base uppercase tracking-widest font-medium gold-glow"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add to Shop
            </Button>
          </form>
        </div>

        {/* Your Added Products */}
        {customProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-6">Your Added Products ({customProducts.length})</h2>
            <div className="space-y-3">
              {customProducts.map((p) => (
                <div
                  key={p.id}
                  data-testid={`row-custom-product-${p.id}`}
                  className="flex items-center gap-4 bg-card border border-border p-4 hover:border-primary/40 transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-sm text-primary">{p.category} &middot; UGX {p.price.toLocaleString()}</p>
                    {p.isBestseller && <span className="text-xs text-yellow-400 uppercase tracking-wide">Bestseller</span>}
                  </div>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    data-testid={`button-delete-${p.id}`}
                    className="p-2 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                    title="Remove product"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All products count */}
        <div className="mt-12 text-center text-muted-foreground text-sm border-t border-border pt-8">
          Your shop has <span className="text-primary font-medium">{allProducts.length} products</span> total
        </div>
          </div>
        )}
      </div>
    </div>
  );
}
