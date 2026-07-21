import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/contexts/AuthContext";

export function MobileTopBar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
      <Link to={user ? "/dashboard" : "/login"} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-bold uppercase">
        {user ? (user.email ?? "?").slice(0, 1) : "?"}
      </Link>
      <Link to="/" className="flex items-center gap-2">
        <Logo variant="mark" className="h-8 w-8" />
      </Link>
      <Link to="/directory" aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
        <Search className="h-5 w-5" />
      </Link>
    </header>
  );
}
