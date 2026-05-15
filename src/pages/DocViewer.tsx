import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoc, isInternalSlug, DOCS } from "@/content/docs/_meta";
import { DocPage } from "@/components/docs/DocPage";
import { useDocAuthState } from "@/components/PasswordGate";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const DocViewer = () => {
  const { slug = "" } = useParams();
  const meta = DOCS.find((d) => d.slug === slug);
  const publicDoc = getDoc(slug);
  const internal = isInternalSlug(slug);
  const { password } = useDocAuthState();
  const [internalSource, setInternalSource] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!internal || !meta || !password) return;
    let cancelled = false;
    (async () => {
      const { data, error: fnErr } = await supabase.functions.invoke("get-internal-doc", {
        body: { password, slug },
      });
      if (cancelled) return;
      if (!fnErr && (data as any)?.ok && typeof (data as any).source === "string") {
        setInternalSource((data as any).source);
      } else {
        setError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [internal, meta, password, slug]);

  if (!meta) return <Navigate to="/documents" replace />;

  if (publicDoc) return <DocPage meta={publicDoc.meta} source={publicDoc.source} />;

  if (internal) {
    if (error) {
      return (
        <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center px-6">
          <p className="text-sm text-primary-foreground/70">Could not load this internal document. Please re-enter the password.</p>
        </div>
      );
    }
    if (!internalSource) {
      return (
        <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      );
    }
    return <DocPage meta={meta} source={internalSource} />;
  }

  return <Navigate to="/documents" replace />;
};

export default DocViewer;
