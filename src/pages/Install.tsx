import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { Logo } from "@/components/brand/Logo";
import { Smartphone, Wifi, Zap, Home, Share, Plus, Download } from "lucide-react";

const benefits = [
  { icon: Home, title: "Home-Screen Icon", body: "Launch MDDMA with one tap, just like a native app." },
  { icon: Zap, title: "Faster Access", body: "Opens fullscreen — no browser bars, no distractions." },
  { icon: Wifi, title: "Reliable on the Go", body: "Optimised for spotty market-day connections." },
  { icon: Smartphone, title: "Works Everywhere", body: "Android, iOS, and desktop — one install link." },
];

export default function Install() {
  return (
    <Layout>
      <Seo title='Install the MDDMA App' description='Install MDDMA as a Progressive Web App on your phone or desktop for fast access to the trade hub.' path='/install' />
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-block rounded-2xl bg-primary-foreground/95 p-4 mb-6">
            <Logo variant="stacked" className="h-24 w-auto" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Install MDDMA Trade Hub</h1>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Add the trade hub to your phone's home screen for instant, app-like access to the directory, RFQs, and market signals.
          </p>
          <InstallAppButton size="lg" showAlways className="h-12 px-6 text-base" />
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border bg-card p-5">
              <b.icon className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-semibold mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-3 text-accent">Android (Chrome)</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
              <li>Tap the menu (⋮) in the top-right of Chrome.</li>
              <li>Choose <b className="text-foreground">Install app</b> or <b className="text-foreground">Add to Home screen</b>.</li>
              <li>Confirm to add the MDDMA icon to your home screen.</li>
            </ol>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-3 text-accent">iPhone / iPad (Safari)</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
              <li>Tap the <Share className="inline h-4 w-4 mx-1 align-text-bottom" /> Share button.</li>
              <li>Choose <Plus className="inline h-4 w-4 mx-1 align-text-bottom" /> <b className="text-foreground">Add to Home Screen</b>.</li>
              <li>Tap <b className="text-foreground">Add</b> in the top-right.</li>
            </ol>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-3 text-accent">Desktop (Chrome/Edge)</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
              <li>Look for the <Download className="inline h-4 w-4 mx-1 align-text-bottom" /> icon in the address bar.</li>
              <li>Click <b className="text-foreground">Install MDDMA</b>.</li>
              <li>Pin the launched app to your taskbar or dock.</li>
            </ol>
          </div>
        </div>
      </section>
    </Layout>
  );
}
