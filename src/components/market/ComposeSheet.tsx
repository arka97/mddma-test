import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  MessageSquareText,
  Plus,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  createBusinessPollPost,
  createBusinessPost,
  type NewBusinessPostType,
} from "@/repositories/communityPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import {
  formatBytes,
  MAX_FILE_MB,
  MAX_IMAGE_MB,
  MAX_IMAGES_PER_POST,
  uploadPostFile,
  uploadPostImage,
  type UploadedMedia,
} from "@/lib/uploads";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditorMode = "discussion" | "price" | "alert" | "update" | "poll";

const MODES: Array<{ id: EditorMode; label: string; icon: typeof MessageSquareText }> = [
  { id: "discussion", label: "Discussion", icon: MessageSquareText },
  { id: "price", label: "Price signal", icon: TrendingUp },
  { id: "alert", label: "Market alert", icon: AlertTriangle },
  { id: "update", label: "Business update", icon: Megaphone },
  { id: "poll", label: "Poll", icon: BarChart3 },
];

const CURRENCIES = ["INR", "USD", "EUR", "AED", "GBP"];
const UNITS = ["kg", "tonne", "lb", "case", "container"];

interface PendingImage {
  file: File;
  previewUrl: string;
}

export function ComposeSheet({ open, onOpenChange }: Props) {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<EditorMode>("discussion");
  const [content, setContent] = useState("");
  const [commodity, setCommodity] = useState("");
  const [origin, setOrigin] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [unit, setUnit] = useState("kg");
  const [alertType, setAlertType] = useState("Supply disruption");
  const [headline, setHeadline] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDays, setPollDays] = useState("3");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canPublish = Boolean(
    user &&
    company &&
    company.is_verified &&
    !company.is_hidden &&
    company.review_status === "approved",
  );

  const canSubmit = useMemo(() => {
    if (!canPublish || submitting) return false;
    if (mode === "discussion") return content.trim().length > 0 || images.length > 0 || Boolean(pdf);
    if (mode === "price") {
      const min = Number(priceMin);
      const max = Number(priceMax);
      return commodity.trim().length > 0 && min > 0 && max >= min;
    }
    if (mode === "alert") return content.trim().length > 0;
    if (mode === "update") return headline.trim().length > 0 && content.trim().length > 0;
    const options = pollOptions.map((option) => option.trim()).filter(Boolean);
    return pollQuestion.trim().length >= 3 && options.length >= 2 && new Set(options.map((option) => option.toLowerCase())).size === options.length;
  }, [canPublish, submitting, mode, content, images, pdf, commodity, priceMin, priceMax, headline, pollQuestion, pollOptions]);

  const reset = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setMode("discussion");
    setContent("");
    setCommodity("");
    setOrigin("");
    setCurrency("INR");
    setPriceMin("");
    setPriceMax("");
    setUnit("kg");
    setAlertType("Supply disruption");
    setHeadline("");
    setSourceLink("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollDays("3");
    setImages([]);
    setPdf(null);
  };

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const available = MAX_IMAGES_PER_POST - images.length;
    const accepted = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, available)
      .filter((file) => {
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
          toast({ title: `${file.name} exceeds ${MAX_IMAGE_MB} MB`, variant: "destructive" });
          return false;
        }
        return true;
      });
    setImages((current) => [
      ...current,
      ...accepted.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
  };

  const pickPdf = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Only PDF documents are supported" });
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast({ title: `PDF exceeds ${MAX_FILE_MB} MB`, variant: "destructive" });
      return;
    }
    setPdf(file);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl);
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const uploadMedia = async () => {
    if (!user) return {} as Record<string, unknown>;
    const uploadedImages: UploadedMedia[] = [];
    for (const image of images) uploadedImages.push(await uploadPostImage(user.id, image.file));
    const uploadedFile = pdf ? await uploadPostFile(user.id, pdf) : null;

    const media: Record<string, unknown> = {};
    if (uploadedImages.length) media.images = uploadedImages.map((image) => image.path);
    if (uploadedFile) {
      media.file = {
        path: uploadedFile.path,
        name: uploadedFile.name,
        size: uploadedFile.size,
      };
    }
    return media;
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const media = await uploadMedia();

      if (mode === "poll") {
        await createBusinessPollPost({
          question: pollQuestion.trim(),
          options: pollOptions.map((option) => option.trim()).filter(Boolean),
          durationDays: Number(pollDays),
          content: content.trim(),
          structuredData: Object.keys(media).length ? media : null,
        });
      } else {
        let postType: NewBusinessPostType = "general";
        const structuredData: Record<string, unknown> = { ...media };

        if (mode === "price") {
          postType = "price_signal";
          Object.assign(structuredData, {
            commodity: commodity.trim(),
            origin: origin.trim() || null,
            currency,
            price_min: Number(priceMin),
            price_max: Number(priceMax),
            unit,
          });
        } else if (mode === "alert") {
          postType = "market_alert";
          structuredData.alert_type = alertType;
        } else if (mode === "update") {
          postType = "member_news";
          structuredData.headline = headline.trim();
          if (sourceLink.trim()) structuredData.link = sourceLink.trim();
        }

        await createBusinessPost({
          postType,
          content: content.trim(),
          structuredData: Object.keys(structuredData).length ? structuredData : null,
        });
      }

      await queryClient.invalidateQueries({ queryKey: qk.community.all });
      toast({ title: "Published to the business community" });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Post could not be published",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) reset(); onOpenChange(next); }}>
      <SheetContent side="bottom" className="flex max-h-[92vh] flex-col gap-0 rounded-t-2xl bg-card p-0 [&>button.absolute]:hidden">
        <div className="flex justify-center pt-2"><span className="h-1 w-10 rounded-full bg-border" /></div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <SheetClose asChild>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
          <h2 className="text-base font-semibold">Publish as a business</h2>
          <Button onClick={submit} disabled={!canSubmit} size="sm" className="h-9 px-5">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
          </Button>
        </div>

        <div className="border-y border-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
              {company?.logo_url ? <img src={company.logo_url} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{company?.name ?? "Verified business"}</p>
              <p className="text-xs text-muted-foreground">Posts are publicly attributed to this business.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-border/60 px-4 py-3">
          {MODES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  mode === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {mode === "price" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Commodity</Label><Input value={commodity} onChange={(event) => setCommodity(event.target.value)} placeholder="Almonds, dates, spices…" /></div>
              <div><Label>Origin</Label><Input value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="Optional" /></div>
              <div><Label>Currency</Label><Select value={currency} onValueChange={setCurrency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CURRENCIES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Minimum</Label><Input type="number" min="0" value={priceMin} onChange={(event) => setPriceMin(event.target.value)} /></div>
              <div><Label>Maximum</Label><Input type="number" min="0" value={priceMax} onChange={(event) => setPriceMax(event.target.value)} /></div>
              <div><Label>Unit</Label><Select value={unit} onValueChange={setUnit}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{UNITS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
            </div>
          )}

          {mode === "alert" && (
            <div><Label>Alert type</Label><Select value={alertType} onValueChange={setAlertType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Supply disruption", "Quality concern", "Regulatory change", "Logistics delay", "Fraud warning", "Other"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          )}

          {mode === "update" && (
            <div className="space-y-3">
              <div><Label>Headline</Label><Input value={headline} onChange={(event) => setHeadline(event.target.value.slice(0, 160))} placeholder="Business milestone, event, launch…" /></div>
              <div><Label>Source link</Label><Input value={sourceLink} onChange={(event) => setSourceLink(event.target.value)} placeholder="https://… (optional)" /></div>
            </div>
          )}

          {mode === "poll" && (
            <div className="space-y-3">
              <div><Label>Question</Label><Input value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value.slice(0, 240))} /></div>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={option} onChange={(event) => setPollOptions((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder={`Option ${index + 1}`} />
                  {pollOptions.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => setPollOptions((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button>}
                </div>
              ))}
              {pollOptions.length < 4 && <Button type="button" variant="outline" size="sm" onClick={() => setPollOptions((current) => [...current, ""])}><Plus className="mr-1 h-4 w-4" /> Add option</Button>}
              <div><Label>Duration</Label><Select value={pollDays} onValueChange={setPollDays}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1, 3, 7, 14].map((days) => <SelectItem key={days} value={String(days)}>{days} day{days === 1 ? "" : "s"}</SelectItem>)}</SelectContent></Select></div>
            </div>
          )}

          <div>
            <Label>{mode === "discussion" ? "Discussion" : mode === "poll" ? "Context (optional)" : "Commentary"}</Label>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value.slice(0, 5000))}
              rows={5}
              placeholder={mode === "discussion" ? "Share a useful market observation or question…" : "Add context, evidence and limitations…"}
            />
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{content.length}/5000</p>
          </div>

          <div className="rounded-xl border border-border/60 p-3">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} disabled={images.length >= MAX_IMAGES_PER_POST}>
                <ImageIcon className="mr-1 h-4 w-4" /> Add images
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={Boolean(pdf)}>
                <FileText className="mr-1 h-4 w-4" /> Add PDF
              </Button>
              <Badge variant="outline">Public media</Badge>
            </div>
            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(event) => addImages(event.target.files)} />
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => pickPdf(event.target.files?.[0])} />

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {images.map((image, index) => (
                  <div key={image.previewUrl} className="relative overflow-hidden rounded-lg border border-border">
                    <img src={image.previewUrl} alt="" className="aspect-square w-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 rounded-full bg-background/90 p-1" aria-label="Remove image"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
            {pdf && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 p-2 text-xs">
                <span className="truncate">{pdf.name} · {formatBytes(pdf.size)}</span>
                <Button type="button" variant="ghost" size="xs" onClick={() => setPdf(null)}>Remove</Button>
              </div>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Do not publish personal contact details or final commercial terms. Use RFQs, private quotations and deal rooms for transactions. Sourcing requests belong in the RFQ network.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
