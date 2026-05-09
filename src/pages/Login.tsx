import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { friendlyErrorMessage } from "@/lib/errors";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Min 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your full name").max(100);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("signin");

  const from = (location.state as { from?: string })?.from || "/dashboard";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const e1 = emailSchema.safeParse(email);
    const p1 = passwordSchema.safeParse(password);
    if (!e1.success || !p1.success) {
      toast({ title: "Invalid input", description: e1.success ? p1.error.errors[0].message : e1.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      console.error("[auth] sign-in", error);
      toast({ title: "Sign-in failed", description: friendlyErrorMessage(error, "Invalid email or password."), variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate(from, { replace: true });
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const fullName = form.get("fullName") as string;

    const checks = [
      nameSchema.safeParse(fullName),
      emailSchema.safeParse(email),
      passwordSchema.safeParse(password),
    ];
    const failed = checks.find((c) => !c.success);
    if (failed && !failed.success) {
      toast({ title: "Invalid input", description: failed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setIsLoading(false);

    if (error) {
      console.error("[auth] sign-up", error);
      toast({ title: "Sign-up failed", description: friendlyErrorMessage(error, "We couldn't create your account. Please try again."), variant: "destructive" });
    } else {
      toast({ title: "Account created", description: "You're now signed in." });
      navigate("/account/profile", { replace: true });
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      toast({ title: "Google sign-in failed", description: String(e), variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-card border-border">
              <CardHeader className="text-center">
                <Logo variant="mark" className="mx-auto mb-3 h-16 w-16" />
                <CardTitle className="text-2xl">MDDMA Member Portal</CardTitle>
                <CardDescription>Sign in or create your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGoogle} disabled={isLoading}>
                  <GoogleIcon /> <span className="ml-2">Continue with Google</span>
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or with email</span></div>
                </div>

                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Create Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="si-email">Email</Label>
                        <Input id="si-email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="si-password">Password</Label>
                        <div className="relative">
                          <Input id="si-password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="su-name">Full Name</Label>
                        <Input id="su-name" name="fullName" type="text" placeholder="Rahul Shah" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-email">Email</Label>
                        <Input id="su-email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-password">Password (min 8 chars)</Label>
                        <Input id="su-password" name="password" type="password" placeholder="••••••••" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                  By continuing, you agree to MDDMA's terms and privacy policy.
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
              New to MDDMA?{" "}
              <Link to="/apply" className="text-accent hover:underline font-medium">Apply for membership</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
