import type { Metadata } from "next";
import { PageHero } from "@/components/Bits";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call 07830 001306 or email info@mbplumber.co.uk for a free plumbing quote in Grantham.",
};

export default function ContactPage() {
  const cards = [
    { Icon: PhoneIcon, label: "Call us", value: SITE.phone, href: SITE.phoneHref },
    { Icon: MailIcon, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { Icon: PinIcon, label: "Covering", value: SITE.area, href: undefined },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's get it sorted" intro="Call, email or send a message below. Free quotes, and we'll get back to you quickly." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {cards.map(({ Icon, label, value, href }) => {
            const inner = (
              <>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-black">
                  <Icon className="h-7 w-7" />
                </span>
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-white/50">{label}</span>
                  <span className="block text-lg font-extrabold sm:text-xl">{value}</span>
                </span>
              </>
            );
            const cls = "flex items-center gap-5 rounded-2xl border border-white/10 bg-ink-soft p-5";
            return href ? (
              <a key={label} href={href} className={`${cls} transition-colors hover:border-brand`}>
                {inner}
              </a>
            ) : (
              <div key={label} className={cls}>
                {inner}
              </div>
            );
          })}
          <p className="px-1 pt-2 text-sm font-medium text-white/60">
            {SITE.yearsExperience} years of plumbing experience. {SITE.tagline}
          </p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
