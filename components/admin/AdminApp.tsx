"use client";

import { useState } from "react";
import { SECTION_LABELS, type SectionKey, type SiteContent } from "@/lib/content";
import { GalleryAdmin } from "../AdminPanel";
import type { GridItem } from "../GalleryGrid";
import { ConfirmProvider, useConfirm } from "./Confirm";
import { HistoryPanel } from "./HistoryPanel";
import { ProjectsEditor } from "./ProjectsEditor";
import { BusinessEditor, FaqEditor, HomeEditor, OtherTextEditors, ReviewsEditor, ServicesEditor } from "./TextEditors";

const TABS = ["projects", "home", "services", "reviews", "faq", "business", "other", "gallery", "history"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  projects: "Projects",
  home: "Home page",
  services: "Services",
  reviews: "Reviews",
  faq: "FAQs",
  business: "Business",
  other: "Contact & banner",
  gallery: "Gallery",
  history: "History",
};

export function AdminApp(props: Parameters<typeof AdminAppInner>[0]) {
  return (
    <ConfirmProvider>
      <AdminAppInner {...props} />
    </ConfirmProvider>
  );
}

function AdminAppInner({
  content,
  customised,
  gallery,
  cloudinary,
  email,
}: {
  content: SiteContent;
  customised: SectionKey[];
  gallery: (GridItem & { createdAt?: string })[];
  cloudinary: boolean;
  email: string;
}) {
  const [tab, setTab] = useState<Tab>("projects");
  const [busy, setBusy] = useState(false);
  const c = (k: SectionKey) => customised.includes(k);
  const ask = useConfirm();

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  }

  async function revertAll() {
    const yes = await ask({
      title: "Revert the whole site to the original?",
      name: customised.length ? customised.map((k) => SECTION_LABELS[k]).join(", ") : "Whole site",
      detail: "These sections have been edited",
      message: "Everything you have added or changed (including project photos) is removed from the site and the original is put back. You can undo this from the History tab.",
      confirmLabel: "Yes, revert everything",
    });
    if (!yes) return;
    setBusy(true);
    const res = await fetch("/api/admin/content", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: "{}" });
    if (res.ok) window.location.reload();
    else {
      setBusy(false);
      alert("Couldn't revert. Please try again.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading text-3xl sm:text-4xl">Edit your site</h1>
          <p className="mt-1 text-sm text-white/55">Signed in as {email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-2 text-sm">
            View site ↗
          </a>
          <button onClick={signOut} className="btn btn-ghost !py-2 text-sm">
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-white/10 bg-ink-soft p-4 text-sm text-white/70">
        <strong className="text-white">Don&apos;t worry about breaking anything.</strong> The original site is always kept safe. Every section has a{" "}
        <em>Revert to original</em> button, and the <em>History</em> tab can undo any change.
        {customised.length > 0 && (
          <span className="mt-2 block text-white/55">
            Edited so far: {customised.map((k) => SECTION_LABELS[k]).join(", ")}.
          </span>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              tab === t ? "bg-brand text-black" : "border border-white/20 text-white/80 hover:border-brand hover:text-brand"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {tab === "projects" && <ProjectsEditor value={content.projects} customised={c("projects")} cloudinary={cloudinary} />}
      {tab === "home" && <HomeEditor value={content.home} customised={c("home")} />}
      {tab === "services" && <ServicesEditor value={content.services} customised={c("services")} />}
      {tab === "reviews" && <ReviewsEditor value={content.reviews} customised={c("reviews")} />}
      {tab === "faq" && <FaqEditor value={content.faq} customised={c("faq")} />}
      {tab === "business" && <BusinessEditor value={content.business} customised={c("business")} />}
      {tab === "other" && <OtherTextEditors contact={content.contact} cta={content.cta} customised={customised} />}
      {tab === "gallery" && <GalleryAdmin items={gallery} configured={cloudinary} />}
      {tab === "history" && <HistoryPanel />}

      <div className="mt-14 rounded-2xl border border-brand-red/40 p-5">
        <h2 className="font-extrabold">Start again from the original</h2>
        <p className="mt-1 mb-4 text-sm text-white/60">Puts every section back to how the site was first delivered.</p>
        <button className="btn btn-red !py-2.5 text-sm disabled:opacity-40" onClick={revertAll} disabled={busy || customised.length === 0}>
          {busy ? "Reverting…" : "Revert whole site to original"}
        </button>
      </div>
    </div>
  );
}
