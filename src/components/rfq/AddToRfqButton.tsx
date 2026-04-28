import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Plus } from "lucide-react";
import { useRfqCart } from "@/contexts/RfqCartContext";

interface AddToRfqButtonProps {
  productName: string;
  productId?: string | null;
  companyId?: string | null;
  sellerName: string;
  sellerSlug?: string | null;
  origin?: string | null;
  moq?: string | null;
  variant?: string | null;
  size?: "sm" | "icon";
  className?: string;
}

// Small toggle that adds/removes an item to the buyer's RFQ shortlist.
// Pairs with the primary "Request Quote" CTA on listing cards.
export function AddToRfqButton({
  productName,
  productId,
  companyId,
  sellerName,
  sellerSlug,
  origin,
  moq,
  variant,
  size = "icon",
  className = "",
}: AddToRfqButtonProps) {
  const { add, remove, isInCart, findCartId } = useRfqCart();
  const inCart = isInCart(productId ?? null, productName, sellerName);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      const cid = findCartId(productId ?? null, productName, sellerName);
      if (cid) remove(cid);
      return;
    }
    add({
      productName,
      productId: productId ?? null,
      companyId: companyId ?? null,
      sellerName,
      sellerSlug: sellerSlug ?? null,
      origin: origin ?? null,
      moq: moq ?? null,
      variant: variant ?? null,
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size={size === "icon" ? "icon" : "sm"}
          variant={inCart ? "secondary" : "outline"}
          onClick={onClick}
          aria-label={inCart ? "Remove from RFQ list" : "Add to RFQ list"}
          aria-pressed={inCart}
          className={`flex-shrink-0 ${size === "icon" ? "h-9 w-9" : ""} ${
            inCart ? "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" : ""
          } ${className}`}
        >
          {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{inCart ? "In your RFQ list — click to remove" : "Add to your RFQ list"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default AddToRfqButton;
