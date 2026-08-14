import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ChromeVisibilityProvider } from "@/contexts/ChromeVisibilityContext";

import { DocAuthProvider } from "@/components/PasswordGate";
import { queryClient } from "@/lib/queryClient";
import ScrollToTop from "@/components/ScrollToTop";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <RoleProvider>
              <ChromeVisibilityProvider>
                <DocAuthProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </DocAuthProvider>
              </ChromeVisibilityProvider>
            </RoleProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
