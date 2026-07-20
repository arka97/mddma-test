import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyErrorMessage } from "@/lib/errors";
import { Logo } from "@/components/brand/Logo";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Min 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your full name").max(100);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

  const stateFrom = (location.state as { from?: string } | null)?.from;
  const queryFrom = new URLSearchParams(location.search).get("next");
  const from = stateFrom || queryFrom || "/dashboard";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);
    if (!emailResult.success || !passwordResult.success) {
      toast({
        title: "Invalid input",
        description: emailResult.success
          ? passwordResult.error.errors[0].message
          : emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      console.error("[auth] sign-in", error);
      toast({
        title: "Sign-in failed",
        description: friendlyErrorMessage(error, "Invalid email or password."),
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome back" });
      navigate(from, { replace: true });
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const fullName = form.get("fullName") as string;

    const checks = [
      nameSchema.safeParse(fullName),
      emailSchema.safeParse(email),
      passwordSchema.safeParse(password),
    ];
    const failed = checks.find((check) => !check.success);
    if (failed && !failed.success) {
      toast({ title: "Invalid input", description: failed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setIsLoading(false);

    if (error) {
      console.error("[auth] sign-up", error);
      toast({
        title: "Sign-up failed",
        description: friendlyErrorMessage(error, "We couldn't create your account. Please try again."),
        variant: "destructive",
      });
    } else {
      toast({ title: "Account created", description: "Complete your profile, then register an existing business to trade." });
      navigate("/account/profile", { replace: true });
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Sign in to G-BAU-G"
        description="Access the verified G-BAU-G food-trade business network."
        path="/login"
        noindex
      />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <Card className="border-border bg-card">
              <CardHeader className="text-center">
                <Logo variant="mark" className="mx-auto mb-3 h-16 w-16" />
                <CardTitle className="text-2xl">Enter the G-BAU-G network</CardTitle>
                <CardDescription>
                  Create a personal account or sign in. Business verification is a separate step.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="mb-4 w-full" onClick={handleGoogle} disabled={isLoading}>
                  <GoogleIcon /> <span className="ml-2">Continue with Google</span>
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or with email</span></div>
                </div>

                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign in</TabsTrigger>
                    <TabsTrigger value="signup">Create account</TabsTrigger>
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
                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="mr-2 h-4 w-4" /> Sign in</>}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="su-name">Full name</Label>
                        <Input id="su-name" name="fullName" type="text" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-email">Email</Label>
                        <Input id="su-email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="su-password">Password (minimum 8 characters)</Label>
                        <Input id="su-password" name="password" type="password" placeholder="••••••••" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                  By continuing, you agree to G-BAU-G's terms and privacy policy.
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Represent an existing food-trade business?{" "}
              <Link to="/apply" className="font-medium text-accent hover:underline">Start business verification</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
