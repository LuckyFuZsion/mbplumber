import type { Metadata } from "next";
import { AdminLogin, AdminPanel } from "@/components/AdminPanel";
import { isAdmin } from "@/lib/auth";
import { cloudinaryConfigured, getGalleryItems } from "@/lib/cloudinary";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <section className="mx-auto max-w-md px-4 py-20">
        <AdminLogin />
      </section>
    );
  }
  const items = await getGalleryItems();
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <AdminPanel items={items} configured={cloudinaryConfigured()} />
    </section>
  );
}
