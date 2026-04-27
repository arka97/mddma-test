import { friendlyErrorMessage } from "@/lib/errors";
// SKU-style variants under a parent product (v3.1.1).
// Sellers CRUD their variants; admins inherit via RLS.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, Save, X, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Variant {
  id: string;
  product_id: string;
  sku: string | null;
  name: string;
  grade: string | null;
  packaging: string | null;
  moq: number | null;
  moq_unit: string | null;
  price_min: number | null;
  price_max: number | null;
  price_unit: string | null;
  stock_band: "high" | "medium" | "low" | "on_order" | null;
  lead_time_days: number | null;
  is_active: boolean;
}

const blank = (product_id: string): Partial<Variant> => ({
  product_id, sku: "", name: "", grade: "", packaging: "", moq: null, moq_unit: "kg",
  price_min: null, price_max: null, price_unit: "kg", stock_band: "medium",
  lead_time_days: null, is_active: true,
});

export function VariantManager({ productId, productName }: { productId: string; productName: string }) {
  const { toast } = useToast();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Variant> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setVariants((data ?? []) as Variant[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [productId]);

  const save = async () => {
    if (!editing?.name?.trim()) {
      toast({ title: "Variant name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      product_id: productId,
      sku: editing.sku?.trim() || null,
      name: editing.name.trim(),
      grade: editing.grade?.trim() || null,
      packaging: editing.packaging?.trim() || null,
      moq: editing.moq ?? null,
      moq_unit: editing.moq_unit ?? "kg",
      price_min: editing.price_min ?? null,
      price_max: editing.price_max ?? null,
      price_unit: editing.price_unit ?? "kg",
      stock_band: (editing.stock_band ?? "medium") as Variant["stock_band"],
      lead_time_days: editing.lead_time_days ?? null,
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("product_variants").update(payload).eq("id", editing.id)
      : await supabase.from("product_variants").insert(payload);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: friendlyErrorMessage(error), variant: "destructive" }); return; }
    toast({ title: editing.id ? "Variant updated" : "Variant added" });
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    const { error } = await supabase.from("product_variants").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", variant: "destructive" });
    else { toast({ title: "Variant removed" }); load(); }
  };

  const toggleActive = async (v: Variant) => {
    const { error } = await supabase.from("product_variants").update({ is_active: !v.is_active }).eq("id", v.id);
    if (error) toast({ title: "Update failed", variant: "destructive" }); else load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Layers className="h-4 w-4 text-accent" /> Variants of {productName}</h3>
          <p className="text-xs text-muted-foreground">SKU rows let buyers request specific grades, packaging, and MOQs.</p>
        </div>
        {!editing && (
          <Button size="sm" onClick={() => setEditing(blank(productId))}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add variant
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <>
          {variants.length === 0 && !editing && (
            <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">
              No variants yet. Add at least one (e.g. "1121 Steam · 25kg PP · MOQ 5 MT").
            </CardContent></Card>
          )}

          <div className="space-y-2">
            {variants.map((v) => (
              <Card key={v.id} className={v.is_active ? "" : "opacity-60"}>
                <CardContent className="p-3 flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{v.name}</span>
                      {v.sku && <Badge variant="outline" className="font-mono text-[10px]">{v.sku}</Badge>}
                      {!v.is_active && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                      {v.grade && <span>Grade: {v.grade}</span>}
                      {v.packaging && <span>· {v.packaging}</span>}
                      {v.moq && <span>· MOQ {v.moq} {v.moq_unit}</span>}
                      {v.lead_time_days && <span>· {v.lead_time_days}d lead</span>}
                    </div>
                    {(v.price_min || v.price_max) && (
                      <div className="text-xs mt-1">
                        ₹{v.price_min ?? "?"} – ₹{v.price_max ?? "?"} / {v.price_unit}
                        <Badge variant="secondary" className="ml-2 text-[10px]">{v.stock_band}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEditing(v)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => toggleActive(v)} title={v.is_active ? "Deactivate" : "Activate"}>
                      {v.is_active ? "Off" : "On"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(v.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editing && (
            <Card className="border-accent/40">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{editing.id ? "Edit variant" : "New variant"}</p>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Name *</Label><Input maxLength={120} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="1121 Steam · 25kg PP" /></div>
                  <div><Label>SKU code</Label><Input maxLength={40} value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} placeholder="BAS-1121-25" /></div>
                  <div><Label>Grade</Label><Input maxLength={60} value={editing.grade ?? ""} onChange={(e) => setEditing({ ...editing, grade: e.target.value })} placeholder="Premium / A+" /></div>
                  <div><Label>Packaging</Label><Input maxLength={60} value={editing.packaging ?? ""} onChange={(e) => setEditing({ ...editing, packaging: e.target.value })} placeholder="25kg PP / Jute / Bulk" /></div>
                  <div><Label>MOQ</Label><Input type="number" step="0.01" value={editing.moq ?? ""} onChange={(e) => setEditing({ ...editing, moq: e.target.value ? parseFloat(e.target.value) : null })} /></div>
                  <div><Label>MOQ unit</Label><Input maxLength={20} value={editing.moq_unit ?? "kg"} onChange={(e) => setEditing({ ...editing, moq_unit: e.target.value })} /></div>
                  <div><Label>Min price (₹)</Label><Input type="number" step="0.01" value={editing.price_min ?? ""} onChange={(e) => setEditing({ ...editing, price_min: e.target.value ? parseFloat(e.target.value) : null })} /></div>
                  <div><Label>Max price (₹)</Label><Input type="number" step="0.01" value={editing.price_max ?? ""} onChange={(e) => setEditing({ ...editing, price_max: e.target.value ? parseFloat(e.target.value) : null })} /></div>
                  <div><Label>Price unit</Label><Input maxLength={20} value={editing.price_unit ?? "kg"} onChange={(e) => setEditing({ ...editing, price_unit: e.target.value })} /></div>
                  <div><Label>Lead time (days)</Label><Input type="number" value={editing.lead_time_days ?? ""} onChange={(e) => setEditing({ ...editing, lead_time_days: e.target.value ? parseInt(e.target.value) : null })} /></div>
                  <div>
                    <Label>Stock band</Label>
                    <Select value={editing.stock_band ?? "medium"} onValueChange={(v) => setEditing({ ...editing, stock_band: v as Variant["stock_band"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="on_order">On order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                  <Button size="sm" onClick={save} disabled={saving}>
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                    Save variant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
