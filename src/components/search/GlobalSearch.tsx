import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  MessageSquare,
  Package,
  Search,
  Sparkles,
  BookOpen,
  Compass,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { KNOWLEDGE } from "@/content/knowledge/_meta";

type Result = {
  key: string;
  label: string;
  hint?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const QUICK: Result[] = [
  { key: "nav-home", label: "Home", href: "/", icon: Compass },
  { key: "nav-market", label: "Market feed", href: "/market", icon: MessageSquare },
  { key: "nav-rfq", label: "RFQ board", href: "/rfq", icon: FileText },
  { key: "nav-directory", label: "Members directory", href: "/directory", icon: Building2 },
  { key: "nav-products", label: "Products", href: "/products", icon: Package },
  { key: "nav-brands", label: "Brands", href: "/brands", icon: Sparkles },
  { key: "nav-knowledge", label: "Knowledge base", href: "/knowledge", icon: BookOpen },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [companies, setCompanies] = useState<Result[]>([]);
  const [products, setProducts] = useState<Result[]>([]);
  const [posts, setPosts] = useState<Result[]>([]);
  const [rfqs, setRfqs] = useState<Result[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 180);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebounced("");
    }
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    if (debounced.length < 2) {
      setCompanies([]);
      setProducts([]);
      setPosts([]);
      setRfqs([]);
      return;
    }
    const like = `%${debounced}%`;

    (async () => {
      const [c, p, m, r] = await Promise.all([
        supabase
          .from("companies_public")
          .select("id,name,slug,city")
          .ilike("name", like)
          .limit(5),
        supabase
          .from("products")
          .select("id,name,slug,category")
          .eq("is_hidden", false)
          .ilike("name", like)
          .limit(5),
        supabase
          .from("community_posts")
          .select("id,content,post_type")
          .eq("is_hidden", false)
          .ilike("content", like)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("rfq_listings")
          .select("id,commodity,listing_type,delivery_location")
          .eq("is_hidden", false)
          .eq("status", "open")
          .ilike("commodity", like)
          .limit(5),
      ]);

      if (cancelled) return;

      setCompanies(
        (c.data ?? []).map((row) => ({
          key: `company-${row.id}`,
          label: row.name,
          hint: row.city ?? "Company",
          href: `/store/${row.slug}`,
          icon: Building2,
        })),
      );
      setProducts(
        (p.data ?? []).map((row) => ({
          key: `product-${row.id}`,
          label: row.name,
          hint: row.category ?? "Product",
          href: `/products/${row.slug}`,
          icon: Package,
        })),
      );
      setPosts(
        (m.data ?? []).map((row) => ({
          key: `post-${row.id}`,
          label: row.content.slice(0, 80) || "Post",
          hint: row.post_type,
          href: `/market/${row.id}`,
          icon: MessageSquare,
        })),
      );
      setRfqs(
        (r.data ?? []).map((row) => ({
          key: `rfq-${row.id}`,
          label: `${row.listing_type === "buy" ? "Buying" : "Selling"}: ${row.commodity}`,
          hint: row.delivery_location ?? "RFQ",
          href: `/rfq?listing=${row.id}`,
          icon: FileText,
        })),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const knowledge = useMemo<Result[]>(() => {
    if (debounced.length < 2) return [];
    const q = debounced.toLowerCase();
    return KNOWLEDGE.filter(
      (k) => k.title.toLowerCase().includes(q) || k.summary.toLowerCase().includes(q),
    )
      .slice(0, 5)
      .map((k) => ({
        key: `kb-${k.slug}`,
        label: k.title,
        hint: k.readTime,
        href: `/knowledge/${k.slug}`,
        icon: BookOpen,
      }));
  }, [debounced]);

  const go = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  const showResults = debounced.length >= 2;
  const groups: [string, Result[]][] = [
    ["Businesses", companies],
    ["Products", products],
    ["RFQs", rfqs],
    ["Posts", posts],
    ["Knowledge", knowledge],
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search businesses, products, RFQs, posts…"
      />
      <CommandList>
        {showResults ? (
          <>
            <CommandEmpty>No matches for "{debounced}".</CommandEmpty>
            {groups.map(([label, items]) =>
              items.length ? (
                <CommandGroup key={label} heading={label}>
                  {items.map((r) => (
                    <CommandItem key={r.key} value={`${label} ${r.label}`} onSelect={() => go(r.href)}>
                      <r.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{r.label}</span>
                      {r.hint && (
                        <span className="ml-auto truncate pl-3 text-xs text-muted-foreground">
                          {r.hint}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null,
            )}
            <CommandSeparator />
            <CommandGroup heading="Search">
              <CommandItem
                value={`search-products-${debounced}`}
                onSelect={() => go(`/products?q=${encodeURIComponent(debounced)}&view=marketplace`)}
              >
                <Search className="mr-2 h-4 w-4" /> Search all products for "{debounced}"
              </CommandItem>
              <CommandItem
                value={`search-directory-${debounced}`}
                onSelect={() => go(`/directory?q=${encodeURIComponent(debounced)}`)}
              >
                <Search className="mr-2 h-4 w-4" /> Search directory for "{debounced}"
              </CommandItem>
            </CommandGroup>
          </>
        ) : (
          <CommandGroup heading="Jump to">
            {QUICK.map((r) => (
              <CommandItem key={r.key} value={r.label} onSelect={() => go(r.href)}>
                <r.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                {r.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
