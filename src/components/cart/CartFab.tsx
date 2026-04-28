import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export function CartFab() {
  const { count, setOpen } = useCart();
  if (count === 0) return null;
  return (
    <Button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-primary"
      aria-label={`RFQ cart with ${count} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
        {count}
      </span>
    </Button>
  );
}
