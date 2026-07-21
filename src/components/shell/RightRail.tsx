import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NewMembersList } from "@/components/home/today/NewMembersList";
import { AdSlot } from "@/components/home/today/AdSlot";

export function RightRail() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 overflow-y-auto border-l border-border px-4 py-3 lg:block">
      <div className="sticky top-0 z-10 -mx-4 mb-3 bg-background/95 px-4 py-1 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search G-BAU-G" className="h-11 rounded-full bg-muted pl-10 text-sm" />
        </div>
      </div>

      <section className="mb-4 rounded-2xl border border-border bg-muted/40 p-4">
        <h3 className="mb-3 text-lg font-bold">What's happening</h3>
        <div className="space-y-3 text-sm">
          <Link to="/circulars" className="block hover:underline">
            <div className="text-xs text-muted-foreground">Bulletin</div>
            <div className="font-semibold">Latest circulars from the association</div>
          </Link>
          <Link to="/rfq" className="block hover:underline">
            <div className="text-xs text-muted-foreground">Trade</div>
            <div className="font-semibold">Open RFQs on the board</div>
          </Link>
          <Link to="/market" className="block hover:underline">
            <div className="text-xs text-muted-foreground">Market</div>
            <div className="font-semibold">Live signals & rate alerts</div>
          </Link>
        </div>
      </section>

      <section className="mb-4 rounded-2xl border border-border bg-muted/40 p-4">
        <h3 className="mb-3 text-lg font-bold">Who to follow</h3>
        <NewMembersList />
      </section>

      <section className="mb-6">
        <AdSlot placement="sidebar" />
      </section>

      <footer className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/faq" className="hover:underline">FAQ</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        <Link to="/documents/privacy-policy" className="hover:underline">Privacy</Link>
        <Link to="/documents/terms-of-service" className="hover:underline">Terms</Link>
        <span>© {new Date().getFullYear()} G-BAU-G</span>
      </footer>
    </aside>
  );
}
