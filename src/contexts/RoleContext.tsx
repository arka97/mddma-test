import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLatestMembershipForUser, isMembershipActive, type Membership } from "@/lib/membership";

export type UserRole = "guest" | "free_member" | "paid_member" | "broker" | "admin";

interface RoleContextType {
  // Effective role: derived from real auth + active membership when signed in;
  // falls back to the demo override when signed out (so the unauth header
  // dropdown can still preview different role experiences).
  role: UserRole;
  // Demo override — only honored while user is signed out.
  setRole: (role: UserRole) => void;
  canAccess: (feature: string) => boolean;
}

const rolePermissions: Record<UserRole, string[]> = {
  guest: ["browse_directory", "view_commodities", "view_products"],
  free_member: ["browse_directory", "view_commodities", "view_products", "storefront", "product_listings", "crm_dashboard", "community"],
  paid_member: ["browse_directory", "view_commodities", "view_products", "storefront", "product_listings", "crm_dashboard", "community", "rfq_mode", "hide_price", "priority_listing", "advanced_crm", "market_intelligence"],
  broker: ["browse_directory", "view_commodities", "view_products", "storefront", "product_listings", "crm_dashboard", "community", "broker_marketplace", "market_intelligence"],
  admin: ["browse_directory", "view_commodities", "view_products", "storefront", "product_listings", "crm_dashboard", "community", "rfq_mode", "hide_price", "priority_listing", "advanced_crm", "market_intelligence", "broker_marketplace", "member_approvals", "product_moderation", "circular_announcements", "admin_panel"],
};

// Invariant: paid_member must be a strict superset of free_member permissions.
// A paid member is no longer a free member in the DB (a trigger removes the
// free_member row on upgrade), so they rely on this superset for all the
// browse/storefront/community benefits they had as a free user.
if (import.meta.env.DEV) {
  const missing = rolePermissions.free_member.filter((p) => !rolePermissions.paid_member.includes(p));
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error("[RoleContext] paid_member is missing free_member permissions:", missing);
  }
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user, hasRole } = useAuth();
  const [demoRole, setDemoRole] = useState<UserRole>("guest");
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (!user) {
      setMembership(null);
      return;
    }
    let alive = true;
    getLatestMembershipForUser(user.id).then((m) => {
      if (alive) setMembership(m);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  const effectiveRole = useMemo<UserRole>(() => {
    if (!user) return demoRole;
    // Real role precedence: admin > broker > paid (active membership OR explicit role) > free
    if (hasRole("admin")) return "admin";
    if (hasRole("broker")) return "broker";
    if (isMembershipActive(membership) || hasRole("paid_member")) return "paid_member";
    return "free_member";
  }, [user, hasRole, membership, demoRole]);

  const canAccess = (feature: string) => rolePermissions[effectiveRole]?.includes(feature) ?? false;

  return (
    <RoleContext.Provider value={{ role: effectiveRole, setRole: setDemoRole, canAccess }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}

export const roleLabels: Record<UserRole, string> = {
  guest: "Guest",
  free_member: "Free Member",
  paid_member: "Paid Member",
  broker: "Broker",
  admin: "Admin",
};
