import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    const to = "grievance@mddma.org";
    const s = encodeURIComponent(subject || "Enquiry via mddma.org");
    window.location.href = `mailto:${to}?subject=${s}&body=${body}`;
  };

  return (
    <Layout>
      <Seo
        title="Contact MDDMA — Secretariat, Grievance & Trade Enquiries"
        subtitle="Reach the Mumbai Dry Fruits & Dates Merchants Association secretariat at APMC Vashi. Phone, email, grievance officer and office hours."
        path="/contact"
      />

      <div className="container mx-auto max-w-4xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8">
        <PageHeader
          eyebrow="Get in touch"
          title="Contact the association"
          subtitle="Secretariat enquiries, grievance and dispute redressal, membership questions and press."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">Association office</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--gold-dark))]" />
                <span className="leading-relaxed text-foreground/90">
                  C/o E-29, APMC Market-I, Phase-II, Sector-19,<br />
                  Masala Market, Navi Mumbai,<br />
                  Maharashtra 400705, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0 text-[hsl(var(--gold-dark))]" />
                <a href="tel:+912227650827" className="font-medium text-foreground hover:text-accent">
                  +91 22 2765 0827
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0 text-[hsl(var(--gold-dark))]" />
                <a href="mailto:grievance@mddma.org" className="font-medium text-foreground hover:text-accent">
                  grievance@mddma.org
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--gold-dark))]" />
                <div className="text-foreground/90">
                  <div>Mon–Sat: 10:00 — 18:00 IST</div>
                  <div className="text-xs text-muted-foreground">Closed Sundays and market holidays</div>
                </div>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/8 p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-[hsl(var(--gold-dark))]" />
                <div className="text-xs leading-relaxed text-foreground/90">
                  <p className="font-semibold">Grievance & Data Protection Officer</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Aditya Parmar · <a href="mailto:grievance@mddma.org" className="hover:text-accent">grievance@mddma.org</a>
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Acknowledgement within 3 working days · resolution target 30 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">Send a message</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Opens your email client with the message pre-filled. For grievances please include your firm name and GSTIN.
            </p>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="c-name" className="text-xs">Your name</Label>
                <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="c-email" className="text-xs">Email</Label>
                <Input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="c-subject" className="text-xs">Subject</Label>
                <Input id="c-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Membership / Grievance / Media / Other" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="c-message" className="text-xs">Message</Label>
                <Textarea id="c-message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Open email <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
