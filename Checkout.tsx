import React, { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Truck, CheckCircle2, Package, MessageCircle } from "lucide-react";

const OWNER_WHATSAPP = "256742448635";

function sendOwnerWhatsApp(
  orderId: string,
  contact: string,
  location: string,
  notes: string,
  items: { name: string; quantity: number; price: number }[],
  subtotal: number
) {
  const itemLines = items
    .map((i) => `  • ${i.name} x${i.quantity} — UGX ${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  const message =
    `🛒 *New Order on West Pulse!*\n\n` +
    `*Order ID:* ${orderId}\n` +
    `*Customer Phone:* ${contact}\n` +
    `*Delivery Location:* ${location}\n` +
    (notes ? `*Notes:* ${notes}\n` : "") +
    `\n*Items Ordered:*\n${itemLines}\n\n` +
    `*Total: UGX ${subtotal.toLocaleString()}*\n\n` +
    `Payment: Pay on Delivery (MoMo or Cash)`;

  const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({ contact: "", location: "", notes: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState<{ items: typeof items; subtotal: number } | null>(null);

  if (items.length === 0 && !orderId) {
    setLocation("/shop");
    return null;
  }

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.contact.trim()) e.contact = "Please enter your phone number";
    if (!form.location.trim()) e.location = "Please enter your delivery location";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setLoading(true);
    const snapshot = { items: [...items], subtotal };
    setTimeout(() => {
      const id = placeOrder({
        contact: form.contact.trim(),
        location: form.location.trim(),
        notes: form.notes.trim(),
        items: snapshot.items,
        subtotal: snapshot.subtotal,
      });
      clearCart();
      setOrderSnapshot(snapshot);
      setOrderId(id);
      setLoading(false);
      // Notify shop owner on WhatsApp
      sendOwnerWhatsApp(
        id,
        form.contact.trim(),
        form.location.trim(),
        form.notes.trim(),
        snapshot.items,
        snapshot.subtotal
      );
    }, 800);
  };

  if (orderId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="border border-primary/30 bg-card p-12 max-w-md w-full">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-foreground mb-3">Order Placed!</h1>
          <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-2 mb-6">
            <span className="text-primary font-mono font-bold tracking-widest text-lg">{orderId}</span>
          </div>
          <p className="text-muted-foreground mb-2">
            Your order has been received. We will contact you on
          </p>
          <p className="text-foreground font-medium mb-6">{form.contact}</p>
          <p className="text-muted-foreground text-sm mb-8">
            Delivery to: <span className="text-foreground">{form.location}</span>
          </p>

          {/* WhatsApp sent notice */}
          <div className="flex items-center justify-center gap-2 bg-green-400/10 border border-green-400/20 text-green-400 text-sm px-4 py-3 mb-6">
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span>Order details sent to the shop on WhatsApp</span>
          </div>

          <p className="text-muted-foreground text-xs border-t border-border pt-6 mb-2">
            Pay by Mobile Money (MoMo) or cash when your order arrives.
          </p>

          {/* Resend button */}
          {orderSnapshot && (
            <button
              onClick={() => sendOwnerWhatsApp(orderId, form.contact, form.location, form.notes, orderSnapshot.items, orderSnapshot.subtotal)}
              data-testid="button-resend-whatsapp"
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2 mb-6"
            >
              Didn't go through? Resend WhatsApp notification
            </button>
          )}

          <Button
            onClick={() => setLocation("/shop")}
            className="w-full bg-primary text-primary-foreground rounded-none px-10 py-6 uppercase tracking-widest hover:bg-primary/90 gold-glow"
            data-testid="button-continue-shopping"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="text-primary uppercase tracking-widest text-sm mb-2">Almost there</p>
        <h1 className="font-serif text-4xl text-foreground mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — Customer details */}
          <div className="lg:col-span-3 space-y-8">

            {/* Contact */}
            <div className="bg-card border border-primary/20 p-8">
              <h2 className="font-serif text-xl text-foreground mb-6 flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" /> Your Contact
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">
                  Phone Number{" "}
                  <span className="text-muted-foreground normal-case tracking-normal font-normal">(MoMo)</span>
                </label>
                <Input
                  data-testid="input-contact"
                  placeholder="e.g. 0742448635"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="bg-background border-border focus:border-primary rounded-none text-lg h-12"
                />
                {errors.contact && <p className="text-red-400 text-xs">{errors.contact}</p>}
                <p className="text-muted-foreground text-xs">
                  We will call or text this number to confirm delivery.
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-primary/20 p-8">
              <h2 className="font-serif text-xl text-foreground mb-6 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Location
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">
                  Your Address / Area
                </label>
                <Textarea
                  data-testid="input-location"
                  placeholder="e.g. Mbarara, Ntungamo Road, near the market..."
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  rows={3}
                  className="bg-background border-border focus:border-primary rounded-none resize-none"
                />
                {errors.location && <p className="text-red-400 text-xs">{errors.location}</p>}
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium text-foreground uppercase tracking-widest">
                  Additional Notes{" "}
                  <span className="text-muted-foreground normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <Textarea
                  data-testid="input-notes"
                  placeholder="Any special instructions for delivery..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="bg-background border-border focus:border-primary rounded-none resize-none"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-card border border-primary/20 p-8">
              <h2 className="font-serif text-xl text-foreground mb-6 flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" /> Payment Method
              </h2>
              <div
                data-testid="option-pay-on-delivery"
                className="flex items-start gap-4 border border-primary bg-primary/5 p-5"
              >
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Pay on Delivery</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Pay with Mobile Money (MoMo) or cash when your order arrives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-primary/30 p-8 sticky top-28">
              <h2 className="font-serif text-2xl text-foreground mb-6 border-b border-border pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3" data-testid={`summary-item-${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-primary text-sm font-medium flex-shrink-0">
                      UGX {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3 mb-8 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">UGX {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Agreed on confirmation</span>
                </div>
                <div className="flex justify-between text-base font-serif text-foreground border-t border-border pt-3">
                  <span>Total</span>
                  <span className="text-primary text-xl">UGX {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                data-testid="button-place-order"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base rounded-none uppercase tracking-widest font-medium gold-glow transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5 animate-bounce" /> Placing Order...
                  </span>
                ) : (
                  "Place Order"
                )}
              </Button>
              <p className="text-muted-foreground text-xs text-center mt-4">
                We will confirm your order and arrange delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
