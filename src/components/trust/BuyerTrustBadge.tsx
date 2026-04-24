import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck, ShieldAlert, ShieldQuestion, BadgeCheck } from "lucide-react";

export type VerificationTier = "unverified" | "email" | "company" | "gst";

interface Props {
  tier: VerificationTier;
  score?: number;
  compact?: boolean;
}

const TIER_META: Record<VerificationTier, { label: string; icon: typeof ShieldCheck; classes: string; help: string }> = {
  unverified: {
    label: "Unverified",
    icon: ShieldAlert,
    classes: "bg-muted text-muted-foreground border-border",
    help: "Buyer has not completed any verification step.",
  },
  email: {
    label: "Email verified",
    icon: ShieldQuestion,
    classes: "bg-secondary text-secondary-foreground border-border",
    help: "Buyer's email address has been confirmed.",
  },
  company: {
    label: "Company verified",
    icon: ShieldCheck,
    classes: "bg-primary/10 text-primary border-primary/30",
    help: "Buyer's company name and contact details have been verified.",
  },
  gst: {
    label: "GST verified",
    icon: BadgeCheck,
    classes: "bg-accent/15 text-accent-foreground border-accent/40",
    help: "Buyer holds a verified GSTIN — highest trust tier.",
  },
};

export function reputationLabel(score: number) {
  if (score >= 80) return "Trusted";
  if (score >= 50) return "Established";
  if (score >= 20) return "Emerging";
  return "New";
}

export const BuyerTrustBadge = ({ tier, score, compact = false }: Props) => {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`gap-1.5 ${meta.classes}`}>
          <Icon className="h-3.5 w-3.5" />
          {compact ? meta.label.split(" ")[0] : meta.label}
          {typeof score === "number" && (
            <span className="ml-1 opacity-70">· {reputationLabel(score)}</span>
          )}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-xs">{meta.help}</p>
        {typeof score === "number" && (
          <p className="text-xs mt-1 opacity-80">Reputation score: {score}/100</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};
