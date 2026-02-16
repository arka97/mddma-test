import { sampleAdvertisers } from "@/data/sampleData";

export function SponsorsSection() {
  const activeAds = sampleAdvertisers.filter((a) => a.isActive);

  return (
    <section className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-6">
          Our Partners & Sponsors
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {activeAds.map((ad) => (
            <a
              key={ad.id}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-card border border-border hover:border-accent/50 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {ad.companyName}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
