import Link from "next/link";
import { phoneHref } from "@/lib/content";
import { getContent, getLastUpdated } from "@/lib/content-server";
import { NAV, SITE } from "@/lib/site";
import { MailIcon, PhoneIcon, PinIcon } from "./Icons";

export async function Footer() {
  const [{ business, services }, updated] = await Promise.all([getContent(), getLastUpdated()]);
  return (
    <footer className="border-t-4 border-brand bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MB Plumber logo" width={88} height={88} className="mb-4 h-20 w-20 rounded-full" />
          <p className="text-sm font-semibold leading-relaxed text-white/70">{business.tagline}</p>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Pages</h3>
          <ul className="space-y-2 text-sm font-semibold">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/75 hover:text-brand">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Services</h3>
          <ul className="space-y-2 text-sm font-semibold">
            {services.items.map((s) => (
              <li key={s.slug}>
                <Link href="/services" className="text-white/75 hover:text-brand">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Get in touch</h3>
          <ul className="space-y-3 text-sm font-semibold">
            <li>
              <a href={phoneHref(business.phone)} className="flex items-center gap-2 text-white hover:text-brand">
                <PhoneIcon className="h-4 w-4 text-brand-red" /> {business.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-white hover:text-brand">
                <MailIcon className="h-4 w-4 text-brand-red" /> {business.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-white/75">
              <PinIcon className="h-4 w-4 text-brand-red" /> {business.area}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs font-semibold text-white/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        <span className="mx-2">·</span>
        <a href={SITE.social[0]} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
          Facebook
        </a>
        <span className="mx-2">·</span>
        Site last updated{" "}
        <time dateTime={updated}>{new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
      </div>
    </footer>
  );
}
