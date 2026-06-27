import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  X, Loader2, Image as ImageIcon, FileText, Link as LinkIcon, BarChart3, Zap, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPost, type PostType, type TopicTag } from "@/repositories/communityPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { extractFirstUrl, fetchLinkPreview, type LinkPreview } from "@/lib/linkPreview";
import { LinkPreviewCard } from "./LinkPreviewCard";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  canPostAnonymous: boolean;
}

const SIGNAL_OPTIONS: { value: Exclude<PostType, "general" | "admin_rate_update">; label: string; topic: TopicTag }[] = [
  { value: "price_signal", label: "Price Signal", topic: "price_signals" },
  { value: "market_alert", label: "Market Alert", topic: "market_alerts" },
  { value: "sourcing_ask", label: "Sourcing Ask", topic: "sourcing" },
  { value: "member_news", label: "Member News", topic: "member_news" },
];

export function ComposeSheet({ open, onOpenChange, canPostAnonymous }: Props) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [postType, setPostType] = useState<PostType>("general");
  const [signalOpen, setSignalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [sd, setSd] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDismissed, setPreviewDismissed] = useState<Set<string>>(new Set());
  const previewSeqRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const initials = useMemo(() => {
    const src = (profile?.full_name || user?.email || "U").trim();
    const parts = src.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || src.slice(0, 1).toUpperCase();
  }, [profile, user]);

  const reset = () => {
    setPostType("general");
    setSignalOpen(false);
    setContent("");
    setIsAnon(false);
    setSd({});
    setPreview(null);
    setPreviewLoading(false);
    setPreviewDismissed(new Set());
  };

  // URL auto-preview (general note + member_news explicit link)
  useEffect(() => {
    const explicit = postType === "member_news" ? String(sd.link ?? "") : "";
    const candidate = explicit && /^https?:\/\//i.test(explicit) ? explicit : extractFirstUrl(content) ?? "";
    if (!candidate) { setPreview(null); setPreviewLoading(false); return; }
    if (previewDismissed.has(candidate)) { setPreview(null); setPreviewLoading(false); return; }
    if (preview && preview.url === candidate) return;
    const seq = ++previewSeqRef.current;
    setPreviewLoading(true);
    const t = setTimeout(async () => {
      const data = await fetchLinkPreview(candidate);
      if (seq !== previewSeqRef.current) return;
      setPreview(data ? { ...data, url: candidate } : null);
      setPreviewLoading(false);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, sd.link, postType]);

  const canSubmit = useMemo(() => {
    if (submitting || !user) return false;
    if (postType === "general") return content.trim().length > 0;
    return true;
  }, [submitting, user, postType, content]);

  const submit = async () => {
    if (!user || !canSubmit) return;
    setSubmitting(true);
    try {
      const opt = SIGNAL_OPTIONS.find((o) => o.value === postType);
      const merged: Record<string, unknown> = { ...sd };
      if (preview) merged.link_preview = preview;
      await createPost({
        author_id: user.id,
        post_type: postType,
        content: content.trim(),
        topic_tag: opt?.topic ?? null,
        structured_data: Object.keys(merged).length ? (merged as Record<string, string | number>) : null,
        is_anonymous: isAnon,
      });
      toast({ title: "Posted" });
      qc.invalidateQueries({ queryKey: ["community-feed"] });
      reset();
      onOpenChange(false);
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k: string, v: string) => setSd((s) => ({ ...s, [k]: v }));

  const dismissPreview = () => {
    if (preview) setPreviewDismissed((s) => new Set(s).add(preview.url));
    setPreview(null);
  };

  const handleLink = () => {
    setContent((c) => (c.endsWith(" ") || c.length === 0 ? c + "https://" : c + " https://"));
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const openSignal = () => { setSignalOpen(true); if (postType === "general") setPostType("price_signal"); };
  const closeSignal = () => { setSignalOpen(false); setPostType("general"); setSd({}); };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <SheetContent
        side="bottom"
        // Hide the built-in top-right close — we render our own X on the left.
        className="flex max-h-[92vh] flex-col gap-0 rounded-t-2xl bg-card p-0 [&>button.absolute]:hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <SheetClose asChild>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
          <h2 className="text-base font-semibold">New Post</h2>
          <Button
            onClick={submit}
            disabled={!canSubmit}
            size="sm"
            className="h-9 px-5"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </div>

        {/* Anonymous row */}
        {canPostAnonymous && (
          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3">
            <div className="min-w-0">
              <Label className="text-sm font-semibold">Post anonymously</Label>
              <p className="truncate text-xs text-muted-foreground">Your identity will be hidden</p>
            </div>
            <Switch checked={isAnon} onCheckedChange={setIsAnon} />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto border-t border-border/60 px-4 py-4">
          {!signalOpen ? (
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <Textarea
                  ref={textareaRef}
                  className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                  placeholder="What's happening in the market?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  autoFocus
                />
                {(preview || previewLoading) && (
                  preview ? (
                    <LinkPreviewCard preview={preview} loading={previewLoading} onRemove={dismissPreview} asLink={false} />
                  ) : (
                    <div className="mt-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                      Loading preview…
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={closeSignal}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to post
              </button>

              <div>
                <Label className="text-xs">Signal type</Label>
                <Select value={postType} onValueChange={(v) => { setPostType(v as PostType); setSd({}); }}>
                  <SelectTrigger className="mt-1 rounded-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SIGNAL_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <Zap className="mr-1 inline h-3 w-3 text-primary" />
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {postType === "price_signal" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2"><Label className="text-xs">Commodity</Label><Input value={String(sd.commodity ?? "")} onChange={(e) => update("commodity", e.target.value)} /></div>
                  <div><Label className="text-xs">Origin</Label><Input value={String(sd.origin ?? "")} onChange={(e) => update("origin", e.target.value)} /></div>
                  <div><Label className="text-xs">Unit</Label>
                    <Select value={String(sd.unit ?? "kg")} onValueChange={(v) => update("unit", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="kg">/kg</SelectItem><SelectItem value="MT">/MT</SelectItem><SelectItem value="box">/box</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Price from (₹)</Label><Input type="number" value={String(sd.price_min ?? "")} onChange={(e) => update("price_min", e.target.value)} /></div>
                  <div><Label className="text-xs">Price to (₹)</Label><Input type="number" value={String(sd.price_max ?? "")} onChange={(e) => update("price_max", e.target.value)} /></div>
                </div>
              )}

              {postType === "market_alert" && (
                <div className="space-y-2">
                  <div><Label className="text-xs">Alert type</Label>
                    <Select value={String(sd.alert_type ?? "")} onValueChange={(v) => update("alert_type", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Port Arrival">Port Arrival</SelectItem>
                        <SelectItem value="Shipment Delay">Shipment Delay</SelectItem>
                        <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                        <SelectItem value="Regulatory Update">Regulatory Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Description</Label><Input value={String(sd.description ?? "")} onChange={(e) => update("description", e.target.value)} /></div>
                </div>
              )}

              {postType === "sourcing_ask" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2"><Label className="text-xs">Commodity</Label><Input value={String(sd.commodity ?? "")} onChange={(e) => update("commodity", e.target.value)} /></div>
                  <div><Label className="text-xs">Qty from</Label><Input type="number" value={String(sd.qty_min ?? "")} onChange={(e) => update("qty_min", e.target.value)} /></div>
                  <div><Label className="text-xs">Qty to</Label><Input type="number" value={String(sd.qty_max ?? "")} onChange={(e) => update("qty_max", e.target.value)} /></div>
                  <div><Label className="text-xs">Qty unit</Label>
                    <Select value={String(sd.qty_unit ?? "kg")} onValueChange={(v) => update("qty_unit", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="MT">MT</SelectItem><SelectItem value="box">box</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Price unit</Label>
                    <Select value={String(sd.price_unit ?? "kg")} onValueChange={(v) => update("price_unit", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="kg">/kg</SelectItem><SelectItem value="MT">/MT</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Price from (₹)</Label><Input type="number" value={String(sd.price_min ?? "")} onChange={(e) => update("price_min", e.target.value)} /></div>
                  <div><Label className="text-xs">Price to (₹)</Label><Input type="number" value={String(sd.price_max ?? "")} onChange={(e) => update("price_max", e.target.value)} /></div>
                  <div className="col-span-2"><Label className="text-xs">Grade / Variety (optional)</Label><Input value={String(sd.grade ?? "")} onChange={(e) => update("grade", e.target.value)} /></div>
                  <div className="col-span-2"><Label className="text-xs">Valid until</Label><Input type="date" value={String(sd.valid_until ?? "")} onChange={(e) => update("valid_until", e.target.value)} /></div>
                </div>
              )}

              {postType === "member_news" && (
                <div className="space-y-2">
                  <div><Label className="text-xs">Headline</Label><Input value={String(sd.headline ?? "")} onChange={(e) => update("headline", e.target.value)} /></div>
                  <div><Label className="text-xs">Description</Label><Input value={String(sd.description ?? "")} onChange={(e) => update("description", e.target.value)} /></div>
                  <div><Label className="text-xs">Link (optional)</Label><Input value={String(sd.link ?? "")} onChange={(e) => update("link", e.target.value)} /></div>
                </div>
              )}

              <div>
                <Label className="text-xs">Add a note (optional)</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  placeholder="Anything else members should know?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom action row */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border/60 bg-card px-2 py-2 pb-safe">
          <ActionPill icon={ImageIcon} label="Photo" onClick={() => toast({ title: "Photos coming soon" })} />
          <ActionPill icon={FileText} label="File" onClick={() => toast({ title: "File uploads coming soon" })} />
          <ActionPill icon={LinkIcon} label="Link" onClick={handleLink} />
          <ActionPill icon={BarChart3} label="Poll" onClick={() => toast({ title: "Polls coming soon" })} />
          <ActionPill
            icon={Zap}
            label="Signal"
            onClick={signalOpen ? closeSignal : openSignal}
            active={signalOpen}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ActionPill({
  icon: Icon, label, onClick, active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary/15 text-foreground"
          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
      {label}
    </button>
  );
}
