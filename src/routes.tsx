import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PasswordGate } from "@/components/PasswordGate";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Directory = lazy(() => import("./pages/Directory"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));
const Storefront = lazy(() => import("./pages/Storefront"));
const Products = lazy(() => import("./pages/Products"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Broker = lazy(() => import("./pages/Broker"));
const Market = lazy(() => import("./pages/Market"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Community = lazy(() => import("./pages/Community"));
const MembershipPlans = lazy(() => import("./pages/MembershipPlans"));
const Circulars = lazy(() => import("./pages/Circulars"));
const Forms = lazy(() => import("./pages/Forms"));
const Login = lazy(() => import("./pages/Login"));
const Apply = lazy(() => import("./pages/Apply"));
const Install = lazy(() => import("./pages/Install"));
const DocumentsHub = lazy(() => import("./pages/DocumentsHub"));
const DocViewer = lazy(() => import("./pages/DocViewer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfilePage = lazy(() => import("./pages/account/ProfilePage"));
const CompanyPage = lazy(() => import("./pages/account/CompanyPage"));
const ProductsPage = lazy(() => import("./pages/account/ProductsPage"));
const RFQInbox = lazy(() => import("./pages/account/RFQInbox"));
const AdminModeration = lazy(() => import("./pages/account/AdminModeration"));
const VerificationCenter = lazy(() => import("./pages/account/VerificationCenter"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const protect = (node: ReactNode, role?: "admin" | "broker" | "paid_member" | "free_member") => (
  <ProtectedRoute requireRole={role}>{node}</ProtectedRoute>
);

const gate = (node: ReactNode) => <PasswordGate>{node}</PasswordGate>;

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
        <Route path="/install" element={<Install />} />
        <Route path="/admin" element={<Navigate to="/account/moderation" replace />} />

        <Route path="/account/profile" element={protect(<ProfilePage />)} />
        <Route path="/account/company" element={protect(<CompanyPage />)} />
        <Route path="/account/products" element={protect(<ProductsPage />)} />
        <Route path="/account/rfqs" element={protect(<RFQInbox />)} />
        <Route path="/account/verify" element={protect(<VerificationCenter />)} />
        <Route path="/account/moderation" element={protect(<AdminModeration />, "admin")} />

        <Route path="/documents" element={gate(<DocumentsHub />)} />
        <Route path="/documents/:slug" element={gate(<DocViewer />)} />

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
    </Suspense>
  );
}
