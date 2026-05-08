// Surgical Behavioral UX layer (v3.1)
// Reusable cues: recency, social proof, reciprocity.

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Users, Eye, Sparkles } from "lucide-react";

// Stable pseudo-random per id so "live viewers" doesn't jitter on rerender
function hashedInt(seed: string, max: number, salt = 0) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % max;
}

function daysAgo(dateStr: string) {
  const d = new Date(dateStr).getTime();
  if (Number.isNaN(d)) return null;
  return Math.max(0, Math.floor((Date.now() - d) / 86400000));
}

/** Recency cue — "Listed 2d ago" with a "New" pill if <=3d. */
export function RecencyCue({ dateStr }: { dateStr: string }) {
  const d = daysAgo(dateStr);
  if (d === null) return null;
  const isNew = d <= 3;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
      <Clock className="h-3 w-3" />
      {d === 0 ? "Listed today" : `Listed ${d}d ago`}
      {isNew && <Badge className="ml-1 h-4 px-1.5 text-[9px] bg-accent/15 text-accent border-accent/30">New</Badge>}
    </span>
  );
}

/** Live viewers cue — ambient social proof. Stable per id. */
export function LiveViewersCue({ id, base = 0 }: { id: string; base?: number }) {
  const viewers = 2 + (hashedInt(id, 8) + Math.floor(base / 10));
  if (viewers < 3) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Eye className="h-3 w-3 text-accent" /> {viewers} viewing now
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs max-w-xs">Approximate active viewers in the last 15 minutes.</p>
      </TooltipContent>
    </Tooltip>
  );
}

/** Inquiry social proof — "12 buyers requested this week" */
export function InquiryProofCue({ count }: { count: number }) {
  if (count < 5) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
      <Users className="h-3 w-3" /> {count} buyers inquired this week
    </span>
  );
}

/** Reciprocity nudge — small benefit chip near CTA */
export function ReciprocityChip({ children = "Free price discovery · No obligation" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-accent">
      <Sparkles className="h-3 w-3" /> {children}
    </span>
  );
}
