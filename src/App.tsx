import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CartFab } from "@/components/cart/CartFab";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DocAuthProvider, PasswordGate } from "@/components/PasswordGate";
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

import MembershipPlans from "./pages/MembershipPlans";
import Circulars from "./pages/Circulars";
import Forms from "./pages/Forms";
import Login from "./pages/Login";
import Apply from "./pages/Apply";
import DocumentsHub from "./pages/DocumentsHub";
import DocViewer from "./pages/DocViewer";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/account/ProfilePage";
import CompanyPage from "./pages/account/CompanyPage";
import ProductsPage from "./pages/account/ProductsPage";
import RFQInbox from "./pages/account/RFQInbox";
import AdminModeration from "./pages/account/AdminModeration";
import VerificationCenter from "./pages/account/VerificationCenter";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <CartProvider>
            <DocAuthProvider>
              <Toaster />
              <Sonner />
              <CartFab />
              <CartDrawer />
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
                <Route path="/membership" element={<MembershipPlans />} />
                <Route path="/circulars" element={<Circulars />} />
                <Route path="/forms" element={<Forms />} />
                <Route path="/contact" element={<Forms />} />
                <Route path="/login" element={<Login />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/admin" element={<Navigate to="/account/moderation" replace />} />

                {/* Authenticated user space */}
                <Route path="/account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/account/company" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
                <Route path="/account/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                <Route path="/account/rfqs" element={<ProtectedRoute><RFQInbox /></ProtectedRoute>} />
                <Route path="/account/verify" element={<ProtectedRoute><VerificationCenter /></ProtectedRoute>} />
                <Route path="/account/moderation" element={<ProtectedRoute requireRole="admin"><AdminModeration /></ProtectedRoute>} />

                {/* Documentation hub (canonical markdown spec) */}
                <Route path="/documents" element={<PasswordGate><DocumentsHub /></PasswordGate>} />
                <Route path="/documents/:slug" element={<PasswordGate><DocViewer /></PasswordGate>} />

                {/* Legacy doc routes → redirect to merged equivalents */}
                <Route path="/pitch" element={<Navigate to="/documents/vision-and-pitch" replace />} />
                <Route path="/mvp-canvas" element={<Navigate to="/documents/vision-and-pitch" replace />} />
                <Route path="/brd" element={<Navigate to="/documents/business-and-scope" replace />} />
                <Route path="/sow" element={<Navigate to="/documents/business-and-scope" replace />} />
                <Route path="/prd" element={<Navigate to="/documents/product-and-ux" replace />} />
                <Route path="/fsd" element={<Navigate to="/documents/functional-spec" replace />} />
                <Route path="/sdd" element={<Navigate to="/documents/architecture-and-tech" replace />} />
                <Route path="/tsd" element={<Navigate to="/documents/architecture-and-tech" replace />} />
                <Route path="/changelog" element={<Navigate to="/documents/build-and-operations" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </DocAuthProvider>
          </CartProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
