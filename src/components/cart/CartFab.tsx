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
      className="fixed right-4 z-40 h-14 w-14 rounded-full shadow-lg md:right-6 md:h-14 md:w-14"
      style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      aria-label={`RFQ cart with ${count} items`}
    >

      <ShoppingCart className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-danger-foreground">
        {count}
      </span>
    </Button>
  );
}
