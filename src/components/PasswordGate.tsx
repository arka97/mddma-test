import { useState, createContext, useContext, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck } from "lucide-react";

const CORRECT_PASSWORD = "271195";

const AuthContext = createContext(false);
const AuthSetContext = createContext<(() => void) | null>(null);

export const useDocAuth = () => useContext(AuthContext);

export function DocAuthProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <AuthContext.Provider value={unlocked}>
      <AuthSetContext.Provider value={() => setUnlocked(true)}>
        {children}
      </AuthSetContext.Provider>
    </AuthContext.Provider>
  );
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const unlocked = useContext(AuthContext);
  const unlock = useContext(AuthSetContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      unlock?.();
      setError(false);
    } else {
      setError(true);
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
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-center text-lg"
            />
            {error && <p className="text-destructive text-sm">Incorrect password. Try again.</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold">
              <ShieldCheck className="h-4 w-4 mr-2" /> Unlock Documents
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
