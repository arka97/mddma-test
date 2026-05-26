import { useAuth } from "@/contexts/AuthContext";

type Band = "high" | "medium" | "low";

function toBand(kg: number | null | undefined): Band | null {
  if (kg == null) return null;
  if (kg >= 1000) return "high";
  if (kg >= 200) return "medium";
  return "low";
}

const TONE: Record<Band, string> = {
  high: "bg-success/10 text-success",
  medium: "bg-warning/15 text-warning-foreground",
  low: "bg-danger/10 text-danger",
};

const LABEL: Record<Band, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function StockBand({ kg, exact = false }: { kg: number | null | undefined; exact?: boolean }) {
  const { hasRole } = useAuth();
  const band = toBand(kg);
  if (band == null) return null;
  const showExact = exact && (hasRole("paid_member") || hasRole("admin") || hasRole("broker"));
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE[band]}`}>
      {showExact && kg != null ? `${kg.toLocaleString()} kg ready` : `${LABEL[band]} stock`}
    </span>
  );
}
