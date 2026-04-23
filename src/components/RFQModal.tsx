import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowRight, ArrowLeft, X, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

interface RFQModalProps {
  productName: string;
  productId?: string | null;
  companyId?: string | null;
  onClose: () => void;
}

const STEPS = ["Quantity & Packaging", "Delivery Details", "Message & Submit"];

export function RFQModal({ productName, productId, companyId, onClose }: RFQModalProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, company: myCompany } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", company: "", phone: "",
    quantity: "", packaging: "",
    deliveryTimeline: "", deliveryLocation: "",
    message: "", sendToMultiple: false,
  });

  useEffect(() => {
    if (user) setFormData((f) => ({
      ...f,
      name: f.name || profile?.full_name || "",
      email: f.email || user.email || "",
      company: f.company || myCompany?.name || "",
      phone: f.phone || profile?.phone || "",
    }));
  }, [user, profile, myCompany]);

  const progress = ((step + 1) / STEPS.length) * 100;
  const updateField = (field: string, value: string | boolean) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in to send an RFQ", variant: "destructive" });
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!companyId) {
      toast({ title: "Missing seller info", description: "Could not identify the seller for this product.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("rfqs").insert({
      buyer_id: user.id,
      company_id: companyId,
      product_id: productId ?? null,
      product_name: productName,
      quantity: formData.quantity,
      packaging: formData.packaging || null,
      delivery_timeline: formData.deliveryTimeline || null,
      delivery_location: formData.deliveryLocation || null,
      message: formData.message || null,
      buyer_name: formData.name || null,
      buyer_company: formData.company || null,
      buyer_phone: formData.phone || null,
      buyer_email: formData.email || null,
      status: "new",
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "RFQ failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "✅ RFQ Submitted",
      description: `Your request for ${productName} has been sent. Track responses in your dashboard.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <Card className="w-full max-w-lg bg-card animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Request Best Price</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{productName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0"><X className="h-4 w-4" /></Button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              {STEPS.map((s, i) => (
                <span key={s} className={i <= step ? "text-accent font-medium" : ""}>{i + 1}. {s}</span>
              ))}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {!user && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Sign in to send and track your RFQ.</span>
              <Button asChild size="sm" variant="outline"><Link to="/login"><LogIn className="h-3 w-3 mr-1" /> Sign In</Link></Button>
            </div>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Full Name *</Label><Input required maxLength={100} value={formData.name} onChange={(e) => updateField("name", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Company</Label><Input maxLength={120} value={formData.company} onChange={(e) => updateField("company", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Email *</Label><Input type="email" required maxLength={120} value={formData.email} onChange={(e) => updateField("email", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input maxLength={20} value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Quantity *</Label><Input required maxLength={60} placeholder="e.g., 500 kg" value={formData.quantity} onChange={(e) => updateField("quantity", e.target.value)} /></div>
                <div className="space-y-1.5">
                  <Label>Packaging</Label>
                  <Select value={formData.packaging} onValueChange={(v) => updateField("packaging", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5kg Box">5kg Box</SelectItem>
                      <SelectItem value="10kg Carton">10kg Carton</SelectItem>
                      <SelectItem value="10kg Tin">10kg Tin</SelectItem>
                      <SelectItem value="20kg Jute Bag">20kg Jute Bag</SelectItem>
                      <SelectItem value="25kg Carton">25kg Carton</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Delivery Timeline</Label>
                <Select value={formData.deliveryTimeline} onValueChange={(v) => updateField("deliveryTimeline", v)}>
                  <SelectTrigger><SelectValue placeholder="When do you need it?" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urgent (1 week)">Urgent (1 week)</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Delivery Location *</Label>
                <Input required maxLength={200} value={formData.deliveryLocation} onChange={(e) => updateField("deliveryLocation", e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Additional Requirements</Label>
                <Textarea rows={4} maxLength={1500} value={formData.message} onChange={(e) => updateField("message", e.target.value)} />
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-sm">
                <h4 className="font-semibold text-foreground">RFQ Summary</h4>
                <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                  <span>Product:</span><span className="text-foreground">{productName}</span>
                  <span>Quantity:</span><span className="text-foreground">{formData.quantity || "—"}</span>
                  <span>Packaging:</span><span className="text-foreground">{formData.packaging || "—"}</span>
                  <span>Timeline:</span><span className="text-foreground">{formData.deliveryTimeline || "—"}</span>
                  <span>Location:</span><span className="text-foreground">{formData.deliveryLocation || "—"}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={step === 0 ? onClose : () => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="bg-accent hover:bg-accent/90 text-primary">
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="bg-accent hover:bg-accent/90 text-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Submit RFQ</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
