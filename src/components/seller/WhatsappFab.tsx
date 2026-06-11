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
        className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366]/40"
      />
      <button
        type="button"
        onClick={handleClick}
        aria-label="Chat with seller on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-2 ring-background transition-transform hover:bg-[#1ebe57] hover:scale-105 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M19.11 4.91A10.07 10.07 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.46 1.32 4.96L2 22l5.2-1.36A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.89-7.09zM12 20.13a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-3.08.81.82-3-.2-.31A8.13 8.13 0 1 1 20.13 12 8.14 8.14 0 0 1 12 20.13zm4.46-6.1c-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.11 3.65.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.45-.59 1.66-1.16.21-.57.21-1.06.14-1.16-.07-.1-.22-.16-.46-.28z" />
        </svg>
      </button>
    </div>
  );
}

