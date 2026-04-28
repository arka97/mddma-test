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
  rfqs: {
    all: ["rfqs"] as const,
    inbox: (companyId: string) => [...qk.rfqs.all, "inbox", companyId] as const,
    sent: (buyerId: string) => [...qk.rfqs.all, "sent", buyerId] as const,
  },
  circulars: {
    all: ["circulars"] as const,
    list: (publishedOnly = true) =>
      [...qk.circulars.all, "list", publishedOnly] as const,
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
} as const;
