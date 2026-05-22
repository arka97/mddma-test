import { Search, ShoppingBag, MessageCircle } from "lucide-react";

const steps = [
  {
    n: 1,
    icon: Search,
    title: "Find what you need",
    body: "Search for any commodity or browse verified sellers in seconds.",
  },
  {
    n: 2,
    icon: ShoppingBag,
    title: "Add to your request",
    body: "Pick items from one or many sellers. Set quantities — no payment yet.",
  },
  {
    n: 3,
    icon: MessageCircle,
    title: "Sellers reply on WhatsApp",
    body: "Get quotes and quantities directly on your phone. Negotiate in your own way.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="t-eyebrow mb-3 text-muted-foreground">How MDDMA works</p>
          <h2 className="font-display text-4xl text-foreground md:text-5xl">
            Three simple steps. <span className="italic text-accent">That's it.</span>
          </h2>
        </div>

        <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map(({ n, icon: Icon, title, body }) => (
            <li
              key={n}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-bold text-accent-foreground">
                  {n}
                </span>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
