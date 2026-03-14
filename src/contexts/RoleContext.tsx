import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "guest" | "free_member" | "paid_member" | "broker" | "admin";

interface RoleContextType {
  role: UserRole;
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

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("guest");

  const canAccess = (feature: string) => {
    return rolePermissions[role]?.includes(feature) ?? false;
  };

  return (
    <RoleContext.Provider value={{ role, setRole, canAccess }}>
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
