import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { MoreSheet } from "./MoreSheet";

export function MobileTopBar() {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="MDDMA — Home">
          <Logo variant="mark" className="h-9 w-9" />
          <span className="font-bold tracking-tight text-foreground">MDDMA</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate("/products?view=marketplace")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </button>
          <MoreSheet />
        </div>
      </div>
    </header>
  );
}
