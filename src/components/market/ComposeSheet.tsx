import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Loader2 } from "lucide-react";
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

const TYPE_OPTIONS: { value: PostType; label: string; topic: TopicTag | null }[] = [
  { value: "general", label: "General post", topic: null },
  { value: "price_signal", label: "Price Signal", topic: "price_signals" },
  { value: "market_alert", label: "Market Alert", topic: "market_alerts" },
  { value: "sourcing_ask", label: "Sourcing Ask", topic: "sourcing" },
  { value: "member_news", label: "Member News", topic: "member_news" },
];

export function ComposeSheet({ open, onOpenChange, canPostAnonymous }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [postType, setPostType] = useState<PostType>("general");
  const [content, setContent] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [sd, setSd] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDismissed, setPreviewDismissed] = useState<Set<string>>(new Set());
  const previewSeqRef = useRef(0);

  const reset = () => {
    setPostType("general");
    setContent("");
    setIsAnon(false);
    setSd({});
    setPreview(null);
    setPreviewLoading(false);
    setPreviewDismissed(new Set());
  };

  // Detect URL in content (general/member_news note) and fetch preview.
  // For member_news, the explicit `link` field is preferred.
  useEffect(() => {
    const explicit = postType === "member_news" ? String(sd.link ?? "") : "";
    const candidate = explicit && /^https?:\/\//i.test(explicit)
      ? explicit
      : extractFirstUrl(content) ?? "";
    if (!candidate) {
      setPreview(null);
      setPreviewLoading(false);
      return;
    }
    if (previewDismissed.has(candidate)) {
      setPreview(null);
      setPreviewLoading(false);
      return;
    }
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

  const submit = async () => {
    if (!user) return;
    if (!content.trim() && postType === "general") {
      toast({ title: "Write something first" });
      return;
    }
    setSubmitting(true);
    try {
      const opt = TYPE_OPTIONS.find((o) => o.value === postType);
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
    if (preview) {
      setPreviewDismissed((s) => new Set(s).add(preview.url));
    }
    setPreview(null);
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>New post</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-3">
          <div>
            <Label className="text-xs">Post type</Label>
            <Select value={postType} onValueChange={(v) => { setPostType(v as PostType); setSd({}); }}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.value !== "general" && <Zap className="inline h-3 w-3 mr-1 text-accent" />}
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
            <Label className="text-xs">{postType === "general" ? "Post" : "Add a note (optional)"}</Label>
            <Textarea
              className="mt-1"
              rows={4}
              placeholder="What's happening in the market today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {(preview || previewLoading) && (
              preview ? (
                <LinkPreviewCard preview={preview} loading={previewLoading} onRemove={dismissPreview} asLink={false} />
              ) : (
                <div className="mt-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  Loading preview…
                </div>
              )
            )}
          </div>

          {canPostAnonymous && (
            <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
              <div>
                <Label className="text-sm">Post anonymously</Label>
                <p className="text-[11px] text-muted-foreground">Your identity will be hidden from members.</p>
              </div>
              <Switch checked={isAnon} onCheckedChange={setIsAnon} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          <Button onClick={submit} disabled={submitting} className="flex-1">
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Post
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
