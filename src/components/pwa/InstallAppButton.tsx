import { useState } from "react";
import { Download, Share, Plus, Smartphone } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { cn } from "@/lib/utils";

interface InstallAppButtonProps extends Omit<ButtonProps, "onClick"> {
  label?: string;
  iconOnly?: boolean;
  /** Always render (even on desktop browsers without install support) — opens the help dialog. */
  showAlways?: boolean;
}

export function InstallAppButton({
  label = "Install App",
  iconOnly = false,
  showAlways = false,
  className,
  size = "sm",
  ...rest
}: InstallAppButtonProps) {
  const { canInstall, showIOSHelp, isAvailable, isInstalled, promptInstall, isIOS } = useInstallPrompt();
  const [helpOpen, setHelpOpen] = useState(false);

  if (isInstalled) return null;
  if (!isAvailable && !showAlways) return null;

  const handleClick = async () => {
    if (canInstall) {
      const ok = await promptInstall();
      if (!ok) setHelpOpen(true);
      return;
    }
    setHelpOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        size={size}
        className={cn(
          "bg-accent text-primary hover:bg-accent/90 font-semibold",
          className,
        )}
        aria-label={label}
        {...rest}
      >
        <Download className={cn("h-4 w-4", !iconOnly && "mr-1.5")} />
        {!iconOnly && <span>{label}</span>}
      </Button>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-accent" /> Install MDDMA App
            </DialogTitle>
            <DialogDescription>
              Add the MDDMA Trade Hub to your home screen for quick, app-like access.
            </DialogDescription>
          </DialogHeader>

          {isIOS ? (
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold">1</span>
                <span>
                  Tap the <Share className="inline h-4 w-4 mx-1 align-text-bottom" /> <b>Share</b> button in Safari's bottom toolbar.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold">2</span>
                <span>
                  Scroll down and tap <Plus className="inline h-4 w-4 mx-1 align-text-bottom" /> <b>Add to Home Screen</b>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold">3</span>
                <span>Tap <b>Add</b> in the top-right corner. The MDDMA icon will appear on your home screen.</span>
              </li>
            </ol>
          ) : (
            <div className="space-y-4 text-sm">
              <p>
                <b>On Android (Chrome):</b> Open the browser menu (⋮) and tap{" "}
                <b>Install app</b> or <b>Add to Home screen</b>.
              </p>
              <p>
                <b>On Desktop (Chrome/Edge):</b> Look for the{" "}
                <Download className="inline h-4 w-4 mx-1 align-text-bottom" /> install icon in the address bar, or open the menu and choose{" "}
                <b>Install MDDMA</b>.
              </p>
              <p className="text-muted-foreground">
                If you don't see the option, your browser may not support installing this app yet.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
