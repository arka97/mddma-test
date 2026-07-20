import { useState } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  startDealRoom,
  type DealContextType,
} from "@/repositories/dealRooms";

interface Props {
  counterpartyCompanyId: string;
  subject: string;
  contextType?: DealContextType;
  rfqId?: string | null;
  quotationId?: string | null;
  productId?: string | null;
  label?: string;
  variant?: "default" | "outline";
  className?: string;
}

export function StartDealRoomButton({
  counterpartyCompanyId,
  subject,
  contextType = "general",
  rfqId,
  quotationId,
  productId,
  label = "Message business",
  variant = "default",
  className,
}: Props) {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [starting, setStarting] = useState(false);

  if (company?.id === counterpartyCompanyId) return null;

  const openRoom = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!company) {
      toast({
        title: "Register a business to start a conversation",
        description: "Private deal rooms belong to verified businesses rather than personal accounts.",
      });
      navigate("/apply");
      return;
    }

    if (!company.is_verified || company.is_hidden || company.review_status !== "approved") {
      toast({
        title: "Business verification required",
        description: "Your business must be approved, visible, and verified before it can open private deal rooms.",
      });
      navigate("/account/company");
      return;
    }

    setStarting(true);
    try {
      const roomId = await startDealRoom({
        counterpartyCompanyId,
        subject,
        contextType,
        rfqId,
        quotationId,
        productId,
      });
      navigate(`/messages/${roomId}`);
    } catch (error) {
      toast({
        title: "Conversation could not be opened",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setStarting(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={openRoom}
      disabled={starting}
    >
      {starting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <MessageSquareText className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}