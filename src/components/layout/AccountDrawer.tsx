import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Building2,
  BookOpen,
  Compass,
  FileCheck2,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Package,
  ShieldCheck,
  Sparkles,
  Store,
  Star,
  User,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { CompanySwitcher } from "@/components/layout/CompanySwitcher";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { InstallPromoCard } from "@/components/pwa/InstallPromoCard";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type Item = { label: string; href: string; icon: typeof User };

const exploreItems: Item[] = [
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Directory", href: "/directory", icon: Building2 },
  { label: "Products", href: "/products", icon: Package },
  { label: "RFQ board", href: "/rfq", icon: FileText },
  { label: "Brands", href: "/brands", icon: Sparkles },
  { label: "Membership", href: "/membership", icon: Star },
  { label: "Knowledge", href: "/knowledge", icon: BookOpen },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Documents", href: "/documents", icon: FileCheck2 },
];

function Row({
  to,
  icon: Icon,
  children,
  onNavigate,
}: {
  to: string;
  icon: typeof User;
  children: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex items-center gap-4 rounded-lg px-3 py-2.5 text-[17px] font-semibold text-foreground transition-colors hover:bg-muted"
    >
      <Icon className="h-[22px] w-[22px] shrink-0 text-foreground" />
      <span className="truncate">{children}</span>
    </Link>
  );
}

function SmallRow({
  to,
  icon: Icon,
  children,
  onNavigate,
}: {
  to: string;
  icon: typeof User;
  children: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate">{children}</span>
    </Link>
  );
}

/** X-style left slide-out holding account actions and all secondary navigation. */
export function AccountDrawer({ open, onOpenChange }: Props) {
  const { user, profile, company, hasRole, signOut } = useAuth();
  const navigate = useNavigate();
  const close = () => onOpenChange(false);

  const initials = (profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    close();
    await signOut();
    navigate("/");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-0 pt-safe">
        <SheetTitle className="sr-only">Account menu</SheetTitle>

        <div className="px-4 pb-2 pt-5">
          {user ? (
            <>
              <Avatar className="h-14 w-14">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="mt-3">
                <div className="text-lg font-bold leading-tight text-foreground">
                  {profile?.full_name || "Member"}
                </div>
                <div className="truncate text-sm text-muted-foreground">{user.email}</div>
              </div>
              {company && (
                <Link
                  to="/account/company"
                  onClick={close}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{company.name}</span>
                </Link>
              )}
              <div className="mt-3">
                <CompanySwitcher />
              </div>
            </>
          ) : (
            <div>
              <div className="text-lg font-bold text-foreground">Welcome to G-BAU-G</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to post, follow businesses and quote on RFQs.
              </p>
              <div className="mt-3 flex gap-2">
                <Button asChild className="flex-1" onClick={close}>
                  <Link to="/login">
                    <LogIn className="mr-1.5 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1" onClick={close}>
                  <Link to="/membership">Join</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        {user && (
          <>
            <nav className="px-2">
              <Row to="/account/profile" icon={User} onNavigate={close}>
                Profile
              </Row>
              <Row to="/dashboard" icon={LayoutDashboard} onNavigate={close}>
                Dashboard
              </Row>
              <Row to="/account/company" icon={Building2} onNavigate={close}>
                {company ? "My business" : "Register business"}
              </Row>
              {company && (
                <Row to={`/store/${company.slug}`} icon={Store} onNavigate={close}>
                  My storefront
                </Row>
              )}
              <Row to="/account/products" icon={Package} onNavigate={close}>
                My products
              </Row>
              <Row to="/account/brands" icon={Sparkles} onNavigate={close}>
                My brands
              </Row>
              <Row to="/account/bookmarks" icon={Bookmark} onNavigate={close}>
                Bookmarks
              </Row>
              <Row to="/notifications" icon={Bell} onNavigate={close}>
                Notifications
              </Row>
              <Row to="/quotes" icon={FileCheck2} onNavigate={close}>
                My quotations
              </Row>
              <Row to="/account/team" icon={Users} onNavigate={close}>
                Team
              </Row>
            </nav>
            <Separator className="my-2" />
          </>
        )}

        <div className="px-2">
          <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </p>
          <nav>
            {exploreItems.map((item) => (
              <SmallRow key={item.href} to={item.href} icon={item.icon} onNavigate={close}>
                {item.label}
              </SmallRow>
            ))}
          </nav>
        </div>

        {hasRole("admin") && (
          <>
            <Separator className="my-2" />
            <div className="px-2">
              <SmallRow to="/account/moderation" icon={ShieldCheck} onNavigate={close}>
                Moderation
              </SmallRow>
            </div>
          </>
        )}

        <Separator className="my-2" />

        <div className="px-4 pb-2 pt-1">
          <InstallPromoCard variant="strip" />
        </div>

        <div className="flex items-center justify-between gap-2 px-4 pb-8 pt-1">
          <InstallAppButton size="sm" variant="outline" label="Install app" />
          {user && (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AccountDrawer;
