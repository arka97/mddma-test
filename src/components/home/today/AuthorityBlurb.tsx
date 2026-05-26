// Desktop-only SEO-bearing authority paragraph for the public homepage.
// Hidden on mobile to keep the app-shell density; rendered semantically
// so crawlers still index the content.
export function AuthorityBlurb() {
  return (
    <section className="hidden rounded-2xl border border-border bg-card p-6 md:block">
      <h2 className="t-h2 text-foreground">95 years of Mumbai's dry-fruit trade</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Founded in 1930, the Mumbai Dry Fruits and Dates Merchants Association (MDDMA) is the
        recognised industry body for India's importers, wholesalers and retailers of almonds,
        cashews, pistachios, dates, walnuts and raisins. From Crawford Market to Masjid Bunder
        and the APMC mandi at Vashi, MDDMA's members handle a significant share of the country's
        dry-fruit and date imports.
      </p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        This portal is the association's digital trade hub — a verified directory of member firms,
        a live RFQ pipeline between buyers and sellers, official trade circulars, and a transparent
        view of APMC market signals for everyone in the supply chain.
      </p>
    </section>
  );
}
