import { useState } from "react";
import { Download, Share, Plus, Smartphone, ExternalLink, Copy, Check } from "lucide-react";
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
  /** Kept for backward compatibility — button now always renders unless app is already installed. */
  showAlways?: boolean;
}

type DialogMode = "ios-safari" | "ios-other" | "android" | "in-app" | "desktop";

export function InstallAppButton({
  label = "Install App",
  iconOnly = false,
  className,
  size = "sm",
  ...rest
}: InstallAppButtonProps) {
  const { canInstall, isIOS, isIOSSafari, isAndroid, isInAppBrowser, isInstalled, promptInstall } =
    useInstallPrompt();
  const [helpOpen, setHelpOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isInstalled) return null;

  const resolveMode = (): DialogMode => {
    if (isInAppBrowser) return "in-app";
    if (isIOS) return isIOSSafari ? "ios-safari" : "ios-other";
    if (isAndroid) return "android";
    return "desktop";
  };

  const handleClick = async () => {
    if (canInstall) {
      const ok = await promptInstall();
      if (ok) return;
      // User dismissed or prompt failed — fall through to instructions.
    }
    setHelpOpen(true);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const mode = resolveMode();

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        size={size}
        className={cn(
          "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold",
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

          {mode === "ios-safari" && (
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Step n={1} />
                <span>
                  Tap the <Share className="inline h-4 w-4 mx-1 align-text-bottom" />{" "}
                  <b>Share</b> button in Safari's bottom toolbar.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Step n={2} />
                <span>
                  Scroll down and tap <Plus className="inline h-4 w-4 mx-1 align-text-bottom" />{" "}
                  <b>Add to Home Screen</b>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Step n={3} />
                <span>
                  Tap <b>Add</b> in the top-right. The MDDMA icon appears on your home screen.
                </span>
              </li>
            </ol>
          )}

          {mode === "ios-other" && (
            <div className="space-y-3 text-sm">
              <p>
                On iPhone &amp; iPad, <b>Add to Home Screen only works in Safari</b>. You're
                currently using a different browser.
              </p>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Copy the link below.</li>
                <li>Open <b className="text-foreground">Safari</b> and paste it into the address bar.</li>
                <li>
                  Tap <Share className="inline h-4 w-4 mx-1 align-text-bottom" /> <b>Share</b> →{" "}
                  <Plus className="inline h-4 w-4 mx-1 align-text-bottom" />{" "}
                  <b>Add to Home Screen</b>.
                </li>
              </ol>
              <Button onClick={copyUrl} variant="outline" className="w-full" size="sm">
                {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? "Copied!" : "Copy site link"}
              </Button>
            </div>
          )}

          {mode === "android" && (
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Step n={1} />
                <span>
                  Tap the menu (<b>⋮</b>) in the top-right of Chrome.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Step n={2} />
                <span>
                  Choose <b>Install app</b> or <b>Add to Home screen</b>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Step n={3} />
                <span>Confirm to add the MDDMA icon to your home screen.</span>
              </li>
            </ol>
          )}

          {mode === "in-app" && (
            <div className="space-y-3 text-sm">
              <p>
                You're viewing this inside an in-app browser (Instagram, Facebook, LinkedIn,
                WhatsApp, etc.) which <b>cannot install apps</b>.
              </p>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Tap the menu (<b>⋯</b> or <b>⋮</b>) in this browser.</li>
                <li>
                  Choose <b className="text-foreground">"Open in Safari"</b> (iPhone) or{" "}
                  <b className="text-foreground">"Open in Chrome"</b> (Android).
                </li>
                <li>Then tap Install App again.</li>
              </ol>
              <Button onClick={copyUrl} variant="outline" className="w-full" size="sm">
                {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? "Copied!" : "Copy site link"}
              </Button>
            </div>
          )}

          {mode === "desktop" && (
            <div className="space-y-3 text-sm">
              <p>
                <b>Chrome / Edge:</b> Look for the{" "}
                <Download className="inline h-4 w-4 mx-1 align-text-bottom" /> install icon in the
                address bar, or open the menu and choose <b>Install MDDMA</b>.
              </p>
              <p>
                <b>Other browsers:</b> Open this site in Chrome or Edge to install it as an app.
              </p>
              <p className="text-muted-foreground inline-flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                On mobile? Open this URL on your phone for the home-screen install option.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
      {n}
    </span>
  );
}
