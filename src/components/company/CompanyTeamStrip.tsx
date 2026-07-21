import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyTeam } from "@/hooks/queries/useCompanyTeam";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·"
  );
}

const roleLabel: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export function CompanyTeamStrip({ companyId }: { companyId: string | undefined }) {
  const { data = [], isLoading } = useCompanyTeam(companyId);
  if (!companyId) return null;
  if (isLoading || data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-primary" aria-hidden />
          Team ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.map((m) => (
            <li key={m.user_id} className="flex items-center gap-3 rounded-lg border p-3">
              <Avatar className="h-10 w-10">
                {m.avatar_url ? <AvatarImage src={m.avatar_url} alt={m.full_name} /> : null}
                <AvatarFallback>{initials(m.full_name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{m.full_name}</div>
                <Badge variant="secondary" className="mt-1 text-[10px] font-medium uppercase tracking-wide">
                  {roleLabel[m.role] ?? m.role}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
