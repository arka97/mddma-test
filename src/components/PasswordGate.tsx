import { useState, createContext, useContext, useCallback, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DocAuthValue {
  unlocked: boolean;
  /** Held in memory only — never persisted. Used to fetch internal docs from the edge function. */
  password: string | null;
}

const AuthContext = createContext<DocAuthValue>({ unlocked: false, password: null });
const AuthSetContext = createContext<((pw: string) => void) | null>(null);

export const useDocAuth = () => useContext(AuthContext).unlocked;
export const useDocAuthState = () => useContext(AuthContext);

export function DocAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DocAuthValue>({ unlocked: false, password: null });
  const unlock = useCallback((pw: string) => setState({ unlocked: true, password: pw }), []);
  return (
    <AuthContext.Provider value={state}>
      <AuthSetContext.Provider value={unlock}>{children}</AuthSetContext.Provider>
    </AuthContext.Provider>
  );
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const { unlocked } = useContext(AuthContext);
  const unlock = useContext(AuthSetContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length > 200) { setError(true); return; }
    setBusy(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("verify-doc-password", {
        body: { password },
      });
      if (!fnErr && (data as any)?.ok) {
        unlock?.(password);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <Card className="w-full max-w-md bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
        <CardContent className="p-8 space-y-6 text-center">
          <Lock className="h-12 w-12 text-accent mx-auto" />
          <div>
            <h1 className="text-2xl font-bold">Document Vault</h1>
            <p className="text-sm text-primary-foreground/60 mt-1">Enter password to access project documents</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              maxLength={200}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-center text-lg"
            />
            {error && <p className="text-destructive text-sm">Incorrect password. Try again.</p>}
            <Button type="submit" disabled={busy} variant="accent" className="w-full">
              {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Unlock Documents
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
