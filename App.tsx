import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { OrderProvider } from "@/context/OrderContext";
import { SellerProvider } from "@/context/SellerContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Pages
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { About } from "@/pages/About";
import { Admin } from "@/pages/Admin";
import { Checkout } from "@/pages/Checkout";
import { BecomeSeller } from "@/pages/BecomeSeller";
import { TrackApplication } from "@/pages/TrackApplication";
import { Wishlist } from "@/pages/Wishlist";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/about" component={About} />
          <Route path="/admin" component={Admin} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/sell" component={BecomeSeller} />
          <Route path="/track-application" component={TrackApplication} />
          <Route path="/wishlist" component={Wishlist} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WishlistProvider>
        <SellerProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </SellerProvider>
        </WishlistProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
