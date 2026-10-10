import type { Metadata } from "next";
import { PageHero } from "@/components/Bits";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { phoneHref } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export async function generateMetadata(): Promise<Metadata> {
  const { business } = await getContent();
  return {
    title: "Contact",
    description: `Call ${business.phone} or email ${business.email} for a free plumbing quote in Grantham.`,
  };
}

export default async function ContactPage() {
  const { business, contact, services } = await getContent();
  const cards = [
    { Icon: PhoneIcon, label: "Call us", value: business.phone, href: phoneHref(business.phone) },
    { Icon: MailIcon, label: "Email", value: business.email, href: `mailto:${business.email}` },
    { Icon: PinIcon, label: "Covering", value: business.area, href: undefined },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title={contact.title} intro={contact.intro} />
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
            {business.yearsExperience} years of plumbing experience. {business.tagline}
          </p>
        </div>
        <ContactForm email={business.email} phone={business.phone} services={services.items.map((s) => s.title)} />
      </section>
    </>
  );
}
