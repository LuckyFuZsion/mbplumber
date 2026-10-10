"use client";

import type { ReviewItem, Service, SiteContent } from "@/lib/content";
import { SERVICE_ICONS } from "@/lib/content";
import { useConfirm } from "./Confirm";
import { Card, Field, fieldClass, MiniButton, move, removeAt, SectionShell, setAt, useSectionEditor } from "./ui";

type Props<K extends keyof SiteContent> = { value: SiteContent[K]; customised: boolean };

export function BusinessEditor({ value, customised }: Props<"business">) {
  const ed = useSectionEditor("business", value, customised);
  const d = ed.draft;
  const set = (p: Partial<typeof d>) => ed.setDraft({ ...d, ...p });
  return (
    <SectionShell title="Business details" help="Shown in the header, footer, contact page and in Google's business information." editor={ed}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone number" value={d.phone} onChange={(v) => set({ phone: v })} hint="Used for the Call buttons too." />
        <Field label="Email address" value={d.email} onChange={(v) => set({ email: v })} type="email" />
        <Field label="Area covered" value={d.area} onChange={(v) => set({ area: v })} />
        <Field label="Years of experience" value={d.yearsExperience} onChange={(v) => set({ yearsExperience: v })} hint="e.g. 20+" />
      </div>
      <Field label="Tagline" value={d.tagline} onChange={(v) => set({ tagline: v })} hint="Shown in the footer and when the site is shared." />
    </SectionShell>
  );
}

export function HomeEditor({ value, customised }: Props<"home">) {
  const ed = useSectionEditor("home", value, customised);
  const ask = useConfirm();
  const d = ed.draft;
  const set = (p: Partial<typeof d>) => ed.setDraft({ ...d, ...p });
  return (
    <SectionShell title="Home page" help="The wording on the home page. Photos on the home page come from your Projects (the first two)." editor={ed}>
      <Field label="Small line above the headline" value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <Field label="Headline" value={d.title} onChange={(v) => set({ title: v })} />
      <Field label="Intro paragraph" value={d.intro} onChange={(v) => set({ intro: v })} textarea rows={4} />

      <div>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-white/60">Highlights strip</h3>
        <div className="space-y-3">
          {d.stats.map((s, i) => (
            <Card
              key={i}
              actions={
                <>
                  <MiniButton onClick={() => set({ stats: move(d.stats, i, -1) })} disabled={i === 0}>↑</MiniButton>
                  <MiniButton onClick={() => set({ stats: move(d.stats, i, 1) })} disabled={i === d.stats.length - 1}>↓</MiniButton>
                  <MiniButton
                    danger
                    onClick={async () =>
                      (await ask({
                        title: "Delete this highlight?",
                        name: [s.big, s.small].filter(Boolean).join(" – ") || "Empty highlight",
                        detail: "Home page highlights strip",
                        message: "It disappears from the home page once you press Save changes.",
                      })) && set({ stats: removeAt(d.stats, i) })
                    }
                  >
                    Remove
                  </MiniButton>
                </>
              }
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                <Field label="Big word" value={s.big} onChange={(v) => set({ stats: setAt(d.stats, i, { big: v }) })} />
                <Field label="Small text" value={s.small} onChange={(v) => set({ stats: setAt(d.stats, i, { small: v }) })} />
              </div>
            </Card>
          ))}
          {d.stats.length < 6 && <MiniButton onClick={() => set({ stats: [...d.stats, { big: "", small: "" }] })}>+ Add highlight</MiniButton>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Recent work: small line" value={d.featuredEyebrow} onChange={(v) => set({ featuredEyebrow: v })} />
        <Field label="Recent work: heading" value={d.featuredHeading} onChange={(v) => set({ featuredHeading: v })} />
        <Field label="Services: small line" value={d.servicesEyebrow} onChange={(v) => set({ servicesEyebrow: v })} />
        <Field label="Services: heading" value={d.servicesHeading} onChange={(v) => set({ servicesHeading: v })} />
        <Field label="Why choose us: small line" value={d.whyEyebrow} onChange={(v) => set({ whyEyebrow: v })} />
        <Field label="Why choose us: heading" value={d.whyHeading} onChange={(v) => set({ whyHeading: v })} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-white/60">Why choose us points</h3>
        <div className="space-y-3">
          {d.why.map((w, i) => (
            <Card
              key={i}
              actions={
                <>
                  <MiniButton onClick={() => set({ why: move(d.why, i, -1) })} disabled={i === 0}>↑</MiniButton>
                  <MiniButton onClick={() => set({ why: move(d.why, i, 1) })} disabled={i === d.why.length - 1}>↓</MiniButton>
                  <MiniButton
                    danger
                    onClick={async () =>
                      (await ask({
                        title: "Delete this point?",
                        name: w.title || "Empty point",
                        detail: "Home page, Why choose us list",
                        message: "It disappears from the home page once you press Save changes.",
                      })) && set({ why: removeAt(d.why, i) })
                    }
                  >
                    Remove
                  </MiniButton>
                </>
              }
            >
              <Field label="Title" value={w.title} onChange={(v) => set({ why: setAt(d.why, i, { title: v }) })} />
              <Field label="Text" value={w.text} onChange={(v) => set({ why: setAt(d.why, i, { text: v }) })} textarea rows={2} />
            </Card>
          ))}
          {d.why.length < 8 && <MiniButton onClick={() => set({ why: [...d.why, { title: "", text: "" }] })}>+ Add point</MiniButton>}
        </div>
      </div>
    </SectionShell>
  );
}

export function ServicesEditor({ value, customised }: Props<"services">) {
  const ed = useSectionEditor("services", value, customised);
  const ask = useConfirm();
  const d = ed.draft;
  const set = (p: Partial<typeof d>) => ed.setDraft({ ...d, ...p });
  const setItem = (i: number, p: Partial<Service>) => set({ items: setAt(d.items, i, p) });
  return (
    <SectionShell title="Services" help="The services page, the home page service cards and the footer list all come from here." editor={ed}>
      <Field label="Page heading" value={d.title} onChange={(v) => set({ title: v })} />
      <Field label="Page intro" value={d.intro} onChange={(v) => set({ intro: v })} textarea rows={2} />
      <div className="space-y-4">
        {d.items.map((s, i) => (
          <Card
            key={s.slug + i}
            actions={
              <>
                <MiniButton onClick={() => set({ items: move(d.items, i, -1) })} disabled={i === 0}>↑ Up</MiniButton>
                <MiniButton onClick={() => set({ items: move(d.items, i, 1) })} disabled={i === d.items.length - 1}>↓ Down</MiniButton>
                <MiniButton
                  danger
                  onClick={async () =>
                    (await ask({
                      title: "Delete this service?",
                      name: s.title || "Untitled service",
                      detail: "Services page, home page and footer",
                      message: "It disappears from the whole site once you press Save changes.",
                    })) && set({ items: removeAt(d.items, i) })
                  }
                >
                  Remove
                </MiniButton>
              </>
            }
          >
            <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
              <Field label="Service name" value={s.title} onChange={(v) => setItem(i, { title: v })} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-white/60">Icon</span>
                <select className={fieldClass} value={s.icon} onChange={(e) => setItem(i, { icon: e.target.value })}>
                  {SERVICE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic.replace("-", " ")}</option>
                  ))}
                </select>
              </label>
            </div>
            <Field label="Description" value={s.blurb} onChange={(v) => setItem(i, { blurb: v })} textarea rows={3} />
            <Field label="Bullet points" value={s.points.join("\n")} onChange={(v) => setItem(i, { points: v.split("\n") })} textarea rows={4} hint="One per line." />
          </Card>
        ))}
        <MiniButton onClick={() => set({ items: [...d.items, { slug: "", icon: "general-plumbing", title: "", blurb: "", points: [] }] })}>+ Add service</MiniButton>
      </div>
    </SectionShell>
  );
}

export function ReviewsEditor({ value, customised }: Props<"reviews">) {
  const ed = useSectionEditor("reviews", value, customised);
  const ask = useConfirm();
  const d = ed.draft;
  const set = (p: Partial<typeof d>) => ed.setDraft({ ...d, ...p });
  const setItem = (i: number, p: Partial<ReviewItem>) => set({ items: setAt(d.items, i, p) });
  return (
    <SectionShell
      title="Reviews"
      help="Only add reviews customers have genuinely left. Leave the star rating as 'Recommendation' for Facebook-style reviews."
      editor={ed}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Page heading" value={d.title} onChange={(v) => set({ title: v })} />
        <Field label="Link to leave a review" value={d.link} onChange={(v) => set({ link: v })} placeholder="https://…" />
      </div>
      <Field label="Page intro" value={d.intro} onChange={(v) => set({ intro: v })} textarea rows={2} />
      <div className="space-y-4">
        {d.items.map((r, i) => (
          <Card
            key={i}
            actions={
              <MiniButton
                danger
                onClick={async () =>
                  (await ask({
                    title: "Delete this review?",
                    name: r.name ? `Review from ${r.name}` : "Review with no name",
                    detail: r.text ? `${r.text.slice(0, 90)}${r.text.length > 90 ? "…" : ""}` : undefined,
                    message: "It disappears from the Reviews page once you press Save changes.",
                  })) && set({ items: removeAt(d.items, i) })
                }
              >
                Remove
              </MiniButton>
            }
          >
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Name" value={r.name} onChange={(v) => setItem(i, { name: v })} placeholder="e.g. Sam T." />
              <Field label="Date" type="date" value={r.date} onChange={(v) => setItem(i, { date: v })} />
              <Field label="Where from" value={r.source ?? ""} onChange={(v) => setItem(i, { source: v })} placeholder="Facebook, Google…" />
              <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-white/60">Stars</span>
                <select className={fieldClass} value={r.rating ?? 0} onChange={(e) => setItem(i, { rating: Number(e.target.value) || undefined })}>
                  <option value={0}>Recommendation</option>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} stars</option>
                  ))}
                </select>
              </label>
            </div>
            <Field label="Review" value={r.text} onChange={(v) => setItem(i, { text: v })} textarea rows={4} />
          </Card>
        ))}
        <MiniButton onClick={() => set({ items: [{ name: "", text: "", date: new Date().toISOString().slice(0, 10) }, ...d.items] })}>+ Add review</MiniButton>
      </div>
    </SectionShell>
  );
}

export function OtherTextEditors({ contact, cta, customised }: { contact: SiteContent["contact"]; cta: SiteContent["cta"]; customised: string[] }) {
  const c = useSectionEditor("contact", contact, customised.includes("contact"));
  const b = useSectionEditor("cta", cta, customised.includes("cta"));
  return (
    <div className="space-y-6">
      <SectionShell title="Contact page" editor={c}>
        <Field label="Heading" value={c.draft.title} onChange={(v) => c.setDraft({ ...c.draft, title: v })} />
        <Field label="Intro" value={c.draft.intro} onChange={(v) => c.setDraft({ ...c.draft, intro: v })} textarea rows={2} />
      </SectionShell>
      <SectionShell title="Bottom banner" help="The banner with the Call button at the bottom of most pages." editor={b}>
        <Field label="Heading" value={b.draft.heading} onChange={(v) => b.setDraft({ ...b.draft, heading: v })} />
        <Field label="Text" value={b.draft.text} onChange={(v) => b.setDraft({ ...b.draft, text: v })} hint="Your area is added after this automatically." />
      </SectionShell>
    </div>
  );
}
