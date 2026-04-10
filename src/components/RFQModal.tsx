import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowRight, ArrowLeft, CheckCircle, X } from "lucide-react";

interface RFQModalProps {
  productName: string;
  onClose: () => void;
}

const STEPS = ["Quantity & Packaging", "Delivery Details", "Message & Submit"];

export function RFQModal({ productName, onClose }: RFQModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    quantity: "",
    packaging: "",
    deliveryTimeline: "",
    deliveryLocation: "",
    message: "",
    sendToMultiple: false,
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSubmit = () => {
    toast({
      title: "✅ RFQ Submitted Successfully!",
      description: `Your request for ${productName} has been sent to ${formData.sendToMultiple ? "multiple sellers" : "the seller"}.`,
    });
    onClose();
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <Card className="w-full max-w-lg bg-card animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Request Best Price</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{productName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {/* Progress bar — Zeigarnik effect */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              {STEPS.map((s, i) => (
                <span key={s} className={i <= step ? "text-accent font-medium" : ""}>
                  {i + 1}. {s}
                </span>
              ))}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input required placeholder="Your name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input placeholder="Company name" value={formData.company} onChange={(e) => updateField("company", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" required placeholder="you@example.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantity Required *</Label>
                  <Input required placeholder="e.g., 500 kg" value={formData.quantity} onChange={(e) => updateField("quantity", e.target.value)} />
                </div>
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
                <Input required placeholder="City or full address" value={formData.deliveryLocation} onChange={(e) => updateField("deliveryLocation", e.target.value)} />
              </div>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-accent/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  checked={formData.sendToMultiple}
                  onChange={(e) => updateField("sendToMultiple", e.target.checked)}
                />
                <div>
                  <span className="text-sm font-medium text-foreground">Send to multiple sellers</span>
                  <p className="text-xs text-muted-foreground">Get competitive quotes from all verified sellers of this product</p>
                </div>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Additional Requirements</Label>
                <Textarea
                  placeholder="Any specific quality requirements, certifications, or other details..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                />
              </div>
              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-sm">
                <h4 className="font-semibold text-foreground">RFQ Summary</h4>
                <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                  <span>Product:</span><span className="text-foreground">{productName}</span>
                  <span>Quantity:</span><span className="text-foreground">{formData.quantity || "—"}</span>
                  <span>Packaging:</span><span className="text-foreground">{formData.packaging || "—"}</span>
                  <span>Timeline:</span><span className="text-foreground">{formData.deliveryTimeline || "—"}</span>
                  <span>Location:</span><span className="text-foreground">{formData.deliveryLocation || "—"}</span>
                  <span>Multi-seller:</span><span className="text-foreground">{formData.sendToMultiple ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={step === 0 ? onClose : () => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="bg-accent hover:bg-accent/90 text-primary">
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-primary">
                <Send className="h-4 w-4 mr-1" /> Submit RFQ
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
