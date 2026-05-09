import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export function CartFab() {
  const { count, setOpen } = useCart();
  if (count === 0) return null;
  return (
    <Button
      variant="accent"
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg sm:h-14 sm:w-14"
      aria-label={`RFQ cart with ${count} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-danger-foreground">
        {count}
      </span>
    </Button>
  );
}
