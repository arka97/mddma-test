import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is MDDMA free to use?",
    a: "Yes. Browsing sellers, products, and sending up to a few price requests every month is free. A paid plan (₹10,000/year) unlocks unlimited requests, full seller details, and broker tools.",
  },
  {
    q: "How do I get replies?",
    a: "When you send a price request, the seller is notified by WhatsApp and email. They reply directly to you — no separate inbox to check.",
  },
  {
    q: "Do I need a GST number?",
    a: "Buying does not need a GST number. Sellers do — it's how we verify them. This keeps the market clean for everyone.",
  },
  {
    q: "Can I use the app in Hindi or Marathi?",
    a: "We are rolling out Hindi and Marathi labels across the app. For now, key buttons and categories are bilingual. WhatsApp support is in your language.",
  },
  {
    q: "What if I make a mistake?",
    a: "Every important action can be undone. Removed an item? Tap Undo. Sent a wrong request? Reply on WhatsApp to cancel. We never charge you for mistakes.",
  },
  {
    q: "Who can I call if I'm stuck?",
    a: "Tap the green 'Need help?' button anywhere in the app to message us on WhatsApp. Real humans, in your language, during business hours.",
  },
];

export function HomeFaq() {
  return (
    <section className="bg-surface-sand py-14 md:py-20">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-12">
          <p className="t-eyebrow mb-3 text-muted-foreground">Common questions</p>
          <h2 className="font-display text-4xl text-foreground md:text-5xl">
            Questions, answered.
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`q-${i}`}
              className="overflow-hidden rounded-2xl border border-border bg-card px-4"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
