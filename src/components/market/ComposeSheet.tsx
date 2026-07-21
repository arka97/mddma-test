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
  X, Loader2, Image as ImageIcon, FileText, Link as LinkIcon, BarChart3, Zap, ChevronLeft, Tag, Plus, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPost, type PostType, type TopicTag } from "@/repositories/communityPosts";
import { createPollForPost } from "@/repositories/postPolls";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { extractFirstUrl, fetchLinkPreview, type LinkPreview } from "@/lib/linkPreview";
import { LinkPreviewCard } from "./LinkPreviewCard";
import {
  uploadPostImage, uploadPostFile, getMediaSignedUrl, formatBytes,
  MAX_IMAGES_PER_POST, MAX_IMAGE_MB, MAX_FILE_MB, type UploadedMedia,
} from "@/lib/uploads";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  canPostAnonymous: boolean;
}

type EditorMode = "general" | "signal" | "price" | "poll";

const SIGNAL_OPTIONS: { value: Exclude<PostType, "general" | "admin_rate_update" | "poll" | "price_signal">; label: string; topic: TopicTag }[] = [
  { value: "market_alert", label: "Market Alert", topic: "market_alerts" },
  { value: "sourcing_ask", label: "Sourcing Ask", topic: "sourcing" },
  { value: "member_news", label: "Member News", topic: "member_news" },
];

interface PendingImage { file: File; previewUrl: string; }

export function ComposeSheet({ open, onOpenChange, canPostAnonymous }: Props) {
  const { user, profile, company, memberships } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [mode, setMode] = useState<EditorMode>("general");
  const [signalType, setSignalType] = useState<"market_alert" | "sourcing_ask" | "member_news">("market_alert");
  const [content, setContent] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [sd, setSd] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);

  const [images, setImages] = useState<PendingImage[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);

  const [pollQ, setPollQ] = useState("");
  const [pollOpts, setPollOpts] = useState<string[]>(["", ""]);
  const [pollDays, setPollDays] = useState(3);

  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDismissed, setPreviewDismissed] = useState<Set<string>>(new Set());
  const previewSeqRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = useMemo(() => {
    const src = (profile?.full_name || user?.email || "U").trim();
    const parts = src.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || src.slice(0, 1).toUpperCase();
  }, [profile, user]);

  const reset = () => {
    setMode("general"); setSignalType("market_alert");
    setContent(""); setIsAnon(false); setSd({});
    images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setImages([]); setPdf(null);
    setPollQ(""); setPollOpts(["", ""]); setPollDays(3);
    setPreview(null); setPreviewLoading(false); setPreviewDismissed(new Set());
  };

  // URL auto-preview
  useEffect(() => {
    const explicit = mode === "signal" && signalType === "member_news" ? String(sd.link ?? "") : "";
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
  }, [content, sd.link, mode, signalType]);

  const addImageFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    const space = MAX_IMAGES_PER_POST - images.length;
    if (space <= 0) { toast({ title: `Max ${MAX_IMAGES_PER_POST} images` }); return; }
    const accepted = arr.slice(0, space).filter((f) => {
      if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
        toast({ title: `${f.name} > ${MAX_IMAGE_MB} MB`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setImages((prev) => [...prev, ...accepted.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))]);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.files);
    const imgs = items.filter((f) => f.type.startsWith("image/"));
    if (imgs.length) { e.preventDefault(); addImageFiles(imgs); }
  };

  const removeImage = (i: number) => {
    URL.revokeObjectURL(images[i].previewUrl);
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onPickPdf = (file: File) => {
    if (file.type !== "application/pdf") { toast({ title: "PDF only" }); return; }
    if (file.size > MAX_FILE_MB * 1024 * 1024) { toast({ title: `File > ${MAX_FILE_MB} MB`, variant: "destructive" }); return; }
    setPdf(file);
  };

  const setPollOpt = (i: number, v: string) => setPollOpts((o) => o.map((x, idx) => (idx === i ? v : x)));
  const addPollOpt = () => setPollOpts((o) => (o.length >= 4 ? o : [...o, ""]));
  const removePollOpt = (i: number) => setPollOpts((o) => (o.length <= 2 ? o : o.filter((_, idx) => idx !== i)));

  const canSubmit = useMemo(() => {
    if (submitting || !user) return false;
    if (mode === "poll") {
      return pollQ.trim().length > 0 && pollOpts.filter((o) => o.trim()).length >= 2;
    }
    if (mode === "price") {
      return !!sd.commodity && !!sd.price_min && !!sd.price_max;
    }
    if (mode === "signal") return true;
    return content.trim().length > 0 || images.length > 0 || pdf !== null;
  }, [submitting, user, mode, content, images, pdf, sd, pollQ, pollOpts]);

  const computePostType = (): { type: PostType; topic: TopicTag | null } => {
    if (mode === "poll") return { type: "poll", topic: "polls" };
    if (mode === "price") return { type: "price_signal", topic: "price_signals" };
    if (mode === "signal") {
      const t = SIGNAL_OPTIONS.find((o) => o.value === signalType);
      return { type: signalType, topic: t?.topic ?? null };
    }
    return { type: "general", topic: null };
  };

  const submit = async () => {
    if (!user || !canSubmit) return;
    setSubmitting(true);
    try {
      const uploadedImages: UploadedMedia[] = [];
      for (const im of images) uploadedImages.push(await uploadPostImage(user.id, im.file));
      const uploadedFile = pdf ? await uploadPostFile(user.id, pdf) : null;

      const { type, topic } = computePostType();
      const merged: Record<string, unknown> = { ...sd };
      if (preview) merged.link_preview = preview;
      if (uploadedImages.length) merged.images = uploadedImages.map((u) => u.path);
      if (uploadedFile) merged.file = { path: uploadedFile.path, name: uploadedFile.name, size: uploadedFile.size };

      const post = await createPost({
        author_id: user.id,
        post_type: type,
        content: content.trim(),
        topic_tag: topic,
        structured_data: Object.keys(merged).length ? (merged as Record<string, string | number>) : null,
        is_anonymous: isAnon,
      });

      if (mode === "poll") {
        await createPollForPost({
          postId: post.id,
          question: pollQ.trim(),
          options: pollOpts.map((o) => o.trim()).filter(Boolean),
          durationDays: pollDays,
        });
      }

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

  const openMode = (m: EditorMode) => { setMode(m); setSd({}); };
  const backToGeneral = () => { setMode("general"); setSd({}); };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92vh] flex-col gap-0 rounded-t-2xl bg-card p-0 [&>button.absolute]:hidden"
      >
        <div className="flex justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <SheetClose asChild>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
          <h2 className="text-base font-semibold">New Post</h2>
          <Button onClick={submit} disabled={!canSubmit} size="sm" className="h-9 px-5">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </div>

        {canPostAnonymous && (
          <div className="border-t border-border/60 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Label className="text-sm font-semibold">Post anonymously</Label>
                <p className="truncate text-xs text-muted-foreground">Your identity will be hidden from other members</p>
              </div>
              <Switch checked={isAnon} onCheckedChange={setIsAnon} />
            </div>
            {isAnon && (
              <p className="mt-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-[11px] leading-relaxed text-muted-foreground">
                Only MDDMA admins can trace anonymous posts — a log is kept for compliance and dispute resolution.
              </p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto border-t border-border/60 px-4 py-4">
          {mode === "general" && (
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                {!isAnon && company && (
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span>Posting as</span>
                    <span className="font-medium text-foreground">{company.name}</span>
                    {memberships.length > 1 && (
                      <span className="text-muted-foreground">· switch in header</span>
                    )}
                  </div>
                )}
                <Textarea
                  ref={textareaRef}
                  className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                  placeholder="What's happening in the market?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={onPaste}
                  autoFocus
                />


                {images.length > 0 && (
                  <div className={cn("mt-2 grid gap-1", images.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                    {images.map((im, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                        <img src={im.previewUrl} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/70 text-background hover:bg-foreground"
                          aria-label="Remove"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {pdf && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="max-w-[180px] truncate font-medium">{pdf.name}</span>
                    <span className="text-muted-foreground">· {formatBytes(pdf.size)}</span>
                    <button type="button" onClick={() => setPdf(null)} className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Remove">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {(preview || previewLoading) && (
                  preview ? (
                    <LinkPreviewCard preview={preview} loading={previewLoading} onRemove={dismissPreview} asLink={false} />
                  ) : (
                    <div className="mt-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">Loading preview…</div>
                  )
                )}
              </div>
            </div>
          )}

          {mode === "price" && (
            <div className="space-y-3">
              <button type="button" onClick={backToGeneral} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-3.5 w-3.5" /> Back to post
              </button>
              <div className="text-sm font-semibold">Share a price</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2"><Label className="text-xs">Commodity</Label><Input value={String(sd.commodity ?? "")} onChange={(e) => update("commodity", e.target.value)} placeholder="e.g. Mamra Almonds" autoFocus /></div>
                <div><Label className="text-xs">Origin (optional)</Label><Input value={String(sd.origin ?? "")} onChange={(e) => update("origin", e.target.value)} placeholder="Iran" /></div>
                <div><Label className="text-xs">Unit</Label>
                  <Select value={String(sd.unit ?? "kg")} onValueChange={(v) => update("unit", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="kg">/kg</SelectItem><SelectItem value="MT">/MT</SelectItem><SelectItem value="box">/box</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Price from (₹)</Label><Input type="number" inputMode="numeric" value={String(sd.price_min ?? "")} onChange={(e) => update("price_min", e.target.value)} /></div>
                <div><Label className="text-xs">Price to (₹)</Label><Input type="number" inputMode="numeric" value={String(sd.price_max ?? "")} onChange={(e) => update("price_max", e.target.value)} /></div>
              </div>
              <div>
                <Label className="text-xs">Add a note (optional)</Label>
                <Textarea className="mt-1" rows={2} value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
            </div>
          )}

          {mode === "poll" && (
            <div className="space-y-3">
              <button type="button" onClick={backToGeneral} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-3.5 w-3.5" /> Back to post
              </button>
              <div className="text-sm font-semibold">Create a poll</div>
              <div>
                <Label className="text-xs">Question</Label>
                <Input value={pollQ} onChange={(e) => setPollQ(e.target.value)} placeholder="Ask members…" autoFocus />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Options</Label>
                {pollOpts.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={o} onChange={(e) => setPollOpt(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                    {pollOpts.length > 2 && (
                      <button type="button" onClick={() => removePollOpt(i)} className="text-muted-foreground hover:text-destructive" aria-label="Remove option">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOpts.length < 4 && (
                  <button type="button" onClick={addPollOpt} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Plus className="h-3.5 w-3.5" /> Add option
                  </button>
                )}
              </div>
              <div>
                <Label className="text-xs">Duration</Label>
                <Select value={String(pollDays)} onValueChange={(v) => setPollDays(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Add a note (optional)</Label>
                <Textarea className="mt-1" rows={2} value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
            </div>
          )}

          {mode === "signal" && (
            <div className="space-y-3">
              <button type="button" onClick={backToGeneral} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-3.5 w-3.5" /> Back to post
              </button>
              <div>
                <Label className="text-xs">Signal type</Label>
                <Select value={signalType} onValueChange={(v) => { setSignalType(v as typeof signalType); setSd({}); }}>
                  <SelectTrigger className="mt-1 rounded-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SIGNAL_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <Zap className="mr-1 inline h-3 w-3 text-primary" />{o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {signalType === "market_alert" && (
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

              {signalType === "sourcing_ask" && (
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

              {signalType === "member_news" && (
                <div className="space-y-2">
                  <div><Label className="text-xs">Headline</Label><Input value={String(sd.headline ?? "")} onChange={(e) => update("headline", e.target.value)} /></div>
                  <div><Label className="text-xs">Description</Label><Input value={String(sd.description ?? "")} onChange={(e) => update("description", e.target.value)} /></div>
                  <div><Label className="text-xs">Link (optional)</Label><Input value={String(sd.link ?? "")} onChange={(e) => update("link", e.target.value)} /></div>
                </div>
              )}

              <div>
                <Label className="text-xs">Add a note (optional)</Label>
                <Textarea className="mt-1" rows={3} placeholder="Anything else members should know?" value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Hidden inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addImageFiles(e.target.files); e.target.value = ""; }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickPdf(f); e.target.value = ""; }}
        />

        {/* Bottom action row */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border/60 bg-card px-2 py-2 pb-safe">
          <ActionPill icon={ImageIcon} label="Photo" onClick={() => imageInputRef.current?.click()} disabled={mode !== "general"} />
          <ActionPill icon={FileText} label="PDF" onClick={() => fileInputRef.current?.click()} disabled={mode !== "general"} />
          <ActionPill icon={LinkIcon} label="Link" onClick={handleLink} disabled={mode !== "general"} />
          <ActionPill icon={Tag} label="Price" onClick={() => openMode("price")} active={mode === "price"} />
          <ActionPill icon={BarChart3} label="Poll" onClick={() => openMode("poll")} active={mode === "poll"} />
          <ActionPill icon={Zap} label="Signal" onClick={() => (mode === "signal" ? backToGeneral() : openMode("signal"))} active={mode === "signal"} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ActionPill({
  icon: Icon, label, onClick, active = false, disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary/15 text-foreground"
          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
      {label}
    </button>
  );
}
