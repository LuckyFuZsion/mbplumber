import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { adminEmail } from "@/lib/auth";
import { cloudinaryConfigured, getGalleryItems } from "@/lib/cloudinary";
import { getAdminState } from "@/lib/content-server";
import { firebaseConfigured } from "@/lib/firebase-admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!firebaseConfigured()) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20">
        <div className="rounded-2xl border border-brand-red bg-brand-red/10 p-8">
          <h1 className="heading mb-3 text-2xl">Admin isn&apos;t set up yet</h1>
          <p className="text-sm font-medium text-white/80">
            The site editor needs its Firebase settings (FIREBASE_SERVICE_ACCOUNT, ADMIN_EMAILS and the NEXT_PUBLIC_FIREBASE_* values). Until
            then the website shows its original content.
          </p>
        </div>
      </section>
    );
  }

  const email = await adminEmail();
  if (!email) {
    return (
      <section className="mx-auto max-w-md px-4 py-20">
        <AdminLogin />
      </section>
    );
  }

  const [{ content, customised }, gallery] = await Promise.all([getAdminState(), getGalleryItems()]);
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <AdminApp
        content={content}
        customised={customised}
        gallery={gallery.map((g) => ({ id: g.id, url: g.url, width: g.width, height: g.height, caption: g.caption, category: g.category, createdAt: g.createdAt }))}
        cloudinary={cloudinaryConfigured()}
        email={email}
      />
    </section>
  );
}
