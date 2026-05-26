import { Link, useNavigate } from "react-router-dom";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { useAuth } from "@/contexts/AuthContext";
import {
  MoreHorizontal, Package, Sparkles, Store, TrendingUp, Briefcase, MessagesSquare,
  LayoutDashboard, User, Building2, Inbox, ShieldCheck, Info, BadgeCheck, FileSignature,
  Download, FileText, Phone, LogIn, LogOut,
} from "lucide-react";
import { ReactNode } from "react";

interface MoreSheetProps {
  trigger?: ReactNode;
}

type Item = { label: string; to: string; icon: typeof Package };

const discover: Item[] = [
  { label: "Products", to: "/products", icon: Package },
  { label: "Brands", to: "/brands", icon: Sparkles },
  { label: "Market", to: "/market", icon: TrendingUp },
  { label: "Broker Board", to: "/broker", icon: Briefcase },
  { label: "Community", to: "/community", icon: MessagesSquare },
];

const info: Item[] = [
  { label: "About", to: "/about", icon: Info },
  { label: "Membership", to: "/membership", icon: BadgeCheck },
  { label: "Apply", to: "/apply", icon: FileSignature },
  { label: "Install App", to: "/install", icon: Download },
  { label: "Documents", to: "/documents", icon: FileText },
  { label: "Contact", to: "/contact", icon: Phone },
];

function Section({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <SheetClose asChild>
                <Link
                  to={it.to}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{it.label}</span>
                </Link>
              </SheetClose>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MoreSheet({ trigger }: MoreSheetProps) {
  const { user, profile, company, hasRole, signOut } = useAuth();
  const navigate = useNavigate();

  const workspace: Item[] = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", to: "/account/profile", icon: User },
    { label: company ? "My Company" : "Create Company", to: "/account/company", icon: Building2 },
    ...(company ? [{ label: "My Storefront", to: `/store/${company.slug}`, icon: Store }] : []),
    { label: "My Products", to: "/account/products", icon: Package },
    { label: "My Brands", to: "/account/brands", icon: Sparkles },
    { label: "RFQ Inbox", to: "/account/rfqs", icon: Inbox },
    ...(hasRole("admin") ? [{ label: "Moderation", to: "/account/moderation", icon: ShieldCheck }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
            aria-label="Open menu"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Logo variant="mark" className="h-9 w-9" />
            <span className="font-bold tracking-tight text-sm">MDDMA</span>
          </SheetTitle>
        </SheetHeader>

        {user && (
          <div className="border-b border-border px-5 py-3">
            <p className="text-sm font-semibold text-foreground">{profile?.full_name || "Member"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}

        <div className="flex flex-col gap-5 p-3">
          <Section title="Discover" items={discover} />
          {user && <Section title="Workspace" items={workspace} />}
          <Section title="Info" items={info} />

          <div className="flex flex-col gap-2 border-t border-border px-2 pt-4">
            <InstallAppButton className="w-full justify-center" />
            {user ? (
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            ) : (
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Sign in
                  </Link>
                </Button>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
