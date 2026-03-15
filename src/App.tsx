import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Directory from "./pages/Directory";
import MemberProfile from "./pages/MemberProfile";
import Storefront from "./pages/Storefront";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import Broker from "./pages/Broker";
import Market from "./pages/Market";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import LeadIntelligence from "./pages/LeadIntelligence";
import MembershipPlans from "./pages/MembershipPlans";
import Circulars from "./pages/Circulars";
import Forms from "./pages/Forms";
import Login from "./pages/Login";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import SalesPitch from "./pages/SalesPitch";
import SOW from "./pages/SOW";
import BRD from "./pages/BRD";
import PRD from "./pages/PRD";
import FSD from "./pages/FSD";
import SDD from "./pages/SDD";
import TSD from "./pages/TSD";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directory/:slug" element={<MemberProfile />} />
            <Route path="/store/:slug" element={<Storefront />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/broker" element={<Broker />} />
            <Route path="/market" element={<Market />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/leads" element={<LeadIntelligence />} />
            <Route path="/membership" element={<MembershipPlans />} />
            <Route path="/circulars" element={<Circulars />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/contact" element={<Forms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pitch" element={<SalesPitch />} />
            <Route path="/sow" element={<SOW />} />
            <Route path="/brd" element={<BRD />} />
            <Route path="/prd" element={<PRD />} />
            <Route path="/fsd" element={<FSD />} />
            <Route path="/sdd" element={<SDD />} />
            <Route path="/tsd" element={<TSD />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
