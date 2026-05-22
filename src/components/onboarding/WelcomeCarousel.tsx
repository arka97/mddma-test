import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Send, MessageCircle } from "lucide-react";

const KEY = "mddma_welcome_seen_v1";

const slides = [
  {
    icon: Search,
    title: "Find verified sellers",
    body: "Browse 1,200+ verified traders across Mumbai's APMC market.",
  },
  {
    icon: Send,
    title: "Send one price request",
    body: "Add items from many sellers. Send all together with one tap.",
  },
  {
    icon: MessageCircle,
    title: "Get replies on WhatsApp",
    body: "Sellers reply directly to your phone. No new app to learn.",
  },
];

export function WelcomeCarousel() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const slide = slides[i];
  const Icon = slide.icon;
  const last = i === slides.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : finish())}>
      <DialogContent className="max-w-sm rounded-2xl p-0 sm:max-w-md">
        <div className="flex flex-col items-center px-6 pb-6 pt-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon className="h-10 w-10" />
          </div>
          <h2 className="font-display text-3xl text-foreground">{slide.title}</h2>
          <p className="mt-3 text-base text-muted-foreground">{slide.body}</p>

          <div className="my-6 flex items-center gap-2" aria-hidden="true">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-accent" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          <div className="flex w-full gap-2">
            <Button variant="ghost" className="flex-1" onClick={finish}>
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={() => (last ? finish() : setI((n) => n + 1))}
            >
              {last ? "Get started" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
