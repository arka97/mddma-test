import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  companyId: string | null | undefined;
  contextLabel?: string;
  /** Extra bottom offset (px) on mobile to clear a sticky bar above the tab bar. */
  mobileBottomOffset?: number;
  className?: string;
}

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function WhatsappFab({ companyId, contextLabel, mobileBottomOffset = 0, className }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole();
  const isPaid = !!user && (role === "paid_member" || role === "broker" || role === "admin");

  const { data: phone } = useQuery({
    queryKey: ["seller-whatsapp", companyId ?? ""],
    enabled: Boolean(companyId) && isPaid,
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>)(
        "get_company_whatsapp",
        { _company_id: companyId },
      );
      if (error) return null;
      return (typeof data === "string" ? data : null) as string | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // For non-paid users we still render the button so they can be nudged to upgrade.
  // For paid users we hide it only when we've confirmed there is no number.
  if (isPaid && !phone) return null;
  if (!companyId) return null;

  const handleClick = () => {
    if (isPaid && phone) {
      const number = normalizeWhatsappNumber(phone);
      if (!number) {
        toast.error("Seller has no WhatsApp number on file.");
        return;
      }
      const message = contextLabel
        ? `Hi, I saw "${contextLabel}" on MDDMA and would like to enquire.`
        : `Hi, I saw your listing on MDDMA and would like to enquire.`;
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    toast.info("Unlock direct contact", {
      description: "Upgrade to a Paid membership to message sellers directly.",
    });
    navigate("/membership");
  };

  const mobileBottom = 72 + mobileBottomOffset; // 64px tab bar + 8px gap (+ optional sticky bar)

  return (
    <div
      className={cn(
        "fixed right-4 z-40 h-14 w-14 lg:right-6",
        "bottom-[var(--fab-bottom)] lg:bottom-6",
        className,
      )}
      style={{
        ["--fab-bottom" as never]: `calc(env(safe-area-inset-bottom) + ${mobileBottom}px)`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-ping rounded-full opacity-60"
        style={{ backgroundColor: "#25D366" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-25"
        style={{ backgroundColor: "#25D366" }}
      />
      <button
        type="button"
        onClick={handleClick}
        aria-label="Chat with seller on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-2 ring-background transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#25D366", color: "#ffffff" }}
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2.25} />
      </button>
    </div>
  );
}
