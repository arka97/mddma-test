import { useState } from "react";
import { ComposeSheet } from "@/components/market/ComposeSheet";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPosted?: () => void;
}

// Thin wrapper around ComposeSheet so any surface can open the same composer.
export function PostComposer({ open, onOpenChange, onPosted }: Props) {
  const { role } = useRole();
  const { user } = useAuth();
  const canPostAnonymous = !!user && (role === "paid_member" || role === "broker" || role === "admin");
  return (
    <ComposeSheet
      open={open}
      onOpenChange={(v) => { onOpenChange(v); if (!v && onPosted) onPosted(); }}
      canPostAnonymous={canPostAnonymous}
    />
  );
}

export function useComposer() {
  const [open, setOpen] = useState(false);
  return { open, setOpen, openComposer: () => setOpen(true) };
}
