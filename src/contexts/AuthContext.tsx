import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export type AppRole = "admin" | "broker" | "paid_member" | "free_member";
export type CompanyMemberRole = "owner" | "admin" | "editor" | "viewer";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  designation: string | null;
  avatar_url: string | null;
  bio: string | null;
  company_name?: string | null;
  gstin?: string | null;
  verification_tier?: "unverified" | "email" | "company" | "gst";
  buyer_reputation_score?: number;
  is_broker?: boolean;
  email_verified_at?: string | null;
  company_verified_at?: string | null;
  gst_verified_at?: string | null;
}

interface CompanyLite {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  country: string | null;
  is_verified: boolean;
  is_hidden: boolean;
  review_status: "pending" | "approved" | "rejected";
}

export interface CompanyMembership {
  company: CompanyLite;
  role: CompanyMemberRole;
}

const ACTIVE_COMPANY_KEY = "gbaug:active-company-id";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  /** Currently-active company (auto-selected or user-switched). */
  company: CompanyLite | null;
  /** All companies the signed-in user belongs to (owner/admin/editor/viewer). */
  memberships: CompanyMembership[];
  activeMembershipRole: CompanyMemberRole | null;
  setActiveCompany: (companyId: string) => void;
  roles: AppRole[];
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<CompanyMembership[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (uid: string) => {
    const [{ data: prof }, { data: memberRows }, { data: rs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase
        .from("company_members")
        .select(
          "role, companies!inner(id,slug,name,logo_url,country,is_verified,is_hidden,review_status)",
        )
        .eq("user_id", uid),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile(prof as Profile | null);

    const list: CompanyMembership[] = ((memberRows ?? []) as Array<{
      role: CompanyMemberRole;
      companies: CompanyLite | null;
    }>)
      .filter((row) => row.companies)
      .map((row) => ({ role: row.role, company: row.companies as CompanyLite }))
      // Sort so owners appear first, then by name
      .sort((a, b) => {
        if (a.role === "owner" && b.role !== "owner") return -1;
        if (b.role === "owner" && a.role !== "owner") return 1;
        return a.company.name.localeCompare(b.company.name);
      });
    setMemberships(list);

    const stored = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_COMPANY_KEY) : null;
    const initial =
      list.find((m) => m.company.id === stored)?.company.id ?? list[0]?.company.id ?? null;
    setActiveCompanyIdState(initial);

    setRoles((rs ?? []).map((r: { role: AppRole }) => r.role));
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => loadUserData(sess.user.id), 0);
      } else {
        setProfile(null);
        setMemberships([]);
        setActiveCompanyIdState(null);
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) loadUserData(sess.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setActiveCompany = useCallback(
    (companyId: string) => {
      const match = memberships.find((m) => m.company.id === companyId);
      if (!match) return;
      setActiveCompanyIdState(companyId);
      if (typeof window !== "undefined") {
        localStorage.setItem(ACTIVE_COMPANY_KEY, companyId);
      }
    },
    [memberships],
  );

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { full_name: fullName } },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/`,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refresh = async () => {
    if (user) await loadUserData(user.id);
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  const activeMembership =
    memberships.find((m) => m.company.id === activeCompanyId) ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        company: activeMembership?.company ?? null,
        memberships,
        activeMembershipRole: activeMembership?.role ?? null,
        setActiveCompany,
        roles,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        refresh,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
