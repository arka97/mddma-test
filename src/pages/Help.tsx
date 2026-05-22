import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HomeFaq } from "@/components/home/HomeFaq";

const HELP_PHONE = "919833000000";
const HELP_MSG = encodeURIComponent("Hi MDDMA team, I need some help using the app.");

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp us",
    body: "Fastest way. Reply within business hours.",
    href: `https://wa.me/${HELP_PHONE}?text=${HELP_MSG}`,
    external: true,
    tone: "bg-success text-success-foreground",
  },
  {
    icon: Phone,
    title: "Call our office",
    body: "Mon–Sat, 10am–6pm IST.",
    href: `tel:+${HELP_PHONE}`,
    external: true,
    tone: "bg-primary text-primary-foreground",
  },
  {
    icon: Mail,
    title: "Email us",
    body: "We reply within one working day.",
    href: "mailto:help@mddma.org",
    external: true,
    tone: "bg-accent text-accent-foreground",
  },
];

const quickLinks = [
  { to: "/products", label: "How to find sellers" },
  { to: "/membership", label: "About membership plans" },
  { to: "/apply", label: "How to join MDDMA" },
  { to: "/account/rfqs", label: "Where my requests go" },
];

export default function Help() {
  return (
    <Layout>
      <Seo title="Help & Support — MDDMA" description="Get help using MDDMA. WhatsApp, call, or email our team in your language." path="/help" />

      <section className="bg-surface-cream py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="t-eyebrow mb-3 text-muted-foreground">We're here for you</p>
          <h1 className="font-display text-4xl text-foreground md:text-6xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Real people, in your language. No tickets, no jargon. Just message and we'll respond.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {channels.map(({ icon: Icon, title, body, href, tone }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[48px] flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-base font-semibold text-foreground">{title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{body}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Quick links</h2>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex min-h-[48px] items-center justify-between px-5 py-4 text-base text-foreground hover:bg-muted/60"
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HomeFaq />
    </Layout>
  );
}
