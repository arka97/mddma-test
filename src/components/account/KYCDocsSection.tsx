import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DOC_HELP,
  DOC_LABEL,
  type KycDocType,
  type KycSubmission,
  getSignedKycUrl,
  insertKycSubmission,
  latestByDocType,
  listKycSubmissions,
  statusTone,
  uploadKycFile,
  validateDocNumber,
} from "@/lib/kyc";

const DOC_ORDER: KycDocType[] = ["gst", "pan", "fssai"];

interface RowState {
  file: File | null;
  docNumber: string;
  saving: boolean;
  err: string | null;
}

const blankRow = (): RowState => ({
  file: null,
  docNumber: "",
  saving: false,
  err: null,
});

export function KYCDocsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<Record<KycDocType, RowState>>({
    gst: blankRow(),
    pan: blankRow(),
    fssai: blankRow(),
  });
  const inputRefs = useRef<Record<KycDocType, HTMLInputElement | null>>({
    gst: null,
    pan: null,
    fssai: null,
  });

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    setRows(await listKycSubmissions(user.id));
    setLoading(false);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const latest = useMemo(() => latestByDocType(rows), [rows]);

  if (!user) return null;

  const updateRow = (doc: KycDocType, patch: Partial<RowState>) =>
    setState((s) => ({ ...s, [doc]: { ...s[doc], ...patch } }));

  const handleSubmit = async (doc: KycDocType) => {
    if (!user) return;
    const r = state[doc];
    updateRow(doc, { err: null });

    if (!r.file) {
      updateRow(doc, { err: "Choose a file" });
      return;
    }
    const docErr = validateDocNumber(doc, r.docNumber);
    if (docErr) return updateRow(doc, { err: docErr });

    updateRow(doc, { saving: true });
    const upload = await uploadKycFile(user.id, doc, r.file);
    if (!upload.path) {
      updateRow(doc, { saving: false, err: upload.error ?? "Upload failed" });
      return;
    }

    const insert = await insertKycSubmission({
      userId: user.id,
      docType: doc,
      docNumber: r.docNumber.trim().toUpperCase(),
      filePath: upload.path,
    });
    if (insert.error) {
      updateRow(doc, { saving: false, err: insert.error.message });
      return;
    }

    toast({ title: `${DOC_LABEL[doc]} submitted`, description: "Pending admin review." });
    setState((s) => ({ ...s, [doc]: blankRow() }));
    if (inputRefs.current[doc]) inputRefs.current[doc]!.value = "";
    reload();
  };

  const openDoc = async (path: string) => {
    const url = await getSignedKycUrl(path);
    if (!url) {
      toast({ title: "Link expired", description: "Please try again.", variant: "destructive" });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const approvedCount = DOC_ORDER.filter((d) => latest[d]?.status === "approved").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent" /> KYC Documents</span>
          <span className="text-sm font-normal text-muted-foreground">{approvedCount}/4 approved</span>
        </CardTitle>
        <CardDescription>
          Upload firm KYC. Each document is reviewed by MDDMA admin within 24h. Files are stored privately and only visible to you and admin reviewers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your submissions…
          </div>
        )}

        {DOC_ORDER.map((doc) => {
          const cur = latest[doc];
          const tone = statusTone(cur?.status);
          const r = state[doc];
          const locked = cur?.status === "pending" || cur?.status === "approved";
          return (
            <div key={doc} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{DOC_LABEL[doc]}</h3>
                    <Badge variant="outline" className={tone.className}>{tone.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{DOC_HELP[doc]}</p>
                </div>
                {cur && (
                  <Button size="sm" variant="ghost" onClick={() => openDoc(cur.file_path)}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                )}
              </div>

              {cur?.status === "rejected" && cur.rejection_reason && (
                <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-2 text-xs text-red-900">
                  <CircleAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Rejected:</span> {cur.rejection_reason}. Re-submit below.</span>
                </div>
              )}
              {cur?.status === "approved" && (
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-900">
                  <CheckCircle2 className="h-4 w-4" />
                  Approved on {cur.reviewed_at ? new Date(cur.reviewed_at).toLocaleDateString("en-IN") : "—"}
                </div>
              )}

              {!locked && (
                <div className="space-y-3">
                  {doc === "bank" ? (
                    <div className="grid sm:grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`${doc}-holder`} className="text-xs">Account Holder</Label>
                        <Input id={`${doc}-holder`} value={r.bankHolder} onChange={(e) => updateRow(doc, { bankHolder: e.target.value })} placeholder="As per cheque" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${doc}-ifsc`} className="text-xs">IFSC</Label>
                        <Input id={`${doc}-ifsc`} maxLength={11} value={r.bankIfsc} onChange={(e) => updateRow(doc, { bankIfsc: e.target.value.toUpperCase() })} placeholder="HDFC0001234" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${doc}-last4`} className="text-xs">Last 4 of A/C</Label>
                        <Input id={`${doc}-last4`} maxLength={4} value={r.bankLast4} onChange={(e) => updateRow(doc, { bankLast4: e.target.value.replace(/[^0-9]/g, "") })} placeholder="1234" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label htmlFor={`${doc}-num`} className="text-xs">
                        {doc === "gst" ? "GSTIN" : doc === "pan" ? "PAN Number" : "FSSAI License Number"}
                      </Label>
                      <Input
                        id={`${doc}-num`}
                        value={r.docNumber}
                        onChange={(e) => updateRow(doc, { docNumber: e.target.value.toUpperCase() })}
                        maxLength={doc === "fssai" ? 14 : doc === "pan" ? 10 : 15}
                        placeholder={doc === "gst" ? "27AAAPL1234C1Z5" : doc === "pan" ? "AAAPL1234C" : "10012345678901"}
                      />
                    </div>
                  )}

                  <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                    <Input
                      type="file"
                      ref={(el) => (inputRefs.current[doc] = el)}
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => updateRow(doc, { file: e.target.files?.[0] ?? null, err: null })}
                    />
                    <Button onClick={() => handleSubmit(doc)} disabled={r.saving} className="bg-accent hover:bg-accent/90 text-primary font-semibold">
                      {r.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-3.5 w-3.5 mr-1" /> Submit</>}
                    </Button>
                  </div>

                  {r.err && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <CircleAlert className="h-3.5 w-3.5" /> {r.err}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG or WEBP · max 8 MB.</p>
                </div>
              )}
            </div>
          );
        })}

        <p className="text-[11px] text-muted-foreground">
          MDDMA stores your KYC documents in a private bucket. Direct links are not publicly browsable; only you and MDDMA's admin reviewers can open them via short-lived signed URLs.
        </p>
      </CardContent>
    </Card>
  );
}

export default KYCDocsSection;
