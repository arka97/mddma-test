import { Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  phone?: string | null;
  onRequestQuote: () => void;
}

export function StickyContactBar({ phone, onRequestQuote }: Props) {
  return (
    <div
      className="fixed inset-x-0 z-30 border-t border-border bg-background/95 px-3 py-2 backdrop-blur lg:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 64px)" }}
    >
      <div className="container mx-auto flex max-w-6xl items-center gap-2">
        {phone ? (
          <Button variant="outline" className="flex-1" asChild>
            <a href={`tel:${phone}`}>
              <Phone className="mr-1.5 h-4 w-4" /> Call
            </a>
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            <Phone className="mr-1.5 h-4 w-4" /> Call
          </Button>
        )}
        <Button variant="accent" className="flex-[2]" onClick={onRequestQuote}>
          <Send className="mr-1.5 h-4 w-4" /> Request quote
        </Button>
      </div>
    </div>
  );
}
