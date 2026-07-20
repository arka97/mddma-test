// Centralised query-key factory. All React Query hooks must derive their keys
// from here so cache invalidation stays safe across refactors.

export const qk = {
  companies: {
    all: ["companies"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...qk.companies.all, "list", filters ?? {}] as const,
    bySlug: (slug: string) => [...qk.companies.all, "slug", slug] as const,
    byOwner: (ownerId: string) => [...qk.companies.all, "owner", ownerId] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...qk.products.all, "list", filters ?? {}] as const,
    bySlug: (slug: string) => [...qk.products.all, "slug", slug] as const,
    byCompany: (companyId: string) =>
      [...qk.products.all, "company", companyId] as const,
  },
  productCategories: {
    all: ["productCategories"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...qk.productCategories.all, "list", filters ?? {}] as const,
  },
  circulars: {
    all: ["circulars"] as const,
    list: (publishedOnly = true) =>
      [...qk.circulars.all, "list", publishedOnly] as const,
  },
  rfqs: {
    all: ["rfqs"] as const,
    active: (type: "buy" | "sell") => [...qk.rfqs.all, "active", type] as const,
    activeCount: () => [...qk.rfqs.all, "active-count"] as const,
  },
  marketNews: {
    all: ["marketNews"] as const,
    list: (publishedOnly = true) =>
      [...qk.marketNews.all, "list", publishedOnly] as const,
  },
  humor: {
    all: ["humor"] as const,
    list: (publishedOnly = true) =>
      [...qk.humor.all, "list", publishedOnly] as const,
  },
  ads: {
    all: ["ads"] as const,
    byPlacement: (placement: string) =>
      [...qk.ads.all, "placement", placement] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (category?: string) => [...qk.posts.all, "list", category ?? "all"] as const,
    detail: (id: string) => [...qk.posts.all, "detail", id] as const,
  },
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) => [...qk.comments.all, "post", postId] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
    byId: (id: string) => ["profile", "id", id] as const,
  },
  roles: {
    me: ["roles", "me"] as const,
  },
  tradeSignals: {
    all: ["tradeSignals"] as const,
    byCompany: (companyId: string) =>
      [...qk.tradeSignals.all, "company", companyId] as const,
    batch: (companyIds: string[]) =>
      [...qk.tradeSignals.all, "batch", [...companyIds].sort().join(",")] as const,
  },
} as const;
