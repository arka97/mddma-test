import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Directory from "./pages/Directory";
import MemberProfile from "./pages/MemberProfile";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import LeadIntelligence from "./pages/LeadIntelligence";
import MembershipPlans from "./pages/MembershipPlans";
import Circulars from "./pages/Circulars";
import Forms from "./pages/Forms";
import Login from "./pages/Login";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import SalesPitch from "./pages/SalesPitch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/directory/:slug" element={<MemberProfile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/leads" element={<LeadIntelligence />} />
          <Route path="/membership" element={<MembershipPlans />} />
          <Route path="/circulars" element={<Circulars />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/contact" element={<Forms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pitch" element={<SalesPitch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
