import React, { useState } from "react";
import { useSellers } from "@/context/SellerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Clock, XCircle, Phone, MapPin, ImagePlus, Store } from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Under Review",
    description: "Your application has been received and is currently being reviewed by our team. We will contact you on WhatsApp within 24 hours.",
    icon: Clock,
    color: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    bg: "bg-yellow-400/5",
  },
  approved: {
    label: "Approved!",
    description: "Congratulations! Your seller application has been approved. Our team will reach out to you on your WhatsApp number to get you set up on the marketplace.",
    icon: CheckCircle2,
    color: "text-green-400",
    borderColor: "border-green-400/30",
    bg: "bg-green-400/5",
  },
  rejected: {
    label: "Not Approved",
    description: "Unfortunately your application was not approved at this time. Please contact us on WhatsApp at +256 742 448 635 for more information or to reapply.",
    icon: XCircle,
    color: "text-red-400",
    borderColor: "border-red-400/30",
    bg: "bg-red-400/5",
  },
};

const WHATSAPP_URL = "https://wa.me/256742448635";

export function TrackApplication() {
  const { applications } = useSellers();
  const [inputId, setInputId] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<(typeof applications)[0] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputId.trim().toUpperCase();
    const found = applications.find(
      (a) => a.id === trimmed || a.id === trimmed.replace(/^SEL-?/, "SEL-")
    );
    setResult(found ?? null);
    setSearched(true);
  };

  const statusInfo = result ? STATUS_CONFIG[result.status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-[85vh] bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <p className="text-primary uppercase tracking-widest text-sm mb-3">Seller Portal</p>
          <h1 className="font-serif text-4xl text-foreground mb-3">Track Your Application</h1>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Enter your seller reference ID to check the status of your application.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <Input
            data-testid="input-track-id"
            placeholder="e.g. SEL-123456"
            value={inputId}
            onChange={(e) => { setInputId(e.target.value); setSearched(false); }}
            className="bg-card border-border focus:border-primary rounded-none h-14 text-base font-mono tracking-wider flex-grow"
          />
          <Button
            type="submit"
            data-testid="button-track-search"
            className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest text-sm"
          >
            <Search className="h-4 w-4 mr-2" /> Check
          </Button>
        </form>

        {/* Result */}
        {searched && !result && (
          <div className="border border-dashed border-border bg-card p-10 text-center">
            <Store className="h-10 w-10 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-foreground font-medium mb-2">No application found</p>
            <p className="text-muted-foreground text-sm">
              Double-check your reference ID. It should look like <span className="font-mono text-primary">SEL-XXXXXX</span>.
            </p>
          </div>
        )}

        {searched && result && statusInfo && StatusIcon && (
          <div className={`border ${statusInfo.borderColor} ${statusInfo.bg} p-8 space-y-6`} data-testid="track-result">

            {/* Status header */}
            <div className="flex items-center gap-4">
              <StatusIcon className={`h-10 w-10 ${statusInfo.color} flex-shrink-0`} />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Application Status</p>
                <h2 className={`font-serif text-2xl ${statusInfo.color}`}>{statusInfo.label}</h2>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{statusInfo.description}</p>

            {/* Details */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Reference ID</p>
                  <p className="font-mono text-primary font-bold">{result.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Submitted</p>
                  <p className="text-foreground text-sm">{new Date(result.submittedAt).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{result.whatsapp}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{result.location}</span>
                </div>
              </div>

              {/* Products summary */}
              {result.products.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Products Listed ({result.products.length})
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {result.products.map((p, i) => (
                      <div key={i} className="border border-border bg-background p-2 space-y-1">
                        {p.image ? (
                          <div className="aspect-square overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="aspect-square bg-card flex items-center justify-center">
                            <ImagePlus className="h-5 w-5 text-muted-foreground/20" />
                          </div>
                        )}
                        <p className="text-xs text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-primary">UGX {Number(p.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact us CTA */}
            <div className="border-t border-border pt-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-track-whatsapp"
                className="inline-flex items-center gap-3 border border-primary/40 text-primary hover:bg-primary/10 px-5 py-3 text-sm uppercase tracking-widest transition-colors"
              >
                <Phone className="h-4 w-4" /> Contact Us on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Help text */}
        {!searched && (
          <p className="text-center text-muted-foreground text-xs mt-4">
            Don't have a reference ID?{" "}
            <a href="/sell" className="text-primary hover:underline">Apply to become a seller</a>.
          </p>
        )}
      </div>
    </div>
  );
}
